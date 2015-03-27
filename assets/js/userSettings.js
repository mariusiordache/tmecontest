$(document).ready(function() {

	UserSettings = Backbone.Model.extend({
		
		rootUrl : 'user/',
		url: 'update_settings',
		initialize: function() {
			this.set('kids', new Kids(this.get('kids')));
			this.listenTo(this, 'change', $.proxy(this.changeData, this));
			this.listenTo(this.get('kids'), 'add remove change', $.proxy(this.changeData, this));
		},
		initializeRoomSetup: function() {
			var a = this.get('arrangements');
			
			if(typeof(a) != 'undefined') {
				for(var i=0; i<a.length; i++) {
					this.get('_arrangements').add({rooms: a[i].rooms});
				}
			}
			
			this.listenTo(this.get('_arrangements'), 'add remove change', $.proxy(this.changeData, this));
		},
		changeData: function() {
			this.trigger('changeData');
		},
		getNewKidIdent: function() {
			var alphabet = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,x,y,z'.split(',');
			alphabet = _.difference(alphabet, this.get('kids').pluck('ident'));
			return alphabet.shift();
		},
		redirect: function() {
			var json = this.toJSON();
			
			//kids
			var kids = this.get('kids').toJSON();
			var kids_serialized = [];
			for(i in kids) {
				kids_serialized[i] = kids[i].ident + ',' + kids[i].birth_date
			}
			json.kids = kids_serialized.join('|');
			
			//arrangements
			var arrangements = [];
			if(typeof(this.get('_arrangements'))!='undefined') {
				this.get('_arrangements').each(function(a) {
					var rooms = a.get('rooms').toJSON();
					var rooms_serialized = [];
					for(i in rooms)
						rooms_serialized[i] = rooms[i].selectedAdults + ',' + rooms[i].selectedKids;
						
					arrangements.push(rooms_serialized.join(';'));				
				});
			}
			
			json.arrangements = arrangements.join('|');
			
			json.departure = json.departure.tag_id + '|' + json.departure.label + '|' + json.departure.full_label;
			
			var settings = 'a:' + json.adults + '~' + 
						   'k:'   + json.kids + '~' + 
						   'd:' + json.departure + '~' + 
						   'ar:' + json.arrangements + '~' + 
						   'c:' + json.currency;
			
			var uri = new Uri(document.location.href);
			uri.replaceQueryParam('s', settings);
			document.location.href = uri.toString();
			
		}
	});
	
	Kid = Backbone.Model.extend({
		defaults: {
			birth_date: '',
			birth_date_display: ''
		},
		initialize: function() {
			this.setAge();
			if(typeof(us)!=='undefined')
				this.setPermanentIdentifier();
			this.listenTo(this, 'change:birth_date', $.proxy(this.setAge, this));
		},
		remove: function() {
			us.get('kids').remove(this);
		},
		removeFromEverywhere: function() {
			this.trigger('removeFromEverywhere');
		},
		setPermanentIdentifier: function() {
			if(typeof(this.get('ident')) == 'undefined') {
				this.set('ident', us.getNewKidIdent());
			}
		},
		setAge: function() {
			console.log('changed');
			var today = new Date();
			var birthDate = new Date(this.get('birth_date'));
			var age = today.getFullYear() - birthDate.getFullYear();
			var m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
			this.set('age', age);
		}
	});
	
	Kids = Backbone.Collection.extend({
		model: Kid,
	});
	
	/* PANEL VIEWS */
	
	PanelView = function (options) {
		this.className = 'settingsPanel';
		Backbone.View.apply(this, [options]);
	};

	_.extend(PanelView.prototype, Backbone.View.prototype, {		
		initialize: function() {
			_.bind(this.toggle, this);
			this.$trigger = $(this.triggerLink);			
			this.$trigger.on('click', $.proxy(this.triggerClick, this));
		},
		
		close: function() {
			if(this.$trigger.hasClass('open'))
				this.$trigger.removeClass('open');
						
			if(this.$el.hasClass('open'))
				this.$el.removeClass('open');
		},
		
		open: function() {			
			if(!this.$trigger.hasClass('open'))
				this.$trigger.addClass('open');
						
			if(!this.$el.hasClass('open'))
				this.$el.addClass('open');
			
			this.place();
		},
		
		is_open: function() {
			return this.$trigger.hasClass('open');
		},
		
		toggle: function() {
			if(this.is_open()) 
				this.close();
			else
				this.open();
		},
		
		triggerClick: function() {
			this.trigger('togglePanel', this.options.panel_id);
		},
		
		place: function() {
			var triggerPos         = this.$trigger.position();
			var triggerHeight      = this.$trigger.outerHeight();
			var triggerWidth       = this.$trigger.outerWidth();
			var placement = this.placement || 'left';
			switch(placement) {
				case 'left':
					this.$el.css({top: (triggerPos.top + triggerHeight -1) + 'px', left: triggerPos.left + 'px'});
					break;
				case 'right':
					this.$el.css({top: (triggerPos.top + triggerHeight -1) + 'px', left: (triggerPos.left + triggerWidth - this.$el.outerWidth()) + 'px'});
					break;
			}
		}
	});

	PanelView.extend = Backbone.View.extend;
	
	adultsPanelView = PanelView.extend({
		template: _.template($('#settings-adults-template').html()),
		triggerLink: '#adults_link',
		id: 'adultsPanel',
		events: {
			'click a': 'selectAdults'
		},
		initialize: function() {
			PanelView.prototype.initialize.apply(this, arguments);
			this.listenTo(this.model, 'change:adults', this.render);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			
			if(this.model.get('adults') == 1) {
				this.$trigger.find('span.tabLabel').html(this.$trigger.data('single-label'));
			} else {
				this.$trigger.find('span.tabLabel').html(this.$trigger.data('label').replace('###', this.model.get('adults')));
			}
			
			return this;
		},
		selectAdults: function(e) {
			switch(e.target.getAttribute('data-value')) {
				case this.model.get('adults'):
					
					break;
				default:
					this.model.set('adults', parseInt(e.target.getAttribute('data-value')));
					userSettingsView.togglePanel('kids');  
					break;
			}
		}
	});
	
	KidView = Backbone.View.extend({
		template: _.template($('#kid-template').html()),
		events: {
			'click .remove': 'removeKid'
		},
		initialize: function() {
			this.className = 'kid' + this.model.id;
			_.bind(this.render, this);
			this.listenTo(this.model, 'change', this.renderUpdate);
			this.listenTo(this.model, 'removeFromEverywhere', this.dispose);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
						
			//this.$('.change').data('date', DPGlobal.formatDate(DPGlobal.parseDate(this.$('.change').data('date'), DPGlobal.parseFormat('yyyy-mm-dd'), 'en'), DPGlobal.parseFormat(PAGE_DATA.js_date_format), 'en'));
		
			this.$('.change').datepicker({
				autoclose: true, format: PAGE_DATA.strftime_date_format
			}).on('changeDate', $.proxy(this.onSelectBirthday, this));
			
			
			return this;
		},
		renderUpdate: function() {
			this.$('.birth_date').html(this.model.get('birth_date_display'));
		},
		onSelectBirthday: function(e, data) {
			this.model.set({
				birth_date: data.value, 
				birth_date_display: data.label
			});					
		},
		removeKid: function(e) {
			//us.get('kids').remove(this.model);
			this.trigger('removeKid', this.model);
			e.preventDefault();
		},
		dispose: function() {
			this.$('.change').datepicker('destroy');
			this.remove();
		}
	});
	
	kidsPanelView = PanelView.extend({
		template: _.template($('#settings-kids-template').html()),
		triggerLink: '#kids_link',
		id: 'kidsPanel',
		kidViews: [],
		events: {
			'click .btn-primary': 'addNewKid'
		},
		initialize: function() {
			PanelView.prototype.initialize.apply(this, arguments);					
			_.bind(this.addKidView, this);			
			this.listenTo(this.model.get('kids'), 'add', this.addKidView);			
			this.listenTo(this.model.get('kids'), 'remove', this.removeKidView);			
		},
		addNewKid: function() {
			this.model.get('kids').add(new Kid());
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.renderKids();
			return this;
		},		
		renderKids: function() {			
			this.model.get('kids').each(this.addKidView, this);
		},
		removeKid: function(kid) {
			this.model.get('kids').remove(kid);
		},
		addKidView: function(kid) {
			var aux = new KidView({model: kid});
			this.$('.kidList').append(aux.render().el);
			this.listenTo(aux, 'removeKid', this.removeKid);
			this.kidViews.push(aux);
			
			if(this.model.get('kids').length == 1) {
				this.$trigger.find('span.tabLabel').html(this.$trigger.data('single-label'));
			} else {
				this.$trigger.find('span.tabLabel').html(this.$trigger.data('label').replace('###', this.model.get('kids').length));
			}
			
		},
		removeKidView: function(kid) {
			_.each(_.clone(this.kidViews), function(kv, index) {
				if(kv.model == kid) {
					kv.dispose();
					this.kidViews.splice(index,1);
				}	
			}, this);
			
			if(this.model.get('kids').length == 1) {
				this.$trigger.find('span.tabLabel').html(this.$trigger.data('single-label'));
			} else {
				this.$trigger.find('span.tabLabel').html(this.$trigger.data('label').replace('###', this.model.get('kids').length));
			}
		}
	});
	
	departurePanelView = PanelView.extend({
		placement: 'right',
		template: _.template($('#settings-departure-template').html()),
		triggerLink: '#departure_link',
		id: 'departurePanel',
		initialize: function() {
			PanelView.prototype.initialize.apply(this, arguments);		
			this.listenTo(this.model, 'change:departure', this.changeDeparture);				
		},
		events: {
			'click .done': 'triggerClick'
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			
			this.$('#departure').autocomplete({
				serviceUrl: '/tags/ajax_search/devbrigde',
				onSelect: $.proxy(this.onSelectDeparture, this),
				appendTo: this.$('.inputHolder'),
				deferRequestBy: 100,
				width: 'auto'
			});
			
			/*
			this.$('#departure').typeahead({
				name: 'departure',
				remote: '/tags/ajax_search?q=%QUERY',
				template: $('#departure-option-template').html(),
				engine: Hogan
			});
			*/
			
			return this;
		},	
		onSelectDeparture: function(e) {
			this.$('#departure').val('');
			this.model.set('departure', {tag_id: e.data, label: e.value});
		},
		changeDeparture: function() {
			var label = this.model.get('departure').label;			
			this.$('.leavingFrom').html(label);
			var labelParts = label.split(',');
			var smallLabel = labelParts[0].length > 10 ? jQuery.trim(labelParts[0]).substring(0, 7).trim(this) + '...' : labelParts[0];
			this.$trigger.find('span.tabLabel').html(smallLabel);
			this.place();
		}
	});
	
	UserSettingsView = Backbone.View.extend({	
		
		panels: {},
		roomSelection: null,
		
		initialize: function() {	
			
			this.overlay = $('#content-overlay');
			this.overlay_content = $('#content-overlay-inside');
					
			this.panels.adults    = new adultsPanelView({model: this.model, panel_id: 'adults'});
			this.panels.kids      = new kidsPanelView({model: this.model, panel_id: 'kids'});
			this.panels.departure = new departurePanelView({model: this.model, panel_id: 'departure'});
						
			$('#list-settings').append(this.panels.adults.render().el);
			$('#list-settings').append(this.panels.kids.render().el);
			$('#list-settings').append(this.panels.departure.render().el);
			
			$('#applySettingsBtn').button();
			$('#applySettingsBtn').on('click.button.settings', $.proxy(this.applySettings, this));
			
			$('#currencySelect .dropdown-menu li a').on('click', $.proxy(function(e) {
				this.model.set('currency', e.target.getAttribute('data-value'));
				e.preventDefault();
				e.stopPropagation();
			}, this));
			
			_.bind(this.togglePanel, this);
			
			for(i in this.panels) {
				this.listenTo(this.panels[i], 'togglePanel', this.togglePanel);
			}
			
			$('#currencySelect .selectbox-trigger').dropdown();
		},
		
		roomSetupInit: function() {			
			this.roomSelection = new RoomSelectionView;
			$('#roomSetupModal').find('.modal-body').append(this.roomSelection.render().el);
			$('#roomSetup').on('click.button.roomsetup', $.proxy(this.openRoomSetup, this));	
		},
		
		openRoomSetup: function() {
			$('#roomSetupModal').modal({
				backdrop: false,				
			});			
		},	
		
		applySettings: function() {
			$('#applySettingsBtn').setState('loading');
			this.model.redirect();			
		},
		
		togglePanel: function(which) {
			for(var i in this.panels) {
				if(i != which)
					this.panels[i].close();
			}
			this.panels[which].toggle();
		},
		
		showOverlay: function() {
			var lh, lw, lsh;
			lh = $('#list').outerHeight();
			lw = $('#list').outerWidth();
			lsh = $('#list-settings').outerHeight() + $('#list-settings-separator').outerHeight();
			
			this.overlay.css({
				top: lsh + 'px',
				height: (lh - lsh) + 'px',
				width: lw + 'px'
			});
			
			this.overlay_content.css({
				top: (lsh + 20) + 'px',
				left: '20px'
			});
			
			this.overlay.addClass('fade').addClass('visible');
			this.overlay_content.addClass('fade').addClass('visible');
		},
		
		listenToChanges: function() {			
			this.listenTo(this.model, 'changeData', this.showOverlay);
		}
	});
	
	us = new UserSettings(PAGE_DATA.user_settings);
	us.get('kids').each(function(m) {
		m.setPermanentIdentifier();
	});
	userSettingsView = new UserSettingsView({model: us});
});