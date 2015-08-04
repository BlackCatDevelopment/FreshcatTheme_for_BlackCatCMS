/**
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 3 of the License, or (at
 *   your option) any later version.
 * 
 *   This program is distributed in the hope that it will be useful, but
 *   WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 *   General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program; if not, see <http://www.gnu.org/licenses/>.
 *
 *   @author          Black Cat Development
 *   @copyright       2014, Black Cat Development
 *   @link            http://blackcat-cms.org
 *   @license         http://www.gnu.org/licenses/gpl.html
 *   @category        CAT_Core
 *   @package         freshcat
 *
 */
function send_testmail(URL) {
    if ( typeof jQuery != 'undefined' ) {
        jQuery.ajax({
            type: 'POST',
            url:  URL,
            data: {'_cat_ajax': 1},
            beforeSend: function( jqXHR ) {
                jQuery('#testmail_result').html(
                    "<div style='border: 2px solid #cc6600; padding: 5px; text-align: center; background-color: #ffcc66;'>" +
                    cattranslate('Trying to send testmail, please wait...') +
                    "</div>").show();
                return true;
            },
            success:    function( data, textStatus, jqXHR  ) {
                jQuery('#testmail_result').html(data).show();
            }
        });
    }
}

function create_guid(URL) {
    if ( typeof jQuery != 'undefined' ) {
        jQuery.ajax({
            type: 'GET',
            url:  URL,
            success:    function( data, textStatus, jqXHR  ) {
                jQuery('#guid').html(data);
                $('#fc_createguid').hide();
            }
        });
    }
}

jQuery(document).ready(function($){
    $('#fc_list_overview li').fc_set_tab_list();
    var set_cookie    = SESSION + "_settings_open";
    // change settings tab
    $('#fc_list_overview li').click( function()
    {
        var current  = $(this),
            dates    = {
                '_cat_ajax': 1,
                'template': current.find('input').val()
            };
        $.cookie( set_cookie, current.find('input').val(), { path: '/' } );
        $.ajax(
        {
            type:     'POST',
            url:      CAT_ADMIN_URL + '/settings/ajax_get_settings.php',
            dataType: 'json',
            data:     dates,
            cache:    false,
            success:  function( data, textStatus, jqXHR )
            {
                if ( data.success === true )
                {
                    $('div#fc_set_form_content').html(data.settings);
                    $('input#current_page').val(current.find('input').val());
                    // Enable qtip2
                    if(typeof window.qtip !== undefined) {
                        $('[title!=""]').qtip({
                            content: {attr: 'title'},
                            style  : {classes: 'qtip-light qtip-shadow qtip-rounded'}
                        });
                    }
                }
                else {
                    return_error( jqXHR.process , data.message);
                }
            }
        });
    });
    if(typeof $.cookie(set_cookie) != 'undefined' && $.cookie(set_cookie).length) {
        $('#fc_list_overview li').find('input[value="' + $.cookie(set_cookie) +'"]').click();
    }

    $('#fc_createguid').click(function()
    {
        create_guid(CAT_ADMIN_URL+'/settings/ajax_guid.php');
    });

    $('#fc_use_short_urls').unbind('click').click( function() {
        if($(this).is(':checked')) {
            $.ajax({
                type:    'GET',
                url:     CAT_ADMIN_URL+'/settings/ajax_check_htaccess.php',
                success: function(data,textStatus,jqXHR) {
                    if ( data.success === false ) {
                        return_error( jqXHR.process, data.message);
                    }
                }
            });
        }
    });

    $('form#settings').submit(function(event) {
        var form = $(this);
        $.ajax({
            type:       'POST',
            url:        form.prop('action'),
            data:       form.serialize(),
            dataType:   'json',
            beforeSend: function( data )
            {
                data.process    = set_activity( 'Saving settings' );
            },
            success:    function( data, textStatus, jqXHR )
            {
                if ( data.success === true )
                {
                    return_success( jqXHR.process , data.message );
                    if ( typeof current !== 'undefined' )
                    {
                        current.slideUp(300, function() { current.remove(); });
                    }
                }
                else {
                    return_error( jqXHR.process , data.message);
                }
            }
        });
        event.preventDefault();
    });
});