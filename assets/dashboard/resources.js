$(document).ready(function() {
    
    var ResourceItemView = Backbone.View.extend({
        template: _.template($('#resource_item').html()),
        tagName: 'tr',
        initialize: function(data) {
            this.data = data;
        },
        render: function() {
            this.$el.html(this.template({resource: this.data}));
            return this;
        }
    });
    
    var ConfigItemView = Backbone.View.extend({
        template: _.template($('#config-item').html()),
        tagName: 'tr',
        initialize: function(data) {
            this.data = data;
        },
        render: function() {
            this.$el.html(this.template({item: this.data, resource_id: this.cid}));
            
            if (this.data.id !== undefined) { 
                this.$el.attr('data-id', this.data.id);
            }
            
            this.$el.find('option[value=' + this.data.type + ']').attr('selected', 'selected');
            return this;
        }
    });
    
    $('h1 a').click(function(e){
        $(this).toggleClass('btn-primary').toggleClass('btn-info').toggleClass('open');
        $('.panel.settings').toggle(500);
    });
    
    $('#configItems').on('click', 'tr a.btn-danger', function(e){
        $(this).parents('tr').remove();
    });
    
    $('#configItems').on('click', 'tr a.btn-primary', function(e){
        var $r = new ConfigItemView(new Object({item: '', 'type': ''}));
        var $el = $(this).parents('tr').after($r.render().el);
        $el.next().find("[type=checkbox].switch").bootstrapSwitch();
    });
    
    $('body').on('submitOk', '.settings form', function(e, resp){
        if (resp.success) {
            $('.api-auto-call').trigger('load');
        }
    });
    
    $.each(configs, function(index, r){
        var $r = new ConfigItemView(r);
        $('#configItems').append($r.render().el);
    });
    
    $.each(resources, function(index, r){
        var $r = new ResourceItemView(r);
        $('table tbody tr.last').before($r.render().el);
    });
    
});