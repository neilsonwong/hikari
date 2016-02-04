var fs = require('fs');
var Program = require('./Program');
var User = require('./User');
var SmallGroupDataDir = './data/sg/';

function SmallGroup(name, leaders, members) {
    this.name = name;

    //loop through leaders and members
    this.leaders = setUsers(leaders);
    this.members = setUsers(members);
    this.emailSettings = new EmailSettings();

    this.pastPrograms = [];
    this.futurePrograms = [];

    this.applicants = [];

    this.logo = 25;

    if (!SmallGroup.list[name]){
        this.save();
    }
}

function instance(smallGroupData){
    return new SmallGroup(smallGroupData.name, smallGroupData.leaders, smallGroupData.members);
}

SmallGroup.getFullDetails = function(name){
    var sg = SmallGroup.load(name);
    sg.leaders = getUsers(sg.leaders);
    sg.members = getUsers(sg.members);
    return sg;
}

function setUsers(source) {
    var arr = [];
    var i;
    for (i = 0; i < source.length; ++i) {
        arr.push(source[i].email === undefined ? source[i] : source[i].email);
    }
    return arr;
}

function getUsers(source) {
    var arr = [];
    var i, email;
    for (i = 0; i < source.length; ++i) {
        email = source[i];
        arr.push(User.list[email]);
    }
    return arr;
}

SmallGroup.prototype.isMember = function(email) {
	return this.members.indexOf(email) !== -1 || this.leaders.indexOf(email);
};

SmallGroup.prototype.approveApplicant = function(user) {
    this.members.push(user.email);
    var index = this.applicants.indexOf(user.email);
    if (index > -1) {
        this.applicants.splice(index, 1);
    }
    this.save();
}

SmallGroup.prototype.addApplicant = function(user) {
    this.applicants.push(user.email);
    this.save();
}

SmallGroup.prototype.addMember = function(user) {
    this.members.push(user.email);
    this.save();
}

SmallGroup.load = function(name) {
    if (SmallGroup.list[name]) {
        return instance(SmallGroup.list[name]);
    }
    else {
        try {
            var sg = JSON.parse(fs.readFileSync(SmallGroupDataDir + SmallGroup.getFileName(name) + '.json', 'utf8'));
            SmallGroup.list[sg.name] = sg;
            return instance(sg);
        }
        catch (e) {
            console.log(e);
        }
        return false;
    }
}

SmallGroup.loadAll = function() {
    var groups = fs.readdirSync(SmallGroupDataDir);

    var i, sg;
    for (i = 0; i < groups.length; ++i) {
        element = groups[i];
        if (element.charAt(0) !== '.' && element.indexOf('.json') !== -1 && (element.length - 5 === element.indexOf('.json'))) {
            //valid file
            try {
                sg = JSON.parse(fs.readFileSync(SmallGroupDataDir + element, 'utf8'));
                SmallGroup.list[sg.name] = sg;
                mapMembersToGroup(sg);

            }
            catch (e) {
                console.log(e);
            }
        }
    }
}

function mapMembersToGroup(sg){
	var i;
	for (i = 0; i < sg.leaders.length; ++i){
		SmallGroup.memberMap[sg.leaders[i]] = sg.name;
	}
	for (i = 0; i < sg.members.length; ++i){
		SmallGroup.memberMap[sg.members[i]] = sg.name;
	}
}

SmallGroup.prototype.save = function(callback) {
    //save to internal array
    SmallGroup.list[this.name] = this;

    //persist to file
    fs.writeFileSync(SmallGroupDataDir + SmallGroup.getFileName(this.name) + '.json', JSON.stringify(this), 'utf8');
}

SmallGroup.list = {};
SmallGroup.memberMap = {};

SmallGroup.detailedList = function(){
    var details = {};
    var keys = Object.keys(SmallGroup.list);
    var i;
    for (i = 0; i < keys.length; ++i){
        //keysp[i] is the SG name
        details[keys[i]] = SmallGroup.getFullDetails(keys[i]);
    }
    return details;
}

function EmailSettings() {
    this.weekly = true;
    this.weeklyMailDay = 2;
    this.lead = true;
    this.leadMailDay = 1;
    this.devo = true;
    this.devoMailDay = 1;
}

SmallGroup.getFileName = function getFileName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '');
};

//stored in array with week number will work cuz sg only functions on 1 day of the week
SmallGroup.prototype.addProgram = function(program, date, time, location, taskList) {
    var p = new Program(program, date, time, location, taskList);
};

module.exports = SmallGroup;