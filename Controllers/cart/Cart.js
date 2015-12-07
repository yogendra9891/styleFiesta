var ApiException = require('../../libs/core/ApiException');
var api_errors = require('../../assets/api_errors');
var magentoObj = require('../../assets/magentoobj');
var util = require('util');
var magento = magentoObj.magento;

/**
 * Defines a Magento login class
 * @constructor
 */
function Cart() {}

// Inherits from Object
util.inherits(Cart, Object);

/**
 * MagentoLogin class.
 * @type {MagentoLogin}
 */
module.exports = Cart;

Cart.createCart = function(store_id, callback) {
  magento.checkoutCart.create({
    storeView: store_id
  }, callback);
};

Cart.applyCoupon = function(store_id, cart_id, coupon_code, callback) {
  magento.checkoutCartCoupon.add({
    quoteId: cart_id,
    couponCode: coupon_code,
    storeView: store_id,
  }, callback);
};

Cart.removeCoupon = function(store_id, cart_id, callback) {
  magento.checkoutCartCoupon.remove({
    quoteId: cart_id,
    storeView: store_id,
  }, callback);
};

Cart.cartDetails = function(store_id, cart_id, callback) {
  magento.checkoutCart.info({
    quoteId: cart_id,
    storeView: store_id,
  }, callback);
};

Cart.setPaymentMethod = function(store_id, cart_id, payment_method, callback) {
  magento.checkoutCartPayment.method({
    quoteId: cart_id,
    paymentData: {
      "method": payment_method
    },
    storeView: store_id,
  }, callback);
};

Cart.setShippingMethod = function(store_id, cart_id, shipping_method, callback) {
  magento.checkoutCartShipping.method({
    quoteId: cart_id,
    shippingMethod: shipping_method,
    storeView: store_id,
  }, callback);
};

Cart.placeOrder = function(store_id, cart_id, callback) {
  magento.checkoutCart.order({
    quoteId: cart_id,
    storeView: store_id,
  }, callback);
};

Cart.listOrders = function(store_id, customer_id, callback) {
  magento.salesOrder.list({
    filters: {
      "store_id": store_id,
      "customer_id": customer_id
    }
  }, callback);
};

Cart.createCustomer = function(store_id, customer, callback) {
  magento.customer.create({
    customerData: customer
  }, callback);
};

Cart.updateCustomer = function(store_id, customer_id, customer, callback) {
  magento.customer.update({
    customerId: customer_id,
    customerData: customer
  }, callback);
};

Cart.orderDetails = function(store_id, customer_id, order_id, callback) {
  magento.salesOrder.info({
    orderIncrementId: order_id
  }, callback);
};
