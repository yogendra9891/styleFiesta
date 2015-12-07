var lodash = require('lodash');
var Route = require('../../libs/core/Route');
//var helpers = require('../../helpers');
var Check = require('../../libs/core/Check');
var appUtils = require('../../libs/appUtils');
var api_errors = require('../../assets/api_errors');
var ApiException = require('../../libs/core/ApiException');
var magentoObj = require('../../assets/magentoobj');
var CartCustomer = require('../../Controllers/cart/CartCustomer');
var magento = magentoObj.magento;
var magentoLoginError = require("../../helpers/MagentoLoginError");
var ApiSuccess = require("../../libs/core/ApiSuccess");

// define route
var route = new Route('post', '/setCustomer');
module.exports = route;

// validate input
route.use(function(req, res, next) {
  var input = req.body;
  var rules = {
    store_id: Check.that(input.store_id).isInteger(),
    cart_id: Check.that(input.cart_id).isInteger(),
    customer_id: Check.that(input.customer.customer_id).isInteger(),
    fname: Check.that(input.customer.fname).isNotEmptyOrBlank(),
    lname: Check.that(input.customer.lname).isNotEmptyOrBlank(),
    email: Check.that(input.customer.email).isEmail(),
    mob: Check.that(input.customer.mob).isNotEmptyOrBlank(),
    mode: Check.that(input.customer.mode).isEnum(['guest', 'customer'])
  };
  appUtils.validateChecks(rules, next);

});


// sanitize input
route.use(function(req, res, next) {
  var customer = ["fname", "lname", "email", "mob", "mode"];
  customer.forEach(function(item) {
    /* istanbul ignore else */
    if (lodash.has(req.body.customer, item)) {
      req.body.customer[item] = (req.body.customer[item]).trim();
    }
  });

  // route.use(function(req, res, next) {
  //
  //   if (lodash.has(req.body.customer, 'fname')) {
  //     req.body.customer.fname = (req.body.customer.fname).trim();
  //   }
  //
  //   if (lodash.has(req.body.customer, 'lname')) {
  //     req.body.customer.lname = (req.body.customer.lname).trim();
  //   }
  //
  //   if (lodash.has(req.body.customer, 'email')) {
  //     req.body.customer.email = (req.body.customer.email).trim();
  //   }
  //
  //   if (lodash.has(req.body.customer, 'mob')) {
  //     req.body.customer.mob = (req.body.customer.mob).trim();
  //   }
  //
  //   if (lodash.has(req.body.customer, 'mode')) {
  //     req.body.customer.mode = (req.body.customer.mode).trim();
  //   }
  /* istanbul ignore else */
  if (lodash.has(req.body, 'customer')) {
    req.body.customer = {
      "customer_id": req.body.customer.customer_id,
      "firstname": req.body.customer.fname,
      "lastname": req.body.customer.lname,
      "email": req.body.customer.email,
      "mode": req.body.customer.mode,
      "store_id": req.body.customer.store_id
    }
  }
  next();
});

route.use(function(req, res, next) {
  var input = req.body;
  var store_id = input.store_id;
  var cart_id = input.cart_id;
  var customer = input.customer;
  CartCustomer.setCustomerToCart(store_id, cart_id, customer, function(err,
    resp) {
    if (err) {
      magentoLoginError.handleError(err, req, res, next,
        api_errors.set_cart_customer.error_code,
        err.faultString, false);
    } else {
      data = {
        "response": resp
      };
      var resp = ApiSuccess.toResponseJSON(200, "SUCCESS", data);
      return res.json(resp);
    }
  })
});
