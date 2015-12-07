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

CustomerAddress.addNewCustomerAddress = function(customer_id,
  address,
  callback) {
  magento.customerAddress.create({
    customerId: customer_id,
    addressData: address,
  }, callback);

};

CustomerAddress.getAddressList = function(customer_id, callback) {
  magento.customerAddress.list({
    customerId: customer_id
  }, callback);

};

CustomerAddress.updateCustomerAddress = function(address_id, address,
  callback) {
  magento.customerAddress.update({
    addressId: address_id,
    addressData: address,
  }, callback);

};


CustomerAddress.deleteCustomerAddress = function(address_id, callback) {
  magento.customerAddress.delete({
    addressId: address_id
  }, callback);

};
