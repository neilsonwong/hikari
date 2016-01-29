function Mail(myName, fromAddress, toAddress, subject, textBody, htmlBody) {
    this.from = myName + ' <' + fromAddress + '>';
    this.to = toAddress;
    this.subject = subject;
    this.text = textBody;
    this.html = htmlBody;

    // example 
    // from: 'bot chan 👥 <bot.t3csg@gmail.com>', // sender address
    // to: config.test, // list of receivers
    // subject: 'hai gaiz', // Subject line
    // text: 'Hello worldz 🐴', // plaintext body
    // html: '<b>Hello world!! 🐴</b>' // html body
}

module.exports = Mail;