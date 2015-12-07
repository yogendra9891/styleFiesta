var util = require('util');
var lodash = require('lodash');
var Exception = require('./Exception');

/**
 * Liberary for preparing the sucess data
 * @constructor
 */
function ApiSuccess() {}

// Inherits Object
util.inherits(ApiSuccess, Object);

/**
 * ApiException class.
 * @type {ApiException}
 */
module.exports = ApiSuccess;

/**
 * Get JSON representation of API exception that can be sent to API clients.
 * @return {{error_code: *, message: *, details: *}}
 */
ApiSuccess.toResponseJSON = function(code, message, data) {
  return {
    'code': code,
    'message': message,
    'data': data
  };
};
