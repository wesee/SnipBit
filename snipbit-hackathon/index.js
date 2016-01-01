var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

//Make an object containing request handlers for different paths
var handle = {};
handle['/'] = requestHandlers.article;
handle['/pay'] = requestHandlers.pay;
handle['/home'] = requestHandlers.home;
handle['/auth'] = requestHandlers.auth;
handle['/oauth/callback'] = requestHandlers.oauthCallback;
//handle['/ack'] = requestHandlers.ack;

//Start server
server.start(router.route, handle);