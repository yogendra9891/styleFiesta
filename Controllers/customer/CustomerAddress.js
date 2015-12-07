var ApiException = require('../../libs/core/ApiException');
var api_errors = require('../../assets/api_errors');
var magentoObj = require('../../assets/magentoobj');
var util = require('util');
var magento = magentoObj.magento;


/**
 * Defines a Magento login class
 * @constructor
 */
function CustomerAddress() {

}
// Inherits from Object

util.inherits(CustomerAddress, Object);

/**
 * MagentoLogin class.
 * @type {MagentoLogin}
 */

module.exports = CustomerAddress;

CustomerAddress.addNewCustomerAddress = function(customer_id, address, store_id,
  callback) {
  magento.customerAddress.create({
    customerId: customer_id,
    storeId: store_id,
    addressData: address,
  }, callback);

};
