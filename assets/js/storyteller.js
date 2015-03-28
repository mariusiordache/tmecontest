$(document).ready(function() {
    
    var Tag = Backbone.Model.extend({
        setImageList: function(images, activateFirst) {
                //console.log(images);
            //console.log('setting image list', images);
            this.images = images;
            if(activateFirst) {
                this.setImage(this.images[0]);
            }
        },
        setImage: function(image) {
            //console.log(image);
            this.set('image_url', image.link);
        }
    });
    
    var Tags = Backbone.Collection.extend({
        model: Tag
    })
        
    var Slide = Backbone.Model.extend({
        'urlRoot' : '/story/save_slide'
    })
    
    var Slides = Backbone.Collection.extend({
       model: Slide        
    });
    
    var TagView = Backbone.View.extend({
        tagName: 'li',
        className: 'tag',
        template: _.template($('#tag-template').html()),
        events: {
            'click': 'showImageSelector'
        },
        initialize: function() {
            this.listenTo(this.model, 'destroy', $.proxy(this.remove, this));
        },
        render: function() {            
			this.$el.html(this.template({tag: this.model.toJSON()}));	            
			return this;
        },
        showImageSelector: function(e) {
            e.stopPropagation();            
            app.imageSelector.setCurrentTag(this.model);
            app.imageSelector.open(this.$el.offset());
        }
    })
    
    var SlideEditView = Backbone.View.extend({        
        tagName: 'li',
        className: 'panel panel-default',
        template: _.template($('#slide-editor-template').html()),
        render: function() {            
			this.$el.html(this.template({slide: this.model.toJSON()}));			
            this.$('textarea').keypress($.proxy(this.processText, this));
            this.$('textarea').keyup($.proxy(this.processBackspace, this));
			return this;
        },        
        initialize: function() {
            var c = $('<div class="slideCanvas" id="terog' + this.cid + '"></div>').appendTo($('#slideCanvasHolder'));
            this.canvas = c.canvasWidget().data("ui-canvasWidget");  
            $(document).on('renderedOk', $.proxy(this.stopLoading, this));
            
            this.$('textarea').on('focus', $.proxy(this.requestSlideSwitch, this));
            this.$el.on('click', $.proxy(this.requestSlideSwitch, this));
        },
        processBackspace: function(e) {
            
            this.canvas.setText(this.$('textarea').val());
            var words = this.$('textarea').val().match(/\S+\s*/gi);
            //console.log(e.which);
            switch(e.which) {
                case 8:
                case 46:
                    var todelete = [];
                    if('tags' in this.model) {
                        var that = this;
                        this.model.tags.each(function(t) {
                            //console.log('LABEL:' + t.get('label'));
                            var found = false;
                            for(var i in words) {
                                w = words[i].replace(/[^a-z0-9\*@#\-_]+/gi,"");
                                if(w == t.get('label')) {
                                    found = true;
                                }
                            }
                            if(!found) {
                                todelete.push(t);
                            }
                        })
                    }
                    for(var i in todelete) {
                        t = todelete[i];
                        //console.log('NOT FOUND, TO DELETE:', t.get('label'), words);
                        that.model.tags.remove(t);
                        that.removeImageFromCanvas(t.get('label'));
                        t.destroy();
                        //console.log(t);
                    }
                    break;
                
            }
        },
        processText: function(e) {
            this.canvas.setText(this.$('textarea').val());
            var words = this.$('textarea').val().match(/\S+\s*/gi);
            switch(e.keyCode) {                
                case 13:
                    app.addBlankSlide.call(app, true);
                    e.preventDefault();
                    break;
                case 32:
                case 44:
                case 46:
                case 33:
                case 63:                    
                    for(var i in words) {
                        w = words[i].replace(/[^a-z0-9\*@#\-_]+/gi,"");
                        switch(w.charAt(0)) {
                            case '@':
                            case '*':
                            case '#':
                                if(!('tags' in this.model))
                                    this.model.tags = new Tags();
                                
                                if(!this.model.tags.findWhere({label: w})) {
                                    var t = new Tag({label: w});
                                    this.model.tags.add(t); 
                                    var tv = new TagView({model: t});
                                    this.$('.tags').append(tv.render().el);
                                    
                                    this.listenTo(t, 'change:image_url', $.proxy(this.updateCanvas, this));
                                    
                                    this.startLoading();
                                    
                                    app.searchEngine.searchImages(w, function(data) {
                                         t.setImageList(data, true);
                                    });                                   
                                    
                                }
                                                                
                                break;
                        }
                    }
                    break;
            }
        },
        updateCanvas: function(e) {
            this.startLoading();
            this.canvas.setImage(e.get('label'), e.get('image_url'), 0, 0);
        },
        removeImageFromCanvas:function(label) {
            this.canvas.deleteImage(label);
        },
        requestSlideSwitch: function() {
            app.switchSlide(this);
        },
        select: function() {
            this.canvas.show();
            this.$el.addClass('current');
            this.$('textarea').focus();
        },
        deselect: function() {
            this.canvas.hide();
            this.$el.removeClass('current');
        },
        toggle: function(newSlide) {
            if(newSlide == this) {
                this.select();
            } else {
                this.deselect();
            }
        },
        startLoading: function() {
            this.$('.loader').show();            
        },
        stopLoading: function(e) {
            console.log('stop', e);
            this.$('.loader').hide();
        }
    })
    
    var SlideView = Backbone.View.extend({
        tagName: 'div'
    });
    
    
    var ImageSelector = Backbone.View.extend({
        _views: [],
        el: '#tagImageSelector',
        initialize: function() {
            this.$el.on('click', function(e){
                e.stopPropagation();
            });
            
            this.$('#moreResults').on('click', $.proxy(this.getMoreImages, this));
        },
        open: function(position) {
            position.top += 25;
            this.$el.offset(position);
            this.$el.fadeIn('fast');
        },
        close: function() {
            this.$el.fadeOut('fast', function() {
                $(this).css({top: 0, left: 0});
            });
        },
        populateImages: function(images) {            
            this.clear();
            //console.log('images', images);
            for(var i in images) {
                var v = new ImageSelectorItemView(images[i]);
                this._views.push(v);
                this.$('.items').append(v.render().el);
                this.listenTo(v, 'imageSelected', $.proxy(this.imageSelected, this));
                //console.log('image added');
            }
        },
        getMoreImages: function(images) {
            var that = this;
            app.searchEngine.searchImages(this.currentTag.get('label'), function(data) {
                 that.populateImages(data, true);
            }, this.firstResult+=10);
        },
        clear: function() {
            for(var i in this._views)
                this._views[i].remove();
        },
        imageSelected: function(image) {
            this.currentTag.setImage(image);
        },
        setCurrentTag: function(t){
            //console.log('setting current tag to:' + t.get('label'));
            this.firstResult = 0;
            this.currentTag = t;
            if('images' in t) {
                this.populateImages(t.images);
            }
        }
    })
    
    var ImageSelectorItemView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#image-selector-item-template').html()),
        events: {
            'click': 'selectImage',
        },
        initialize: function(data) {
            this.data = data;
        },
        render: function() {            
			this.$el.html(this.template({data: this.data}));			
			return this;
        },
        selectImage: function(e) {
            e.stopPropagation();
            e.preventDefault();
            this.trigger('imageSelected', this.data);
        }
    })
          
    var App = Backbone.View.extend({
        el: 'body',
        initialize: function(story_id) {
            this.story_id = story_id;
            this.slides = new Slides();            
            this.imageSelector = new ImageSelector();  
            this.$('#add-slide').on('click', $.proxy(this.addBlankSlide, this));          
            this.$('#show-story').on('click', $.proxy(this.showStory, this));          
            if(typeof backend_slides !== 'undefined') {
                for(var i in backend_slides) {
                    this.addSlide(slides[i]);
                }
            } else {
                this.addBlankSlide();
            }
            var that = this;
            this.$el.on('click', function() {
                that.imageSelector.close();
            })
        },
        addBlankSlide: function(e) {
            //console.log('addSlide');
            var s = new Slide({paragraph: '', story_id: this.story_id});
            /* var that = this;
            this.listenTo(s, 'sync', function(data){
                that.onAddBlankSlide(s, data);
            });
            s.save();
        },
        onAddBlankSlide: function(s,data) {        */    
            this.slides.add(s);
            var sev = new SlideEditView({model: s});
            $('#slide-editors').append(sev.render().el);            
            sev.listenTo(this, 'switchSlide', sev.toggle);
            if(e){
                sev.requestSlideSwitch(sev);
            }
        },
        addSlide: function(slide) {
            
        },
        switchSlide: function(slide) {
           this.trigger('switchSlide', slide);
        },
        showStory: function(e) {
            if($('#show-story').text()=='show story') {
                $('#slide-editors').fadeOut();
                $('.slideCanvas').show();
                $('#show-story').html('edit story');                
            } else {
                $('#slide-editors').fadeIn();
                $('.slideCanvas').hide();
                $('#show-story').html('show story');                
            }
        }
    });
    
    app = new App(backend_story_id);
    
    app.searchEngine = {        
        searchImages: function(query, callback, start) {
            if(arguments.length==2)
                start = 1;
            app.searchCallback = callback;
            if(!query || !query.length)return;
			//if(!imgtype){
            var assoc = {
                "@":"photo",
                "#":"clipart",
                "*":"lineart",
                "%":"face",
            }
            //start with any
            imgtype = "any";
            var imgtypeSelector = query.match(/^[^a-zA-Z]/g);
            var fileType  = "";
            var imgSize = "xxlarge";
            if(imgtypeSelector && assoc[imgtypeSelector]){
                imgtype = assoc[imgtypeSelector];
                if(imgtypeSelector=="#"){
                    fileType = "png";
                }
                if(imgtypeSelector!="@"){
                    imgSize="medium";
                }
            }
			
			//} 
			//if it starts with a non-alpha char
			if(query.match(/^[^a-zA-Z]/g)){
				//delete first char
				query = query.substring(1);
			}
			
			var selectedImgType = imgtype!="any"?("&imgType="+imgtype):"";
			var selectedFileType = fileType!=""?("&fileType="+fileType):"";
			var selectedImgSize = imgSize!=""?("&imgSize="+imgSize):"";
			var theUrl = "https://www.googleapis.com/customsearch/v1?"
							+"q="+query
							+"&searchType=image"
							+ selectedImgType
							+ selectedFileType  
							+ selectedImgSize  
							+"&callback=searchCallback"
                            +"&start="+start
							+"&googlehost=www.google.com"
							+"&cx=018375217190222075462%3A4cmnq_yzkf8&key=AIzaSyChf-DwlkffjAR_9NIBjGRKSkRv3r8PegU"; 
			$.ajax({
				url: theUrl, 
				// The name of the callback parameter, as specified by the YQL service
				jsonp: "searchCallback",
				// Tell jQuery we're expecting JSONP
				dataType: "jsonp", 
				// Work with the response
				success: function( response ) {
					//console.log( "success response", response ); // server response
				}
			});           
            
        }        
    }
    
});

function searchCallback(param) {
    app.searchCallback.call(this, param.items);
    //console.log(param);
}