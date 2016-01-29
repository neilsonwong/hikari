var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var config = require('./config')

// create reusable transporter object using the default SMTP transport
var encodedEmail = encodeURI(config.email);
var transporter = nodemailer.createTransport('smtps://'+ encodedEmail+':'+config.pass+'@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'bot chan 👥 <bot.t3csg@gmail.com>', // sender address
    to: config.test, // list of receivers
    subject: 'hai gaiz', // Subject line
    text: 'Hello worldz 🐴', // plaintext body
    html: '<b>Hello world!! 🐴</b>' // html body
};

function sendTheMail(){
	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}


//schedule the job to fire on fridays @ 2:30
var j = schedule.scheduleJob({hour: 14, minute: 30, dayOfWeek: 5}, sendTheMail);