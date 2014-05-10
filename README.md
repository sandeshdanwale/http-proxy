HTTP(s) Proxy

HTTPs <-> HTTPs

var http = require('http')
  , httpProxy = require('./http-proxy')
  , fs = require('fs');

//
// Create your proxy server and set the proxy_pass in the options.
//
httpProxy.createProxyServer({
  proxy_pass: 'localhost',
  port: 9000,
  ssl: {
    key: fs.readFileSync('key'),
    cert: fs.readFileSync('cer')
  }
}).listen(8000);

//
// Create your target server
//

https.createServer(
  ssl: {
    key: fs.readFileSync('key'),
    cert: fs.readFileSync('cer')
  }, function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9000);


OR

HTTP <-> HTTP

var http = require('http')
  , httpProxy = require('./http-proxy')
  , fs = require('fs');


https.createServer({
    key: fs.readFileSync('/home/advay/Documents/cert/ssl/keys/ca.key'),
    cert: fs.readFileSync('/home/advay/Documents/cert/ssl/certs/ca.cer')
  }, function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9000);


//
// Create your proxy server and set the proxy_pass in the options.
//

httpProxy.createProxyServer({
  proxy_pass: 'localhost',
  port: 9000,
  ssl: {
    key: fs.readFileSync('/home/advay/Documents/cert/ssl/keys/ca.key'),
    cert: fs.readFileSync('/home/advay/Documents/cert/ssl/certs/ca.cer')
  }
}).listen(8000);