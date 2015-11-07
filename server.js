
var http = require('http');

http.createServer(function(request, response){
	// 200 'OK'
	response.writeHead(200, {"Content-Type": "text/plain"});
	// Write to document
	response.write("Here's SnipBit");
	// End response
	response.end();

}).listen(8888); //listen on url port 8888 view on http:/ip:8888
