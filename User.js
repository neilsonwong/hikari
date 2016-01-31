function User(firstName, lastName, nickName, email){
	this.name = nickName || firstName;
	this.firstName = firstName;
	this.lastName = lastName;
	this.fullName = firstName + ' ' + lastName;
	this.email = email;
	this.unsubscribe = false;
}

module.exports = User;