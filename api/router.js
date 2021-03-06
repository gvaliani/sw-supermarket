var url = require('url');
var qs  = require('querystring');

module.exports = [
	{
		route: '/api',
		handle: function(req, res, next){
		  if (req.method == 'POST' || req.method == 'PUT') {
		    var body = '';
		    req.on('data', function (data) {
		        body += data;
		        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
		        if (body.length > 1e6) {
		          // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
		          req.connection.destroy();
		        }
		    });
		    req.on('end', function () {
		      req.body = JSON.parse( body );
		      next();
		    });
		  } else {
		  	next();
		  }
		}
	},
  {
    route: '/api',
    handle: function (req, res, next) {
      var parsedUrl = url.parse(req.url).path.split('/').filter(function(n){ return n != '' });
      var ctrlName = parsedUrl[0];
      parsedUrl.shift(); // Remove first element
      req.urlParams = parsedUrl;

      var ctrl = require('./' + ctrlName)();
      ctrl[req.method.toLowerCase()](req, res, next);

      next();
    }
  }
];
