function buttonLoading(selector) {
	var el = $(selector);
	if(el.data('state')=='loading') return;
	el.data('resetText', el.html()).data('state', 'loading').html(el.data('loading-text')).attr('disabled','disabled').addClass('disabled');
}

function buttonReset(selector) {
	var el = $(selector);
	if(el.data('state')=='loading')
		el.data('state', '').html(el.data('resetText')).removeClass('disabled').removeAttr('disabled');
}

$(document).ready(function() {

	$.ajaxSetup({
		dataFilter: function(data) {
			if(data.toString() == '"login_timeout"') {
				var location_parts = location.href.split('/');
				location_parts.pop();
				location.href = location_parts.join('/') + '/login.php';
				return false;
			} else {
				return data;
			}
		}
	});

	var Resource = Backbone.Model.extend({
		version: 1,
		defaults: {
			'is_default' : true,
			'name'       : 'default.png',
			'ninepatch'  : false,
			'screens'    : ['home','launcher']
		},
		initialize: function() {
			this.setUrl();
		},
		setUrl: function() {							
			if(this.version==1)
				this.version = (new Date()).getTime();
			this.version = this.version+10;			
			var resource_base_url = app.theme.get('resources_url');
			this.set('url', resource_base_url + '/' + this.get('folder') + '/' + this.get('filename') + '?r=' + this.version);			
		},
		update: function(filename) {	
			this.set('filename', filename);
			this.set('is_default', false);
			this.setUrl();
			this.trigger('refresh');
		}
	});
	var Resources = Backbone.Collection.extend({
		model: Resource
	});
	
	var ResourceView = Backbone.View.extend({
		tagName: "li",
		className: "resource",
		image_template: _.template($('#image_resource_template').html()),
		color_template: _.template($('#color_resource_template').html()),
		initialize: function(data) {
			this.model = data.model;
			this.$el.hover(_.bind(this.mouseover, this), _.bind(this.mouseout, this));
			this.listenTo(this.model, 'remove', _.bind(this.remove, this));
			this.listenTo(this.model, 'refresh', _.bind(this.render, this));
		},
		render: function() {
			switch(this.model.get('type')) {
				case 'color': 
					this.$el.html(this.color_template($.extend(this.model.toJSON(), {id: this.model.id})));
					this.colorInput = this.$('[data-plugin="colorpicker"]');
					this.colorInput.colorpicker();
					this.colorInput.colorpicker().on('hidePicker', _.bind(this.saveColor, this));
					this.colorInput.colorpicker().on('changeColor', _.bind(this.onChangeColor, this));
					this.colorInput.on('keyup', _.bind(this.onTypeColor, this));
					break;
				default: 
					this.$el.html(this.image_template($.extend(this.model.toJSON(), {id: this.model.id})));
					break;
			}
			
			return this;
		},
		onTypeColor: function(e) {	
			this.colorInput.colorpicker('setValue', this.colorInput.val());
		},
		mouseover: function() {
			this.model.trigger('highlight');
		},
		mouseout: function() {
			this.model.trigger('removehighlight');
		},
		onChangeColor: function(e) {
			app.trigger('changeResourceColor', {resource_id: this.model.id, color: e.color.toHex()});			
		},
		saveColor: function(e) {
			this.model.trigger('saveColor', {resource_id: this.model.id, color: e.color.toHex()});
		}
	});
	
	var DeviceResourceView = Backbone.View.extend({
		tagName: "img",
		className: "deviceResource",	
		isMask: false,
		events: {
			'click': 'showFolderResources',
		},
		initialize: function() {
			this.version = 0;
			
			this.el = $('[data-resource="' + this.model.id  + '"]').get();	
			this.$el = $(this.el);
			if(this.$el.size()==0) {
				this.$el = $('[data-resource-mask="' + this.model.id + '"]');
				if(this.$el.size()>0)
					this.isMask = true;
			}	
			this.listenTo(this.model, 'refresh', _.bind(this.render, this));
			
			this.listenTo(this.model, 'highlight',        _.bind(this.highlight, this));
			this.listenTo(this.model, 'removehighlight', _.bind(this.remove_highlight, this));
			
			this.listenTo(this.model, 'remove', _.bind(this.remove, this));
		},	
		highlight: function() {
			var position = this.$el.offset();
			if(typeof(position) != 'undefined') {
				var width = this.$el.outerWidth();
				var height = this.$el.outerHeight();
				this.highlightBox = $('<div class="resource_highlight">&nbsp;</div>');
				this.highlightBox.css({
					top: position.top,
					left: position.left,
					width: width,
					height: height
				});
				this.highlightBox.appendTo('body');
			}
		},
		remove_highlight: function() {
			if(this.highlightBox)
				this.highlightBox.remove();	
		},
		showFolderResources: function() {
			app.showFolderResources(this.model.get('folder'));
		},
		render: function() {		

			this.$el.removeAttr('style');
			
			var width  = this.model.get('width') * app.device.get('scale_factor');
			var height = this.model.get('height') * app.device.get('scale_factor');	
			var url = this.model.get('url');
			
			var ninepatch = false;
			if(this.model.get('filename').match(/\.9\.(png|gif)/i)) {
				ninepatch = true;
			}	
			if(ninepatch && this.model.get('force_ninepatch')) {
				width  = this.$el.outerWidth();
				height = this.$el.outerHeight();
			}
			
			if(this.$el.size() > 0) {
				
				this.$el.css({
					'width': width + 'px', 
					'height': height + 'px'
				});	
				
				if(this.$el.prop('tagName').toLowerCase() == 'img') {		
					if(ninepatch) {
						this.$el.on('load', _.bind(this.convertTo9Patch, this));
					}	
					
					if(this.isMask) {
						this.$el.css('-webkit-mask', 'url(' + url + ') top left / cover');
					} else {
						this.$el.attr('src', url);
					}
				} else {
					if(ninepatch) {
						var tmpImg = $('<img />');
						tmpImg.on('load', _.bind(this.simple9Patch, this));
						
						this.$el.css({"background": 'url(' + url + ')'});
						tmpImg.attr('src', url);
					} else {
						this.$el.css({"background": 'url(' + url + ')', "background-size": 'cover'});
					}
				}
			}			
		},
		convertTo9Patch: function() {
			var url = this.$el.attr('src');						
			var width = parseFloat(this.$el.css('width'));			
			var height = parseFloat(this.$el.css('height'));
			this.$el.replaceWith('<div class="' + this.$el.attr('class') + '" id="' + this.$el.attr('id') + '" data-resource="' + this.model.id + '" style="width: ' + width +'px; height: ' + height + 'px;"></div>');
			this.el = $('[data-resource="' + this.model.id  + '"]').get();
			this.$el = $(this.el);		
			this.$el.css({
				"background-image": 'url(' + url + ')'
			});
			_.each(this.el, function(el, index){
				new NinePatch(el);
			});
		},
		simple9Patch: function() {	
			_.each(this.el, function(el, index){
				new NinePatch(el);
			});
			this.keepColor();
		},
		keepColor: function() {
			var color_resources = [];
			_.each(this.el, function(el, index){
				var color_resource = el.getAttribute('data-color');
				if(typeof(color_resource)!='undefined' && color_resource) {
					app.setColor({
						color: app.theme.resources.get(color_resource).get('color'),
						resource_id: color_resource
					});
				}
			});
		}
	});
	 
	var Device = Backbone.Model.extend({
		defaults: {
			'scale_factor': 0.45,
			'width': 360,
			'height': 600,
			'name': 'Nexus 4'
		},
		setTheme: function(theme) {
			this.theme = theme;
		}
	});

	var Theme = Backbone.Model.extend({
		defaults: {
			name: 'New theme',
			launcher: 'golauncher',
			id: 'default',		
			default_url: 'themes/default',			
			url: 'themes/default'
		},      
		initialize: function() {
			this.resources = new Resources();
		},
		updateResourceByName: function(filename) {
			var resource_id = filename.replace(/(\.jpg|\.jpeg|\.9\.png|\.png)/, '');
			this.resources.get(resource_id).update(filename);
		},
		updateColor: function(data) {
			$.post(
				PAGE_DATA.base_url + '/app/update_color', 
				{theme_id: this.id, resource_id: data.resource_id, color: data.color}, 
				_.bind(this.onUpdateColor, this), 
				'json'
			);
		},
		onUpdateColor: function(data) {
			this.resources.get(data.resource_id).set('color', data.color);
		}
	});


	var DeviceScreen = Backbone.View.extend({
		initialize: function() {
			//this.listenTo(this.device, 'change', _.bind(this.reloadAssets, this));
		}
	})

	var HomeScreen = DeviceScreen.extend({
		id: "homescreen"
	});
	var LauncherScreen = DeviceScreen.extend({
		id: "launcher"
	});

	var DeviceView = Backbone.View.extend({	     
		screens: {},
		initialize: function() {
			this.screens.home     = new HomeScreen({device: this.device});
			this.screens.launcher = new LauncherScreen({device: this.device});
		},
		placeResource: function(res) {
			if(res.get('folder')==='app_icons' && $('#apps > ul > li').size()<16) {				
				$('#apps > ul').append(_.template($('#icon_template').html(), {id: res.id, label: res.get('iconLabel')}));
			}
			if(res.get('folder')==='homescreen_menu_icons') {
				var selected = false;
				if($('#bottom_menu_options1 li').size()<4) {
					if($('#bottom_menu_options1 li').size()==3)
						selected = true;
					$('#bottom_menu_options1').append(_.template($('#bottom_option_template').html(), {id: res.id, label: res.get('iconLabel'), selected: selected}));
				} else {
					if($('#bottom_menu_options2 li').size()<3) {
						$('#bottom_menu_options2').append(_.template($('#bottom_option_template').html(), {id: res.id, label: res.get('iconLabel'), selected: selected}));						
					} else {
						if($('#bottom_menu_options2 li').size()<4) {
							$('#bottom_menu_options2').append(_.template($('#bottom_option_selected_template').html(), {id: res.id, label: res.get('iconLabel'), selected: selected}));											
						}
					}
				}
			}
			var r = new DeviceResourceView({model: res});
			r.render();
		}
	});
	
	var FolderView = Backbone.View.extend({
		tagName: 'div',
		className: 'folder',
		template: _.template($('#folder_template').html()),
		initialize: function() {
			this.data = arguments[0].data;
			this.$el.attr('id', 'folder_' + this.data.folder_id);
			this.$el.data('folder', this.data.folder_id);
		},
		addResource: function(model) {
			var r = new ResourceView({model: model});
			this.$('.folder_resources').append(r.render().el);
		},
		render: function() {
			this.$el.html(this.template(this.data));
			return this;
		}
	});	
	
	var InteractionView = Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#interaction_button').html()),
		events: {
			'click a': 'runInteraction'
		},
		initialize: function(data) {
			this.data = data;
		},
		render: function() {
			this.$el.html(this.template(this.data));
			return this;
		},
		runInteraction: function() {
			app.runInteraction(this.data.interaction_id);
		}
	});

	var AppView = Backbone.View.extend({
		theme:  null,
		folders: [],
		interactionViews: [],
		demoIcons: [
			{iconLabel: 'Amazon MP3', url: 'AmazonMP3.png'},
			{iconLabel: 'Google Car', url: 'GoogleCar.png'},
			{iconLabel: 'Kindle',     url: 'Kindle.png'},
			{iconLabel: 'Android', url: 'Android.png'},
			{iconLabel: 'Candy Crush Saga', url: 'CandyCrushSaga.png'},
			{iconLabel: 'Google Goggles', url: 'GoogleGoggles.png'},
			{iconLabel: 'Notes', url: 'Notes.png'},
			{iconLabel: 'Android2', url: 'Android2.png'},
			{iconLabel: 'Photoshop', url: 'Photoshop.png'},
		],
		el: 'body',
		events: {
			'click #newTheme': 'newTheme',
			'click #editTheme': 'editTheme',
			'click #loadTheme': 'loadTheme',
			'click #createNewTheme': 'createNewTheme',
			'submit #newThemeForm': 'createNewTheme',			
			'click #updateTheme': 'updateTheme',
			'submit #editThemeForm': 'updateTheme',
			'click #reloadTheme': 'reload_theme',
			'click #loadSelectedTheme': 'load_selected_theme',
			'click #downloadTheme': 'download_theme'
		},
		initialize: function() {		
			this.device = new Device;
			this.deviceView = new DeviceView({model: this.device});
			var _this = this;
			
			$('#fileupload').fileupload({
				//xhrFields: {withCredentials: true},
				url: PAGE_DATA.base_url + '/app/upload',
				autoUpload: true,
				disableImageResize: true,
				maxFileSize: 5000000,
				acceptFileTypes: /(\.|\/)(jpe?g|png|zip)$/i,
				done: function(e, data) {
					var that = $(this).data('blueimp-fileupload') || $(this).data('fileupload');					
					
					if (data.result && $.isArray(data.result.files)) {
						files = data.result.files;
					} else {
						files = [];
					}
					
					for(var index=0; index<files.length; index++) {
						var file = files[index] || {error: 'Empty file upload result'};
						_this.theme.updateResourceByName(file.name);
					}
					
					data.context.each(function (index) {								   
                        var node = $(this);
						$(this).removeClass('in');
						
						if ($.support.transition && node.is(':visible')) {
							node.bind(
								$.support.transition.end,
								function (e) {
									// Make sure we don't respond to other transitions events
									// in the container element, e.g. from button elements:
									if (e.target === node[0]) {
										node.unbind($.support.transition.end).remove();
									}
								}
							).addClass('out');
						}						
                    });
				}
			});

			// Enable iframe cross-domain access via redirect option:
			$('#fileupload').fileupload(
				'option',
				'redirect',
				window.location.href.replace(
					/\/[^\/]*$/,
					'jqueryfileupload/cors/result.html?%s'
				)
			);
			
			var that = this;
			$('#fileupload').bind('fileuploadsubmit', function (e, data) {				
				data.formData = {theme_id: that.theme.id};
			});
			
			
			this.listenTo(this, 'changeResourceColor', _.bind(this.setColor, this));
			
		},
		setColor: function(data) {
			this.$('[data-color="' + data.resource_id + '"]').css('color', data.color);
		},
		start: function() {			
			$.post(PAGE_DATA.base_url + '/app/get_existing_themes', {}, _.bind(this.add_existing_themes, this));			
		},
		add_existing_themes: function(list) {
			for(i in list) {
				$('<option value="' + list[i].id + '">' + list[i].name + ' (' + list[i].launcher + ')</option>').data('theme', list[i]).appendTo('#themeLoader');
			}
			//$('#themeLoader').change(_.bind(this.load_selected_theme, this));
		},
		reload_theme: function(e) {
			buttonLoading('#reloadTheme');
			$.post(PAGE_DATA.base_url + '/app/load_theme', {id: this.theme.id}, _.bind(this.setup_theme_editor, this), 'json');
		},
		load_selected_theme: function(e) {	
			var theme_id = $('#themeLoader').val();
			this.theme = new Theme($('[value="' + theme_id + '"]').data('theme'));
			this.device.setTheme(this.theme);		
			buttonLoading('#loadSelectedTheme');
			$.post(PAGE_DATA.base_url + '/app/load_theme', {action: 'load_theme', id: $('#themeLoader').val()}, _.bind(this.setup_theme_editor, this), 'json');
		},
		reset_theme_editor: function() {
			$('#demoapps > ul > li').remove();
			this.theme.resources.each(function(res){
				res.trigger('remove');
			});
			_.each(this.folders, function(folderView){
				folderView.remove();
			});
			
			_.each(this.interactionViews, function(interactionView){
				interactionView.remove();
			});
		},
		setup_theme_editor: function(config, status) {		
		
			buttonReset('#loadSelectedTheme');
			buttonReset('#createNewTheme');
			buttonReset('#reloadTheme');
		
			$('#themeName').html(this.theme.get('name'));
			$('#themeOptions').show();
			
			$('#editor').show();
			$('#loading').show();
			$('.modal').modal('hide');
		
			var that = this;			
			if(status == 'success') {
				
				this.theme = new Theme(config.theme);
				this.device.setTheme(this.theme);		
				
				config = config.editor;
				
				this.reset_theme_editor();
				
				//add demo app icons
				$.each(this.demoIcons, function(index, icon) {
					icon.url = PAGE_DATA.base_url + '/assets/app/img/icons/' + icon.url;
					var icon_html = _.template($('#demo_icon_template').html(), icon);
					$('#demoapps > ul').append(icon_html);
				});
				
				//add interactions
				this.interactions = config.interactions;
				$.each(this.interactions, function(action_id, action) {
					var trigger_parts = action.trigger.split(' ');					
					switch(trigger_parts[0]) {
						case 'click':
						case 'swipeup': 
							$(trigger_parts[1]).on(trigger_parts[0], _.bind(that.runInteraction, action_id));
							break;
						case 'default':
							that.default_interaction = action_id;
							break;
					}
					
					var interactionView = new InteractionView({interaction_id: action_id, label: action.label});
					$('#interactions_list').append(interactionView.render().el);
					that.interactionViews.push(interactionView);
				});
				
				//add custom resources
				$.each(config.assets, function(folder, folder_resources) {
					var folderview = new FolderView({data: {folder_id: folder}});
					$('#folders').append(folderview.render().el);
					
					$.each(folder_resources, function(res, res_data) {		
						that.theme.resources.add($.extend({id: res, folder: folder}, res_data));							
						if("type" in res_data) {
							switch(res_data.type) {
								case 'auto':
									break; 
								case 'color':
									folderview.addResource(that.theme.resources.get(res));
									that.theme.listenTo(that.theme.resources.get(res), 'saveColor', _.bind(that.theme.updateColor, that.theme));;
									break;
							}														
						} else {					
							that.deviceView.placeResource(that.theme.resources.get(res));
							folderview.addResource(that.theme.resources.get(res));
						}							
					});					
					that.folders.push(folderview);
				});	
				
				//set colors
				that.theme.resources.each(function(res){
					if(res.get('type') == 'color' && res.get('value') && res.get('value').length > 0) {				
						that.theme.resources.get(res.id).set('color', res.get('value'));
						that.trigger('changeResourceColor', {resource_id: res.id, color: res.get('value')});			
					}
				}); 
				 
				//this.runInteraction(this.default_interaction);
				
				setTimeout(function() {	
					that.runInteraction(that.default_interaction);					
					$('#loading').hide();
				}, 4000);
			}
		},
		runInteraction: function(e) {			
			var interaction_id = '';
			if(typeof(e) == "string") {
				interaction_id = e;
			} else {
				interaction_id = e.data;
			}
			var that = this;
			switch(interaction_id) {
				case 'hideall':
					$("[fragment]").hide();
					break;
				case 'show':
				case 'hide':
					if(arguments.length>1) {					
						var fragments = arguments[1];
						for(var i=0; i<fragments.length;i++) {
							$(fragments[i])[interaction_id]();
						}
					}
					break;
				default:
					if(interaction_id in this.interactions) {
						$.each(this.interactions[interaction_id].actions, function(index, action) {
							if(typeof(action) == "string") {
								that.runInteraction(action);
							} else {
								for(var i in action) {
									var action_id = i;
								}
								that.runInteraction(action_id, action[action_id]);
							}
						});
						$('.folder').hide();
						$.each(this.interactions[interaction_id].folders, function(index, folder) {
							$('#folder_' + folder).show();
						});
					}
					break;
			}
		},
		showFolderResources: function(folder) {
			$('[folder]').hide();
			$('[folder="' + folder + '"]').show();
		},		
		newTheme: function() {
			$('#newThemeModal').modal('toggle');
		},
		editTheme: function() {
			$('#editThemeModal').modal('toggle');
			var that = this;
			$('#editThemeForm input, #editThemeForm select').each(function(index, element) {
				var prop = $(element).attr('name');
				$(element).val(that.theme.get(prop));
			});
		},
		loadTheme: function() {
			$('#loadThemeModal').modal('toggle');
		},
		updateTheme: function() {
			$('#editThemeError').toggleClass('in');
			var themeData = $('#editThemeForm').serialize() + '&id=' + this.theme.id;
			buttonLoading('#updateTheme');
			$.post(PAGE_DATA.base_url + '/app/update_theme', themeData, _.bind(this.onUpdateTheme, this), 'json');
			return false;			
		},
		createNewTheme: function() {
			$('#createThemeError').toggleClass('in');
			var newThemeData = $('#newThemeForm').serialize();    
			buttonLoading('#createNewTheme');
			$.post(PAGE_DATA.base_url + '/app/create_theme', newThemeData, _.bind(this.onCreateNewTheme, this), 'json');
			return false;
		},
		onCreateNewTheme: function(data) {	
			if(data.success) {
				this.theme = new Theme(data.themedata);
				this.device.setTheme(this.theme);		
				$.post(PAGE_DATA.base_url + '/app/load_theme', {id: this.theme.id}, _.bind(this.setup_theme_editor, this), 'json');
				$('#newThemeModal').modal('hide');
			} else {
				buttonReset('#createNewTheme');
				$('#createThemeError').html(data.error).addClass('in');
			}
		},
		onUpdateTheme: function(data) {
			if(data.success) {
				this.theme = new Theme(data.themedata);
				this.device.setTheme(this.theme);	
				$.post(PAGE_DATA.base_url + '/app/', {action: 'load_theme', id: this.theme.id}, _.bind(this.setup_theme_editor, this), 'json');
				$('#editThemeModal').modal('hide');				
			} else {			
				buttonReset('#updateTheme');
				$('#editThemeError').html(data.error).addClass('in');
			}
		},
		download_theme: function() {
			window.open(PAGE_DATA.base_url + '/app/download.php?theme=' + this.theme.id);
		}
	});
	
	
	var app = new AppView;
	app.start();

});