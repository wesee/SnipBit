var PaymentProtocol = require('bitcore-payment-protocol');
var bitcore = require('bitcore-lib');
var querystring = require('querystring');
	fs = require('fs');

//for requests with / path
function hello(response){
	console.log("Request handler '/' called.");

	response.writeHead(200, {'Content-Type':'text/html'});
	//replace this for html page
	response.write(
		'<html>' + '<head>' + '</head>' + '<body>' + '<a href="bitcoin:?r=http://198.199.70.166:8888/pay">Click here to pay</a>' + 
		'</body>' + '</body>'
	);
	response.end();
}

//for request with /pay path
function pay(response){
	console.log("Request handler '/pay' called.")

	//get current time
	var now = Date.now() / 1000 | 0;

	//make an output
	//UPDATE THIS LATER
	var tx = new bitcore.Transaction();
		tx.to('1ZquFz5Pc2KLaY1mrZdXD6DyprgtsjiR5', 10);
	var output = tx.getChangeOutput();

	//Make an object for payment details
	var details = new PaymentProtocol().makePaymentDetails();
	details.set('network', 'main');
	details.set('outputs', output);
	details.set('time', now);
	details.set('expires', now + 60 * 60 * 24);
	details.set('memo', 'A Paymet Request from SnipBit');
	details.set('payment_url', 'http://198.199.70.166:8888/ack');
	details.set('merchant_data', new Buffer({size: 7})); // identify the request

	// load the X509 certificate
	//UPDATE IF THERE IS A CERTIFICATE
	//var certificates = new PaymentProtocol().makeX509Certificates();
	//certificates.set('certificate', [file_with_x509_der_cert]);

	// form the request
	var request = new PaymentProtocol().makePaymentRequest(); //Documentation is wrong
	request.set('payment_details_version', 1);
	request.set('pki_type', 'none');
	//request.set('pki_data', certificates.serialize());
	request.set('serialized_payment_details', details.serialize());
	//request.sign(file_with_x509_private_key);

	// serialize the request
	var rawbody = request.serialize();
	console.log(rawbody.length);

	response.writeHead(200, {
		'Content-Type': 'application/bitcoin-paymentrequest', //infor in BIP 71
		'Content-Length': rawbody.length,
		'Content-Encoding': 'binary'
	});

	response.write(rawbody);

	response.end();
}

//function ack(response){
//	response.write
//}

//Export methods for use in other files
exports.hello = hello;
exports.pay = pay;
//exports.ack = ack;
