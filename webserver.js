var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var favicon = require('serve-favicon');

//app reqs
var Auth = require('./auth');
var UI = require('./dynamicUIGenerator');
var User = require('./User');
var Surgeon = require('./Surgeon');
var TaskList = require('./TaskList');
var config = require('./config');
var mailer = require('./mailer')(config);
var Template = require('./template')(config);

var cookieChecker = require('./routes/cookieChecker');
var common = require('./routes/common');
var api = require('./routes/api');
var basic = require('./routes/basic');
var admin = require('./routes/admin');
var sg = require('./routes/sg');

var app = express();

//middle wares
app.use('/css', express.static('web/css'));
app.use('/js', express.static('web/js'));
app.use('/images', express.static('web/images'));
app.use(favicon('web/images/dawn.ico'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieChecker);

//actual routes
app.use('/api', api);
app.use('/admin', admin);
app.use('/', basic);
app.use('/sg', sg);

app.get('/user/:userEmail', function(req, res) {
    var email = Auth.tokens[req.cookies.kagi];
    var userEmail = req.params.userEmail;
    var editable = email === userEmail;
    var user = User.list[userEmail];
    if (user) {
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
    console.log('hello')
    return common.notFound(res);
});

app.listen(3000, function() {
    console.log('ヒカリ listening on port 3000!');
});