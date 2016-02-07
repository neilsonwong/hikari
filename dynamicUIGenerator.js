var $ = require('jdummy');
var Surgeon = require('./Surgeon');

exports.loadSmallGroup = function(smallgroup) {
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

    var replacements = {};
    replacements[titlePlaceholder] = populatedTitle;
    replacements[memberListPlaceholder] = makeMemberList(smallgroup);

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

function populateMembers(list, members, isLeader) {
    var i;
    var css = isLeader ? 'leader' : 'member';
    for (i = 0; i < members.length; ++i) {
        list.append(makeMemberItem(members[i], css));
    }
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