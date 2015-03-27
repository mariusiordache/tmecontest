$(document).ready(function() {
	$('.search').each(function() {		
		$(this).autocompleter({
			ajax: {
				url: $(this).data('source'),
				add_url: $(this).data('add-url'),
				displayField: 'name',
				valueField: 'id',
				triggerLength: 1
			},
			updater: function(item) {
				var relation = this.$element.data('relation');
				$('#' + relation).val(item[this.options.ajax.valueField]);
				$('#' + relation + '_name').html(item[this.options.ajax.displayField]);
				return '';
			}
		});					
	});
});
