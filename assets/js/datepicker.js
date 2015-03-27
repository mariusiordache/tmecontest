!function ($) {

  "use strict"; // jshint ;_;


 /* DATEPICKER PUBLIC CLASS DEFINITION
  * =============================== */

  var Datepicker = function (element, options) {
    this.init('datepicker', element, options)
  }

  Datepicker.prototype = {

    constructor: Datepicker,
	
	init: function (type, element, options) {
		var triggers, trigger, i

		this.type = type
		this.$element = $(element)
		this.options = this.getOptions(options)
		this.options.columnOrder = this.options.columnOrder.split(',');
	  
		this.currentDate = new Date();
		if('value' in this.options) {
			this.dateParts = this.getDateParts(this.options.value);
		}		  
		this.$picker = this.buildPicker();
		this.update();

		triggers = this.options.trigger.split(' ')

		for (i = triggers.length; i--;) {
			trigger = triggers[i]
			if (trigger == 'click') {
				this.$element.on('click.' + this.type, $.proxy(this.toggle, this))
			} else if (trigger != 'manual') {
				/*
				var eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
				var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
				this.$element.on(eventIn + '.' + this.type, $.proxy(this.enter, this))
				this.$element.on(eventOut + '.' + this.type, $.proxy(this.leave, this))
				*/
			}
		}	  
	
	},
	
	buildPicker: function() {
		var i,el = $(_.template($('#datepicker-template').html())(this.getTemplateData())).appendTo('body')
		
		this.columns = {};
		this.columns.year  = el.find('.years').detach();
		this.columns.month = el.find('.months').detach();
		this.columns.day   = el.find('.days').detach();
		
		for(i in this.options.columnOrder) {
			el.find('.columns').append(this.columns[this.options.columnOrder[i]]);
		}
		
		el.find('.column:first').addClass('highlightColumn');
		
		this.columns.year.find('ul > li > a').on('click.' + this.type + '.year',   $.proxy(this.selectYear, this)); 
		this.columns.month.find('ul > li > a').on('click.' + this.type + '.months', $.proxy(this.selectMonth, this)); 
		this.columns.day.find('ul > li > a').on('click.' + this.type + '.days',   $.proxy(this.selectDay, this)); 		
		
		el.find('.ok').on('click.' + this.type + '.done', $.proxy(this.update, this));
		el.find('.cancel').on('click.' + this.type + '.cancel', $.proxy(this.cancel, this));
		
		return el;
	},
	
	selectYear: function(e) {
		this.dateParts.year = e.target.getAttribute('data-value');
		this.columns['year'].find('li').removeClass('active');
		$(e.target.parentNode).addClass('active');
		this.clicks.year = 1;
		this.nextCol('year');
		e.preventDefault();
	},
	
	selectMonth: function(e) {
		this.dateParts.month = e.target.getAttribute('data-value');
		this.columns['month'].find('li').removeClass('active');
		$(e.target.parentNode).addClass('active');
		this.clicks.month = 1;
		this.nextCol('month');
		e.preventDefault();
	},
	
	selectDay: function(e) {
		this.dateParts.day = e.target.getAttribute('data-value');
		this.columns['day'].find('li').removeClass('active');
		$(e.target.parentNode).addClass('active');
		this.clicks.day = 1;
		this.nextCol('day');
		e.preventDefault();
	},
	
	nextCol: function(prevCol) {
		var i = this.options.columnOrder.indexOf(prevCol);
		this.columns[prevCol].removeClass('highlightColumn');
		
		if(i < 2) {
			var nextCol = this.options.columnOrder[i+1];
			this.columns[nextCol].addClass('highlightColumn');
		} 
		
		if('year' in this.clicks && 'month' in this.clicks && 'day' in this.clicks) {
			this.update();
		} else {
			this.showDone();
		}
	},
	
	showDone: function() {
		this.$picker.find('.datepickerToolbar > .ok').removeClass('invisible').addClass('fade').addClass('in');
	},
	
	hideDone: function() {
		this.$picker.find('.datepickerToolbar > .ok').removeClass('in').removeClass('fade').addClass('invisible');
	},
	
	getTemplateData: function() {		
		return $.extend({selected: this.dateParts}, this.options);		
	},	
	
	getOptions: function (options) {
		options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)
		return options
	},
	
	/* process date value (only supports YYYY-mm-dd database format) */
	getDateParts: function(date_value) {
		var parts = date_value.split('-');
		return {
			year: parts[0],
			month: parts[1],
			day: parts[2]
		}
	},
	
	cancel: function() {
		
		var i;
		
		this.dateParts.year  = this.currentDate.getFullYear();
		this.dateParts.month = this.currentDate.getMonth() + 1;
		this.dateParts.day   = this.currentDate.getDate();
		
		for(i in this.columns) {
			this.columns[i].find('ul > .active').removeClass('active');
			this.columns[i].find('ul > li > [data-value="' + this.dateParts[i] + '"]').parent().addClass('active');
		}
		
		this.hide();
		
	},
	
	update: function() {
	
		this.currentDate.setDate(this.dateParts.day);
		this.currentDate.setMonth(this.dateParts.month-1);
		this.currentDate.setFullYear(this.dateParts.year);

		this.value = this.dateParts.year + '-' + this.dateParts.month + '-' + this.dateParts.day;
		this.label = strftime(this.currentDate, this.options.format);
		
		var e = $.Event('changeDate')
		this.$element.trigger(e, {value: this.value, label: this.label});
				
		if(this.options.autoclose)
			this.hide();
	},
	
	enter: function (e) {
		var self = $(e.currentTarget)[this.type](this.options).data(this.type)
		return self.show();
    },
	
	leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)
		return self.hide()
    },
	
	show: function () {
		var e = $.Event('show'), actualWidth, actualHeight, pos, placement, tp, cell, cellPos, i
      
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
		
        if (this.options.animation) {
			this.$picker.addClass('fade')
        }
		
		this.hideDone();
				
        this.options.container ? this.$picker.appendTo(this.options.container) : this.$picker.insertAfter(this.$element)

        placement = typeof this.options.placement == 'function' ?
			this.options.placement.call(this, this.$picker[0], this.$element[0]) :
			this.options.placement
		
		
		for(i in this.columns) {
			var cell = this.columns[i].find('ul > .active');
			if(cell.size()>0) {
				cellPos = cell.position();
				this.columns[i].scrollTop(cellPos.top - this.columns[i].outerWidth()/2);
			}
		}
		
		
		this.clicks = {};
		
        pos = this.getPosition()

        actualWidth = this.$picker[0].offsetWidth
        actualHeight = this.$picker[0].offsetHeight

        switch (placement) {
			case 'bottom':
				tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
			break
			case 'top':
				tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
			break
			case 'left':
				tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
			break
			case 'right':
				tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
			break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
	},
	
	hide: function () {
      var e = $.Event('hide'), $picker = this.$picker

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      this.$picker.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $picker.off($.support.transition.end).detach()
        }, 500)

        $picker.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && $picker.hasClass('fade') ?
        removeWithAnimation() :
        $picker.detach()

      this.$element.trigger('hidden')

      return this
    },

	applyPlacement: function(offset, placement) {
		var width = this.$picker[0].offsetWidth
			, height = this.$picker[0].offsetHeight
			, actualWidth
			, actualHeight
			, delta
			, replace

		this.$picker
			.offset(offset)
			.addClass(placement)
			.addClass('in')

			actualWidth = this.$picker[0].offsetWidth
			actualHeight = this.$picker[0].offsetHeight

			if (placement == 'top' && actualHeight != height) {
				offset.top = offset.top + height - actualHeight
				replace = true
			}

			if (placement == 'bottom' || placement == 'top') {
				delta = 0
				if (offset.left < 0){
					delta = offset.left * -2
					offset.left = 0
					this.$picker.offset(offset)
					actualWidth = this.$picker[0].offsetWidth
					actualHeight = this.$picker[0].offsetHeight
				}		
				this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
			} else {
				this.replaceArrow(actualHeight - height, actualHeight, 'top')
			}	

			if (replace) this.$picker.offset(offset)
    },

	replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.$picker.find('.datepicker-arrow')
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      this.$picker.hasClass('in') ? this.hide() : this.show()
	  e.preventDefault();
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.datepicker

  $.fn.datepicker = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('datepicker')
        , options = typeof option == 'object' && option
      if (!data) $this.data('datepicker', (data = new Datepicker(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.datepicker.Constructor = Datepicker

  $.fn.datepicker.defaults = {
    animation: true
  , placement: 'bottom'
  , trigger: 'click hover focus'
  , container: false
  , value: '2013-01-01'
  , startYear: 2000
  , endYear: 2012
  , columnOrder: 'day,month,year'
  , format: '%e %B %Y'
  }


 /* DATEPICKER NO CONFLICT
  * =================== */

  $.fn.datepicker.noConflict = function () {
    $.fn.datepicker = old
    return this
  }

}(window.jQuery);

var strftime;
strftime = (function () {
 
    var zeropad = function (n) {
        return n > 9 ? n : '0' + n;
    };
 
    var shortDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var shortMonths = ['Jan','Feb','Mar','Apr','May','Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'];
    var months = ['January','February','March','April','May','June', 'July','August', 'September','October','November','December'];
 
    var callbacks = {
        // Short day name (Sun-Sat)
        a: function (t) {
            return shortDays[t.getDay()];
        },
        // Long day name (Sunday-Saturday)
        A: function (t) {
            return days[t.getDay()];
        },
        // Short month name (Jan-Dec)
        b: function (t) {
            return shortMonths[t.getMonth()];
        },
        // Long month name (January-December)
        B: function (t) {
            return months[t.getMonth()];
        },
        // String representation (Thu Dec 23 2010 11:48:54 GMT-0800 (PST))
        c: function (t) {
            return t.toString();
        },
        // Two-digit day of the month (01-31)
        d: function (t) {
            return zeropad(t.getDate());
        },
		e: function (t) {
			return t.getDate();
		},
        // Day of the month (1-31)
        D: function (t) {
            return t.getDate();
        },
        // Two digit hour in 24-hour format (00-23)
        H: function (t) {
            return zeropad(t.getHours());
        },
        // Hour in 24-hour format (0-23)
        i: function (t) {
            return t.getHours();
        },
        // Two digit hour in 12-hour format (01-12)
        I: function (t) {
            return zeropad(callbacks.l(t));
        },
        // Hour in 12-hour format (1-12)
        l: function (t) {
            var hour = t.getHours() % 12;
            return hour === 0 ? 12 : hour;
        },
        // Two digit month (01-12)
        m: function (t) {
            return zeropad(t.getMonth() + 1);
        },
        // Two digit minutes (00-59)
        M: function (t) {
            return zeropad(t.getMinutes());
        },
        // am or pm
        p: function (t) {
            return callbacks.H(t) < 12 ? 'am' : 'pm';
        },
        // AM or PM
        P: function (t) {
            return callbacks.H(t) < 12 ? 'AM' : 'PM';
        },
        // Two digit seconds (00-61)
        S: function (t) {
            return zeropad(t.getSeconds());
        },
        // Zero-based day of the week (0-6)
        w: function (t) {
            return t.getDay();
        },
        // Locale-specific date representation
        x: function (t) {
            return t.toLocaleDateString();
        },
        // Locale-specific time representation
        X: function (t) {
            return t.toLocaleTimeString();
        },
        // Year without century (00-99)
        y: function (t) {
            return zeropad(callbacks.Y(t) % 100);
        },
        // Year with century
        Y: function (t) {
            return t.getFullYear();
        },
        // Timezone offset (+0000)
        Z: function (t) {
            if (t.getTimezoneOffset() > 0) {
                return "-" + zeropad(t.getTimezoneOffset() / 60) + "00";
            } else {
                return "+" + zeropad(Math.abs(t.getTimezoneOffset()) / 60) + "00";
            }
        },
        // A percent sign
        '%': function(t) {
            return '%';
        }
    };
 
    /**
     * Returns a string of this date in the given +format+.
     */
    return function (date, format) {
        var regexp;
        date = date || new Date();
		
		shortDays = PAGE_DATA.shortDayNames;
		days = PAGE_DATA.dayNames;
		shortMonths = PAGE_DATA.shortMonthNames;
		months = PAGE_DATA.monthNames;
		
        for (var key in callbacks) {
            regexp = new RegExp('%' + key, 'g');
            format = format.replace(regexp, callbacks[key](date));
        }
 
        return format;
    };
 
})();
