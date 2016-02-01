var pkmnPng = [1, 4, 7, 25, 39, 52, 63, 79, 92, 129, 133, 134, 135, 143];

$(function() {
    //jquery ready
    $('#step1Done').click(function(){
        $.post('/checkEmail', {'email': $('#email').val()}, function(res){
            if (res.result){
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



    $('#step2Done').click(function(){
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
});