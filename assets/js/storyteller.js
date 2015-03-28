$(document).ready(function() {
    
    var Tag = Backbone.Model.extend({
        setImageList: function(images, activateFirst) {
            console.log('setting image list', images);
            this.images = images;
            if(activateFirst) {
                this.setImage(this.images[0]);
            }
        },
        setImage: function(image) {
            console.log('setting image', image);
            this.set('image_url', image);
        }
    });
    
    var Tags = Backbone.Collection.extend({
        model: Tag
    })
        
    var Slide = Backbone.Model.extend({

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
        render: function() {            
			this.$el.html(this.template({tag: this.model.toJSON()}));	            
			return this;
        },
        showImageSelector: function(e) {
            e.stopPropagation();            
            app.imageSelector.setCurrentTag(this.model);
            app.imageSelector.open(this.$el.offset());
            console.log('xx');
        }
    })
    
    var SlideEditView = Backbone.View.extend({
        tagName: 'li',
        className: 'panel panel-default',
        template: _.template($('#slide-editor-template').html()),
        render: function() {            
			this.$el.html(this.template({slide: this.model.toJSON()}));			
            this.$('textarea').keypress($.proxy(this.processText, this));
			return this;
        },        
        processText: function(e) {
            switch(e.keyCode) {
                case 32:
                case 44:
                case 46:
                case 33:
                case 63:
                    var words = $('textarea').val().match(/\S+\s*/gi);
                    for(var i in words) {
                        w = words[i].replace(/[^a-z0-9@#\-_]+/gi,"");
                        switch(w.charAt(0)) {
                            case '@':
                            case '#':
                                if(!('tags' in this.model))
                                    this.model.tags = new Tags();
                                
                                if(!this.model.tags.findWhere({label: w})) {
                                    var t = new Tag({label: w});
                                    this.model.tags.add(t); 
                                    var tv = new TagView({model: t});
                                    this.$('.tags').append(tv.render().el);
                                    
                                    app.searchEngine.searchImages(w.substring(1), function(data) {
                                         t.setImageList(data, true);
                                    });
                                    
                                    
                                }
                                                                
                                break;
                        }
                    }
                    break;
            }
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
            console.log('images', images);
            for(var i in images) {
                var v = new ImageSelectorItemView(images[i]);
                this._views.push(v);
                this.$('.items').append(v.render().el);
                this.listenTo(v, 'imageSelected', $.proxy(this.imageSelected, this));
                console.log('image added');
            }
        },
        clear: function() {
            for(var i in this._views)
                this._views[i].remove();
        },
        imageSelected: function(image) {
            this.currentTag.setImage(image);
        },
        setCurrentTag: function(t){
            console.log('setting current tag to:' + t.get('label'));
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
        initialize: function() {
            this.slides = new Slides();            
            this.imageSelector = new ImageSelector();  
            this.$('#add-slide').on('click', $.proxy(this.addBlankSlide, this));          
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
            console.log('addSlide');
            var s = new Slide({text: ''});
            this.slides.add(s);
            var sev = new SlideEditView({model: s});
            var sv = new SlideView({model: s});
            $('#slide-editors').append(sev.render().el);
        },
        addSlide: function(slide) {
            
        }
    });
    
    app = new App();
    
    app.searchEngine = {        
        searchImages: function(keyword, callback) {
            callback.call(this, [
                {url: "http://2.bp.blogspot.com/-lkzAjJ7mjxQ/UaL27IWJ0hI/AAAAAAAABnw/SwPK3Xkhqt8/s400/new-african-animals-you-are-viewing-the-jungle-scenes-named-palms-it-has-205911.jpg"},
                {url: "http://images.wisegeek.com/jungle-and-rainforest.jpg"}
            ]) 
        }        
    }
});