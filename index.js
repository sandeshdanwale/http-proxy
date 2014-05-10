var httpProxy = require('./lib/server');

module.exports.createProxyServer = function createProxyServer(options) {
  return new httpProxy(options);
};

