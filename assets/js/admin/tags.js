$(document).ready(function() {
	
	$('#tagAssocSelector').TagSelector({
		select: function (event, ui) {	
			app.setFoundTag(ui.item);
		}
	});
	

	var TagView = BaseView.extend({ 
		template: _.template($('#tag-template').html()),
		tagName: 'div',
		className: 'listTag',
		initialize: function() {			
			if(arguments.length==1)
				$.extend(this, {data: arguments[0]});
		},
		render: function() {
			this.$el.html(this.template(this.data));
			return this;
		},
		events: {
			'click .tagLabel': 'loadChildren',
			'click .remove': 'deleteTag'
		},
		deleteTag: function(e) {		
			if(confirm('Are you sure you want to delete this tag?')) {
				$.post('/admin/tags/ajax_delete/' + this.data.id, {}, $.proxy(this.onDelete, this));		
			}
			e.preventDefault();
			e.stopPropagation();
		},
		onDelete: function(ajax_result) {
			if(ajax_result.success)
				this.$el.fadeOut($.proxy(this.dispose, this));
		},
		loadChildren: function(e) {
			
			$.post('/admin/tags/ajax_list_children/' + this.data.id, {}, $.proxy(this.onLoadChildren, this));
						
			e.preventDefault();
			e.stopPropagation();
		},
		onLoadChildren: function(ajax_result) {
			if(ajax_result.tags.length==0)
				alert('This tag has no children');
			else
				app.addPanel(this.data.panelHolderID, ajax_result.tags);
		}	
	});

	var TagPanel = BaseView.extend({
		template: _.template($('#tag-panel-template').html()),
		tagName: 'div',
		className: 'tagPanel widget',
		tagViews: [],
		initialize: function() {	
			this.tagViews = [];
			if(arguments.length==1) {
				$.extend(this, {data: arguments[0]});
				if('tags' in this.data) {
					for(i in this.data.tags) {
						this.data.tags[i].panelHolderID = this.data.holderID;
						this.addTag(i);
					}
				}
			}
		},
		pushTag: function(data) {
			this.data.tags.puhs(data);
			this.addTag(this.data.tags.length-1);
		},
		addTag: function(i) {
			var tagview = new TagView(this.data.tags[i]);
			this.tagViews[i] = tagview;
		},
		render: function() {
			this.$el.html(this.template(this.data));
			this.$el.css('marginTop', 0);
			for(i in this.tagViews) {
				this.$('.tagHolder').append(this.tagViews[i].render().el);
			}
			return this;
		},
		events: {
			'click .closePanel': 'closePanel'
		},
		closePanel: function(e) {		
			for(i in this.tagViews) {
				this.tagViews[i].dispose();
			}
			this.dispose();
			e.preventDefault();
			e.stopPropagation();
		}
	});
		
	var AppView = BaseView.extend({	
		initialize: function() {	
			if(typeof(existingTags)!='undefined') {
				for(box in existingTags) {
					this.addPanel(box, existingTags[box]);			
					if(box == 'continents')
						break;					
				}
			}
		},
		addPanel: function(holderID, tags) {
			position = 1 + $('#' + holderID + 'PanelHolder .tagPanel').length;
			var panel = new TagPanel({tags: tags, holderID: holderID, id: holderID+position});
			$('#' + holderID + 'PanelHolder').append(panel.render().el);		
		},
		setFoundTag: function(tag_data) {
			if(typeof(this.foundTag) != 'undefined') {
				this.foundTag.dispose();
			}
			this.foundTag = new TagView(tag_data);
			$('#foundTagHolder').html(this.foundTag.render().el);
		}
	});

	var app = new AppView();

});
