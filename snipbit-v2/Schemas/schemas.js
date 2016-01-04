var mongoose = require('mongoose')

function save(toSave) {
	toSave.save(function (err, result) {
	  	if (err) return console.error(err);
	});
}

var userSchema = mongoose.Schema({
    name: String, 
    password: String,
    accessToken: String, //For coinbase Oauth
    refreshToken: String
});

var User = mongoose.model('User', userSchema);

function newUser(name, password, accessToken, refreshToken) {
	var newUser = new User({
		name: name,
		password: password,
		accessToken: accessToken,
		refreshToken: refreshToken 
	});

	return newUser;
}

module.exports = save;
module.exports = newUser;