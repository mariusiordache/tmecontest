$(document).ready(function() {

	$('.decision_checkbox').change(function(e) {
		if(this.checked) {
			$(this).parentsUntil('td','label').eq(0).find('input[type="hidden"]').val(this.value);
		} else {
			$(this).parentsUntil('td','label').eq(0).find('input[type="hidden"]').val(this.getAttribute('data-unchecked'));		
		}
	});

});