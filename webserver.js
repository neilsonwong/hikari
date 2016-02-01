var express = require('express');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var parseUrl = require('parseurl');

//app reqs
var SmallGroup = require('./SmallGroup');

var Auth = require('./auth');

var app = express();

app.use(favicon('web/images/dawn.ico'));
app.use('/css', express.static('web/css'));
app.use('/js', express.static('web/js'));
app.use('/images', express.static('web/images'));

app.use(cookieParser());
app.use(function(req, res, next) {
    var url = parseUrl(req).pathname;
    if (url === '/' ||
        url === '/welcome' ||
        url.indexOf('/letmein') === 0) {
        //bypass cookie check
        return next();
    }

    var cookie = req.cookies;
    if (!cookie || !cookie.kagi || !Auth.check(cookie.kagi)) {
        console.log('oh no');
        //invalid cookie!
        return nope(req, res);
    }

    console.log('cookie detected: ' + cookie.kagi);
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
})

app.get('/sglist', function(req, res) {
    res.status(200).send(Object.keys(SmallGroup.list));
});

app.get('/letmein/:kagi', function(req, res) {
    if (req.params.kagi){
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

app.get('*', function(req, res){
    res.status(404).sendFile('');
});

function nope(req, res) {
    console.log('nope');
    res.redirect('/welcome');
}



app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});