//sg routes

var express = require('express');
var Auth = require('../auth');
var SmallGroup = require('../SmallGroup');
var User = require('../User');
var Surgeon = require('../Surgeon');
var UI = require('../dynamicUIGenerator');

var common = require('./common');

module.exports = (function() {
    'use strict';
    var sg = express.Router();

    sg.get('/:sg', function(req, res) {
        var email = Auth.tokens[req.cookies.kagi];
        if (req.params.sg !== undefined && email) {
            var sg = SmallGroup.getFullDetails(req.params.sg);
            if (sg && sg.isMember(email)) {
                //valid sg and is a member
                //render the right sg
                var html = UI.loadSmallGroup(sg, sg.isLeader(email));
                res.end(html);
                return;
            }
        }
        common.notFound(res);
    });

    sg.get('/:sg/addProgram', function(req, res) {
        var email = Auth.tokens[req.cookies.kagi];
        if (req.params.sg !== undefined && email) {
            var sg = SmallGroup.getFullDetails(req.params.sg);
            if (sg && sg.isMember(email)) {
                //valid sg and is a member
                //render the right sg
                var html = Surgeon.inject('addProgram.html', {
                    'smallGroup': sg,
                    'responsibilityList': TaskList.list
                });
                // res.sendFile('web/addProgram.html', {
                //     root: __dirname
                // });
                res.end(html);
                return;
            }
        }
        common.notFound(res);
    });

    return sg;
})();