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

exports.loadUserProfile = function(user) {
    var topPlaceHolder = $('<div>', { id: 'top' }).append($('<div>', { id: 'avatar' })).append($('<h1>', { id: 'nickName' })).html();
    var containerPlaceHolder = $('<div>', { class: 'info' }).append($('<div>', { id: 'firstName' })).append($('<div>', { id: 'lastName' }))    
        .append($('<div>', { id: 'email' })).append($('<div>', { id: 'gender' })).append($('<div>', { id: 'birthday' }))
        .append($('<div>', { id: 'description' })).html();

    var top = $('<div>', {
        id: 'top'
    });

    var avatar = $('<div>', { id: 'avatar' }).append($('<img>', { src: '/images/pokemon/'+user.avatar+'.png' }));
    // console.log(avatar.html());
    var nickName = $('<h1>', { id: 'nickName', html: user.name });
    console.log(nickName.html())

    var container = $('<div>', {
        class: 'info'
    });

    var firstName = $('<div>', { id: 'firstName' }).append($('<span>', { html: user.firstName }));
    var lastName = $('<div>', { id: 'lastName' }).append($('<span>', { html: user.lastName }));
    var email = $('<div>', { id: 'email' }).append($('<span>', { html: user.email }));
    var gender = $('<div>', { id: 'gender' }).append($('<span>', { html: '' + user.gender }));
    var birthday = $('<div>', { id: 'birthday' }).append($('<span>', { html: '' + user.birthday }));
    var description = $('<div>', { id: 'description' }).append($('<span>', { html: '' + user.description }));

    top.append(avatar).append(nickName);
    container.append(firstName).append(lastName).append(email).append(gender).append(birthday).append(description);

    var replacements = {};
    replacements[topPlaceHolder] = top;
    replacements[containerPlaceHolder] = container;

    console.log(top.html())
    console.log(container.html())

    return Surgeon.forcedInject('userProfile.html', replacements);
}

function makeMemberList(smallgroup) {
    var list = $('<div>', {
        id: 'memberList'
    });
    var title = $('<h2>', {
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

