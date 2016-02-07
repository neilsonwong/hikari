var pkmnPng = [1, 4, 7, 25, 39, 52, 63, 79, 92, 129, 133, 134, 135, 143];
var Core = function() {};
var Admin = function() {};
var Welcome = function() {};
var SmallGroup = function() {};

$(function() {
    //jquery ready
    Welcome.init = function() {
        $('#step1Done').click(function() {
            var email = $('#email').val();
            $.post('/api/checkEmail', {
                'email': email
            }, function(res) {
                if (res.result) {
                    window.location.href = 'heythere/' + encodeURIComponent(email);
                }
                else {
                    //no email means this is a new user!
                    //WOOT
                    proceed('welcome', 'introduce_yourself');
                }
            });
        });

        $('#email').keydown(function(event) {
            if (event.keyCode == 13) {
                $('#email').blur();
                event.preventDefault();
            }
            return;
        });

        $('#step2Done').click(function() {
            //load the small list
            $.get('/api/sgDetailList', function(groups) {
                var keys = Object.keys(groups);
                //populate the sg list
                var i, groupButton;
                for (i = 0; i < keys.length; ++i) {
                    groupButton = makeListItem(groups[keys[i]], true);
                    groupButton.click(clickGroup);
                    $('#sgList').append(groupButton);
                }
                proceed('introduce_yourself', 'choose_your_smallgroup');
            });
        });

        $('#step3Done').click(function() {
            $.post('/api/join', {
                'appliedSG': $('#sgname').val(),
                'firstname': $('#firstname').val(),
                'lastName': $('#lastName').val(),
                'nickname': $('#nickname').val(),
                'email': $('#email').val()
            }, function(res) {
                if (res.result) {
                    console.log('cool');
                    proceed('choose_your_smallgroup', 'all_done');
                }
                else {
                    console.log('something went wrong');
                }
            });

        });

        function clickGroup(event) {
            var chosen = $(event.currentTarget);
            $('.chosen').toggleClass('chosen');
            chosen.addClass('chosen');
            $('#sgname').val(chosen.attr('data-sgname'));
            console.log($('#sgname').val());
        }

        function proceed(oldAnchor, newAnchor) {
            $('#' + oldAnchor).toggleClass('disabled');
            $('#' + newAnchor).toggleClass('disabled');
            $('#' + newAnchor).focus();

            window.location.replace('welcome#' + newAnchor);
        }
    };

    Admin.init = function() {
        //load sg list
        $.get('/api/sgDetailList', function(groups) {
            var keys = Object.keys(groups);
            //populate the sg list
            var i;
            for (i = 0; i < keys.length; ++i) {
                $('#sgDetailList').append(makeListItem(groups[keys[i]]));
            }

            // fix font sizes
            $('.sgtitle').textfill({
                'maxFontPixels': 21
            });


        });

        $('#saveNewGroup').click(function() {
            $.post('/admin/newSmallGroup', {
                'sgname': $('#newSgName').val(),
                'leaderFname': $('#leaderFirstName').val(),
                'leaderLname': $('#leaderLastName').val(),
                'leaderNickname': $('#leaderNickName').val(),
                'leaderEmail': $('#leaderEmail').val()
            }, function(smallGroup) {
                if (smallGroup) {
                    console.log(smallGroup);
                }
                else {
                    console('HUH? WHAT IS WRONG');
                }
            });
        });
    };

    SmallGroup.init = function() {

    };

    //init the right function
    var page = $('meta[name="page"]').attr('content');
    switch (page) {
        case 'Welcome':
            Welcome.init();
            break;
        case 'Admin':
            Admin.init();
            break;
        case 'SmallGroup':
            SmallGroup.init();
            break;
        default:
    }
});

function makeListItem(smallGroup, simple) {
    var a = $('<li>', {
        'data-sgname': smallGroup.name
    });
    var b = $('<div>');
    var c = $('<img>', {
        src: 'images/pokemon/' + smallGroup.logo + '.png'
    });
    var d = $('<div>', {
        class: 'sgtitle'
    });

    var e = $('<span>', {
        html: smallGroup.name
    });

    d.append(e);
    b.append(c).append(d);

    if (!simple) {
        var f = $('<div>', {
            class: 'userList'
        });

        var j;
        for (j = 0; j < smallGroup.leaders.length; ++j) {
            f.append($('<div>', {
                class: 'leaderTag',
                'data-fname': smallGroup.leaders[j].firstName,
                'data-name': smallGroup.leaders[j].name
            }));
        }
        for (j = 0; j < smallGroup.members.length; ++j) {
            f.append($('<div>', {
                class: 'memberTag',
                'data-fname': smallGroup.members[j].firstName,
                'data-name': smallGroup.members[j].name
            }));
        }
        b.append(f);
    }
    a.append(b);
    return a;
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

function removeTransplant(){
    $('#transplant').remove();
    return;
}