$.widget('ui.tagImageSelector', {    
    _changed: false,
    
    _create: function(){
        var that = this,
        $element = that.element;
        
        $element.find('input[name^=bills_count]').bind('keyup', function(e){
           var num = $(this).attr('name').match(/([0-9]+)/g);
           var $total = $element.find('input[name="bills_totals['+num+']"]');
           var $value = $element.find('input[name="bills_value['+num+']"]').val();
           $total.val($(this).val() * $value);
           that._recalculate();
        });
    },
    
    _populateImages:function(images) {
        for(var i in images) {
            var v = new ImageSelectorItemView(images[i]);
            this.element.find('.tags').append(v.render().el);
            this.element.on(v, );
        }
        this.element.trigger('sumUpComplete')
    }
    
    _selectImage:function(image) {
        
        
    }
    
})


