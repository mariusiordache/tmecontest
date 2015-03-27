$(document).ready(function() {
		
	/*
	$('#parentTag_selector').jqui_autocompleter({ 	
		add_url: $('#parentTag_selector').data('add-url'),
		source: function(request, response) {
			$.ajax({
				type: 'POST',
				url: $('#parentTag_selector').data('source'),
				dataType: "json",
				data: {query: request.term},
				success: function( data ) {
					response( $.map( data, function( item ) {
						return {
							label: item.label,
							id:    item.id
						}
					}));
				}
			});
		},
		select: function (event, ui) {
			$('#parentTagHolder').html(_.template($('#parentTagTemplate').html(), ui.item));
		}
	});	
	*/
	
});

$(document).ready(function() { 
		
	var availabilityInterval     = Backbone.Model.extend({ });
	var availabilityIntervalView = BaseView.extend({
		template: _.template($('#timeIntervalTemplate').html()),
		events: {
			'click .remove': 'removeInterval'
		},
		initialize: function() {
			$.extend(this, arguments[0]);
		},
		render: function() {		
			this.$el.html(this.template({data: this.data}));	
			this.$('[data-plugin="de_datepicker"]').datepicker({dateFormat: 'yy-mm-dd', showOtherMonths:true});
			return this;
		},	
		removeInterval: function() {
			this.$('[data-plugin="de_datepicker"]').datepicker('destroy');
			this.dispose();
		}
	});

	var availabilityIntervals    = Backbone.Collection.extend({ 
		model: availabilityInterval
	});
	
	var RelatedTagContainer = BaseView.extend({
		template: _.template($('#relatedTagContainer').html()),
		render: function() {
			if(arguments.length==0)
				arguments[0] = {data: {}};
			this.$el.html(this.template(arguments[0]));		
			return this.$el;		
		}		
	});
	
	var RelatedTagView = BaseView.extend({ 
		template: _.template($('#tagListItemTemplate').html()),
		render: function() {
			if(arguments.length==0)
				arguments[0] = {data: {}};
			this.$el.html(this.template(arguments[0]));		
			return this.$el;
		},
		events: {
			'click': 'loadEditData',
			'click a.x': 'removeRelation'
		},
		loadEditData: function() {
			$.post('/admin/tags/ajax_load_relation/' + this.$el.find('.tag').data('id'), {}, $.proxy(this.onLoadEditData, this));
		},
		onLoadEditData: function(ajax_result) {
			if(ajax_result.success) {
				RTE.model = ajax_result.data;
				RTE.render();
			} else {
				alert(JSON.stringify(ajax_result.error, null, 4));
			}				
		},
		removeRelation: function(e) {		
			if(confirm('Are you sure you want to delete this tag association?')) {
				$.post('/admin/tags/ajax_remove_relation/' + this.$el.find('.tag').data('id'), {}, $.proxy(this.onRemoveRelation, this));		
			}
			e.preventDefault();
			e.stopPropagation();
		},
		onRemoveRelation: function() {		
			delete App.tagViews[this.$el.find('.tag').data('id')];
			this.dispose();
		}
	});
	
	var TagEditorView = BaseView.extend({ 
		template: _.template($('#related-tag-editor').html()),
		el: '#relatedTagEditorHolder',
		render: function() {		
			this.$el.html(this.template({data: this.model}));
			this.$('[type="radio"],select').uniform();
			this.$('.main_tag').html($('#tag_label').val());
			if('time_intervals' in this.model && this.model.time_intervals.length>0) {
				for(i in this.model.time_intervals) {
					this.addInterval(this.model.time_intervals[i]);
				}
			}
			return this.$el;
		},
		initialize: function() {
			
		},
		events: {
			'click .addInterval': 'addBlankInterval',
			'change [name="availability"]': 'toggleIntervals',
			'click #saveTagButton': 'save',
			'click #cancelTagButton': 'clear'
		},
		addInterval: function(data) {
			var i = new availabilityIntervalView({data:data});
			this.$('.intervals').append(i.render().el);
		},
		addBlankInterval: function() {
			var i = new availabilityIntervalView({data: {}});
			this.$('.intervals').append(i.render().el);
		},
		toggleIntervals: function() {
			var selected = this.$('[name="availability"]:checked').val();
			if(selected == 'intervals')
				$('#intervalsHolder').show();
			else
				$('#intervalsHolder').hide();
		},
		save: function(e) {
			var post_url = $('#tagAssocEditor').data('url');
			var	relation_data = $('#tagAssocEditor').serialize();
			console.log(relation_data);
			var tag_data	  = $('#tagform').serialize();
			$.post(post_url, {relation: relation_data, tag: tag_data}, $.proxy(this.onSave, this));
			e.stopPropagation();
		},
		onSave: function(ajax_result) {
			if(ajax_result.success) {
				/* @todo: set tag id to the resulting tag1_id (in case we're adding related tags to a new tag that didn't have an ID before */
				App.addRelatedTag(ajax_result);
				this.clear();
			} else {				
				alert(JSON.stringify(ajax_result.errors, null, 4));
			}
		},
		clear: function() {
			this.$el.html('');
			$('#tagAssocSelector').val('');
		}
	});
	
	var RTE = new TagEditorView();
	
	var AppView = BaseView.extend({	
		tagViews: [],
		relatedTagContainers: {},
		initialize: function() {
			if(typeof(existingRelatedTags) != 'undefined') {
				for(i in existingRelatedTags) {
					this.addRelatedTag(existingRelatedTags[i]);
				}
			}
		},
		addRelatedTag: function(data) {
			if(data.id in this.tagViews) {
				this.tagViews[data.id].render({data: data});
			} else {
				this.tagViews[data.id] = new RelatedTagView();
				this.tagViews[data.id].render({data: data}).appendTo(this.getRelatedTagContainer(data.relation_type));
			}	
		},
		getRelatedTagContainer: function(relation_type) {
			relation_type_clean = remove_spaces(relation_type);
			if(relation_type_clean in this.relatedTagContainers) {
				return this.relatedTagContainers[relation_type_clean].$('.taglist');
			} else {
				var rtc = new RelatedTagContainer();
				rtc.render({label: relation_type}).appendTo('#relatedTagsList');
				this.relatedTagContainers[relation_type_clean] = rtc;
				return rtc.$('.taglist');
			}
		}
	});
	
	var App = new AppView;
	
	$('#tagAssocSelector').TagSelector({ 	
		context: 'tag_relation', // what does this do? 
		select: function (event, ui) {
			RTE.model = {
				tag2_id: ui.item.id,
				tag2_label: ui.item.label
			};
			RTE.render();
			$('#tagAssocSelector').val('');
		}
	});	
	
	
});

function remove_spaces(str) {
	return str.replace(/[^a-z0-9]+/ig, '');
}