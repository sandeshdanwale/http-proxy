var util = require('util')
  , EventEmitter = require('events').EventEmitter
  , helper = require('./helper/util')
  , http = require('http')
  , https = require('https');

module.exports = ProxyServer;

function ProxyServer (options) {
  this.options = options;
  this.options.protocol = helper.checkSecure(options) ? 'https' : 'http';
};

util.inherits(ProxyServer, EventEmitter);

ProxyServer.prototype.listen = function(port) {
  var self = this;
  function proxy (req, res) {
    self.proxyRequest()(req, res); 
  };

  this._server  = this.options.ssl ?
    https.createServer(this.options.ssl, proxy) :
    http.createServer(proxy);

  this._server.listen(port);

  return this;
};

ProxyServer.prototype.proxyRequest = function() {
	var self = this;
	return function (req, res) {
		var orig = req.headers['x-forwarded-for']
    	, remote = req.connection.remoteAddress || req.socket.remoteAddress;

    var out = {
    	host: self.options.proxy_pass,
    	port: self.options.port,
    	path: req.url,
    	rejectUnauthorized: self.options.rejectUnauthorized ? self.options.rejectUnauthorized : false
    }

    req.headers['x-forwarded-for'] = orig ? orig + ',' + remote : remote;
    req.headers['x-forwarded-port'] = helper.getPort(req);
    req.headers['x-forwarded-proto'] = self.options.protocol;

    ['method', 'headers'].forEach(
	    function(e) { 
	    	out[e] = req[e]; 
	  });  
    var proxyRequest = (self.options.protocol === 'https' ? https : http).request(out);

    req.pipe(proxyRequest);

    req.on('data', function(buffer) {
    	if (buffer.toString('ascii', 44,63).toLowerCase() === 'content-disposition') {
    		var headerValue = buffer.toString('ascii', 65,106)
    		var m = headerValue.match(/\bfilename="(.*?)"($|; )/i);
			  console.log(m[1]);
    	}
    })

    req.on('aborted', function () {
      proxyRequest.abort();
    });

    req.on('error', function(err) {
    	proxyRequest.abort();
    	console.log(err)
    });

    proxyRequest.on('error', function(err) {
    	console.log(err);
    });

    proxyRequest.on('response', function(proxyResponse) {
    	
      proxyResponse.headers.connection = req.headers.connection || 'keep-alive';

      Object.keys(proxyResponse.headers).forEach(function(key) {
	      res.setHeader(key, proxyResponse.headers[key]);
	    });

	    res.writeHead(proxyResponse.statusCode);

      proxyResponse.pipe(res);
    });
  }   
}
