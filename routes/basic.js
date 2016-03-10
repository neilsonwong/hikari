//basic routes
var express = require('express');

var Auth = require('../auth');
var SmallGroup = require('../SmallGroup');
var common = require('./common');

module.exports = (function() {
    'use strict';
    var basic = express.Router();

    basic.get('/', function(req, res) {
        var sg;
        var email = Auth.tokens[req.cookies.kagi];
        //if cookie move them to their appropriate sg
        if (email !== undefined) {
            //we have a cookie and now their email, move them to their sg
            sg = SmallGroup.memberMap[email];
            // console.log(SmallGroup.memberMap)
            if (sg) {
                //valid sg found
                //redirecting
                return res.redirect('/sg/' + encodeURIComponent(sg));
            }
        }
        common.goToWelcome(req, res);
    });

    basic.get('/welcome', function(req, res) {
        res.sendFile('web/welcome.html', common.SITEROOT);
    });

    basic.get('/test', function(req, res) {
        res.sendFile('web/test.html', common.SITEROOT);
    });

    basic.get('/heythere/:email', function(req, res) {
        //get user since we know who it is
        var user = User.list[req.params.email];
        if (user) {
            //fire the email
            // mailer.sendMail(Template.authMail(Auth.getFullToken(user.email), user));
            var html = UI.loadHeyThere(user);
            res.end(html);
            return;
        }

        return common.notFound(res);
    });

    basic.get('/letmein/:kagi', function(req, res) {
        if (req.params.kagi) {
            res.cookie('kagi', req.params.kagi, {
                maxAge: 900000000,
                httpOnly: true
            });
        }

        res.sendFile('web/letmein.html', common.SITEROOT);
    });

    return basic;
})();