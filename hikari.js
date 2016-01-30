var schedule = require('node-schedule');

var config = require('./config');
var mailer = require('./mailer')(config);
var Template = require('./template')(config);
var Program = require('./Program');
var TaskList = require('./TaskList');




//schedule the job to fire on fridays @ 2:30
var j = schedule.scheduleJob({
    hour: 16,
    minute: 43,
    dayOfWeek: 5
}, function(){
	console.log('hi');
});

// mailer.mail(Template.test());
// mailer.sendMail(Template.devoMail("Neilson", config.test));	
var p = new Program('test program', 'Feb 5', '8:00pm', 'neilson\'s house', new TaskList('Lydia', 'Teann', 'Neilson', 'Andrew'));
mailer.sendMail(Template.remindLeadMail(p));
mailer.sendMail(Template.generalWeeklyMail(p));
