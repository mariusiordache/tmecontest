$(document).ready(function() {

    $("[type=checkbox].switch").bootstrapSwitch();

    $('body').on('submit', 'form', function(e){
        var that = $(this);
        var _alert = that.find('.alert').show().addClass('alert-warning').html('Please wait ... ');
        
        $.post(that.attr('action'), that.serialize(), function(resp){
            if (resp.success) {
                if (resp.message) {
                    _alert.html(resp.message).removeClass('alert-warning').addClass('alert-success');
                    setTimeout(function(){
                        _alert.hide(500);
                    }, 1000);
                }
                
                if (resp.location) {
                    window.location.href = resp.location;
                } else if (resp.js) {
                    eval(resp.js);
                }
                
                that.parents('.modal').modal('hide');
                that.trigger('submitOk', resp);
                
            } else {
                _alert.html(resp.error).removeClass('alert-warning').addClass('alert-danger');
            }
        });
        
        e.preventDefault();
    });
    
    $('.api-auto-call').bind('load', function(){
        var that = $(this),
        url = $(this).find('pre.url').text();
        
        $.get(url, function(resp){
            if (resp) {
                that.find('pre.result').text(JSON.stringify(resp, undefined, 2));
                that.show();
            }
        }, 'json');
    });
    
    $('.api-auto-call').each(function(index){
        $(this).trigger('load');
    });
    
    
    

});