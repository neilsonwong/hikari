var nodemailer = require('nodemailer');
var config = require('./config')

// create reusable transporter object using the default SMTP transport
var encodedEmail = encodeURI(config.email);
var transporter = nodemailer.createTransport('smtps://'+ encodedEmail+':'+config.pass+'@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'bot chan 👥 <bot.t3csg@gmail.com>', // sender address
    to: config.test, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello worldz 🐴', // plaintext body
    html: '<b>Hello world!! 🐴</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});