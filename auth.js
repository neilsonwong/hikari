var fs = require('fs');

var Authenticator = function() {};
var AuthenticatorDataFile = './data/auth/tokens.json';

Authenticator.tokens = {};
Authenticator.emails = {};

Authenticator.makeNewToken = function(email) {
    //make sure this guy doesn't already have a token
    if (Authenticator.emails[email]) {
        console.log(email + ' already has a token, do something else');
        return null;
    }

    //valid new user
    return new Token(email);
}

function Token(email) {
	//gen token
    var token = Math.round((Math.pow(36, 16 + 1) - Math.random() * Math.pow(36, 16))).toString(36).slice(1);

    //persist into list
    Authenticator.tokens[token] = email;
    Authenticator.emails[email] = token;

	//persist to file
	//lawl just save errthang errTYME
	Authenticator.save();

    return {
        'token': token,
        'email': email
    }
}

Authenticator.check = function(token){
	return Authenticator.tokens[token] === undefined;
} 

Authenticator.load = function() {
    //load everything in file back into memory (should only be called on startup)
    Authenticator.tokens = JSON.parse(fs.readFileSync(AuthenticatorDataFile, 'utf8'));
}

Authenticator.save = function() {
    //write to file
    fs.writeFileSync(AuthenticatorDataFile, Authenticator.tokens, 'utf8');
}

module.exports = Authenticator;