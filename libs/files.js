var AWS = require('aws-sdk');
var config = require('config');
var uuid = require('node-uuid');
var lodash = require('lodash');

// init AWS SDK config
AWS.config.update(config.get("aws.credentials"));

// define module
var files = {};
module.exports = files;

/**
 * Upload given stream to AWS S3. Error if any, or Uploaded object metadata will be provided to callback.
 * @param {stream.Readable}fileStream - readable stream.
 * @param {String} mimeType - data MIME type.
 * @param {function(Error,Object)} callback = callback function.
 * @returns {{abort:function}}
 */
files.upload = function (fileStream, mimeType, callback) {

    // s3 object metadata
    var metadata = {
        Bucket: config.get("aws.s3.bucket"),
        Key: uuid.v4(),
        ACL: 'private',
        ContentType: mimeType,
        Body: fileStream
    };

    // track uploaded bytes
    var bytesSent = 0;

    // do upload, return upload object so that it 'abort' can be called on it if needed.
    return new AWS.S3.ManagedUpload({params:metadata}).on('httpUploadProgress', function (evt) {
        bytesSent += evt.loaded;
    }).send(function (err, data) {
        if(err){
            callback(err,undefined);
        }else {
            callback(undefined, {
                object_key: metadata.Key,
                content_type: metadata.ContentType,
                content_length: bytesSent,
                s3_url: data.Location,
                s3_e_tag: data.ETag,
                timestamp: Date.now()
            });
        }
    });


};

/**
 * Download AWS S3 object to given stream. Callback will be called to notify end of download as well any error.
 * @param {String} objectKey - S3 object key.
 * @param {stream.Writable} outStream - writable stream.
 * @param {function(Error)} callback - callback function.
 */
files.download = function(objectKey,outStream,callback){

    // stream s3 object
    var inStream = new AWS.S3().getObject({
        Bucket:config.get("aws.s3.bucket"),
        Key:objectKey
    }).createReadStream();

    // callback stream events
    var cb = lodash.once(callback);
    inStream.on('error',cb);
    inStream.on('end',cb);

    // pipe
    inStream.pipe(outStream);
};
