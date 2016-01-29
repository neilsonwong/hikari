var nodemailer = require('nodemailer');
var Mail = require('./mail');

var Mailer = function() {};

var init = function(config) {
    if (!config) {
        return null;
    }
    Mailer.encodedEmail = encodeURI(config.email);
    Mailer.password = config.pass;
    Mailer.testEmail = config.test;

    // create reusable transporter object using the default SMTP transport
    Mailer.transporter = nodemailer.createTransport('smtps://' + Mailer.encodedEmail + ':' + Mailer.password + '@smtp.gmail.com');

    return Mailer;
}

Mailer.sendMail = function(mail) {
    // send mail with defined transport object
    Mailer.transporter.sendMail(mail, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};

Mailer.test = function() {
    var testMail = new Mail('bot chan', 'bot.t3csg@gmail.com', Mailer.testEmail, 'this is a test', '光testing 123', '<b>光 (ひかり)</b>');
    Mailer.sendMail(testMail);
    return;
};

module.exports = init;