//admin routes

var express = require('express');
var Auth = require('../auth');
var SmallGroup = require('../SmallGroup');
var User = require('../User');

var common = require('./common');

module.exports = (function() {
    'use strict';
    var admin = express.Router();

    admin.get('/', function(req, res) {
        if (adminOnly(req, res)) {
            res.sendFile('web/admin.html', common.SITEROOT);
        }
    });

    admin.post('/newSmallGroup', function(req, res) {
        if (adminOnly(req, res)) {
            var leader = new User(req.body.leaderFname, req.body.leaderLname, req.body.leaderNickname, req.body.leaderEmail);
            var sg = new SmallGroup(req.body.sgname, [leader], []);
            res.status(200).send(sg);
        }
    });

    return admin;
})();

function adminOnly(req, res) {
    if (Auth.isAdmin(req.cookies.kagi)) {
        return true;
    }
    return true;
    // return false;
}
