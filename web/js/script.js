var pkmnPng = [1, 4, 7, 25, 39, 52, 63, 79, 92, 129, 133, 134, 135, 143];
var Core = function() {};
var Admin = function() {};
var Welcome = function() {};

$(function() {
    //jquery ready
    Welcome.init = function() {
        $('#step1Done').click(function() {
            $.post('/checkEmail', {
                'email': $('#email').val()
            }, function(res) {
                if (res.result) {
                    window.location.href('hello');
                }
                else {
                    notFound();
                }
            });

            function notFound() {
                $('#welcome').toggleClass('disabled');
                $('#introduce_yourself').toggleClass('disabled');
                $('#introduce_yourself').focus();

                window.location.replace('welcome#introduce_yourself');
            }
        });

        $('#email').keydown(function(event) {
            if (event.keyCode == 13) {
                $('#email').blur();
                event.preventDefault();
            }
        });

        $('#step2Done').click(function() {
            //load the small list
            $.get('/sgDetailList', function(groups) {
                var keys = Object.keys(groups);
                //populate the sg list
                var i;
                for (i = 0; i < keys.length; ++i) {
                    $('#sgList').append(makeListItem(groups[keys[i]], true));
                }

                $('#introduce_yourself').toggleClass('disabled');
                $('#choose_your_smallgroup').toggleClass('disabled');
                $('#choose_your_smallgroup').focus();

                window.location.replace('welcome#introduce_yourself');
            });
        });
    };

    Admin.init = function() {
        console.log('init Admin');
        //load sg list
        $.get('/sgDetailList', function(groups) {
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

    //init the right function
    var page = $('meta[name="page"]').attr('content');
    switch (page) {
        case 'Welcome':
            Welcome.init();
            break;
        case 'Admin':
            Admin.init();
            break;
        default:
    }
});

function makeListItem(smallGroup, simple) {
    var a = $('<li>');
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