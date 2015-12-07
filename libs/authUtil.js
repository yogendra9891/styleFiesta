var ApiException = require('../libs/core/ApiException');
var apiErrors = require('../assets/api_errors');
//var helpers = require('../helpers');
var lodash = require('lodash');
var config = require('config');

// define module
function authUtil(){}
module.exports = authUtil;

/**
 * Ensures there is a valid api_key in request headers or url query params.
 * @param req - express request.
 * @param res - express response.
 * @param next - express next.
 * @return {*}
 */
authUtil.verifyApiKey = function(req,res,next){
    // get api_key from header or url query parameter if present
    var apiKey = req.get('api_key') || req.query.api_key;

    // api key must be provided
    if(apiKey === null || apiKey === undefined){
        return next(ApiException.newUnauthorizedError(apiErrors.api_key_required.error_code,null));
    }

    // defined api keys
    var apiKeys = config.get('api_keys');

    //check for valid api_key
    var valid = lodash.any(lodash.keys(apiKeys),function(ak){
        var value = apiKeys[ak];
        if(value === apiKey){
            req.client_type = ak;
            return true;
        }else{
            return false;
        }
    });

    if(valid) {
        return next();
    } else {
        return next(ApiException.newUnauthorizedError(apiErrors.invalid_api_key.error_code,null));
    }
};

/**
 * Ensures there is a valid auth_token in request headers or url query params.
 * @param req - express request.
 * @param res - express response.
 * @param next - express next.
 * @return {*}
 */
authUtil.verifyAuthToken = function(req,res,next){

    // get auth_token from header or url query parameter if present
    var authToken = req.get('auth_token') || req.query.auth_token;

    // auth_token must be provided
    if(authToken === null || authToken === undefined){
        return next(ApiException.newUnauthorizedError(apiErrors.auth_token_required.error_code,null));
    }

    // find the Auth object for token
    helpers.authHelper.getAuthForToken(authToken,function(err,auth){
        if(err){
            next(err);
        }else if (auth === null || auth === undefined){
            // no matching auth token found
            next(ApiException.newUnauthorizedError(apiErrors.invalid_auth_token.error_code,null));
        }else{
            // save authentication info in request
            req.auth = auth;
            next();
        }
    });

};

/**
 * Ensures that requests passing through have Admin level Auth attached.
 * @param {Object} req - express request.
 * @param {Object} res - express response.
 * @param {function} next - next middleware callback.
 */
authUtil.verifyIsAdmin = function(req,res,next){
    if(req.auth && req.auth.level === helpers.constants.AUTH.LEVEL_ADMIN){
        next();
    }else{
        // No Admin access without admin level Auth.
        next(ApiException.newUnauthorizedError(apiErrors.no_resource_access.error_code,null)
            .addDetails('Admin Users Only.'));
    }
};
