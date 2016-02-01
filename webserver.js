var express = require('express');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');

//app reqs
var SmallGroup = require('./SmallGroup');

var Auth = require('./auth');

var app = express();

app.use(favicon('web/images/dawn.ico'));
app.use('/css', express.static('web/css'));
app.use('/js', express.static('web/js'));
app.use('/images', express.static('web/images'));

app.use(cookieParser());

// set a cookie
app.use(function(req, res, next) {
    // check if client sent cookie
    var cookie = req.cookies.cookieName;
    if (cookie === undefined) {
        // no: set a new cookie
        var randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2, randomNumber.length);
        res.cookie('cookieName', randomNumber, {
            maxAge: 900000,
            httpOnly: true
        });
        console.log('cookie created successfully');
    } else {
        // yes, cookie was already present 
        console.log('cookie exists', cookie);
    }
    next(); // <-- important!
});

app.get('/', function(req, res) {
	res.sendFile('web/index.html', { root: __dirname });
});

app.get('/welcome', function(req, res) {
	res.sendFile('web/welcome.html', { root: __dirname });
});

app.post('/checkEmail', function(req, res) {
    res.status(200).send({"result": false});
});

app.get('/sglist', function(req, res) {
    res.status(200).send(Object.keys(SmallGroup.list));
    
});

function nope(req, res){
	res.sendFile('web/index.html', { root: __dirname });
}



app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});