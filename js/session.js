// we have to do this outside the dialog as cattranslate() may fail there
var dlg_title      = cattranslate("Your session has expired!");
var dlg_text       = cattranslate("Please enter your login details to log in again.");
var txt_username   = cattranslate('Username');
var txt_password   = cattranslate('Password');
var txt_login      = cattranslate("Login");
var txt_details    = cattranslate('Please enter your login details!');

var sessionTimeoutDialog = false;

function sessionTimedOutDialog()
{
    $('#sessionTimeoutDialog').dialog('close').dialog('destroy');

    // logout
    $.ajax({
        type:     'POST',
        url:      CAT_ADMIN_URL + '/logout/index.php',
        dataType: 'json',
        cache:    false,
        data:     { _cat_ajax: 1 },
        success:  function( data, textStatus, jqXHR )
        {
            // ignore
        }
    });

    var username_field = Math.random().toString(36).slice(2);
    var password_field = Math.random().toString(36).slice(2);
    var dates          = {
		'username_fieldname':	'username_'+username_field,
		'password_fieldname':	'password_'+password_field,
        '_cat_ajax'         :   1,
        'redirect'          :   false
        //location.href
	};
    $('<div id="sessionTimedOutDialog"></div>')
        .html(
            '<span class="icon icon-warning" style="color:#c00;"></span> '+
            dlg_text+
            '<br /><br />'+
            '<div id="login_error_field" style="display:none;color:#c00;padding:5px;"></div><br /><br />'+
            '<form>'+
            '<label for="username" class="fc_label_200">'+txt_username+':</label>'+
            '<input type="text" name="username_'+username_field+'" id="username_'+username_field+'" /><br />'+
            '<label for="pass" class="fc_label_200">'+txt_password+':</label>'+
            '<input type="password" name="password_'+password_field+'" id="password_'+password_field+'" /><br /><br />'
        ).dialog({
            modal: true,
            closeOnEscape: false,
            open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
            title: dlg_title,
            width: 600,
            height: 300,
            buttons: [
                {
                    text: txt_login,
                    icons: {primary: "ui-icon-check"},
                    open: function() {
                        $(this).keypress(function(e) {
                            if (e.keyCode == $.ui.keyCode.ENTER) {
                                $(this).find('.ui-dialog-buttonset button').eq(0).trigger('click');
                            }
                        });
                    },
                    click: function() {
                        var _this = $(this);
                        if($('#username_'+username_field).val() == ''
                        || $('#password_'+password_field).val() == '' ) {
                            if($('#username_'+username_field).val() == '') {
                                $('#username_'+username_field).css('border','1px solid #c00');
                            }
                            if($('#password_'+password_field).val() == '' ) {
                                $('#password_'+password_field).css('border','1px solid #c00');
                            }
                            $('#login_error_field').text(txt_details).show();
                        }
                        else {
                            dates['username_'+username_field] = $('#username_'+username_field).val();
                            dates['password_'+password_field] = $('#password_'+password_field).val();
                            $.ajax({
                                type:     'POST',
                                url:      CAT_ADMIN_URL + '/login/ajax_index.php',
                                dataType: 'json',
                                data:     dates,
                                cache:    false,
                                success:  function( data, textStatus, jqXHR )
                                {
                                    if(data.success===true) {
                                        $(_this).dialog('close').dialog('destroy');
                                        sessionSetTimer(data.timer);
                                    }
                                    else {
                                        //$('#login_error_field').text(cattranslate(data.message)).show();
                                        $('#login_error_field').text(data.message).show();
                                    }
                                }
                            });
                        }
                    }
                }
            ]
        }).on('keyup', function(e){
            if (e.keyCode == 13) {
                $('.ui-button-text-icon-primary').click();
            }
        });
    $('.ui-widget-overlay').css('background-image','none').css('background-color','#000').css('opacity','0.9');
}

function sessionSetTimer(sesstime)
{
    // session timer
    var timer = $('#fc_session_counter');
    if(typeof sesstime != 'undefined') { timer.text(toTimeString(sesstime)); }
    timerId   = setInterval(function() {
        var secs = TimeStringToSecs(timer.text())-1;
        if(secs < 300)   { timer.parent().addClass('fc_gradient_red'); }
        if(secs == 5)    { $('#fc_dlg_timer').css('color','#c00'); }
        if(secs == 0)    { clearInterval(timerId); sessionTimedOutDialog(); }
        timer.text(toTimeString(secs));
        $('span#fc_dlg_timer').text(secs);
    }, 1000);
}

jQuery(document).ready(function($) {
    sessionSetTimer();
});