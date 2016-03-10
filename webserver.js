var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var favicon = require('serve-favicon');
var parseUrl = require('parseurl');

//app reqs
var SmallGroup = require('./SmallGroup');
var Auth = require('./auth');
var UI = require('./dynamicUIGenerator');
var User = require('./User');
var Surgeon = require('./Surgeon');
var TaskList = require('./TaskList');
var config = require('./config');
var mailer = require('./mailer')(config);
var Template = require('./template')(config);

var api = require('./routes/api');
var basic = require('./routes/basic');
var admin = require('./routes/admin');
var sg = require('./routes/sg');

var app = express();

app.use(favicon('web/images/dawn.ico'));
app.use('/css', express.static('web/css'));
app.use('/js', express.static('web/js'));
app.use('/images', express.static('web/images'));

app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    //should change to whitelist cookie check as opposed to black list
    var url = parseUrl(req).pathname;
    if (checkWhitelist(url)) {
        //bypass cookie check
        return next();
    }

    var cookie = req.cookies;
    var email;
    if (!cookie || !cookie.kagi || !(email = Auth.check(cookie.kagi))) {
        //invalid cookie!
        return nope(req, res);
    }

    // console.log('cookie detected: ' + cookie.kagi);
    //seems like we are ok
    return next();
});

app.use('/api', api);
app.use('/admin', admin);
app.use('/', basic);
app.use('/sg', sg);

app.get('/user/:userEmail', function(req, res) {
    var email = Auth.tokens[req.cookies.kagi];
    var userEmail = req.params.userEmail;
    var editable = email === userEmail;
    var user = User.list[userEmail];
    if (user){
        //user found
        var html = UI.loadUserProfile(user, editable);
        res.end(html);
        return;
    }
    else {
        return oops(res);
    }
});

app.get('*', function(req, res) {
    oops(res);
});

function adminOnly(req, res) {
    if (Auth.isAdmin(req.cookies.kagi)) {
        return true;
    }
    // res.end('NOPE BOI');
    return true;
    // return false;
}

function checkWhitelist(url) {
    return (url === '/' ||
        url === '/welcome' ||
        url === '/test' ||
        url.indexOf('/heythere') === 0 ||
        url.indexOf('/letmein') === 0 ||
        url.indexOf('/api') === 0 ||
        url.indexOf('/util') === 0);
}

app.listen(3000, function() {
    console.log('ヒカリ listening on port 3000!');
});