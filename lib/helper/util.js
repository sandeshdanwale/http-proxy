
exports.checkSecure = function (options) {
	if (!options || !options.ssl || !options.ssl.key || !options.ssl.cert) return false;
	return true;
}

exports.getPort = function (req) {
	var port = req.headers['x-forwarded-port'];
	if (port) return port;
	port = req.headers.host ? req.headers.host.match(/:(\d+)/)[1] : util.checkSecure() ? 443 : 80;
	return port;
}

function extend() {
  if (!Array.prototype.forEach)
  {
    Array.prototype.forEach = function(fun /*, thisp */)
    {
      "use strict";

      if (this === void 0 || this === null)
        throw new TypeError();

      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== "function")
        throw new TypeError();

      var thisp = arguments[1];
      for (var i = 0; i < len; i++)
      {
        if (i in t)
          fun.call(thisp, t[i], i, t);
      }
    };
  }
}
