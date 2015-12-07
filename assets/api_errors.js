/**
 * API errors definition
 * @type {Object}
 */
module.exports = {

  api_key_required: {
    error_code: "API_KEY_REQUIRED",
    description: "Api key is required."
  },

  invalid_api_key: {
    error_code: "INVALID_API_KEY",
    description: "Api key is invalid."
  },

  auth_token_required: {
    error_code: "AUTH_TOKEN_REQUIRED",
    description: "Auth token is required."
  },

  invalid_auth_token: {
    error_code: "INVALID_AUTH_TOKEN",
    description: "Auth token is invalid."
  },

  invalid_auth_credentials: {
    error_code: "INVALID_AUTH_CRED",
    description: "Authorization credentials are invalid. Cannot authorize."
  },

  user_disabled: {
    error_code: "USER_DISABLED",
    description: "User account has been disabled. API use or login is not allowed."
  },

  already_registered: {
    error_code: "ALREADY_REGISTERED",
    description: "User is already registered. Cannot register again"
  },

  invalid_operation: {
    error_code: "INVALID_OPERATION",
    description: "The requested operation is not allowed due to logical or business rules. Cannot proceed."
      // example: user cannot send a connect request to himself.
  },

  no_resource_access: {
    error_code: "NO_RESOURCE_ACCESS",
    description: "User does not have required level of access to the requested resource."
      // example: user is not the author of the post he wants to edit.
      // example: User is not connected to user whose email he wants to view.
      // example: free user cannot access a paid resource.
  },

  email_already_registered: {
    error_code: "EMAIL_ALREADY_REGISTERED",
    description: "The email has already been registered."
  },

  phone_already_registered: {
    error_code: "PHONE_ALREADY_REGISTERED",
    description: "The phone has already been registered."
  },

  email_not_verified: {
    error_code: "EMAIL_NOT_VERIFIED",
    description: "The email has not been verified."
  },

  phone_not_verified: {
    error_code: "PHONE_NOT_VERIFIED",
    description: "The phone has not been verified."
  },

  email_and_phone_not_verified: {
    error_code: "EMAIL_AND_PHONE_NOT_VERIFIED",
    description: "Neither email nor phone has been verified."
  },

  already_connected: {
    error_code: "ALREADY_CONNECTED",
    description: "Already connected to user, cannot send connect request."
  },

  connect_request_already_incoming: {
    error_code: "CONNECT_REQUEST_ALREADY_INCOMING",
    description: "The user you want to connect to, has already sent you a request, answer that request first."
  },

  connect_request_not_found: {
    error_code: "NO_CONNECT_REQUESTED",
    description: "The user did not requested any connection to you, cannot connect you to the user."
  },

  cannot_connect_to_self: {
    error_code: "NO_CONNECT_TO_SELF",
    description: "You can't connect to yourself."
  },

  cannot_disconnect_from_self: {
    error_code: "NO_DISCONNECT_SELF",
    description: "You can't disconnect from yourself."
  },

  file_type_not_allowed: {
    error_code: "INVALID_FILE_TYPE",
    description: "This type of file cannot be uploaded."
  },

  file_size_exceeds_limit: {
    error_code: "FILE_SIZE_EXCEEDS_LIMIT",
    description: "The file size exceeds the allowed limits by API."
  },

  error_login_magento: {
    error_code: "ERROR_WHILE_LOGIN_MAGENTO",
    description: "There is some error while login to the Magento server via api"
  },

  error_while_cart_create: {
    error_code: "ERROR_WHILE_CART_CREATE",
    description: "There is some error while creating cart Magento server via api"
  },

  error_while_adding_product_in_cart: {
    error_code: "ERROR_WHILE_ADD_PRODUCT",
    description: "There is some error while adding product cart Magento server via api"
  },

  apply_coupon_to_cart: {
    error_code: "ERROR_WHILE_APPLYING_COUPON",
    description: "There is some error while applying coupon to cart Magento server via api"
  },

  get_cart_details: {
    error_code: "ERROR_WHILE_GETTING_CART_DETAILS",
    description: "There is some error while fatching cart info from Magento server via api"
  },

  remove_cart_product: {
    error_code: "ERROR_WHILE_REMOVING_PRODUCT_FROM_CART",
    description: "There is some error while removing product from cart on Magento server via api"
  },

  remove_cart_coupon: {
    error_code: "ERROR_WHILE_REMOVING_COUPON_FROM_CART",
    description: "There is some error while removing coupon from cart on Magento server via api"
  },

  set_cart_address: {
    error_code: "ERROR_WHILE_SET_CART_ADDRESS",
    description: "There is some error while setting cart address on Magento server via api"
  },

  set_cart_customer: {
    error_code: "ERROR_WHILE_ADDING_CUSTOMER_TO_CART",
    description: "There is some error while adding customer to cart on Magento server via api"
  },

  update_cart: {
    error_code: "ERROR_WHILE_UPDATING_CART_INFO",
    description: "There is some error while updating cart on Magento server via api"
  },

  get_country_list: {
    error_code: "ERROR_WHILE_GETTING_COUNTRY_LIST",
    description: "There is some error while getting country list from Magento server via api"
  },

  get_payment_methods: {
    error_code: "ERROR_WHILE_GETTING_PAYMENT_METHODS",
    description: "There is some error while getting payment methods from Magento server via api"
  },

  get_regions: {
    error_code: "ERROR_WHILE_GETTING_REGIONS",
    description: "There is some error while getting regions list from Magento server via api"
  },

  get_shipping_methods: {
    error_code: "ERROR_WHILE_GETTING_SHIPPING_METHODS",
    description: "There is some error while getting shipping methods from Magento server via api"
  },

  set_shipping_methods: {
    error_code: "ERROR_WHILE_SETTING_SHIPPING_METHODS",
    description: "There is some error while setting shipping method on cart from Magento server via api"
  },

  set_payment_methods: {
    error_code: "ERROR_WHILE_SETTING_PAYMENT_METHOD",
    description: "There is some error while setting payment method on cart from Magento server via api"
  },

  place_order: {
    error_code: "ERROR_WHILE_PLACING_ORDER",
    description: "There is some error while placing the order from Magento server via api"
  },

  create_Customer_Address: {
    error_code: "ERROR_WHILE_CREATING_ADDRESS",
    description: "There is some error while creating the  new  customer address from Magento server via api"
  },

  update_Customer_Address: {
    error_code: "ERROR_WHILE_UPDATING_ADDRESS",
    description: "There is some error while updating the  new  customer address from Magento server via api"
  },



  get_category_list: {
    error_code: "ERROR_WHILE_GETTING_CATEGORY_LIST",
    description: "There is some error while getting category list from Magento server via api"
  },

  get_list_order: {
    error_code: "ERROR_WHILE_GETTING_ORDER_LIST",
    description: "There is some error while getting order list from Magento server via api"
  },

  get_create_customer: {
    error_code: "ERROR_WHILE_CREATE_CUSTOMER",
    description: "There is some error while creating customer from Magento server via api"
  },

  get_update_customer: {
    error_code: "ERROR_WHILE_UPDATE_CUSTOMER",
    description: "There is some error while updating customer from Magento server via api"
  },

  get_detail_order: {
    error_code: "ERROR_WHILE_ORDER_DETAIL_GETTING",
    description: "There is some error while updating customer from Magento server via api"
  },

  get_address_list: {
    error_code: "ERROR_WHILE_CUSTOMER_ADDRESS_LIST_GETTING",
    description: "There is some error while getting customer address list from Magento server via api"
  },

  delete_customer_address: {
    error_code: "ERROR_WHILE_DELETING_CUSTOMER_ADDRESS",
    description: "There is some error while deleting customer address from Magento server via api"
  },

};
