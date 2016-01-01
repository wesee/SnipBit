var express = require('express');
var querystring = require('querystring');
var url = require('url');
var requestLib = require('request');
var router = express.Router();

router.get('/', function(req, res, next) {
  	res.render('index', { title: 'SnipBit' });
});

router.get('/oauth', function(req, res, next) {
  	res.render('getauth', { title: 'Testing Coinbase OAUTH' });
});

router.get('/oauth/auth', function(req, res, next) {
  	res.render('auth', { title: 'Testing Coinbase OAUTH' });
  	
  	var search = url.parse(req.url).search;
	var searchArray = search.split("=");
	var code = searchArray[1];

	//make post request url
	var clientId = "63048e52144cce0dea1e079bdbe143c2b05d4c0e9a5a70d3e0980631b32283b7";
	var clientSecret = "eb85d2f2f5681ffee16f448b44aa01822e9a1b88ffe738c2246300f68d82fcde";
			
	var postUrl = "https://api.coinbase.com/oauth/token?";
	postUrl += "&client_id=" + clientId;
	postUrl += "&client_secret=" + clientSecret;
	postUrl += "&code=" + code;
	postUrl += "&grant_type=authorization_code";
	postUrl += "&redirect_uri=http://198.199.70.166:3000/oauth/auth"

	requestLib.post(postUrl, function (error, resp, body) {
		if (!error && resp.statusCode == 200) {
			var bodyObject = JSON.parse(body);
			//SAVE THESE TO DATABASE
			var accessToken = bodyObject.access_token;
			var expiresIn = bodyObject.expires_in; //In seconds, usually 7200 or two hours
			var refreshToken = bodyObject.refresh_token;
			//Create coinbase client for API use
			var Client = require('coinbase').Client;
			var client = new Client({'accessToken': accessToken, 'refreshToken': refreshToken});
			//Now we have API Access
			client.getBuyPrice({'currency': 'USD'}, function(err, obj) {
				console.log('You can buy 1btc at Coinbase for: $' + obj.data.amount);
			});

			client.getCurrentUser(function(err, user) {
				console.log("Hello " + user.name +", your user ID is: " + user.id + " and you can view your coinbase profile here: " + user.profile_url);
			});

		} else {
			console.log(body);
		}
	});

	res.end();
});

module.exports = router;
