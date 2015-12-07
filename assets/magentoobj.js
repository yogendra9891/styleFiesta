var MagentoAPI = require('magento');
var config = require('config');
module.exports = {
	magento: new MagentoAPI({
    host: config.get("magento.host"),
    port: config.get("magento.port"),
    path: config.get("magento.path"),
    login: config.get("magento.login"),
    pass: config.get("magento.pass"),
}),
	session_id: ''
};