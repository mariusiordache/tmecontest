var comingsoon = {
	setup: function() {
		this.form = $('#launch-alert-form');
		this.form.on('submit', $.proxy(this.post, this));
		this.errors = this.form.find('.ajax-report');
	},
	post: function(e) {
		this.errors.html('').removeClass('in');
		var data = this.form.serialize();
		$.post(PAGE_DATA.base_url + '/auxiliary/save_launch_alert', data, $.proxy(this.onPost, this), 'json');
		e.preventDefault();
		e.stopPropagation();		
		return false;
	},
	onPost: function(data) {
		if(data.success) {
			$('#thanks').show();
			this.form.removeClass('in').addClass('out');
		} else {	
			var error_html = '<ul>';
			for(var i in data.errors) {
				error_html += '<li>' + data.errors[i] + '</li>';
			}
			error_html += '</ul>';
			this.errors.html(error_html).addClass('in');
		}		
	}
}

$(document).ready(function() {
	comingsoon.setup();
});