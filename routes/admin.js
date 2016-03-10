//admin routes

var express = require('express');
var SmallGroup = require('../SmallGroup');
var User = require('../User');

module.exports = (function() {
    'use strict';
    var admin = express.Router();

    admin.get('/', function(req, res) {
        if (adminOnly(req, res)) {
            res.sendFile('web/admin.html', {
                root: __dirname
            });
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