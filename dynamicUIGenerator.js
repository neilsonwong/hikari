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
    var titlePlaceholder = $('<h1>', {
        id: 'sgTop',
    }).html();

    var populatedTitle = $('<h1>', {
        id: 'sgTop',
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
        // replacements[applicantListPlaceholder] = makeApplicantList(smallgroup);
    // }

    return Surgeon.forcedInject('smallgroup.html', replacements);
}

function makeMemberList(smallgroup) {
    var list = $('<div>', {
        id: 'memberList'
    });
    var title = $('<div>', {
        class: 'big',
        html: 'Members'
    });
    var div = $('<div>');
    list.append(title).append(div);
    populateMembers(div, smallgroup.leaders, 'leader');
    populateMembers(div, smallgroup.members, 'member');
    populateMembers(div, smallgroup.applicants, 'applicant');
    return list;
}

function makeApplicantList(smallgroup) {
    var list = $('<div>', {
        id: 'applicantList'
    });
    var title = $('<div>', {
        class: 'big',
        html: 'Applicants'
    });
    var div = $('<div>');
    list.append(title).append(div);
    populateApplicants(div, smallgroup.applicants);
    return list;
}

function populateMembers(list, members, css) {
    var i;
    for (i = 0; i < members.length; ++i) {
        list.append(makeMemberItem(members[i], css));
    }
}

function makeApproveButton(member){
    var button = $('<button>', {
        class: 'btn btn-sm btn-info',
        'data-email': member.email,
        html: 'Yes'
    });
    return button;
}

function makeMemberItem(member, css) {
    var div = $('<div>');
    // var img = $('');
    var name = $('<div>', {
        class: css
    });
    var span = $('<span>', {
        html: member.name,
    });

    //append extra if birthday

    div.append(name.append(span));
    return div;
}