var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var favicon = require('serve-favicon');
var parseUrl = require('parseurl');
var SmallGroup = require('./SmallGroup');
var User = require('./User');

//app reqs
var SmallGroup = require('./SmallGroup');

var Auth = require('./auth');

var app = express();

app.use(favicon('web/images/dawn.ico'));
app.use('/css', express.static('web/css'));
app.use('/js', express.static('web/js'));
app.use('/images', express.static('web/images'));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    var url = parseUrl(req).pathname;
    if (url === '/' ||
        url === '/welcome' ||
        url.indexOf('/letmein') === 0) {
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

app.get('/', function(req, res) {
    res.sendFile('web/index.html', {
        root: __dirname
    });
});

app.get('/welcome', function(req, res) {
    res.sendFile('web/welcome.html', {
        root: __dirname
    });
});

app.post('/checkEmail', function(req, res) {
    res.status(200).send({
        "result": false
    });
});

app.get('/sglist', function(req, res) {
    res.status(200).send(getSGList());
});

app.get('/sgDetailList', function(req, res) {
    res.status(200).send(getSGList(true));
});

function getSGList(details) {
    return details ? SmallGroup.list : Object.keys(SmallGroup.list);
}

app.get('/letmein/:kagi', function(req, res) {
    if (req.params.kagi) {
        res.cookie('kagi', req.params.kagi, {
            maxAge: 900000000,
            httpOnly: true
        });
        console.log('cookie created successfully');
    }

    res.sendFile('web/letmein.html', {
        root: __dirname
    });
});

app.get('/admin', function(req, res) {
    if (adminOnly(req, res)) {
        res.sendFile('web/admin.html', {
            root: __dirname
        });
    }
});

app.post('/admin/newSmallGroup', function(req, res) {
    if (adminOnly(req, res)) {
        var leader = new User(req.body.leaderFname, req.body.leaderLname, req.body.leaderNickname, req.body.leaderEmail);
        var sg = new SmallGroup(req.body.sgname, [leader], []);
        res.status(200).send(sg);
    }
});

app.get('*', function(req, res) {
    res.status(404).sendFile('');
});

function nope(req, res) {
    res.redirect('/welcome');
}

function adminOnly(req, res) {
    if (Auth.isAdmin(req.cookies.kagi)) {
        return true;
    }
    res.end('NOPE BOI');
    return false;
}

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});