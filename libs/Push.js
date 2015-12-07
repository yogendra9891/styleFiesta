// import modules
var apn = require('apn');
var gcm = require('node-gcm');
var lodash = require('lodash');
var util = require('util');
var assert = require('assert');
var fs = require('fs');
var logger = require('./logger');

/**
 * @constructor
 * Create a new Push instance.
 */
function Push() {

    // declare senders, will be initialized by calls to corresponding init*() methods.
    this.apnConn = null;
    this.apnFeedback = null;
    this.gcmSender = null;

    // feedback handler, will be initialized by call to setFeedbackHandler() method.
    this.feedbackHandler = null;
}

// inherit from Object and export as a module
util.inherits(Push, Object);

/**
 * Set push feedback handler function. This function will be invoked for unreachable
 * and updated device ids.
 *
 * Function should have signature function(service,event,deviceId1,deviceId2).
 *
 * The parameters of handler function when invoked, are as following :
 * service   : this will be either 'apn' or 'gcm'.
 * event     : this will be either 'deleted' or 'updated'.
 * deviceId1 : In case of 'deleted' event, this is device id that is no longer reachable. In case
 *             of 'updated' event, this is old device id that is to be updated.
 * deviceId2 : only set in case of 'updated' event, this is the new device id that will replace old
 *             device id.
 *
 * @param  {function} handler - handler function
 */
Push.prototype.setFeedbackHandler = function (handler) {

    // validate input
    if (!lodash.isFunction(handler)) {
        throw new Error('Handler must be a function(service,event,deviceId1,deviceId2)');
    }

    // set handler
    this.feedbackHandler = handler;
};


/**
 * Initialize apn connection, required before apn can be used.
 * @param {Boolean} production - true for production apn, false for sandbox apn.
 * @param {String} certPath - full file path of apn certificate .pem file.
 * @param {String} keyPath - full file path of apn key .pem file.
 */
Push.prototype.initApn = function (production, certPath, keyPath) {

    // validate file parameters
    if (!(production === true || production === false)) {
        throw new Error('Production parameter must be a boolean, true or false');
    }

    if (!fs.existsSync(certPath)) {
        throw new Error('Invalid apn certificate file: ' + certPath);
    }

    if (!fs.existsSync(keyPath)) {
        throw new Error('Invalid apn key file: ' + keyPath);
    }

    // create apn configuration
    var apnConf = {
        'production': production,
        'cert': certPath,
        'key': keyPath
    };

    // initialize apn
    this.apnConn = new apn.Connection(apnConf);

    // listen to apn service errors and log them
    /* istanbul ignore next */
    this.apnConn.on('transmissionError', function (errCode, notification, device) {
        logger.error('PUSH', 'ERROR : APN : %s , %s \n', errCode, device);
    });

    // add feedback configuration
    var feedbackConf = lodash.assign({},apnConf,{batchFeedback:true,interval:60});

    // initialize apn feedback
    this.apnFeedback = new apn.Feedback(feedbackConf);

    var self = this;
    this.apnFeedback.on('feedback', function (devices) {
        devices.forEach(function (item) {
            // log feedback
            logger.warn('PUSH','FEEDBACK : APN : device invalidated : %s.\n', item.device);

            // invoke feedback handler if defined
            /* istanbul ignore else */
            if (self.feedbackHandler) {
                self.feedbackHandler('apn', 'deleted', item.device);
            }
        });
    });
};


/**
 * Initialize gcm sender, required before gcm can be used.
 * @param {String} gcmApiKey - gcm api key.
 */
Push.prototype.initGcm = function (gcmApiKey) {

    // validate input
    if (!lodash.isString(gcmApiKey)) {
        throw new Error('Proper gcm api key is required.');
    }

    // initialise gcm sender
    this.gcmSender = new gcm.Sender(gcmApiKey);

};


/**
 * Internal function to validate send*() methods parameters.
 * Throws error for invalid inputs.
 * @param {[String]} deviceIds - device Id array.
 * @param {String} message - message string.
 * @param {Object} data - data object.
 */
function validatePushParams(deviceIds, message, data) {

    // deviceIds needs to be an array
    if (!lodash.isArray(deviceIds)) {
        throw new Error('deviceIds parameter must be an array.');
    }

    // validate deviceIds contents
    deviceIds.forEach(function (item) {
        if (!lodash.isString(item)) {
            throw new Error('deviceIds array must only contain proper string device ids.');
        }
    });

    // validate message
    if (!lodash.isString(message)) {
        throw new Error('message parameter must be a non empty string.');
    }

    // validate data
    if (!lodash.isObject(data)) {
        throw new Error('data parameter must be an Object.');
    }
}

