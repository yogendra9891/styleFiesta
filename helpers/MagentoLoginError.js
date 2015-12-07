var ApiException = require('../libs/core/ApiException');
var api_errors = require('../assets/api_errors');
var magentoObj = require('../assets/magentoobj');
var util = require('util');
var magento = magentoObj.magento;
var config = require('config');

/**
 * Defines a Magento login class
 * @constructor
 */
function MagentoLoginError() {

}

// Inherits from Object
util.inherits(MagentoLoginError, Object);

/**
 * MagentoLogin class.
 * @type {MagentoLogin}
 */
module.exports = MagentoLoginError;

MagentoLoginError.handleError = function(err, req, res, next, error_message,
  details, code) {
  //check if error code present then ok other wise use 1001
  code = typeof code !== 'undefined' ? code : 1001;
  /* istanbul ignore else */
  if (err.faultString && err.code != 5) {
    next(ApiException.newMagentoError(error_message, null, err.code).addDetails(
      details));
  } else if (err.code == 5) {
    magento.sessionId = null;
    if (req.method === 'POST') {
      console.log(config.get("server.host") + ":" + config.get(
        "server.port") + config.get("server.route_prefix") + req.url);
      return res.redirect(307, config.get("server.host") + ":" + config.get(
        "server.port") + config.get("server.route_prefix") + req.url);
    } else {
      return res.redirect(config.get("server.host") + ":" + config.get(
        "server.port") + config.get("server.route_prefix") + req.url);
    }
  } else {
    next(err);
  }

}
