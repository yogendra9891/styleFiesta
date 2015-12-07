var ApiException = require('../libs/core/ApiException');
var api_errors = require('../assets/api_errors');
var magentoObj = require('../assets/magentoobj');
var util = require('util');
var magento = magentoObj.magento;

/**
 * Defines a Magento login class
 * @constructor
 */
function MagentoLogin() {

}

// Inherits from Object
util.inherits(MagentoLogin, Object);

/**
 * MagentoLogin class.
 * @type {MagentoLogin}
 */
module.exports = MagentoLogin;

MagentoLogin.checkLogin = function(req, res, next) {
  if (magento.sessionId) {
    return next();
  }
  //login to the magento server and set session
  magento.login(function(err, sessId) {
    /* istanbul ignore if */
    if (err) {
      next(ApiException.newNotAllowedError(api_errors.error_login_magento
        .error_code, null));
    } else {
      return next();
    }

  });

}
