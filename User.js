var fs = require('fs');
var Auth = require('./auth');
var UsersDataFile = './data/users/users.json';

function User(firstName, lastName, nickName, email) {
    //uniqueness check
    if (User.list[email]){
        return User.list[email];
    }

    this.name = nickName || firstName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = firstName + ' ' + lastName;
    this.email = email; //should be unique!
    this.unsubscribe = false;
    this.id = Auth.makeNewToken(email);

    //optional details
    this.gender = null;
    this.description = null;
    this.birthday = null;
    this.avatar = null;

    this.save();
}

User.prototype.save = function(callback) {
    //save to internal array
    User.list[this.email] = this;

    //persist to file
    fs.writeFileSync(UsersDataFile, JSON.stringify(User.list), 'utf8');
}

User.load = function() {
    if (fileExists(UsersDataFile)) {
        //load everything in file back into memory (should only be called on startup)
        User.list = JSON.parse(fs.readFileSync(UsersDataFile, 'utf8'));
    }
};

User.list = {};

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (err) {
        return false;
    }
}

module.exports = User;