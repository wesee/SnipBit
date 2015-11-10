
var http = require('http');
var url = require('url');

//Declare start module
//Takes any function as a parameter
//handle is an object, defined in index.js
function start(route, handle) {

	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log(pathname);
		//route the request to the proper handler
		//The arguments passed to this start module
		route(handle, pathname, response);
	}

	//Create the server
	http.createServer(onRequest).listen(8888);
	console.log("Server has started. See on http://ip:8888");
}

//Export start module for use in other files
exports.start = start;
