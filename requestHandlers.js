var PaymentProtocol = require('bitcore-payment-protocol');
var bitcore = require('bitcore-lib');
var querystring = require('querystring');
var fs = require('fs');

//for requests with / path
function hello(response){

	fs.readFile('postpreview.html', function(error, content) {
		if (error) {
			response.writeHead(500);
			response.end();
		}
		else {
			response.writeHead(200, { 'Content-Type': 'text/html' });
			response.write(content);
			response.end();
		}
	});
}

//for request with /pay path
function pay(response){

	//get current time
	var now = Date.now() / 1000 | 0;

	//make an output
	//UPDATE THIS LATER
	//make an output
	var address = bitcore.Address.fromString('1J3HDEarLhjRNNjdfYfE1ZJyC95aPdL3wQ');
	var script = bitcore.Script.buildPublicKeyHashOut(address);
	var raw_script = script.toBuffer(); //new Buffer(script.toString(), 'ascii');

	var outputs = new PaymentProtocol().makeOutput();
	outputs.set('amount', 1000);
	outputs.set('script', raw_script);

	//Make an object for payment details
	var details = new PaymentProtocol().makePaymentDetails();
	details.set('network', 'main');
	details.set('outputs', outputs.message);
	details.set('time', now);
	details.set('expires', now + 60 * 60 * 24);
	details.set('memo', 'Space Article');
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

	response.writeHead(200, {
		'Content-Type': PaymentProtocol.PAYMENT_REQUEST_CONTENT_TYPE, //info in BIP 71
		'Content-Length': rawbody.length,
		'Content-Encoding': 'binary'
	});

	response.write(rawbody);

	response.end();
}

//function ack(request, rawPaymentbody, response){
	
//}

//Export methods for use in other files
exports.hello = hello;
exports.pay = pay;
//exports.ack = ack;