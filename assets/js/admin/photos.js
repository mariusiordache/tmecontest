function changeUploaderURL(new_url) {
	uploader.pluploadQueue().settings.url = new_url;
}

$(document).ready(function() {

	uploader = $("#uploader").pluploadQueue({
		runtimes : 'html5,html4',
		url: PAGE_DATA.upload_url,
		unique_names : true,
		filters : [
			{title : "Image files", extensions : "jpg,gif,png"}
		],
		rename: true,
		multiple_queues: true,
		preinit : {
            FileUploaded: function(up, file, info) {
				app.addPhoto($.parseJSON(info.response));
            }
		}
	});
	
	$('#tagSelector').TagSelector({ 
		select: function (event, ui) {		
			$('#tagSelector').val('');
			app.addTag({
				tag_id: ui.item.id,
				label: ui.item.label
			});
			
			event.stopPropagation();
		}
	});	
	
	var TagView = BaseView.extend({
		template: _.template($('#tag-template').html()),
		events: {
			'click .tag': 'loadPhotos'
		},
		initialize: function() {
			if(arguments.length==1) {
				$.extend(this, {data: arguments[0]});
			}
		},
		loadPhotos: function() {
			app.loadGalleryPhotos(this.$('span').eq(0).data('gallerytype'), this.$('span').eq(0).data('galleryid'));
		},
		render: function() {
			this.$el.html(this.template(this));	
			return this;
		},
		
	});
	
	var PhotoView = BaseView.extend({ 
		template: _.template($('#photo-template').html()),
		tagName: 'li',
		initialize: function() {			
			if(arguments.length==1)
				$.extend(this, {data: arguments[0]});
		},
		render: function() {
			this.$el.html(this.template(this.data));		
			if(this.data.connection_type == 'deal') {
				this.$('.addToDeal').hide();		
				this.$('.removeFromDeal').hide();		
			} else {
				if('match' in this.data) {
					this.matchFound();				
				} else {		
					this.matchNotFound();
				}				
			}
			return this;
		},
		matchFound: function() {
			this.$('.addToDeal').hide();				
			this.$('.removeFromDeal').show();
			this.$('img').addClass('photoMatch');
		},
		matchNotFound: function() {
			this.$('.addToDeal').show();		
			this.$('.removeFromDeal').hide();		
			this.$('img').removeClass('photoMatch');	
		},
		events: {
			'click .edit': 'edit',
			'click .remove': 'deletePhoto',
			'click .unlink': 'unlink',
			'click .addToDeal': 'addToDeal',
			'click .removeFromDeal': 'removeFromDeal'
		},
		edit: function() {
			//$.post('/admin/tags/ajax_load_relation/' + this.data.id, {}, $.proxy(this.onLoadEditData, this));
		},
		onLoadEditData: function(ajax_result) {
			/*
			if(ajax_result.success) {
				RTE.model = ajax_result.data;
				RTE.render();
			} else {
				alert(ajax_result.error)
			}
			*/			
		},
		unlink: function(e) {
			$.post('/admin/photos/ajax_unlink/' + this.data.connection_type + '/' + this.data.connection_id, {}, $.proxy(this.onUnlink, this));
		},
		deletePhoto: function(e) {		
			if(confirm('Are you sure you want to delete this photo?')) {
				$.post('/admin/photos/ajax_delete/' + this.data.id, {}, $.proxy(this.onDelete, this));		
			}
			e.preventDefault();
			e.stopPropagation();
		},
		onDelete: function(ajax_result) {
			if(ajax_result.success)
				this.$el.fadeOut($.proxy(this.dispose, this));
		},
		onUnlink: function(ajax_result) {
			if(ajax_result.success)
				this.$el.fadeOut($.proxy(this.dispose, this));
		},
		addToDeal: function() {
			$.post('/admin/photos/ajax_add_to_deal/' + this.id + '/' + PAGE_DATA.deal_id, {}, $.proxy(this.onAddToDeal, this));
		},
		onAddToDeal: function(ajax_result) {
			if(ajax_result.success) {
				this.matchFound();
			}
		},
		removeFromDeal: function() {
			$.post('/admin/photos/ajax_remove_from_deal/' + this.id + '/' + PAGE_DATA.deal_id, {}, $.proxy(this.onRemoveFromDeal, this));
		},
		onRemoveFromDeal: function(ajax_result) {
			if(ajax_result.success) {
				this.matchNotFound();
			}
		}		
	});
	
	var AppView = BaseView.extend({		
		loadGalleryPhotos: function() {
			if(arguments.length==2) {
				this.gtype = arguments[0];
				this.gid   = arguments[1];
			}
			$.post('/admin/photos/ajax_list_for_' + this.gtype + '/' + this.gid, {match: 'deal/'+PAGE_DATA.deal_id}, $.proxy(this.onSwitchGallery, this));
		},
		switchGallery: function(e) {
			this.gtype = e.target.getAttribute('data-gallerytype');
			this.gid   = e.target.getAttribute('data-galleryid');
			this.loadGalleryPhotos();			
		},
		onSwitchGallery: function(ajax_result) {
			$('#gallery li').remove();
			if('photos' in ajax_result) {
				for(i in ajax_result.photos) {
					this.addPhoto(ajax_result.photos[i]);
				}
			}
			$('#gallery').sortable('refresh');
			changeUploaderURL('/admin/photos/ajax_upload/' + this.gtype + '/' + this.gid);
			$('.switchGalleryButton').removeClass('this');
			$('.tag').removeClass('this');
			$('[data-galleryid='+this.gid+'][data-gallerytype='+this.gtype+']').addClass('this');
			
		},
		saveOrder: function(event, ui) {	
			app.list = [];
			$('#gallery li').each(function() {
				app.list.push($(this).find('[name="connection_id[]"]').val());
			});
			$.post('/admin/photos/ajax_update_order/' + this.gtype + '/' + this.gid, {order: app.list}, $.proxy(this.onSaveOrder, this));
		},
		onSaveOrder: function(ajax_result) {
			
		},
		initialize: function() {			
			$('#gallery').sortable();
			$('#gallery').on( 'sortupdate', $.proxy(this.saveOrder, this));
			$('#gallery').disableSelection();
			
			if(typeof(existingDealPhotos) != 'undefined') {
				for(i in existingDealPhotos) {
					this.addPhoto(existingDealPhotos[i]);
				}
			}	
			$('ul.subNav').on('click','a.switchGalleryButton', $.proxy(this.switchGallery, this));
			
			if(typeof(dealTags)!=='undefined') {
				for(i in dealTags) {
					this.addTag(dealTags[i]);
				}
			}
			
			this.gtype = 'deal';
			this.gid   = PAGE_DATA.deal_id;  
		},
		addPhoto: function(data) {		
			var pview = new PhotoView(data);			
			$('#gallery').append(pview.render().el);
			$( "#sortable" ).sortable('refresh');
		},
		addTag: function(data) {
			var tview = new TagView(data);
			$('#tagList').append(tview.render().el);
		}
	});
	
	var app = new AppView();

});