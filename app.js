// require stuff
var express = require('express');
var config = require('config');
var lodash = require('lodash');
//var docs = require('./docs');
var Route = require('./libs/core/Route');
var ApiException = require('./libs/core/ApiException');
var ErrorHandler = require('./libs/core/ErrorHandler');
var WhiteList = require('./libs/core/Whitelist');
var authUtil = require('./libs/authUtil');
var logger = require('./libs/logger');
var cors = require('cors');
var jsonBodyParser = require('./libs/jsonBodyParser');
var path = require('path');

var MagentoLogin = require('./helpers/checkMagentoLogin');

// init environment
var allowedEnv = ["development", "staging", "production"];
var env = config.util.getEnv('NODE_ENV');
if (lodash.contains(allowedEnv, env)) {
  console.info("NODE_ENV: %s", env);
} else {
  throw new Error(" Environment variable NODE_ENV must be one of [" +
    allowedEnv.join(",") + "]");
}

// init app
var app = express();
app.locals.title = config.get("server.name");
app.locals.host = config.get("server.host");
app.locals.port = config.get("server.port");
app.locals.env = env;
app.locals.config = config;

// make the API Router and mount it on '/api' path.
var apiRouter = new express.Router();
app.use(config.get("server.route_prefix"), apiRouter);

// enable CORS support
apiRouter.use(cors());

// serve docs on development
if (app.locals.env === 'development' || app.locals.env === 'staging') {
  //docs.serve(apiRouter);
}



// // add api key verification for all routes
apiRouter.use(authUtil.verifyApiKey);

apiRouter.use(MagentoLogin.checkLogin);

// // define white-listed routes
// var whiteList = new WhiteList();
// whiteList.allow(['/data/*']);
// whiteList.allow('/verification/*');
// whiteList.allow(['/login','/register']);
// whiteList.allow(['/recovery/*']);
// whiteList.allow(['/admin/login']);

// // use auth token verification for all routes except for those allowed in white-list
// whiteList.use(authUtil.verifyAuthToken);
// apiRouter.use(whiteList.build());

// // restrict access of /admin/* routes (other than login) to admin level Auth only.
// var adminWhiteList = new WhiteList();
// adminWhiteList.allow(['/login']);
// adminWhiteList.use(authUtil.verifyIsAdmin);
// apiRouter.use('/admin',adminWhiteList.build());

// user json body parser
apiRouter.use(jsonBodyParser({
  limit: '1000kb'
}));

// setup all other routes, and mount them on API router
Route.scanAll(path.join(__dirname, 'routes'), true).forEach(function(route) {
  route.mount(apiRouter);
});

// setup not found handler for requests un-served by any routes.
apiRouter.use(function(req, res, next) {
  next(ApiException.newNotFoundError('Request not handled.'));
});

// setup error handling
var errorHandler = new ErrorHandler(logger);
apiRouter.use(errorHandler.build());

// print when online
app.on('online', function() {
  console.info("%s server online at %s:%s", app.locals.title, app.locals.host,
    app.locals.port);
});

// start listening app and emit the 'online' event.
app.listen(app.locals.port, function() {
  app.emit('online');
});

// export for testing purposes
module.exports = app;
