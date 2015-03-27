!function( $ ) {
	
	var DateTimePicker = function(element, options) {
		this.options = options;
		this.element = $(element);
		this.element.hide();
		this.generateInterface();		
	}
	
	DateTimePicker.prototype = {
		constructor: DateTimePicker,	
		generateInterface: function() {
			var disabled = this.element.prop('disabled')==true ? 'disabled = "disabled"' : '';
			this.dayElement    = $('<input style="width: 80px;" type="text" ' + disabled + ' />');
			this.hourElement   = $('<select style="width: 50px;" ' + disabled + '></select>');
			this.minuteElement = $('<select style="width: 50px;" ' + disabled + '></select>');
			this.secondElement = $('<select style="width: 50px;" ' + disabled + '></select>');
			
			this.element.after(this.secondElement);
			this.element.after(':');
			this.element.after(this.minuteElement);
			this.element.after(':');
			this.element.after(this.hourElement);			
			this.element.after(' ');
			this.element.after(this.dayElement);
			
			for(var i=0; i<60; i++) {				
				var value = i.toString().length==1 ? ('0'+i) : i;
				if(i < 24) {
					this.hourElement.append('<option value="' + value + '">' + value + '</option>');
				}
				this.minuteElement.append('<option value="' + value + '">' + ( i.toString().length==1 ? ('0'+i) : i ) + '</option>');
				this.secondElement.append('<option value="' + value + '">' + ( i.toString().length==1 ? ('0'+i) : i ) + '</option>');
			}
			
			if(this.element.val().length == 19) {
				this.set_from_value(this.element.val());
			}
			
			this.dayElement.datepicker($.extend(this.options, {'onSelect': $.proxy(this.update, this)}));
			this.hourElement.on('change', $.proxy(this.update, this));
			this.minuteElement.on('change', $.proxy(this.update, this));
			this.secondElement.on('change', $.proxy(this.update, this));
		},
		set_from_value: function(val) {			
			var current_time = val.split(' ');
			var date_parts = current_time[0].split('-');
			for(i in date_parts) {
				if(date_parts[i].toString().length==1)
					date_parts[i] = '0' + date_parts[i];
			}
			this.dayElement.val(date_parts.join('-'));
			current_time = current_time[1].split(':');
			for(i in current_time) {
				if(current_time[i].toString().length==1)
					current_time[i] = '0' + current_time[i];
			}
			this.hourElement.val(current_time[0]);
			this.minuteElement.val(current_time[1]);
			this.secondElement.val(current_time[2]);
			this.update();
		},
		update: function() {
			this.element.val(this.dayElement.val() + ' ' + this.hourElement.val() + ':' + this.minuteElement.val() + ':' + this.secondElement.val());
		},
		disable: function() {
			this.dayElement.attr('disabled', 'disabled');
			this.hourElement.attr('disabled', 'disabled');
			this.minuteElement.attr('disabled', 'disabled');
			this.secondElement.attr('disabled', 'disabled');
			this.element.attr('disabled', 'disabled');
		},
		enable: function() {		
			this.dayElement.removeAttr('disabled');
			this.hourElement.removeAttr('disabled');
			this.minuteElement.removeAttr('disabled');
			this.secondElement.removeAttr('disabled');
			this.element.removeAttr('disabled');
		}
	}
	
	$.fn.datetimepicker = function ( option ) {		
		return this.each(function () {			
			var $this = $(this),
				data = $this.data('datetimepicker'),
				options = typeof option == 'object' && option;
			if (!data) {
				$this.data('datetimepicker', (data = new DateTimePicker(this, $.extend({}, $.fn.datetimepicker.defaults,options))));
			}
			if (typeof option == 'string') data[option]();
		});
	};

	$.fn.datetimepicker.defaults = {
	};
	
	$.fn.datetimepicker.Constructor = DateTimePicker;
	
} ( window.jQuery );