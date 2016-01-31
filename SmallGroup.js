var fs = require('fs');

function SmallGroup(name, leaders, members){
	this.name = name;
	this.leaders = leaders;
	this.members = members;
	this.mutex = false;
}

SmallGroup.prototype.addMember = function(user){
	this.members.push(user);
}

SmallGroup.load = function(name){
	if (SmallGroup.list[name]){
		return SmallGroup.list[name];
	}
	else {
		var sg = JSON.parse(fs.readFileSync('./data/' + SmallGroup.getFileName(name) + '.json', JSON.stringify(this), 'utf8'));
		SmallGroup.list[name] = sg;
		return sg;
	}
}

SmallGroup.prototype.save = function(callback){
	//save to internal array
	SmallGroup.list[this.name] = this;

	//persist to file
	fs.writeFileSync('./data/' + SmallGroup.getFileName(this.name) + '.json', JSON.stringify(this), 'utf8');
}

SmallGroup.list = {};

function EmailSettings(){

}

SmallGroup.getFileName = function getFileName(name){
	return name.replace(/[^a-zA-Z0-9]/g,'');
}

module.exports = SmallGroup;