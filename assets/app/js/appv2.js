function buttonLoading(selector) {
    var el = $(selector);
    if (el.data('state') == 'loading')
        return;
    el.data('resetText', el.html()).data('state', 'loading').html(el.data('loading-text')).attr('disabled', 'disabled').addClass('disabled');
}

function buttonReset(selector) {
    var el = $(selector);
    if (el.data('state') == 'loading')
        el.data('state', '').html(el.data('resetText')).removeClass('disabled').removeAttr('disabled');
}

$(document).ready(function() {

    $.ajaxSetup({
        dataFilter: function(data) {
            if (data.toString() == '"login_timeout"') {
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
            'is_default': true,
            'name': 'default.png',
            'ninepatch': false,
            'screens': ['home', 'launcher']
        },
        initialize: function() {
            this.setUrl();

            try {
                if (this.get('filename').match(/\.9\.(png|gif)/i)) {
                    this.set('ninepatch', true);
                    new NinePatch(this.get('url'), $.proxy(this.setInitial9PatchDataCollection, this));
                }
            } catch (e) {

            }
        },
        setUrl: function() {
            if (this.version == 1)
                this.version = (new Date()).getTime();
            this.version = this.version + 10;
            var resource_base_url = app.theme.get('resources_url');
            this.set('url', resource_base_url + '/' + this.get('folder') + '/' + this.get('filename') + '?r=' + this.version);
        },
        update: function(filename) {
            this.set('filename', filename);
            this.set('is_default', false);
            this.setUrl();

            if (filename.match(/\.9\.(png|gif)/i)) {
                this.set('ninepatch', true);
                new NinePatch(this.get('url'), $.proxy(this.triggerRefreshAfter9PatchDataCollection, this));
            } else {
                this.set('ninepatch', false);
                this.trigger('refresh');
            }

        },
        setInitial9PatchDataCollection: function(ninePatchData) {
            this.set('ninePatchData', ninePatchData);
        },
        triggerRefreshAfter9PatchDataCollection: function(ninePatchData) {
            this.set('ninePatchData', ninePatchData);
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
        array_template: _.template($('#array_resource_template').html()),
        events: {
            'click .ignore': 'requestSwitchIgnore',
            'click img': 'triggerRefresh'
        },
        initialize: function(data) {
            this.model = data.model;
            this.$el.hover(_.bind(this.mouseover, this), _.bind(this.mouseout, this));
            this.listenTo(this.model, 'remove', _.bind(this.remove, this));
            this.listenTo(this.model, 'refresh', _.bind(this.render, this));
            this.listenTo(this.model, 'change:ignore', _.bind(this.switchIgnore, this));
        },
        triggerRefresh: function(e) {
            this.model.trigger('refresh');
            e.preventDefault();
            e.stopPropagation();
        },
        render: function() {
            switch (this.model.get('type')) {
                case 'array':
                    this.$el.html(this.array_template($.extend(this.model.toJSON(), {id: this.model.id})));
                    this.$('.create-new').on('click', _bind(this.createNewResource, this));
                    break;
                case 'color':
                    this.$el.html(this.color_template($.extend(this.model.toJSON(), {id: this.model.id})));
                    this.colorInput = this.$('[data-plugin="colorpicker"]');
                    this.colorInput.colorpicker({format: 'argb'});
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
            app.trigger('changeResourceColor', {resource_id: this.model.id, color: e.color.toRGB()});
        },
        saveColor: function(e) {
            this.model.trigger('saveColor', {resource_id: this.model.id, color: ColorUtils.rgbaToHex(e.color.toRGB())});
        },
        requestSwitchIgnore: function(e) {
            var ignore = this.$('.ignore').is(':checked');
            this.model.trigger('switchIgnore', {resource_id: this.model.id, ignore: ignore});
            e.preventDefault();
            e.stopPropagation();
        },
        switchIgnore: function(data) {
            //console.log(typeof(this.model.get('ignore')));

            if (this.model.get('ignore') == true) {
                this.$('.ignore').prop('checked', true);
                //console.log('ON', this.$('.ignore').is(':checked'));
            } else {
                this.$('.ignore').prop('checked', false);
                //console.log('OFF', this.$('.ignore').is(':checked'));
            }
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

            this.el = $('[data-resource="' + this.model.id + '"]').get();
            this.$el = $(this.el);
            if (this.$el.size() == 0) {
                this.$el = $('[data-resource-mask="' + this.model.id + '"]');
                if (this.$el.size() > 0)
                    this.isMask = true;
            }
            this.listenTo(this.model, 'refresh', _.bind(this.renderIfVisible, this));

            this.listenTo(this.model, 'highlight', _.bind(this.highlight, this));
            this.listenTo(this.model, 'removehighlight', _.bind(this.remove_highlight, this));

            this.listenTo(this.model, 'remove', _.bind(this.remove, this));
        },
        highlight: function() {
            var position = this.$el.offset();
            if (typeof (position) != 'undefined') {
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
            if (this.highlightBox)
                this.highlightBox.remove();
        },
        showFolderResources: function() {
            app.showFolderResources(this.model.get('folder'));
        },
        renderIfVisible: function() {
            if (this.$el.is(':visible')) {
                this.render();
            }
        },
        render: function() {

            this.remove_highlight();

            var width = this.model.get('width') * app.device.get('scale_factor');
            var height = this.model.get('height') * app.device.get('scale_factor');
            _.each(this.el, function(el, index) {
                el.setAttribute('data-width', width);
                el.setAttribute('data-height', height);
                el.setAttribute('data-display', el.style.display);
            });

            this.$el.removeAttr('style');

            var url = this.model.get('url');

            var ninepatch = this.model.get('ninepatch');

            if (ninepatch && this.model.get('force_ninepatch')) {
                _.each(this.el, function(el, index) {
                    el.setAttribute('data-width', $(el).outerWidth());
                    el.setAttribute('data-height', $(el).outerHeight());
                });
            }
            if (this.$el.size() > 0) {

                _.each(this.el, function(el, index) {
                    el.style.width = el.getAttribute('data-width') + 'px';
                    el.style.height = el.getAttribute('data-height') + 'px';
                    el.style.display = el.getAttribute('data-display');
                });

                if (this.$el.prop('tagName').toLowerCase() == 'img') {
                    if (ninepatch) {
                        this.$el.on('load', _.bind(this.convertTo9Patch, this));
                    }

                    if (this.isMask) {
                        this.$el.css('-webkit-mask', 'url(' + url + ') top left / cover');
                    } else {
                        this.$el.attr('src', url);
                    }
                } else {
                    if (ninepatch) {

                        /*
                         var tmpImg = $('<img />');
                         tmpImg.on('load', _.bind(this.simple9Patch, this));
                         
                         this.$el.css({"background": 'url(' + url + ')'});
                         tmpImg.attr('src', url);
                         */
                        this.simple9Patch(url);
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
            this.$el.replaceWith('<div class="' + this.$el.attr('class') + '" id="' + this.$el.attr('id') + '" data-resource="' + this.model.id + '" style="width: ' + width + 'px; height: ' + height + 'px;"></div>');
            this.el = $('[data-resource="' + this.model.id + '"]').get();
            this.$el = $(this.el);
            this.$el.css({
                "background-image": 'url(' + url + ')'
            });
            _.each(this.el, function(el, index) {
                new NinePatch(el);
            });
        },
        simple9Patch: function(imageUrl) {
            var ninePatchData = this.model.get('ninePatchData');
            _.each(this.el, function(el, index) {
                new NinePatch(el, _.extend({'imageUrl': imageUrl}, ninePatchData));
            });
            this.keepColor();
        },
        keepColor: function() {
            var color_resources = [];
            _.each(this.el, function(el, index) {
                var color_resource = el.getAttribute('data-color');
                if (typeof (color_resource) != 'undefined' && color_resource) {
                    try {
                        app.setColor({
                            color: app.theme.resources.get(color_resource).get('color'),
                            resource_id: color_resource
                        });
                    } catch (e) {

                    }
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
            //console.log('color updated');
            //console.log(data);
            if (data.success) {
                this.resources.get(data.resource_id).set('value', data.color);
                this.resources.get(data.resource_id).set('color', data.color);
            }
        },
        switchResourceIgnore: function(data) {
            $.post(
                    PAGE_DATA.base_url + '/app/switch_resource_ignore',
                    {theme_id: this.id, resource_id: data.resource_id, ignore: data.ignore},
            _.bind(this.onSwitchResourceIgnore, this),
                    'json'
                    );
        },
        onSwitchResourceIgnore: function(data) {
            if (data.success) {
                var ignore = data.ignore;
            } else {
                var ignore = data.ignore == true ? false : true;
            }
            this.resources.get(data.resource_id).set('ignore', ignore);
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
            this.screens.home = new HomeScreen({device: this.device});
            this.screens.launcher = new LauncherScreen({device: this.device});

            this.$el.hover(_.bind(this.mouseover, this), _.bind(this.mouseout, this));
        },
        mouseover: function() {
            $('.resource_highlight').remove();
        },
        mouseout: function() {
        },
        placeResource: function(res) {
            if (res.get('folder') === 'app_icons' && $('#apps > ul > li').size() < 16) {
                $('#apps > ul').append(_.template($('#icon_template').html(), {id: res.id, label: res.get('iconLabel')}));
            }
            if (res.get('folder') === 'homescreen_menu_icons') {
                var selected = false;
                if ($('#bottom_menu_options1 li').size() < 4) {
                    if ($('#bottom_menu_options1 li').size() == 3)
                        selected = true;
                    $('#bottom_menu_options1').append(_.template($('#bottom_option_template').html(), {id: res.id, label: res.get('iconLabel'), selected: selected}));
                } else {
                    if ($('#bottom_menu_options2 li').size() < 3) {
                        $('#bottom_menu_options2').append(_.template($('#bottom_option_template').html(), {id: res.id, label: res.get('iconLabel'), selected: selected}));
                    } else {
                        if ($('#bottom_menu_options2 li').size() < 4) {
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
        },
        createResource: function() {

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
            this.listenTo(app, 'runInteraction', this.toggleCurrent);
        },
        render: function() {
            this.$el.html(this.template(this.data));
            return this;
        },
        runInteraction: function() {
            app.hide_copyright_info();
            app.runInteraction(this.data.interaction_id);
        },
        toggleCurrent: function(e) {
            if (e.current_interaction == this.data.interaction_id) {
                this.$el.addClass('current');
            } else {
                this.$el.removeClass('current');
            }
        }
    });

    var AppView = Backbone.View.extend({
        theme: null,
        folders: [],
        interactionViews: [],
        demoIcons: [
            {iconLabel: 'Amazon MP3', file_url: 'AmazonMP3.png'},
            {iconLabel: 'Google Car', file_url: 'GoogleCar.png'},
            {iconLabel: 'Kindle', file_url: 'Kindle.png'},
            {iconLabel: 'Android', file_url: 'Android.png'},
            {iconLabel: 'Candy Crush Saga', file_url: 'CandyCrushSaga.png'},
            {iconLabel: 'Google Goggles', file_url: 'GoogleGoggles.png'},
            {iconLabel: 'Notes', file_url: 'Notes.png'},
            {iconLabel: 'Android2', file_url: 'Android2.png'},
            {iconLabel: 'Photoshop', file_url: 'Photoshop.png'},
        ],
        el: 'body',
        events: {
            'click #newTheme': 'newTheme',
            'click #testTheme': 'testTheme',
            'click  #testNewTheme': 'testNewTheme',
            'click  #cancelTestTheme': 'cancelTestTheme',
            'submit #testThemeForm': 'testNewTheme',
            'click #editTheme': 'editTheme',
            'click #loadTheme': 'loadTheme',
            'click #createNewTheme': 'createNewTheme',
            'submit #newThemeForm': 'createNewTheme',
            'click #updateTheme': 'updateTheme',
            'submit #editThemeForm': 'updateTheme',
            'click #refreshVisible': 'refreshVisibleResources',
            'click #loadSelectedTheme': 'load_selected_theme',
            'click #downloadTheme': 'download_theme',
            'click #showCopyrightInfo': 'show_copyright_info',
            'click #saveCopyrightInfo': 'save_copyright_info'
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

                    for (var index = 0; index < files.length; index++) {
                        var file = files[index] || {error: 'Empty file upload result'};
                        _this.theme.updateResourceByName(file.name);
                    }

                    data.context.each(function(index) {
                        var node = $(this);
                        $(this).removeClass('in');

                        if ($.support.transition && node.is(':visible')) {
                            node.bind(
                                    $.support.transition.end,
                                    function(e) {
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
            $('#fileupload').bind('fileuploadsubmit', function(e, data) {
                data.formData = {theme_id: that.theme.id};
            });


            this.listenTo(this, 'changeResourceColor', _.bind(this.setColor, this));

        },
        setColor: function(data) {

            if (typeof (data.color) == 'string')
                data.color = ColorUtils.hexToRGBA(data.color);

            if (typeof (data.color) != 'undefined') {

                this.$('[data-color="' + data.resource_id + '"]').css('color', ColorUtils.rgbaCSS(data.color));
                this.$('[data-background-color="' + data.resource_id + '"]').css('background-color', ColorUtils.rgbaCSS(data.color));

                this.$('[data-text-shadow-color="' + data.resource_id + '"]').each(function(index, e) {
                    DOMUtils.changeShadowColor(e, 'text-shadow', data.color);
                });

                this.$('[data-box-shadow-color="' + data.resource_id + '"]').each(function(index, e) {
                    DOMUtils.changeShadowColor(e, 'text-shadow', data.color);
                });

            }
        },
        start: function() {
            $.post(PAGE_DATA.base_url + '/app/get_existing_themes', {}, _.bind(this.add_existing_themes, this));
            if ('theme_id' in PAGE_DATA) {
                $.post(PAGE_DATA.base_url + '/app/load_theme', {action: 'load_theme', id: PAGE_DATA.theme_id}, _.bind(this.setup_theme_editor, this), 'json');
            }
        },
        add_existing_themes: function(list) {
            for (i in list) {
                $('<option value="' + list[i].id + '">' + list[i].name + ' (' + list[i].launcher + ')</option>').data('theme', list[i]).appendTo('#themeLoader');
            }
            //$('#themeLoader').change(_.bind(this.load_selected_theme, this));
        },
        load_selected_theme: function(e) {
            var theme_id = $('#themeLoader').val();
            location.href = PAGE_DATA.base_url + '/app/theme/' + theme_id;
            /*
             this.theme = new Theme($('[value="' + theme_id + '"]').data('theme'));
             this.device.setTheme(this.theme);		
             buttonLoading('#loadSelectedTheme');
             $.post(PAGE_DATA.base_url + '/app/load_theme', {action: 'load_theme', id: $('#themeLoader').val()}, _.bind(this.setup_theme_editor, this), 'json');
             */
        },
        reset_theme_editor: function() {
            $('#demoapps > ul > li').remove();
            this.theme.resources.each(function(res) {
                res.trigger('remove');
            });
            _.each(this.folders, function(folderView) {
                folderView.remove();
            });

            _.each(this.interactionViews, function(interactionView) {
                interactionView.remove();
            });
        },
        setup_theme_editor: function(config, status) {

            buttonReset('#loadSelectedTheme');
            buttonReset('#createNewTheme');
            buttonReset('#reloadTheme');

            $('#themeTitle .theme-name').html(config.theme.name);
            $('#themeTitle .theme-status').html(config.theme.status).attr('class', 'theme-status label-' + config.theme.status);
            $('#themeOptions').show();

            $('#editor').show();
            $('#loading').show();
            $('.modal').modal('hide');

            var that = this;
            if (status == 'success') {

                this.theme = new Theme(config.theme);
                this.device.setTheme(this.theme);

                config = config.editor;

                if (!('deviceSize' in config)) {
                    config.deviceSize = '360x600';
                }
                $('#device').addClass('device' + config.deviceSize);

                if (config.deviceSize == '480x800') {
                    $('#editor > div:first-child').removeClass('span3').addClass('span4');
                    $('#editor > div:last-child').removeClass('span3').addClass('span2');
                }

                this.reset_theme_editor();

                if ($('#demo_icon_template').size() > 0) {
                    $.each(this.demoIcons, function(index, icon) {
                        icon.url = PAGE_DATA.base_url + '/assets/app/img/icons/' + icon.file_url;
                        var icon_html = _.template($('#demo_icon_template').html(), icon);
                        $('#demoapps > ul').append(icon_html);
                    });
                }

                //add interactions
                this.interactions = config.interactions;
                $.each(this.interactions, function(action_id, action) {
                    var trigger_parts = action.trigger.split(' ');
                    switch (trigger_parts[0]) {
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
                        if ("type" in res_data && res_data.type != 'temporary') {
                            switch (res_data.type) {
                                case 'auto':
                                    break;
                                case 'color':
                                    folderview.addResource(that.theme.resources.get(res));
                                    that.theme.listenTo(that.theme.resources.get(res), 'saveColor', _.bind(that.theme.updateColor, that.theme));
                                    break;
                                case 'array':
                                    folderview.addResource(that.theme.resources.get(res));
                                    break;
                            }
                        } else {
                            that.deviceView.placeResource(that.theme.resources.get(res));
                            that.theme.listenTo(that.theme.resources.get(res), 'switchIgnore', _.bind(that.theme.switchResourceIgnore, that.theme));
                            ;
                            folderview.addResource(that.theme.resources.get(res));
                        }
                    });
                    that.folders.push(folderview);
                });

                //set colors
                that.theme.resources.each(function(res) {
                    if (res.get('type') == 'color' && res.get('value') && res.get('value').length > 0) {
                        that.theme.resources.get(res.id).set('color', res.get('value'));
                        that.trigger('changeResourceColor', {resource_id: res.id, color: res.get('value')});
                    }
                });

                //this.runInteraction(this.default_interaction);

                $('#loading-seconds').html('10');
                var secondsTimer = setInterval(function() {
                    var seconds = parseInt($('#loading-seconds').html());
                    seconds--;
                    $('#loading-seconds').html(seconds);
                }, 1000);

                setTimeout(function() {
                    that.runInteraction(that.default_interaction);
                    clearInterval(secondsTimer);
                    $('#loading').hide();
                }, 0);

            }
        },
        runInteraction: function(e) {
            var interaction_id = '';
            if (typeof (e) == "string") {
                interaction_id = e;
            } else {
                interaction_id = e.data;
            }
            var that = this;
            switch (interaction_id) {
                case 'hideall':
                    $("[fragment]").hide();
                    break;
                case 'show':
                case 'hide':
                    if (arguments.length > 1) {
                        var fragments = arguments[1];
                        for (var i = 0; i < fragments.length; i++) {
                            $(fragments[i])[interaction_id]();
                        }
                    }
                    break;
                default:
                    if (interaction_id in this.interactions) {
                        $.each(this.interactions[interaction_id].actions, function(index, action) {
                            if (typeof (action) == "string") {
                                that.runInteraction(action);
                            } else {
                                for (var i in action) {
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
            if (interaction_id in this.interactions) {
                this.current_interaction = interaction_id;
                this.trigger('runInteraction', {current_interaction: interaction_id});
                this.refreshVisibleResources();
            }
        },
        refreshVisibleResources: function() {
            /* var that = this;
             if(this.current_interaction != undefined) {
             $.each(this.interactions[this.current_interaction].folders, function(index, folder) {
             //console.log('Show resources from folder: ' + folder);
             that.theme.resources.each(function(res){
             if(res.get('folder')==folder) {
             //console.log('Rereshing ' + res.get('id'));
             //console.log(res.toJSON());
             res.trigger('refresh');
             }
             });
             });			 
             }*/
            this.theme.resources.each(function(res) {
                if (res.get('ninepatch') === true)
                    res.trigger('refresh');
            });
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
            $('#editThemeForm input[type="text"], #editThemeForm input[type="hidden"], #editThemeForm select').each(function(index, element) {
                var prop = $(element).attr('name');
                if (prop.indexOf('settings') === 0) {
                    var settings_prop = prop.replace('settings[', '');
                    settings_prop = settings_prop.replace(']', '');
                    var value = that.theme.get('settings')[settings_prop];
                } else {
                    var value = that.theme.get(prop);
                }
                $(element).val(value);
            });
        },
        testTheme: function() {
            $('#testThemeForm').find('select').each(function(index, el) {
                var existing = simpleStorage.get('testThemeForm-' + $(el).attr('name'));
                if (existing) {
                    $(el).val(existing);
                }
            });

            $('#testThemeModal').modal('toggle');
        },
        testNewTheme: function() {
            $('#testThemeError').toggleClass('in');
            $('#testThemeForm').show();
            var newThemeData = $('#testThemeForm').serialize();
            buttonLoading('#testNewTheme');
            $('#testThemeError').html('Making batch');
            
            $('#testThemeForm').find('select').each(function(index, el) {
                simpleStorage.set('testThemeForm-' + $(el).attr('name'), $(el).val());
            });

            $.post(PAGE_DATA.base_url + '/app/test_theme/' + this.theme.id, newThemeData, _.bind(this.onTestNewTheme, this), 'json');
            return false;
        },
        resetTestForm: function() {
            $('#testThemeForm').show();
            $('#progressbar').hide();
            $('#testThemeError').hide();
        },
        cancelTestTheme: function() {
            clearInterval(this.testNewThemeInterval);
            this.resetTestForm();
            buttonReset('#testNewTheme');
        },
        onTestNewTheme: function(data) {
            var that = this;
            
            if (data.success) {
                $('#progressbar').show();
                // we have the batch id, 10% done
                that.updateTestThemeProgressBar(10);
                $('#testThemeError').addClass('in').html('Making projects');
            
                that.socket = io.connect(window.location.origin + ":8080");
                that.socket.on('progresschange', function(step) {
                    that.updateTestThemeProgressBar(step);
                });
                
                that.socket.on('messagereceived', function(message) {
                    $('#testThemeError').show().html(message);
                });
                
                that.socket.on('finisherror', function(error) {
                    $('#testThemeError').show().html("Finished with errors! Check <a href=\"/download/batch-"+data.id+"/"+that.theme.id+"/output/errorlog.txt\" target=\"_new\">error log</a>");
                });
                
                that.testNewThemeInterval = setInterval(function() {
                    console.log('update progress bar')
                    that.updateTestThemeProgressBar();
                }, 1000);
                
                that.socket.emit('buildprojects', new Object({batch_id: data.id}));
                
            } else {
                buttonReset('#testNewTheme');
                $('#testThemeError').html(data.error).addClass('in');
            }
        },
        updateTestThemeProgressBar: function(step) {
            var that = this,
                progressBar = $('#progressbar .bar');
            
            if (step === undefined) {
                step = progressBar.data('step') + 5;
                
                if (step > 90) {
                    clearInterval(that.testNewThemeInterval);
                }
            } else if (parseInt(step) === 100) {
                clearInterval(that.testNewThemeInterval);
                $('#progressbar').hide();
            }
            
            progressBar
                .data('step', step)
                .css('width', step + "%")
                .text(step + "% complete");
        },
        testNewThemeProgressBar: function(batch_id) {
            var that = this;
            $.get(PAGE_DATA.base_url + '/app/test_theme_progress/' + batch_id, function(resp) {
                
                

                if (resp.step == 100) {
                    clearInterval(that.testNewThemeInterval);
                    if (resp.error !== undefined) {
                        $('#testThemeError').html(
                                $('<a>')
                                .attr('target', '_blank')
                                .attr('href', resp.error)
                                .text('Finished with errors')
                                );
                    }
                }
            }, 'json');
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
            if (data.success) {
                location.href = PAGE_DATA.base_url + '/app/theme/' + data.themedata.id;
                /*
                 this.theme = new Theme(data.themedata);
                 this.device.setTheme(this.theme);		
                 $.post(PAGE_DATA.base_url + '/app/load_theme', {id: this.theme.id}, _.bind(this.setup_theme_editor, this), 'json');
                 $('#newThemeModal').modal('hide');
                 */
            } else {
                buttonReset('#createNewTheme');
                $('#createThemeError').html(data.error).addClass('in');
            }
        },
        onUpdateTheme: function(data) {
            if (data.success) {
                this.theme = new Theme(data.themedata);
                this.device.setTheme(this.theme);
                $.post(PAGE_DATA.base_url + '/app/load_theme', {action: 'load_theme', id: this.theme.id}, _.bind(this.setup_theme_editor, this), 'json');
                $('#editThemeModal').modal('hide');
                buttonReset('#updateTheme');
            } else {
                buttonReset('#updateTheme');
                $('#editThemeError').html(data.error).addClass('in');
            }
        },
        download_theme: function() {
            window.open(PAGE_DATA.base_url + '/app/download/' + this.theme.id);
        },
        show_copyright_info: function(e) {
            $('#copyrightInfo').val(this.theme.get('copyright_info'));
            $('#folders').hide();
            $('#folders_header').hide();
            $('#copyrightInfoForm').show();
            $('#folders_header').hide();
        },
        hide_copyright_info: function(e) {
            $('#copyrightInfoForm').hide();
            $('#folders').show();
            $('#folders_header').show();
        },
        save_copyright_info: function(e) {
            var data = $('#copyrightInfoForm').serialize() + '&id=' + this.theme.id;
            $.post(PAGE_DATA.base_url + '/app/update_copyright_info', data, $.proxy(this.onSaveCopyrightInfo, this));
            buttonLoading('#saveCopyrightInfo');
        },
        onSaveCopyrightInfo: function(data) {
            buttonReset('#saveCopyrightInfo');
            if (data.success) {
                this.theme.set('copyright_info', data.copyright_info);
                $('#copyrightInfo').val(data.copyright_info);
                alert('Saved!');
            } else {
                alert(data.error);
            }
        }
    });


    var app = new AppView;
    app.start();

});