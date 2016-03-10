var express = require('express');
var SmallGroup = require('../SmallGroup');
var Auth = require('../auth');
var User = require('../User');

module.exports = (function() {
    'use strict';
    var api = express.Router();

    //public

    api.get('/getSglist', function(req, res) {
        res.status(200).send(getSGList());
    });

    api.get('/getSgDetailList', function(req, res) {
        res.status(200).send(getSGList(true));
    });

    api.post('/getSg/', function(req, res) {
        var sg = SmallGroup.load(req.body.sg);
        return res.status(200).send(sg);
    });

    api.post('/checkEmail', function(req, res) {
        res.status(200).send({
            "result": Auth.userExists(req.body.email)
        });
    });

    api.post('/join', function(req, res) {
        var sg = SmallGroup.load(req.body.appliedSG);
        var regStatus = {
            "result": false
        };
        if (sg) {
            //make user for this guy
            var applicant = new User(req.body.firstname, req.body.lastname, req.body.nickname, req.body.email);
            sg.addApplicant(applicant);
            regStatus.result = true;
        }
        res.status(200).send(regStatus);
    });

    api.post('/addProgram', function(req, res) {
        var sg = SmallGroup.getFullDetails(req.body.sg);
        var email = Auth.tokens[req.cookies.kagi];
        var status = {
            "result": false
        };
        if (sg && sg.isLeader(email)) {
            //valid person is adding the program
            sg.addProgram(req.body.program, req.body.date, req.body.time, req.body.location, req.body.taskList, req.body.description);
            status.result = true;
        }
        res.status(200).send(status);
    });

    return api;
})();

function getSGList(details) {
    return details ? SmallGroup.detailedList() : Object.keys(SmallGroup.list);
}

