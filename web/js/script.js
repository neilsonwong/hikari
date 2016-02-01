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
            console.log('hi')
            //load the small list
            $.get('/sgList', function(groups) {
                console.log(groups)
                //populate the sg list
                var i;

                function makeListItem(smallGroup) {
                    var a = $('<li>');
                    var b = $('<div>');
                    var c = $('<img>', {
                        src: "images/pokemon/" + pkmnPng[i] + ".png"
                    });
                    var d = $('<span>', {
                        html: smallGroup
                    });

                    b.append(c).append(d);
                    a.append(b);
                    return a;
                }

                for (i = 0; i < groups.length; ++i) {
                    $('#sgList').append(makeListItem(groups[i]));
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
            console.log(groups)
            //populate the sg list
            var i;

            function makeListItem(smallGroup) {
                var a = $('<li>');
                var b = $('<div>', {
                    class: 'left'
                });
                var c = $('<img>', {
                    src: 'images/pokemon/151.png'
                });
                var d = $('<div>', { class: 'sgtitle' });

                var title = $('<span>', {
                    html: smallGroup.name
                });

                d.append(title);

                //sg creation needs name, leaders
                var e = $('<div>');

                var right = $('<div>', {
                    class: 'right'
                });

                b.append(c).append(d);
                right.append(e);
                a.append(b);
                a.append(right);
                return a;
            }

            function newSG() {
                var a = $('<li>');
                var b = $('<div>', {
                    class: 'left'
                });
                var c = $('<img>', {
                    src: 'images/pokemon/151.png'
                });
                var d = $('<div>', { class: 'sgtitle' });

                var title = $('<span>', {
                    html: 'New Group'
                });

                d.append(title);

                //sg creation needs name, leaders
                var e = $('<input>', {
                    id: 'sgname',
                    type: 'text',
                    placeholder: 'Small Group Name'
                });

                var f = $('<input>', {
                    id: 'leaderFirstName',
                    type: 'text',
                    placeholder: 'Leader\'s First Name'
                });

                var g = $('<input>', {
                    id: 'leaderLastName',
                    type: 'text',
                    placeholder: 'Leader\'s Last Name'
                });

                var h = $('<input>', {
                    id: 'leaderNickName',
                    type: 'text',
                    placeholder: 'Leader\'s Nickname'
                });

                var right = $('<div>', {
                    class: 'right'
                });

                b.append(c).append(d);
                right.append(e).append(f).append(g).append(h);
                a.append(b);
                a.append(right);
                return a;
            }

            for (i = 0; i < groups.length; ++i) {
                $('#sgDetailList').append(makeListItem(groups[i].name));
            }
            $('#sgDetailList').append(newSG());
            $('#sgDetailList').append(makeListItem('Samantha and Dexter'));

            //fix font sizes
            $('.sgtitle').textfill({'maxFontPixels':21});
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