var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

//Make an object containing request handlers for different paths
var handle = {};
handle['/'] = requestHandlers.hello;
handle['/pay'] = requestHandlers.pay;
//handle['/ack'] = requestHandlers.ack;

//Start server
server.start(router.route, handle);
