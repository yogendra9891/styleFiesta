var ApiException = require('../../libs/core/ApiException');
var api_errors = require('../../assets/api_errors');
var magentoObj = require('../../assets/magentoobj');
var util = require('util');
var magento = magentoObj.magento;

/**
 * Defines a Magento login class
 * @constructor
 */
function CartCustomer() {

}

// Inherits from Object
util.inherits(CartCustomer, Object);

/**
 * MagentoLogin class.
 * @type {MagentoLogin}
 */
module.exports = CartCustomer;

CartCustomer.setCustomerToCart = function(store_id, cart_id, customer, callback) {
  magento.checkoutCartCustomer.set({
    quoteId: cart_id,
    customerData: customer,
    storeView: store_id,
  }, callback);
};

CartCustomer.setCustomerAddressToCart = function(store_id, cart_id,
  customerAddress, callback) {
  magento.checkoutCartCustomer.addresses({
    quoteId: cart_id,
    customerAddressData: customerAddress,
    storeView: store_id,
  }, callback);
};
