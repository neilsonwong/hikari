var $ = require('jdummy');
var Surgeon = require('./Surgeon');

exports.loadHeyThere = function(user) {
    var usernamePlaceholder = $('<span>', {
        id: 'username'
    }).html();

    var populatedUsername = $('<span>', {
        id: 'username',
        html: user.name
    });

    var replacements = {};
    replacements[usernamePlaceholder] = populatedUsername;

    return Surgeon.forcedInject('heythere.html', replacements);
};

exports.loadSmallGroup = function(smallgroup, admin) {
    var titlePlaceholder = $('<span>', {
        id: 'sgTop',
        class: 'chubby big'
    }).html();

    var populatedTitle = $('<span>', {
        id: 'sgTop',
        class: 'chubby big',
        html: smallgroup.name
    });

    var memberListPlaceholder = $('<div>', {
        id: 'memberList'
    }).html();

    var applicantListPlaceholder = $('<div>', {
        id: 'applicantList'
    }).html();

    var replacements = {};
    replacements[titlePlaceholder] = populatedTitle;
    replacements[memberListPlaceholder] = makeMemberList(smallgroup);

    //admin mode things
    // if (admin) {
        replacements[applicantListPlaceholder] = makeApplicantList(smallgroup);
    // }

    return Surgeon.forcedInject('smallgroup.html', replacements);
}

function makeMemberList(smallgroup) {
    var list = $('<div>', {
        id: 'memberList'
    });
    var ul = $('<ul>');
    list.append(ul);
    populateMembers(ul, smallgroup.leaders, true);
    populateMembers(ul, smallgroup.members, false);
    return list;
}

function makeApplicantList(smallgroup) {
    var list = $('<div>', {
        id: 'applicantList'
    });
    var ul = $('<ul>');
    list.append(ul);
    populateApplicants(ul, smallgroup.applicants);
    return list;
}

function populateMembers(list, members, isLeader) {
    var i;
    var css = isLeader ? 'leader' : 'member';
    for (i = 0; i < members.length; ++i) {
        list.append(makeMemberItem(members[i], css));
    }
}

function populateApplicants(list, members) {
    var i;
    var li;
    for (i = 0; i < members.length; ++i) {
        li = makeMemberItem(members[i], 'applicant');
        li.append(makeApproveButton(members[i]));
        list.append(li);
    }
}

function makeApproveButton(member){
    console.log(member.email);
    var button = $('<button>', {
        class: 'btn btn-sm btn-info',
        'data-email': member.email,
        html: 'Yes'
    });
    return button;
}

function makeMemberItem(member, css) {
    var li = $('<li>');
    // var img = $('');
    var name = $('<div>', {
        html: member.name,
        class: css
    });

    li.append(name);
    return li;
}