function User(firstName, lastName, email){
	this.name = firstName;
	this.firstName = firstName;
	this.lastName = lastName;
	this.fullName = firstName + ' ' + lastName;
	this.email = email;
}

module.exports = User;