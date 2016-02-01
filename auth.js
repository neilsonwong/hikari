var fs = require('fs');
var config = require('./config');

var Authenticator = function() {};
var AuthenticatorDataFile = './data/auth/tokens.json';
var AuthenticatorDataFile2 = './data/auth/emails.json';

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

Authenticator.check = function(token) {
    return Authenticator.tokens[token] !== undefined;
}

Authenticator.isAdmin = function(token){
    return Authenticator.tokens[token] === config.email;
}

Authenticator.load = function() {
    if (fileExists(AuthenticatorDataFile)){
        //load everything in file back into memory (should only be called on startup)
        Authenticator.tokens = JSON.parse(fs.readFileSync(AuthenticatorDataFile, 'utf8'));
    }
    if (fileExists(AuthenticatorDataFile2)){
        //load everything in file back into memory (should only be called on startup)
        Authenticator.emails = JSON.parse(fs.readFileSync(AuthenticatorDataFile2, 'utf8'));
    }
}

Authenticator.save = function() {
    //write to file
    fs.writeFileSync(AuthenticatorDataFile, JSON.stringify(Authenticator.tokens), 'utf8');
    fs.writeFileSync(AuthenticatorDataFile2, JSON.stringify(Authenticator.emails), 'utf8');
}

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (err) {
        return false;
    }
}

module.exports = Authenticator;