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
        var pages = [pageHeight, 2 * pageHeight, 3 * pageHeight, 4 * pageHeight];
        var anchors = ['welcome', 'introduce_yourself', 'choose_your_smallgroup', 'all_done'];
        var inBoundingBox = function(x, y) {
            var rect = document.getElementById('sgList').getBoundingClientRect();
            return (rect.left < x && x < rect.right) && (rect.top < y && y < rect.bottom);
        };

        //performance of scroll is bad, handle each event type individually
        //mousewheel
        $('body').on({
            'mousewheel': function(e) {
                var pageY = e.originalEvent.pageY;
                if (pageY < pages[2] && inBoundingBox(e.clientX, e.clientY)) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();

                //mutex
                if (scrollMutex) {
                    return;
                }
                scrollMutex = true;

                var direction = e.originalEvent.wheelDelta / 120 > 0;
                scrollPage(direction, pageY);
                return;
            }
        });

        //keyboard
        $(document).keydown(function(e) {
            var direction;
            switch (e.which){
                case 32:
                case 34:
                case 35:
                case 40:
                    direction = false;
                    break;
                case 33:
                case 36:
                case 38:
                    direction = true;
                    break;
                default:
                    return;
            }

            e.preventDefault();
            e.stopPropagation();

            if ($('input:focus').length !== 0){
                //user is typing; ignore keyboard scrolling keys
                return;
            }

            //mutex
            if (scrollMutex) {
                return;
            }
            scrollMutex = true;

            var pageY = $(document).scrollTop();
            scrollPage(direction, pageY);
        }); 



        function scrollPage(direction, pageY, callback) {
            var origin, destination;
            switch (true) {
                case (pageY < pages[0]):
                    origin = 0;
                    break;
                case (pageY < pages[1]):
                    origin = 1;
                    break;
                case (pageY < pages[2]):
                    origin = 2;
                    break;
                case (pageY < pages[3]):
                    origin = 3;
                    break;
            }
            destination = direction ? Math.max(0, origin - 1) : Math.min(3, origin + 1);
            //check if we are allowed to go there
            if (!$('#' + anchors[destination]).hasClass('disabled')) {
                proceed(anchors[origin], anchors[destination], callback);
            }
        }

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

        function proceed(oldAnchor, newAnchor, callback) {
            // $('#' + oldAnchor).toggleClass('disabled');
            callback = callback || function() { scrollMutex = false; };
            $('#' + newAnchor).removeClass('disabled');
            $('#' + newAnchor).focus();

            // window.location.replace('welcome#' + newAnchor);
            //turn on mutex just in case
            scrollMutex = true;
            $('body').animate({
                'scrollTop': $('#' + newAnchor).offset().top
            }, 200, callback);

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
            var num = i - 1;
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
        return countdown(6, function() {
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
        class: 'line sgAvatar'
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