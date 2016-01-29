var nodemailer = require('nodemailer');
var Mail = require('./mail');

var Mailer = function() {};

var init = function(config) {
    if (!config) {
        return null;
    }
    Mailer.encodedEmail = encodeURI(config.email);
    Mailer.password = config.pass;

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

module.exports = init;