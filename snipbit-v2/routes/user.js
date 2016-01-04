var mongoose = require('mongoose');
var mongodb = require('mongodb');
var express = require('express');

var router = express.Router();

//User mongodb Schema
var userSchema = mongoose.Schema({
    email: String, 
    password: String,
    accessToken: String, //For coinbase Oauth
    refreshToken: String
});

var User = mongoose.model('User', userSchema);

//user get request
router.get('/', function(req, res, next) {
	if (req.cookies._uid) {
		//convert to ObjectId class
		var userId = mongodb.ObjectId(req.cookies._uid);

		User.find({ _id: userId }, function (err, userArray) {
			var email = userArray[0].email;
			res.render('user', { email : email, loggedInDisplay : 'initial', loggedOutDisplay: 'none' });
		});
	} else {
		res.render('user', { loggedInDisplay : 'none', loggedOutDisplay: 'initial' });
	}
});

router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Login'});
});

//login post request
router.post('/login', function(req, res, next) {
	var reqBody = req.body;
	var email = reqBody.email;
	var password = reqBody.password;
	var rememberMe = reqBody.remember;

	//check if email and password are legit
	User.find({ email: email }, function (err, userArray) {
		if (err) {
			console.log(err);
			res.redirect('/user/login');
		} else if (password == userArray[0].password) {

			var userId = mongodb.ObjectId(userArray[0]._id).toString();
			//check is remember checkbox is on
			if (rememberMe == 'on') {
				//login for three days
				res.cookie('_uid', userId , { expires: new Date(Date.now() + 259200000) });
				res.redirect('/user');
			} else {
				//login for two hours
				res.cookie('_uid', userId , { expires: new Date(Date.now() + 7200000) });
				res.redirect('/user');
			}

		} else {
			console.log(userArray);
			console.log('!!!!Something went wrong!!!!');
			res.redirect('/user/login');
		}
	});
});

router.get('/register', function(req, res, next) {
	res.render('register', { title: 'Register'});
});

//From register form
router.post('/register', function(req, res, next) {
	var reqBody = req.body;
	var email = reqBody.email;
	var password = reqBody.password;
	var rememberMe = reqBody.remember;

	//check if email is taken
	User.find({ email: email }, function (err, userArray) {
		if (err) {
			console.log(err);
			res.redirect('/user/register');
		} else if (userArray.length > 1) {
			console.log('Email already in use.');
			res.redirect('/user/register');
		} else if (userArray.length == 0) {
			//create the new user
			var newUser = new User({
				email: email,
				password: password,
				accessToken: null,
				refreshToken: null 
			});

			//save the new user
			newUser.save(function (err, newUser) {
			  	if (err) return console.error(err);

			  	var userId = mongodb.ObjectId(newUser._id).toString();
			  	//check is remember checkbox is on
				if (rememberMe == 'on') {
					//login for three days
					res.cookie('_uid', userId, { expires: new Date(Date.now() + 259200000) });
					res.redirect('/user');
				} else {
					//login for two hours
					res.cookie('_uid', userId, { expires: new Date(Date.now() + 7200000) });
					res.redirect('/user');
				}
			});

		} else {
			console.log('!!!!Something Went Wrong!!!!');
			res.redirect('/user/login');
		}
	});
	
});

router.get('/logout', function (req, res, next) {
	res.clearCookie('_uid');
	res.redirect('/user');
});

module.exports = router;
