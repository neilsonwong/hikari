var parseUrl = require('parseurl');

var Auth = require('../auth');
var common = require('./common');

var whiteList = ['/', '/welcome', '/test'];
var grayList = ['/heythere', '/letmein', '/api', '/util'];

function cookieChecker(req, res, next) {
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
        return common.goToWelcome(req, res);
    }

    // console.log('cookie detected: ' + cookie.kagi);
    //seems like we are ok
    return next();
}

function checkWhitelist(url) {
    var i;
    for (i = 0; i < whiteList.length; ++i) {
        if (url === whiteList[i]) {
            return true;
        }
    }
    for (i = 0; i < grayList.length; ++i) {
        if (url.indexOf(grayList[i]) === 0) {
            return true;
        }
    }
    return false;
}

module.exports = cookieChecker;