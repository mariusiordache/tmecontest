$(document).ready(function() {

    var SettingsView = Backbone.View.extend({
        template: _.template($('#settings-button').html()),
        tagName: 'span',
        events: {
            'click a': 'toogleValue'
        },
        toogleValue: function(e) {
            var that = this;
            that.popupid = $(e.currentTarget).attr('aria-describedby');
                        
            $.post('/resources/toggleSettingsValue/' + that.item.item + '/' + that.item.value, function(resp){
                if (resp.success) {
                    that.item.value = resp.data.value;
                    that.render();
                    
                    userSettings[that.item.item].value = resp.data.value;
                }
            }, 'json');
        },
        initialize: function(data) {
            this.item = data;
        },
        render: function() {
            this.$el.html(this.template({item: this.item}));
            if (this.popupid !== undefined) {
                $('#' + this.popupid).remove();
            }
            
            this.$el.find('a[data-toggle="popover"]').popover({trigger: 'hover','placement': 'bottom'});
            return this;
        }
    });
    
    var Status = Backbone.View.extend({
        template: _.template($('#resource_status').html()),
        tagName: 'span',
        events: {
            'click a': 'toogleStatus'
        },
        toogleStatus: function() {
            var that = this;
            $.post('/resources/toggleStatus/' + that.resource.id + '/' + that.resource.status, function(resp){
                if (resp.success) {
                    that.resource.status = resp.data.status;
                    that.render();
                } else {
                    $('#main-alert-box').html(resp.error).show(500);
                    setTimeout(function(){
                        $('#main-alert-box').hide(500);
                    }, 5000);
                    
                }
            }, 'json');
        },
        initialize: function(data) {
            this.resource = data;
        },
        render: function() {
            this.$el.html(this.template({resource: this.resource}));
            return this;
        }
    });
    
    var DropdownItemView = Backbone.View.extend({
        template: _.template($('#dropdown-item').html()),
        tagName: 'li',
        events: {
            'click a': 'add'
        },
        add: function() {
            appendTab(this.data);

            this.$el.remove();

            if ($('.dropdown-menu').children().length == 0) {
                $('li.dropdown').remove();
            }
        },
        initialize: function(data) {
            this.data = data;
        },
        render: function() {
            this.$el.html(this.template({config: this.data}));
            return this;
        }
    });
    
    var UploadingItemHiddenView = Backbone.View.extend({
        template: _.template($('#uploading-item-hidden').html()),
        tagName: 'tr',
        className: 'template-upload fade',
        initialize: function(data) {
            this.data = data;
        },
        render: function() {
            this.$el.hide();
            this.$el.html(this.template({file: this.data}));
            return this;
        }
    });
    
    var UploadingItemView = Backbone.View.extend({
        template: _.template($('#uploading-item').html()),
        tagName: 'tr',
        className: 'template-upload fade in',
        initialize: function(data) {
            this.data = data;
        },
        render: function() {
            this.$el.html(this.template({file: this.data}));
            return this;
        }
    });
    
    var ResourceFileView = Backbone.View.extend({
        template: _.template($('#resource-file').html()),
        tagName: 'tr',
        initialize: function(data) {
            this.data = data;
        },
        render: function() {
            this.$el.attr('id', 'resource-' + this.data.id);
            this.$el.html(this.template({item: this.data}));
            return this;
        }
    });
    
    var ResourceColorView = ResourceFileView.extend({
        template: _.template($('#resource-color').html())
    });
    
    var ResourceStringView = ResourceFileView.extend({
        template: _.template($('#resource-string').html())
    });

    var TabPaneView = Backbone.View.extend({
        template: _.template($('#tab-pane-clone').html()),
        className: 'tab-pane',
        initialize: function(data) {
            this.data = data;

        },
        render: function() {
            this.$el.html(this.template({config: this.data}));
            this.$el.attr('id', 'config-' + this.data.id);

            return this;
        }
    });

    var TabItemView = Backbone.View.extend({
        template: _.template($('#tab-item').html()),
        tagName: 'li',
        initialize: function(data) {
            this.data = data;
        },
        render: function() {
            this.$el.html(this.template({config: this.data}));
            return this;
        }
    });
    
    var AttributeItemView = Backbone.View.extend({
        template: _.template($('#attribute-item').html()),
        tagName: 'tr',
        initialize: function(data) {
            this.data = data;
        },
        render: function() {
            this.$el.html(this.template({item: this.data, id: this.cid}));
            return this;
        }
    });

    $.each(configs, function(index, c) {
        if (items[c.id] === undefined) {
            var $dc = new DropdownItemView(c);
            $('ul.dropdown-menu').append($dc.render().el);
        } else {
            appendTab(c);
        }
    });
    
    var AppStatus = new Status(resource);
    $('h1').append(AppStatus.render().el);

    $('ul.nav-tabs li:first').addClass('active');
    $('.tab-content .tab-pane:first').addClass('active');

    $('body').on('click', '.template-upload a.delete', function(e) {
        $(this).parents('tr').remove();
    });
    
    $('form[id^=fileupload] table thead').on('change', 'input[type=checkbox]', function(e) {
        $(this).parents('table').find('input[type=checkbox]').prop('checked', $(this).prop('checked'));
    });
    
    function appendTab(c) {
        var $ti = new TabItemView(c);
        $('ul.nav-tabs .dropdown').before($ti.render().el);
        var $tp = new TabPaneView(c);
        $('#mainTabs').append($tp.render().el);

        if (items[c.id] !== undefined) {
            $.each(items[c.id], function(index, item) {
                var $item;
                switch(item.type) {
                    case 'file':
                        $item = new ResourceFileView(item);
                        break;
                    case 'color':
                        $item = new ResourceColorView(item);
                        break;
                    default:
                        $item = new ResourceStringView(item);
                        break;
                }
                
                $('#config-' + item.config_id + ' .db-' + item.type).append($item.render().el);
            });
        }
    
        $('#fileupload-' + c.id).fileupload({
            url: $('#fileupload-' + c.id).attr('action'),
            autoUpload: true,
            disableImageResize: true,
            maxFileSize: 500000000,
            progressall: function(e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .bar').css(
                    'width',
                    progress + '%'
                );
            },
            start: function(e) {
                $(this).find('.upload-preview').show()
            },
            done: function(e, data) {
                
                if (data.result && $.isArray(data.result.files)) {
                    files = data.result.files;
                } else {
                    files = [];
                }
                
                var $parent = data.context.parent();
                data.context.remove();
                
                var autoupload = parseInt(userSettings['autoupload'].value) === 1;
                
                $.each(files, function(index, file){
                    var $f;
                    if (!autoupload) {
                        $f = new UploadingItemView(file);
                    } else {
                        $f = new UploadingItemHiddenView(file);
                    }
                    
                    $parent.append($f.render().el);
                });
                
                
                if (autoupload) {
                    $(this).find('.upload-items').trigger('click');
                }
                
            }
        });
        
    }
    
    $('body').on('submitOk', 'form.addColorForm', function(e, resp){
        appendOrReplace(e, new ResourceColorView(resp.item), $('#config-' + resp.item.config_id + ' .db-color'));
    });
    
    $('body').on('submitOk', 'form.addStringForm', function(e, resp){
        appendOrReplace(e, new ResourceStringView(resp.item), $('#config-' + resp.item.config_id + ' .db-string'));
    });
    
    function appendOrReplace(e, $item, $parent) {
        var $form = $(e.currentTarget);
        $form.find('input,select,textarea').val('');
        
        if (!$('#resource-' + $item.data.id).length) {
            $parent.append($item.render().el);
        } else {
            $('#resource-' + $item.data.id).replaceWith($item.render().el);
        }
    }
    
    $('#packfilesbtn').click(function(){
        $.get('/resources/pack/' + resource.id, function(resp){
            
            if (resp.success) {
                $('#main-alert-box').html('Pack finished succesfully').addClass('alert-success').removeClass('alert-danger');
                $('#packfilesbtn').hide();
            } else {
                $('#main-alert-box').html(resp.error).addClass('alert-danger').removeClass('alert-success');
            }
            
            $('#main-alert-box').show(500);
            setTimeout(function(){
                $('#main-alert-box').hide(500);
            }, 5000);
                    
        }, 'json');
    });
    
    $('body').on('click', '.tab-pane tr .glyphicon-remove', function(){
        var row = $(this).parents('tr');
        var id = $(this).parent().attr('data-item-id');
        
        $.get('/resources/delete/' + id, function(resp){
            if (resp.success === true) {
                if (row.parents('table.table').hasClass('db-file')) {
                    $('#packfilesbtn').show();
                }
                row.remove();
            } else {
                alert(resp.error);
            }
        }, 'json');
    });
    
    $('body').on('click', '.upload-preview .upload-items', function(){
        var uploadContainer = $(this).parents('.upload-preview');
        
        uploadContainer.find('.template-upload').each(function(index, el) {
            var that = $(this);
            that.css('opacity', 0.3);
            var config_id = that.parents('.upload-preview').find('input[name=config_id]').val();
            $.post('/resources/saveUpload/' + resource.id + '/' + config_id, that.find('input').serialize(), function(items){
                that.remove();
                
                $.each(items, function(index, item) {
                    var $item = new ResourceFileView(item);
                    if (item.existing) {
                        $('#resource-' + item.id).replaceWith($item.render().el);
                    } else {
                        $('#config-' + config_id + ' .db-file').append($item.render().el);
                    }
                });
                
                if (uploadContainer.find('.template-upload').length == 0) {
                    uploadContainer.hide();
                }
                
                $('#packfilesbtn').show();
                
            }, 'json');
        });
    });
    
    $.each(userSettings, function(index, el){
        var $s = new SettingsView(el);
        $('.upload-settings').append($s.render().el);
    });
    
    
    $.each(attributes, function(index, el){
        var $s = new AttributeItemView(el);
        $('#attributes-table').append($s.render().el);
    });
    
    $('#attributes-table').on('click', 'tr a.btn-danger', function(e){
        $(this).parents('tr').remove();
    });
    
    $('#attributes-table').on('click', 'tr a.btn-primary', function(e){
        var $r = new AttributeItemView(new Object({item: '', 'type': ''}));
        var $el = $(this).parents('tr').after($r.render().el);
    });

});