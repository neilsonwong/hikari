var pkmnPng = [1, 4, 7, 25, 39, 52, 63, 79, 92, 129, 133, 134, 135, 143];
var Core = function() {};
var Admin = function() {};
var Welcome = function() {};
var SmallGroup = function() {};
var Auth = function() {};

bambi = {};

$(function() {
    //jquery ready
    Welcome.init = function() {
        var scrollMutex = false;
        var pageHeight = $(window).height();
        var anchors = ['welcome', 'introduce_yourself', 'choose_your_smallgroup', 'all_done'];
        $('body').on({
            'mousewheel': function(e) {
                bambi = e.target;
                console.log(e.target)
                if (e.target.parentNode.className.indexOf('sg') > -1 || e.target.parentNode.id === 'sgList' || e.target.id === 'sgList') {
                    //fix issue with scrollbox scrolling weird for sgBox
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                //mutex
                if (scrollMutex){
                    return;
                }
                console.log('mutex false');
                scrollMutex = true;

                var direction = e.originalEvent.wheelDelta /120 > 0;
                var pageY = e.originalEvent.pageY;
                var origin, destination;

                switch (true) {
                    case (pageY < pageHeight):
                        origin = 0;
                        break;
                    case (pageY < 2*pageHeight):
                        origin = 1;
                        break;
                    case (pageY < 3*pageHeight):
                        origin = 2;
                        break;
                    case (pageY < 4*pageHeight):
                        origin = 3;
                        break;
                }
                destination = direction ? Math.max(0, origin - 1) : Math.min(3, origin + 1);
                //check if we are allowed to go there
                if (!$('#'+anchors[destination]).hasClass('disabled')){
                    proceed(anchors[origin], anchors[destination]);
                }
                else {
                    //not allowed to scroll, can release mutex
                    scrollMutex = false;
                }
                return;
            }
        });

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
            // $('#' + oldAnchor).toggleClass('disabled');
            $('#' + newAnchor).removeClass('disabled');
            $('#' + newAnchor).focus();
                console.log(newAnchor);

            // window.location.replace('welcome#' + newAnchor);
            $('html, body').animate({
               'scrollTop':   $('#'+newAnchor).offset().top
             }, 200, function(){
                scrollMutex = false;
             });

        }
    };

    Admin.init = function() {
        //load sg list
        $.get('/api/sgDetailList', function(groups) {
            var keys = Object.keys(groups);
            //populate the sg list
            var i;
            for (i = 0; i < keys.length; ++i) {
                $('#sgManagement').append(makeListItem(groups[keys[i]]));
            }
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

    Auth.init = function() {
        function countdown(i, callback) {
            var num = i-1;
            if (num === 0) {
                return callback();
            }
            else {
                $('#countdown').html(num);
                return setTimeout(function() {
                    return countdown(num, callback);
                }, 1000);
            }
        };
        return countdown(6, function(){
            window.location.replace('/');
            return;
        });
    };

    SmallGroup.init = function() {
        return;
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
        case 'Auth':
            Auth.init();
            break;
        case 'SmallGroup':
            SmallGroup.init();
            break;
        default:
    }
});

function makeListItem(smallGroup, simple) {
    var divContainer = $('<div>', {
        class: 'sgBox',
        'data-sgname': smallGroup.name
    });

    var divTopLine = $('<div>', {
        class: 'big line sgAvatar'
    });
    var logo = $('<img>', {
        src: 'images/pokemon/' + smallGroup.logo + '.png'
    });
    var title = $('<span>', {
        html: smallGroup.name
    });


    if (!simple) {
        var memberList = $('<div>', {
            class: 'userList line'
        });

        var j;
        for (j = 0; j < smallGroup.leaders.length; ++j) {
            memberList.append($('<div>', {
                class: 'leaderTag',
                'data-fname': smallGroup.leaders[j].firstName,
                'data-name': smallGroup.leaders[j].name
            }));
        }
        for (j = 0; j < smallGroup.members.length; ++j) {
            memberList.append($('<div>', {
                class: 'memberTag',
                'data-fname': smallGroup.members[j].firstName,
                'data-name': smallGroup.members[j].name
            }));
        }
    }
    divContainer.append(divTopLine.append(logo).append(title)).append(memberList);
    return divContainer;
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

function removeTransplant() {
    $('#transplant').remove();
    return;
}