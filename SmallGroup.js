var fs = require('fs');
var Program = require('./Program');
var SmallGroupDataDir = './data/sg/';

function SmallGroup(name, leaders, members){
	this.name = name;
	this.leaders = leaders;
	this.members = members;
	this.emailSettings = new EmailSettings();

	this.pastPrograms = [];
	this.futurePrograms = [];
}

SmallGroup.prototype.addMember = function(user){
	this.members.push(user);
}

SmallGroup.load = function(name){
	if (SmallGroup.list[name]){
		return SmallGroup.list[name];
	}
	else {
		var sg = JSON.parse(fs.readFileSync(SmallGroupDataDir + SmallGroup.getFileName(name) + '.json', 'utf8'));
		SmallGroup.list[name] = sg;
		return sg;
	}
}

SmallGroup.prototype.save = function(callback){
	//save to internal array
	SmallGroup.list[this.name] = this;

	//persist to file
	fs.writeFileSync(SmallGroupDataDir + SmallGroup.getFileName(this.name) + '.json', JSON.stringify(this), 'utf8');
}

SmallGroup.list = {};

function EmailSettings(){
	this.weekly = true;
	this.weeklyMailDay = 2;
	this.lead = true;
	this.leadMailDay = 1;
	this.devo = true;
	this.devoMailDay = 1;
}

SmallGroup.getFileName = function getFileName(name){
	return name.replace(/[^a-zA-Z0-9]/g,'');
}



module.exports = SmallGroup;