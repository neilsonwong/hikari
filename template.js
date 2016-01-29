/*
Hi All, 

Hope you all get to enjoy a wonderful day off tomorrow!! 

This Friday we will be having our Bible Study on Matthew 5.

Where: My House
When: 8pm
What: Bible Study on Matthew 5

Leading this week...
Program: Lydia
Devo: Andrew Cheung
Skype: Pablo

See you Friday folks!
*/

var cheerio = require('cheerio');
$ = cheerio.load('<div></div>')

var Mail = require('./mail');

var lb = $('<br />');
var you = $('<b>').html('YOU');

var Template = function() {};

var init = function(config) {
    if (!config) {
        return null;
    }
    Template.encodedEmail = encodeURI(config.email);
    Template.botName = 'Dawn';
    Template.botEmail = config.email;
    Template.password = config.pass;
    return Template;
}

function example() {

}

function generateGeneral() {

}

function generatePrimary(leader, program, dateTime, location) {
    /* example email text
<p>Hi @leader, <br /><br />

<b>YOU</b> are leading this week!<br />
The program is <b>@program</b>.<br />
The details are ...<br />
<b>
Date: @date
When: 8pm
Where: My House
</b>

Leading this week...
Program: Lydia
Devo: Andrew Cheung
Skype: Pablo

See you Friday folks!
*/
}

function generateSecondary(secondary) {
    /*
	<p>
	Hey @secondary,<br /><br />
	Just wanna remind you that this week <b>YOU</b> are responsible for devo!!
	See you on Friday! :)
	</p>
	*/
    var body = $('<div>');
    var greeting = $('<span>').html('Hey ' + secondary + ',');
    var meat = $('<span>').html('Just wanna remind you that this week ' + you + ' are responsible for devo!!');
    var farewell = $('<span>').html('See you on Friday! :)');

    body.append(greeting);
    body.append(lb);
    body.append(meat);
    body.append(lb);
    body.append(farewell);

    return getFullHtml(body);
}

function getFullHtml(jqueryElem) {
	$('div').append(jqueryElem);
    var htmlText = $('div').html();
    console.log(htmlText);
    $('div').empty();
    return htmlText;
}

Template.devoMail = function(name, email) {
    var html = generateSecondary(name);
    var subject = "Devo Reminder"
    return new Mail(Template.botName, Template.botEmail, email, subject, "helloz", html);
}

Template.test = function() {
    return new Mail(Template.botName, Template.botEmail, Template.testEmail, 'this is a test', '光testing 123', '<b>光 (ひかり)</b>');
};

module.exports = init;