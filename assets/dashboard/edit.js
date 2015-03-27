$(document).ready(function() {

    $("[type=checkbox].switch").bootstrapSwitch();

    var Status = Backbone.View.extend({
        template: _.template($('#app_status').html()),
        tagName: 'span',
        events: {
            'click a': 'toogleStatus'
        },
        toogleStatus: function() {
            var that = this;
            $.post('/app/toggleStatus/' + that.app.id + '/' + that.app.status, function(resp){
                if (resp.success) {
                    that.app.status = resp.data.status;
                    that.render();
                }
            }, 'json');
        },
        initialize: function(data) {
            this.app = data;
        },
        render: function() {
            this.$el.html(this.template({app: this.app}));
            return this;
        }
    });
    
    var TypeView = Backbone.View.extend({
        template: _.template($('#app_type').html()),
        tagName: 'tr',
        initialize: function(data) {
            this.data = data;
        },
        render: function() {
            this.$el.html(this.template({type: this.data}));
            return this;
        }
    });
    
    var AppStatus = new Status(app);
    $('h1').append(AppStatus.render().el);
    
    
    $.each(app_types, function(index, type){
        var $t = new TypeView(type);
        $('table tbody tr.last').before($t.render().el)
    });
    
    $('form[name=apptype]').on('submitOk', function(e, resp) {
        var type = resp.data;
        type.id = resp.id;
        type.quota = 0;
        type.count = 0;
        
        var $t = new TypeView(type);
        $('table tbody tr.last').before($t.render().el)
    });
});