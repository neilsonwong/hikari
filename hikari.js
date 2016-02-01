var schedule = require('node-schedule');

var config = require('./config');
var mailer = require('./mailer')(config);
var Template = require('./template')(config);
var Program = require('./Program');
var TaskList = require('./TaskList');
var SmallGroup = require('./SmallGroup');
var User = require('./User');
var webServer = require('./webserver');


SmallGroup.loadAll();

//schedule the job to fire on fridays @ 2:30
// var j = schedule.scheduleJob({
//     hour: 16,
//     minute: 43,
//     dayOfWeek: 5
// }, function(){
// 	console.log('hi');
// });

// mailer.mail(Template.test());
// mailer.sendMail(Template.devoMail("Neilson", config.test));	
// var p = new Program('test program', 'Feb 5', '8:00pm', 'neilson\'s house', new TaskList('Lydia', 'Teann', 'Neilson', 'Andrew'));
// mailer.sendMail(Template.remindLeadMail(p));
// mailer.sendMail(Template.generalWeeklyMail(p));

// var neilson = new User('neilson', 'wong', 'rin', 'neilson.hc.wong@gmail.com');
// var lydia = new User('lydia', 'chan', null, 'lydiachan@lydiachan.asdfasdf');
// var pablo = new User('pablo', 'lam', 'pawbs', 'pablolam12345@123jdkfjkdjfkj.skjdfkj');
// var asdf = new User('asdf', 'asdf', 'asdf', 'asdf');
// var andrew = new User('andrew', 'andrew', 'andrew', 'andrew');

// var s = new SmallGroup('Lydia\'s Small Group', [lydia], [neilson, pablo, asdf]);
// s.addMember(andrew);
// s.save();

// var s = SmallGroup.load('Lydia\'s Small Group');
// console.log(JSON.stringify(s));