/**
 * Created by eli on 23.10.2015.
 */
// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
});

function mnotify(mess) {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(document.title, {
            icon: 'https://nodejs.org/static/apple-touch-icon.png',
            body: mess,
        });

        notification.onclick = function () {
            //window.open("http://stackoverflow.com/a/13328397/1269037");
        };

        setTimeout(function(){
            notification.close().bind(notification);
        }, 3000);
    }
}


(function($){
    "use strict";

    var inter;

    $(document).ready(function(){
        $('#check').click(function(){
            clearInterval(inter);
            inter = setInterval(function(){
                check(!0);
            }, 60000)
            check(!0);
        });
        $('input#url').change(function(e) {
            clearInterval(inter);
        });
        $('input#url').keypress(function(e) {
            if (e.keyCode==13) {
                $('#check').trigger('click');
            }
        });
        $('form').submit(function(e){
            e.preventDefault();
            return !1;
        });
    });

    function check(notice) {
        var fdata = '';
        $('#res').text('loading...');

        fdata = $('form[name="checkUrl"]').serialize();
        $.ajax({
            url:'/',
            method: 'GET',
            dataType:'JSON',
            data: fdata,//'url=' + $('#url').val(),
            success: function(data) {
                var date = new Date();
                var options = {
                    era: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                    timezone: 'UTC',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                };
                data.response += "\n\n" + date.toLocaleString("ru", options);
                $('#res').text(data.response);
                if (notice) {
                    var p = data.response.trim().indexOf("\n");
                    mnotify(data.response.trim().substr(0, p));
                }
            },
            error:function( jqXHR, textStatus, errorThrown ) {
                console.error(jqXHR.responseText, errorThrown );
            }
        });
    }
})(jQuery);