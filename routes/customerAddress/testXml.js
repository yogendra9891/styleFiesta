var lodash = require('lodash');
var Route = require('../../libs/core/Route');
//var helpers = require('../../helpers');
var Check = require('../../libs/core/Check');
var appUtils = require('../../libs/appUtils');
var api_errors = require('../../assets/api_errors');
var ApiException = require('../../libs/core/ApiException');
var magentoObj = require('../../assets/magentoobj');
var CustomerAddressObject = require(
  '../../Controllers/customer/customerAddress');
var magento = magentoObj.magento;
var magentoLoginError = require("../../helpers/MagentoLoginError");
var ApiSuccess = require("../../libs/core/ApiSuccess");
var xmlrpc = require('xmlrpc');
// define route
var route = new Route('post', '/testXml');
module.exports = route;


route.use(function(req, res, next) {
  // var client1 = xmlrpc.createClient({'host': 'localhost', 'port': 80, 'path': '/yogendra/xml-rpc/server.php'});
  // client1.methodCall('say_hello', ['yogi'], function(err) {
  //   if (err) {
  //     console.log('error11111111');
  //   } else {
  //    console.log('success');
  //   }
  //
  // });

  // Creates an XML-RPC server to listen to XML-RPC method calls
var server = xmlrpc.createServer({ host: 'localhost', port: 9090 })
// Handle methods not found
server.on('NotFound', function(method, params) {
  console.log('Method ' + method + ' does not exist');
})
// Handle method calls by listening for events with the method call name
server.on('anAction', function (err, params, callback) {
  console.log('Method call params for \'anAction\': ' + params)

  // ...perform an action...

  // Send a method response with a value
  callback(null, 'aResult')
})
console.log('XML-RPC server listening on port 9091')

// Waits briefly to give the XML-RPC server time to start up and start
// listening
setTimeout(function () {
  // Creates an XML-RPC client. Passes the host information on where to
  // make the XML-RPC calls.
  var client = xmlrpc.createClient({ host: 'localhost', port: 9090, path: '/'})

  // Sends a method call to the XML-RPC server
  client.methodCall('anAction', ['aParam'], function (error, value) {
    // Results of the method response
    console.log('Method response for \'anAction\': ' + value)
  })

}, 1000);

});
