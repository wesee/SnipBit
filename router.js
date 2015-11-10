function route(handle, pathname, response) {

	//check if pathname exists
	if (typeof handle[pathname] === 'function') {
		//run request handler
		handle[pathname](response);
	} else {
		//no page found
		console.log("No request handler found for " + pathname);
		//update staus
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Page Not Found");
		response.end();
	}
}

//export route method for use in other files
exports.route = route;
