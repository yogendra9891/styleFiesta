var ApiException = require('../../libs/core/ApiException');
var api_errors = require('../../assets/api_errors');
var magentoObj = require('../../assets/magentoobj');
var util = require('util');
var magento = magentoObj.magento;

/**
 * Defines a Magento login class
 * @constructor
 */
function MasterData() {

}

// Inherits from Object
util.inherits(MasterData, Object);

/**
 * MagentoLogin class.
 * @type {MagentoLogin}
 */
module.exports = MasterData;

MasterData.getCountries = function(callback) {
  magento.directoryCountry.list(callback);
};

MasterData.getRegions = function(country_code, callback) {
  magento.directoryRegion.list({
    country: country_code
  }, callback);
};

MasterData.getShippingMathods = function(store_id, cart_id, callback) {
  magento.checkoutCartShipping.list({
    quoteId: cart_id,
    storeView: store_id
  }, callback);
};

MasterData.getPaymentMathods = function(store_id, cart_id, callback) {
  magento.checkoutCartPayment.list({
    quoteId: cart_id,
    storeView: store_id
  }, callback);
};

MasterData.getCategoryList = function(callback) {
  magento.catalogCategory.tree(callback);
};