/**
 * Send apn notification to device ids.
 * @param {[String]} deviceIds - an Array of device id strings.
 * @param {String} message - message of notification.
 * @param {Object} data -  data sent with notification.
 */
Push.prototype.sendApn = function (deviceIds, message, data) {

    // ensure connection is initialized
    if (this.apnConn === null) {
        throw new Error('Apn not initialized. Call initApn(production, certPath, keyPath) one time to initialize apn.');
    }

    // validate input
    validatePushParams(deviceIds, message, data);

    /* istanbul ignore else */
    if (deviceIds.length > 0) {

        // send apn push
        var note = new apn.Notification();
        note.alert = message;
        note.payload = data;
        note.retryLimit = 1; //--retry 1 time--
        note.expiry = Math.floor(Date.now() / 1000) + 3600; // expire 1 hour from now
        this.apnConn.pushNotification(note, deviceIds);

        logger.info('PUSH','SEND : APN : Successfully sent.\n');
    }
};


/**
 * Internal function to parse gcm send response and invoke feedback handler.
 * Implemented as per :  https://developers.google.com/cloud-messaging/http#response
 *
 * @param {[String]} deviceIds - device ids used to send notification.
 * @param {Object} gcmResponse - gcm response object.
 * @param {Function} handler - feedback handler to invoke.
 */
function processGcmResponse(deviceIds, gcmResponse, handler) {

    // skip if no failures or canonical ids
    if (gcmResponse.failure === 0 && gcmResponse.canonical_ids === 0) {
        return;
    }

    // gsm results
    var results = gcmResponse.results;

    // results MUST have same length as device ids
    assert.strictEqual(results.length, deviceIds.length, "gcm results count not matching input device id count !!");

    // process results
    for (var i = 0; i < results.length; i++) {

        var oldId = deviceIds[i];
        var deviceResult = results[i];

        // get message_id
        var msgId = deviceResult.message_id;

        if (msgId) {

            // If message_id is set, check for registration_id
            var newId = deviceResult.registration_id;

            /* istanbul ignore else */
            if (newId) {
                logger.warn('PUSH','FEEDBACK : GCM : device id updated : %s to %s \n', oldId, newId);

                // If registration_id is set, replace the original ID with the new value
                /* istanbul ignore else */
                if (handler) {
                    handler('gcm', 'updated', oldId, newId);
                }
            }

        } else {

            // Otherwise, get the value of error
            var e = deviceResult.error;

            /* istanbul ignore else */
            if (e === 'Unavailable') {
                logger.warn('PUSH','ERROR : GCM : device unavailable : %s \n', oldId);
                // If it is Unavailable, you could retry to send it in another request

            } else if (e === 'NotRegistered' || e === 'InvalidRegistration') {
                logger.warn('PUSH','FEEDBACK : GCM : device not found (%s) : %s \n', e, oldId);

                // If it is NotRegistered or Invalid, you should remove the registration ID
                /* istanbul ignore else */
                if (handler) {
                    handler('gcm', 'deleted', oldId);
                }
            }
        }
    }

}


/**
 * Send gcm notification to device ids.
 * @param {[String]} deviceIds - an Array of device id strings.
 * @param {String} message - message of notification.
 * @param {Object} data -  data sent with notification.
 */
Push.prototype.sendGcm = function (deviceIds, message, data) {

    // ensure connection is initialized
    if (this.gcmSender === null) {
        throw new Error('Gcm not initialized. Call initGcm(gcmApiKey) one time to initialize gcm.');
    }

    // validate input
    validatePushParams(deviceIds, message, data);

    // send gcm push
    /* istanbul ignore else */
    if (deviceIds.length > 0) {

        var msg = new gcm.Message();
        msg.addData(data);
        msg.addNotification('title', message);

        // gcm API allows maximum of 1000 device ids per request.
        var self = this;
        lodash.chunk(deviceIds, 1000).forEach(function (ids) {

            self.gcmSender.send(msg, ids, 4, function (err, result) {
                /* istanbul ignore if */
                if (err) {
                    logger.error('PUSH','ERROR : GCM : %s \n', JSON.stringify(err));
                } else {
                    logger.info('PUSH','SEND : GCM : Successfully sent.\n');

                    // handle gcm response
                    processGcmResponse(deviceIds, result, self.feedbackHandler);
                }
            });

        });

    }
};

// export as module
module.exports = Push;