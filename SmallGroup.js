var fs = require('fs');
var Program = require('./Program');
var User = require('./User');
var SmallGroupDataDir = './data/sg/';

function SmallGroup(name, leaders, members) {
    if (arguments.length > 0){
        this.name = name;
        this.uniqueName = SmallGroup.getFileName(name);

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
}

SmallGroup.list = {};
SmallGroup.memberMap = {};

function instance(smallGroupData){
    var sg = new SmallGroup();
    var keys = Object.keys(smallGroupData);
    var i;
    for (i = 0; i < keys.length; ++i){
        //append properties to make proper object
        sg[keys[i]] = smallGroupData[keys[i]];
    }
    return sg;
}

SmallGroup.getFullDetails = function(uname){
    var sg = SmallGroup.load(uname);
    //check if it is an instance
    if (isDBReady(this)){
        sg.leaderEmails = sg.leaders;
        sg.memberEmails = sg.members;
        sg.applicantEmails = sg.applicants;
        sg.leaders = getUsers(sg.leaders);
        sg.members = getUsers(sg.members);
        sg.applicants = getUsers(sg.applicants);
        sg.isLeader = function(email){
            return this.leaderEmails.indexOf(email) !== -1;
        };
        sg.isMember = function(email){
            return this.memberEmails.indexOf(email) !== -1 || this.leaderEmails.indexOf(email) !== -1;
        };
    }
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

SmallGroup.prototype.isLeader = function(email) {
    return this.leaders.indexOf(email) !== -1;
};

SmallGroup.prototype.isMember = function(email) {
	return this.members.indexOf(email) !== -1 || this.leaders.indexOf(email) !== -1;
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
    //assume it is the unique name first
    if (SmallGroup.list[name]) {
        return instance(SmallGroup.list[name]);
    }
    //prolly not the unique name so lets try to change it to that
    else {
        try {
            var sg = JSON.parse(fs.readFileSync(SmallGroupDataDir + SmallGroup.getFileName(name) + '.json', 'utf8'));
            SmallGroup.list[sg.uniqueName] = sg;
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
                SmallGroup.list[sg.uniqueName] = sg;
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
		SmallGroup.memberMap[sg.leaders[i]] = sg.uniqueName;
	}
	for (i = 0; i < sg.members.length; ++i){
		SmallGroup.memberMap[sg.members[i]] = sg.uniqueName;
	}
}

SmallGroup.prototype.save = function(callback) {
    //save to internal array
    //additional processing to stop heisenbuglike errors with our files
    var sg = this;

    if (!isDBReady(sg)){
        sg.leaders = sg.leaderEmails
        sg.members = sg.memberEmails;
        sg.applicants = sg.applicantEmails;
        delete sg.leaderEmails;
        delete sg.memberEmails;
        delete sg.applicantEmails;
        delete sg.isLeader;
        delete sg.isMember;
    }

    SmallGroup.list[sg.uniqueName] = sg;

    //persist to file
    fs.writeFileSync(SmallGroupDataDir + sg.uniqueName + '.json', JSON.stringify(sg), 'utf8');
}

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

SmallGroup.prototype.addProgram = function(program, date, time, location, taskList, description) {
    var p = new Program(program, date, time, location, taskList, description);
    this.futurePrograms.push(p.id);
    this.futurePrograms.sort();
    this.save();
};

function isDBReady(sg){
    return (sg.leaderEmails === undefined && sg.memberEmails === undefined);
}

module.exports = SmallGroup;