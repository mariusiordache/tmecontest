$(document).ready(function() {

    $('form').each(function(index, form) {
        var that = $(form);
        that.on('submit', function(e) {
            
            var _loader = that.find('.ajax-report');
            
            _loader.children().remove();
            _loader
                .append($('<img>').css('margin-right', '10px').attr('src','/assets/img/ajax-loader.gif'))
                .append($('<span>').text('Please wait ...'));
            
            $.post(PAGE_DATA.base_url + that.attr('action'), that.serialize(), function(resp){
                if (resp.success) {
                    $('form').hide();
                    $('#thanks').show();
                    
                    setTimeout(function(e){
                        window.location.href = resp.location;
                    }, 1000);
                } else {
                    var $errors = $('<ul>').addClass('errors');
                    for (var i in resp.errors) {
                        $errors.append($('<li>').html(resp.errors[i]));
                    }
                    _loader.children().remove();
                    _loader.append($errors);
                }
            }, 'json');
            
            e.preventDefault();
            e.stopPropagation();
        });
    });
});