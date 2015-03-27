$(document).ready(function() {
	
	
	DealPrice    = Backbone.Model.extend({
		initialize: function() {
			this.set('identifier', (typeof(this.id) == 'undefined' || this.id==0) ? this.cid : this.id );
		},
		removeFromEverywhere: function() {
			this.trigger('removeFromEverywhere');
		}
		
	});
	
	DealPrices = Backbone.Collection.extend({
		model: DealPrice
	});	
	
	DealPriceView = BaseView.extend({
		tagName: 'div',
		className: 'form-inline dealPriceRow',
		template: _.template($('#deal-price-template').html()),
		events: {	
			'click .delete': 'removeDealPrice',
			'change .priceType': 'updateLabel',
			'change .priceCurrency': 'updateModel',
			'keyup .priceLabel': 'updateModel',
			'keyup .priceValue': 'updateModel'
		},
		initialize: function() {				
			
		},	
		render:	function() {		
			var template_data = this.model.toJSON();
			this.$el.html(this.template(template_data));
			this.$('.priceType').val(this.model.get('type'));
			this.$('.priceCurrency').val(this.model.get('currency_id'));
			this.$('.pricePaidAt').val(this.model.get('paid_at'));
			this.updateLabel();
			return this;
		},
		removeDealPrice: function(e) {
			this.model.removeFromEverywhere();
			app.dealPrices.remove(this.model);
			this.dispose();
			e.preventDefault();			
		},
		updateLabel: function(e) {			
			var new_value = this.$('.priceType').val();
			this.$('.priceLabel').val(this.$('.priceType option[value="' + new_value + '"]').html());
			this.updateModel();
		},
		updateModel: function() {
			this.model.set('label', this.$('.priceLabel').val());
			this.model.set('val', this.$('.priceValue').val());
			this.model.set('currency_name', this.$('.priceCurrency option[value="' + this.$('.priceCurrency').val() + '"]').html());
		}
	});
	
	DealPriceSelectView = BaseView.extend({
		tagName: 'span',
		className: 'tagLabelFull tag',
		template: _.template($('#deal-price-select-template').html()),
		events: {	
			'click': 'addPriceToRule'
		},
		initialize: function() {
			this.listenTo(this.model, 'removeFromEverywhere', this.dispose);
			this.bindTo(this.model, 'change', this.render);
		},	
		render:	function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		addPriceToRule: function() {
			app.dealPriceRules.addPriceToCurrentRule(this.model);
		}
	});
		
	app.dealPrices = new DealPrices;
	
	if(typeof(existingPrices)!='undefined') {
		for(var i=0; i<existingPrices.length; i++) {
			app.addDealPrice(existingPrices[i]);
		}
	}
});