$(document).ready(function() {

	$('#end_date_timer').on('blur', update_end_date_from_timer);
	
	$('.form-inline').hover(function() {
		$(this).contents().css('color', 'blue');
	}, function() {
		$(this).contents().css('color', 'black');
	});
	
	function fetchTagRestrictions(tag_id) {
		var locations = new Array();
		$('.location_id').each(function() {
			locations.push($(this).val());
		});
		
		var intervals = new Array();
		$('.interval_start').each(function() {
			intervals.push({start: $(this).val()});
		});
		
		$('.interval_end').each(function(index) {
			intervals[index].end = $(this).val();
		});
						
		$.post('/admin/tags/ajax_fetch_restrictions/' + tag_id, {locations: locations, intervals: intervals}, function(ajax_result) {
			app.addTag(ajax_result.tag_data);
			$('#tagSelector').data('TagSelector').stopLoading();
		});
	}
	
	$('#tagSelector').TagSelector({ 
		select: function (event, ui) {		
			$(this).data('TagSelector').startLoading();
			$('#tagSelector').val('');
			fetchTagRestrictions(ui.item.id);
			event.stopPropagation();
		}
	});	
	
	
	$('#departureSelector').TagSelector({
		select: function (event, ui) {			
			$('#departure_city_name').html(_.template($('#location-template').html(), ui.item));
			$('#departure_city').val(ui.item.id);
			$('#departureSelector').val('');
			event.preventDefault();
		}
	});
	
	$('#perksSelector').TagSelector({
		select: function (event, ui) {	
			app.addPerk(ui.item);
			event.preventDefault();
		}
	});
	
	/*	
	$('#departureSelector_search').each(function() {
		$(this).autocompleter({
			ajax: {
				url: $(this).data('source'),
				add_url: $(this).data('add-url'),
				displayField: 'label',
				valueField: 'id',
				triggerLength: 1
			},
			updater: function(item) {
				console.log(this);
				console.log(this.$element);
				var relation = this.$element.data('relation');
				$('#' + relation).val(item[this.options.ajax.valueField]);
				$('#' + relation + '_name').html(_.template($('#location-template').html(), {id: item[this.options.ajax.valueField], name: item[this.options.ajax.displayField]}));
				return '';
			}
		});
	});
	*/
	
	$('[data-plugin="de_datetimepicker"]').datetimepicker({dateFormat: 'yy-mm-dd', showOtherMonths:true});
	$('[data-plugin="de_datepicker"]').datepicker({dateFormat: 'yy-mm-dd', showOtherMonths:true});

	if($('#id').val()=='0' || $('#id').val()=='') {
		$('#date_created').datetimepicker('disable');
	}

	var TravelInterval  = Backbone.Model.extend({ });
	var DealDestination = Backbone.Model.extend({ });
	var Tag             = Backbone.Model.extend({ });
	var Perk            = Backbone.Model.extend({ });
	
	var TravelIntervals = Backbone.Collection.extend({
		model: TravelInterval
	});
	var DealDestinations = Backbone.Collection.extend({
		model: DealDestination
	});
	var Tags = Backbone.Collection.extend({
		model: Tag
	});
	var Perks = Backbone.Collection.extend({
		model: Perk
	});
	
	var TravelIntervalView = BaseView.extend({	
		tagName: 'div',
		className: 'form-inline',
		template: _.template($('#travel-interval-template').html()),
		events: {	
			'click .delete': 'remove',
		},
		initialize: function() {					
		},	
		render:	function() {		
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.find('[type="text"]').datepicker({dateFormat: 'yy-mm-dd', showOtherMonths: true});
			return this;
		},
		removeInterval: function() {
			console.log('removed');
			app_intervals.remove(this.model);
			this.dispose();
		}
	});
	
	
	
	var TagIntervalView = BaseView.extend({
		tagName: 'div',
		className: 'tagInterval',
		template: _.template($('#tag-interval-template').html()),
		events: {
			'click .delete': 'removeInterval',			
		},
		initialize: function(params) {
			$.extend(this, params);
		},
		render: function() {			
			this.$el.html(this.template(this.data));
			return this;
		},
		removeInterval: function(e) {
			this.dispose();
			e.preventDefault();
			e.stopPropagation();
		}
	});
	
	var TagView = BaseView.extend({
		tagName: 'li',
		className: '',
		template: _.template($('#tag-template').html()),
		events: {
			'click .tag_remove': 'removeTag',
			'click .tag_label': 'toggleSecondRow',
			'click .add_interval': 'addBlankInterval'
		},
		initialize: function() {
		
		},
		render: function() {
			if(!this.model.get('relation_description')) this.model.set('relation_description', '');
			if(!this.model.get('tag_deal_id')) this.model.set('tag_deal_id', '0');
			
			this.$el.html(this.template(this.model.toJSON()));
			
			var intervals = this.model.get('intervals');
			if(intervals) {
				for(i in intervals) {					
					intervals[i].tag_id = this.model.get('tag_id');
					var aux = new TagIntervalView({data: intervals[i]});					
					this.$el.find('.intervals_holder').append(aux.render().el);
				}
			}
			
			this.$el.find('[data-plugin="de_datepicker"]').datepicker({dateFormat: 'yy-mm-dd', showOtherMonths: true});
			
			return this;
		},
		removeTag: function(e) {
			console.log('tag removed');
			app_tags.remove(this.model);
			this.dispose();
			e.stopPropagation()
		},
		toggleSecondRow: function(e) {
			this.$el.find('.tag_second_row').toggle();
			e.stopPropagation();
		},
		addBlankInterval: function(e) {
			var aux = new TagIntervalView({data: {start_date:'', end_date: '', tag_id: this.model.get('tag_id')}});					
			this.$el.find('.intervals_holder').append(aux.render().el);
			this.$el.find('[data-plugin="de_datepicker"]').datepicker({dateFormat: 'yy-mm-dd', showOtherMonths: true});
			e.preventDefault();
		}
	});
	
	var DealDestinationView = BaseView.extend({	
		tagName: 'li',
		className: 'deal-destination',
		template: _.template($('#destination-template').html()),
		events: {	
			'click .delete': 'removeDestination',	
			'click div': 'focusSelectors',
			'click input[type="checkbox"]': 'updateMainDestination'
		},
		initialize: function() {	
			this.bindTo(this.model, "change", this.render);
		},	
		render:	function() {		
			if(app) {
				app.hotel_selector.detach();
				app.location_selector.detach();
			}
			
			this.updateView();
			if(app) {
				app.hotel_selector.appendTo(this.$el.find('.hotel-selector')).data('currentView', this).show();
				app.location_selector.appendTo(this.$el.find('.location-selector')).data('currentView', this).show();
			}
			//this.$el.find('[type="text"]').datepicker({dateFormat: 'yy-mm-dd', showOtherMonths: true});
			return this;
		},
		updateView: function() {	
			this.$el.html(this.template(this.model.toJSON()));
		},
		removeDestination: function(e) {
			app.hotel_selector.detach();
			app.location_selector.detach();
			app_destinations.remove(this.model);
			this.dispose();
			e.stopPropagation();
		},
		focusSelectors: function() {
			if(app.hotel_selector.data('currentView') != this) {
				app.hotel_selector.detach().appendTo(this.$el.find('.hotel-selector')).data('currentView', this).show();
				app.location_selector.detach().appendTo(this.$el.find('.location-selector')).data('currentView', this).show();			
				app.initDestinationSelectors();
			}
		},
		updateMainDestination: function(e) {
			app_destinations.each(function(m) {m.set('main_destination', 0);});
			this.model.set('main_destination', 1);
			e.stopPropagation();
		}
	});
	
	var PerkView = BaseView.extend({	
		tagName: 'div',
		className: 'row-fluid',
		template: _.template($('#deal-perk-template').html()),
		events: {
			'click .delete': 'removePerk'
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			if(this.model.get('perk_type')) {
				this.$('select').val(this.model.get('perk_type'));
			}
			return this;
		},
		removePerk: function(e) {			
			app_perks.remove(this.model);
			this.dispose();
			e.stopPropagation();
		}
	});
	
	var AppView = BaseView.extend({			
		el: $('body'),
		events: {
			'click #addTimeInterval': 'addBlankTimeInterval',
			'click #addDealPrice': 'addBlankDealPrice',
			'click #addDestination': 'addBlankDealDestination',
			'click #addDealPriceRule': 'addBlankDealPriceRule'
		},
		initialize: function() {
						
			app_intervals = new TravelIntervals;
			app_destinations = new DealDestinations;
			app_tags = new Tags;
			app_perks = new Perks;

		},		
		afterInit: function() {
			this.hotel_selector = $('#hotel-selector');
			this.location_selector = $('#location-selector');
			
			if(typeof(existingTimeIntervals)!='undefined' && existingTimeIntervals.length>0) {
				for(var i=0; i<existingTimeIntervals.length; i++) {
					this.addTimeInterval(existingTimeIntervals[i]);
				}
			}
			/*
			if(typeof(existingDealPrices)!='undefined' && existingDealPrices.length>0) {
				for(var i=0; i<existingDealPrices.length; i++) {
					this.addDealPrice(existingDealPrices[i]);
				}
			}*/
			if(typeof(existingDealDestinations)!='undefined' && existingDealDestinations.length>0) {
				for(var i=0; i<existingDealDestinations.length; i++) {
					this.addDealDestination(existingDealDestinations[i]);
				}
			}			
			if(typeof(existingDepartureCity)!='undefined') {
				$('#departure_city_name').html(_.template($('#location-template').html(), {id: existingDepartureCity.id, label: existingDepartureCity.label}));
			}
			if(typeof(existingTags)!='undefined') {
				for(var i=0; i<existingTags.length; i++) {
					this.addTag(existingTags[i]);
				}
			}
			if(typeof(existingPerks)!='undefined' && existingPerks.length>0) {
				for(var i=0; i<existingPerks.length; i++) {
					this.addPerk(existingPerks[i]);
				}
			}			
		},
		addBlankDealDestination: function() {
			this.addDealDestination({hotel_id: 0, hotel_name: '', location_id: 0, location_name: '', main_destination: 0});
		},
		addBlankTimeInterval: function() {
			this.addTimeInterval({start_date: '', end_date: ''});
		},
		addBlankDealPrice: function() {
			this.addDealPrice({id: 0, type: '', val: 0, currency_id: 0, label: ''});		
		},
		addBlankDealPriceRule: function() {
			this.addDealPriceRule({id: 0, pattern: this.dealPriceRules.suggestPattern(), formula: ''});		
		},
		addTimeInterval: function(model) {		
			var ti = new TravelInterval(model);
			app_intervals.add(ti);
			var ti_view = new TravelIntervalView({model: ti});			
			$('#travelIntervals').append(ti_view.render().el);
		},
		addDealPrice: function(model) {			
			var dp = new DealPrice(model);
			this.dealPrices.add(dp);
			var dp_view = new DealPriceView({model: dp});			
			$('#dealPricesHolder').append(dp_view.render().el);
			
			var dp_select_view = new DealPriceSelectView({model: dp});			
			$('#dealPricesSelectHolder').append(dp_select_view.render().el);		
		},
		addDealPriceRule: function(model) {   
			var dpr = new DealPriceRule(model);
			this.dealPriceRules.add(dpr);
			this.dealPriceRules.setCurrentRule(dpr);
			
			var dpr_view = new DealPriceRuleView({model: dpr});
			$('#dealPriceRulesHolder').append(dpr_view.render().el);
			
			
		},
		addDealDestination: function(model) {
			var dd = new DealDestination(model);
			app_destinations.add(dd);
			var dd_view = new DealDestinationView({model: dd});
			$('#dealDestinationsHolder').append(dd_view.render().el);
			$('#dealDestinationsHolder').sortable({handle: '.handler'});
			/* make sure the TagSelector is active for the location selectors */
			this.initDestinationSelectors();
		},
		addTag: function(model) {
			var t = new Tag(model);
			app_tags.add(t);
			var t_view = new TagView({model: t});
			$('#tags').append(t_view.render().el);
		},
		
		addPerk: function(model) {
			if('perk_id' in model) {
				
			} else {
				model.perk_id = model.id;
				delete model.id;
			}
			
			var s = new Perk(model);
			app_perks.add(s);
			var s_view = new PerkView({model: s});
			$('#perks').append(s_view.render().el);
		},
				
		initDestinationSelectors: function() {		
			$('#locationSelector_search').data('TagSelector', null);					
			$('#locationSelector_search').TagSelector({		
				select: function (event, ui) {
					var holder = $('#location-selector');
					var field  = 'location';
					
					holder.data('currentView').model.set(field + '_id', ui.item.id);
					holder.data('currentView').model.set(field + '_name', ui.item.label);
					holder.data('currentView').render();						
					app.initDestinationSelectors();
					$('#locationSelector_search').val('');
					if(event) {
						event.stopPropagation();
						event.preventDefault();
					}
				}
			});
			
			$('#hotelSelector_search').data('TagSelector', null);					
			$('#hotelSelector_search').TagSelector({	
				add_url: '/admin/hotels/ajax_add',
				list_url: '/admin/hotels/ajax_list',
				select: function (event, ui) {
					var holder = $('#hotel-selector');
					var field  = 'hotel';
					
					holder.data('currentView').model.set(field + '_id', ui.item.id);
					holder.data('currentView').model.set(field + '_name', ui.item.label);
					holder.data('currentView').render();						
					app.initDestinationSelectors();
					$('#hotelSelector_search').val('');
					if(event) {
						event.stopPropagation();
						event.preventDefault();
					}
				}
			});
		}
	})
	
	app = new AppView;	
	app.afterInit();
	
});

function onHotelEdit(data) {
	//"this" is mapped to the originating edit-popup link
	this.prev().html(data.label);
}

function update_end_date_from_timer() {
	var parts = $('#end_date_timer').val().split(',');
	switch(parts.length) {
		case 3:
			break;
		case 2:				
			parts.unshift(0);
			break;
		case 1:
			parts.unshift(0);
			parts.unshift(0);
			break;
	}
	
	var add_seconds = parseInt(parts[0]) * 24 * 3600 + parseInt(parts[1]) * 3600 + parseInt(parts[2]) * 60;
	var now = new Date();	
	var then = new Date(now.getTime() + add_seconds * 1000);
	var new_value = then.getFullYear()+'-'+(then.getMonth()+1)+'-'+then.getDate()+' '+then.getHours()+':'+then.getMinutes()+':00';		
	$('#end_date').data('datetimepicker').set_from_value(new_value);
}

function onLocationEdit(data) {
	this.parent().prev().html(data.label);
}
