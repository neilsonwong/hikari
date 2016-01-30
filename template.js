

var Mail = require('./mail');
var EH = require('./emailHelper');

var Template = function() {};

var init = function(config) {
    if (!config) {
        return null;
    }
    Template.encodedEmail = encodeURI(config.email);
    Template.botName = config.name;
    Template.botEmail = config.email;
    Template.password = config.pass;
    Template.testEmail = config.test;
    return Template;
}

function generateGeneral(program) {
    //SAMPLE
    // Hi All, 

    // Hope you all get to enjoy a wonderful day off tomorrow!! 

    // This Friday we will be having our Bible Study on Matthew 5.

    // Where: My House
    // When: 8pm
    // What: Bible Study on Matthew 5

    // Leading this week...
    // Program: Lydia
    // Devo: Andrew Cheung
    // Skype: Pablo

    // See you Friday folks!

    var greeting, statement, details, responsibilities, farewell;

    greeting = 'Hi Everybody,';
    statement = 'This Friday our program will be ' + program.program;
    details = makeProgramDetails(program);
    responsibilities = makeResponsibilities(program.responsibilities);
    farewell = farewell || 'See you on Friday! :)';

    return EH.wrap([
            EH.makeLine(greeting),
            EH.linebreak,
            EH.makeLine(statement),
            details,
            responsibilities,
            EH.makeLine(farewell),
            EH.linebreak,
            makeSignature()].join(''));

}

// function generateCustom() {

// }

function generatePrimary(program) {

    //SAMPLE
    // Hi @leader,
    // YOU are leading this week!
    // The program is @program.
    // The details are ...
    // 
    // Date: @date
    // When: @time
    // Where: @location
    //
    // Leading this week...
    // Program: @leader 
    // Devo: @devo
    // Skype: @skype
    //
    // See you Friday folks!

    //if no member responsibilities or no lead
    if (!program.responsibilities || !program.responsibilities.lead){
        return;
    }
    var greeting, reminder, statement, details, responsibilities, farewell;

    greeting = 'Hey ' + program.responsibilities.lead + ',';
    reminder = 'Just wanted to remind you that YOU are leading SG this week!';
    statement = 'The program is ' + program.program;
    details = makeProgramDetails(program);
    responsibilities = makeResponsibilities(program.responsibilities);
    farewell = farewell || 'See you on Friday! :)';

    return EH.wrap([
            EH.makeLine(greeting),
            EH.linebreak,
            EH.makeLine(reminder),
            EH.makeLine(statement),
            EH.linebreak,
            details,
            responsibilities,
            EH.makeLine(farewell),
            EH.linebreak,
            makeSignature()].join(''));
}

//on 2nd through screw custom emails lol
//just add configurable text bubbles later lawl
//and configurable sections
function generateSecondary(secondary, greeting, body, farewell) {
    //SAMPLE
    //Hey Neilson,
    //Just wanna remind you that this week YOU are responsible for devo!!
    //See you on Friday! :)

    secondary = secondary ? (' ' + secondary) : '';
    greeting = greeting || 'Hey' + secondary + ',';
    body = body || 'Just wanna remind you that this week ' + EH.bold('YOU') + ' are responsible for devo!!';
    farewell = farewell || 'See you on Friday! :)';

    return EH.wrap([
            EH.makeLine(greeting),
            EH.makeLine(body),
            EH.makeLine(farewell),
            EH.linebreak,
            makeSignature()].join(''));
}

function makeProgramDetails(program){
    // Date: @date
    // When: @time
    // Where: @location

    var deets, date, time, location;
    deets = EH.makeLine('Here are the details: ');
    date = program.date ? EH.makeLine('Date: ' + EH.bold(program.date)) : '';
    time = program.date ? EH.makeLine('When: ' + EH.bold(program.time)) : '';
    location = program.location ? EH.makeLine('Where: ' + EH.bold(program.location)) : '';

    return deets + date + time + location + EH.linebreak;
}

//takes a TaskList object
function makeResponsibilities(tasks){
    // Leading this week...
    // Program: @leader 
    // Devo: @devo
    // TimeKeeper: @timeKeeper
    // Skype: @skype

    var lead, devo, timeKeeper, skype;

    lead = tasks.lead ? EH.makeLine('Program: ' + EH.bold(tasks.lead)) : '';
    devo = tasks.devo ? EH.makeLine('Devotion: ' + EH.bold(tasks.devo)) : ''
    timeKeeper = tasks.timeKeeper ? EH.makeLine('Time Keeper: ' + EH.bold(tasks.timeKeeper)) : '';
    skype = tasks.skype ? EH.makeLine('Skype/Whatsapp: ' + EH.bold(tasks.skype)) : '';
    
    var result = '' + lead + devo + timeKeeper + skype;
    if (result.length > 0){
        result = EH.makeLine(EH.italic('Leading this week:')) + result + EH.linebreak;
    }
    return result;
}



function makeSignature(){
    return EH.makeLine('Robotically Controlled,') + EH.makeLine(Template.botName);
}


Template.devoMail = function(name, email) {
    var html = generateSecondary(name);
    var subject = 'SG Devo Reminder';
    return new Mail(Template.botName, Template.botEmail, email, subject, "helloz", html);
}

Template.remindLeadMail = function(program){
    var html = generatePrimary(program);
    var subject = 'SG Program Lead Reminder';
    return new Mail(Template.botName, Template.botEmail, Template.testEmail, subject, "hi", html);
}

Template.generalWeeklyMail = function(program){
    var html = generateGeneral(program);
    var subject = 'SG Weekly Program Reminder (Friday, ' + program.date + ', 2016' + ' @' + program.time + ')';
    return new Mail(Template.botName, Template.botEmail, Template.testEmail, subject, "hi", html);
}

Template.test = function() {
    return new Mail(Template.botName, Template.botEmail, Template.testEmail, 'this is a test', '光testing 123', '<b>光 (ひかり)</b>');
};

module.exports = init;