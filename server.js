
var http = require('http');
var url = require('url');
var PaymentProtocol = require('bitcore-payment-protocol');
var bitcore = require('bitcore-lib');

//Declare start module
//Takes any function as a parameter
//handle is an object, defined in index.js
function start(route, handle) {

	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log(pathname);

		if (request.method === 'POST' && pathname === '/ack'){
			var rawPaymentbody = '';
	
			request.on('data', function (data){
				rawPaymentbody += data;
			});

			//recieve payment
			var body = PaymentProtocol.Payment.decode(rawPaymentbody);
			var payment = new PaymentProtocol().makePayment(body);
			var merchant_data = payment.get('merchant_data');
			var transactions = payment.get('transactions');
			var refund_to = payment.get('refund_to');
			var memo = payment.get('memo');
			//console.log(body);
			//form ACK
			var ack = new PaymentProtocol().makePaymentACK();
			ack.set('payment', payment.message);
			ack.set('memo', 'Thank you for your payment and for using SnipBit! ');
			var rawACKbody = ack.serialize();
			//console.log(ack);

			request.on('end', function (){
				console.log('it ended');
				response.writeHead(200, {
					'Content-Type': PaymentProtocol.PAYMENT_ACK_CONTENT_TYPE, //info in BIP 71
					'Content-Length': rawACKbody.length,
					'Content-Encoding': 'binary'
				});

				response.write(rawACKbody);
				response.end();
			});
		} else {
			//route the request to the proper handler
			route(handle, pathname, request, rawPaymentbody, response);
		}
	}

	//Create the server
	http.createServer(onRequest).listen(8888);
	console.log("Server has started. See on http://ip:8888");
}

//Export start module for use in other files
exports.start = start;
