var fs = require('fs');
var Program = require('./Program');
var SmallGroupDataDir = './data/sg/';

function SmallGroup(name, leaders, members) {
    this.name = name;

    //loop through leaders and members
    this.leaders = setUsers(leaders);
    this.members = setUsers(members);
    this.emailSettings = new EmailSettings();

    this.pastPrograms = [];
    this.futurePrograms = [];
    this.save();
}

function setUsers(source) {
    var arr = [];
    var i;
    for (i = 0; i < source.length; ++i) {
        arr.push({
            email: source[i].email,
            name: source[i].name
        });
    }
    return arr;
}

SmallGroup.prototype.addMember = function(user) {
    this.members.push(user);
}

SmallGroup.load = function(name) {
    if (SmallGroup.list[name]) {
        return SmallGroup.list[name];
    } else {
        var sg = JSON.parse(fs.readFileSync(SmallGroupDataDir + SmallGroup.getFileName(name) + '.json', 'utf8'));
        SmallGroup.list[sg.name] = sg;
        return sg;
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
            } catch (e) {
                console.log(e);
            }
        }
    }
}

SmallGroup.prototype.save = function(callback) {
    //save to internal array
    SmallGroup.list[this.name] = this;

    //persist to file
    fs.writeFileSync(SmallGroupDataDir + SmallGroup.getFileName(this.name) + '.json', JSON.stringify(this), 'utf8');
}

SmallGroup.list = {};

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