var Auth = require('./auth');
var UsersDataFile = './data/users/users.json';

function User(firstName, lastName, nickName, email){
	this.name = nickName || firstName;
	this.firstName = firstName;
	this.lastName = lastName;
	this.fullName = firstName + ' ' + lastName;
	this.email = email;	//should be unique!
	this.unsubscribe = false;
	this.id = Auth.makeNewToken(email);
}

module.exports = User;