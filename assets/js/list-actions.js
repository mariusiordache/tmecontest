$(document).ready(function() {
	$('.deal-more').click(function() {
		$(this).closest('.deal-details').find('li.moreContent').addClass('visible');
		$(this).addClass('fade out');
	});
});