var schedule = require('node-schedule');

var config = require('./config');
var mailer = require('./mailer')(config);

//schedule the job to fire on fridays @ 2:30
var j = schedule.scheduleJob({
    hour: 15,
    minute: 29,
    dayOfWeek: 5
}, mailer.test);