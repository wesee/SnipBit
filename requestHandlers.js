var PaymentProtocol = require('bitcore-payment-protocol');
var bitcore = require('bitcore-lib');
var querystring = require('querystring');
var fs = require('fs');
var url = require('url');
var request = require('request');


//TESTING COINBASE OAUTH
function home(response, req) {

	fs.readFile('oauthresp.html', function(error, content) {
		if (error) {
			response.writeHead(500);
			response.end();
		}
		else {
			var search = url.parse(req.url).search;
			var searchArray = search.split("=");
			var code = searchArray[1];

			//load the page
			response.writeHead(200, { 'Content-Type': 'text/html' });
			response.write(content);

			//make post request url
			var clientId = "63048e52144cce0dea1e079bdbe143c2b05d4c0e9a5a70d3e0980631b32283b7";
			var clientSecret = "eb85d2f2f5681ffee16f448b44aa01822e9a1b88ffe738c2246300f68d82fcde";
			
			var postUrl = "https://api.coinbase.com/oauth/token?grant_type=authorization_code&code=" + code;
			postUrl += "&client_id=" + clientId;
			postUrl += "&client_secret=" + clientSecret;
			postUrl += "&redirect_uri=http%3A%2F%2F198.199.70.166%3A8888%2Foauth%2Fcallback"
			console.log(postUrl);

			request(postUrl, function (error, resp, body) {
				if (!error && resp.statusCode == 200) {
					console.log(resp);
					console.log(body);
				} else {
					console.log(error);
				}
			});

			response.end();
		}
	});

}

//TESTING COINBASE OAUTH
function auth(response) {

	fs.readFile('auth.html', function(error, content) {
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

//TESTING COINBASE OAUTH
function oauthCallback(response) {

	fs.readFile('oauthCallback.html', function(error, content) {
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

//for requests with / path
function article(response) {

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
function pay(response) {

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
exports.article = article;
exports.home = home;
exports.auth = auth;
exports.pay = pay;
exports.oauthCallback = oauthCallback;
//exports.ack = ack;