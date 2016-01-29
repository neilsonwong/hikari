var schedule = require('node-schedule');

var config = require('./config');
var mailer = require('./mailer')(config);
var Template = require('./template')(config);




//schedule the job to fire on fridays @ 2:30
var j = schedule.scheduleJob({
    hour: 16,
    minute: 43,
    dayOfWeek: 5
}, function(){
	console.log('hi');
});

// mailer.mail(Template.test());
mailer.sendMail(Template.devoMail("Neilson", config.test));	
