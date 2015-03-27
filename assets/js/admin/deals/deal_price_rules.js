$(document).ready(function() {
	
	/* RULE PRICE */
	
	DealPriceRule   = Backbone.Model.extend({	
		initialize: function() {			
			this.formulaPrices = new FormulaPriceCollection;
			this.parseFormula();
		},
		
		parseFormula: function() {
		
			var formula = arguments.length ? arguments[0] : this.get('formula');
			
			if(formula.length>0) {
				var parts = formula.split('+');
				for(var i in parts) {
					var aux = parts[i].split('*');
					var multiplier = aux[0];
					var priceIdentifier = aux[1].replace('{', '').replace('}', '');
					if(priceIdentifier.charAt(0) == 't') {
						/* if the identifiers begin with "t" then we are adding a variation of another deal.
						This means that the formula will not contain price IDs, nor will it contain backbone-generated cid-s. It will include server-side, temp-generated tid-s */
						var searchResult = app.dealPrices.where({tempID: priceIdentifier});
						if(searchResult.length>0) {
							var priceModel = searchResult[0];
						}
					} else 
						var priceModel = app.dealPrices.get(parseInt(priceIdentifier));
					this.addPrice(priceModel, multiplier);
				}
			}
		},
		
		addPrice: function(priceModel) {
			var rp = new FormulaPrice({
				priceModel: priceModel,
				multiplier: arguments.length == 2 ? arguments[1] : 1
			});
			this.formulaPrices.add(rp);			
			this.listenTo(rp, 'removeFromFormula', this.removeFormulaPrice);
			this.listenTo(rp, 'updateFormula', this.updateFormula);
			this.listenTo(rp, 'change', this.updateFormula);
			this.updateFormula();
		},
		
		removeFormulaPrice: function(formulaPriceModel) {	
			this.formulaPrices.remove(formulaPriceModel);	
			this.updateFormula();
		},
		
		updateFormula: function() {
			var parts = [];
			for(var i in this.formulaPrices.models) 
				parts.push(this.getFormulaFromModel(this.formulaPrices.models[i]));
			this.set('formula', parts.join('+'));
			this.trigger('formulaUpdated', parts.join('+'));
		},
		
		getFormulaFromModel: function(pm) {
			return pm.get('multiplier') + '*' + '{' + pm.get('priceModel').get('identifier') + '}';
		}
	});
	
	DealPriceRules = Backbone.Collection.extend({
		model: DealPriceRule,
		
		suggestPattern: function() {		
			return '';		
		},
		
		setCurrentRule: function(model) {
			this.currentRule = model;
		},
		
		addPriceToCurrentRule: function(priceModel) {
			this.currentRule.addPrice(priceModel);
		}		
	});	
	
	DealPriceRuleView = BaseView.extend({
		tagName: 'div',
		className: 'dealPriceRule',
		template: _.template($('#deal-price-rule-template').html()),
		priceViews: [],
		events: {
			'click .delete': 'removeRule',
			'click': 'selectRule'
		},
		initialize: function() {
			this.listenTo(this.model.formulaPrices, 'add', this.addPrice);
			this.listenTo(this.model, 'formulaUpdated', this.updateFormula);
		},
		render:	function() {		
			_.each(this.priceViews, this.removePrice);
			this.priceViews = [];
			this.$el.html(this.template(this.model.toJSON()));
			this.model.formulaPrices.each($.proxy(this.addPrice, this));
			return this;
		},
		removeRule: function(e) {			
			if(confirm('Are you sure you want to delete this price rule?')) {
				app.dealPriceRules.remove(this.model);
				this.dispose();
			}
			e.preventDefault();			
		},
		selectRule: function() {
			$('.dealPriceRule').removeClass('dealPriceRuleCurrent');
			this.$el.addClass('dealPriceRuleCurrent');
			app.dealPriceRules.setCurrentRule(this.model);
		},
		addPrice: function(newFormulaPrice) {
			var fpv = new FormulaPriceView({model: newFormulaPrice});
			this.$('.prices').append(fpv.render().el);
			this.priceViews.push(fpv);
		},
		removePrice: function(fpv) {
			fpv.dispose();			
		},
		updateFormula: function(newFormula) {
			this.$('.ruleFormula').val(newFormula);
		}
	});
	
	/* Formula Prices (each rule has a formula, comprised of prices) */
	
	FormulaPrice = Backbone.Model.extend({
	
		initialize: function() {
			this.syncData();
			this.listenTo(this.get('priceModel'), 'change', this.syncData);
			this.listenTo(this.get('priceModel'), 'removeFromEverywhere', this.removeFromEverywhere);
		},
		
		syncData: function() {
			this.set({
				label:         this.get('priceModel').get('label'), 
				currency_name: this.get('priceModel').get('currency_name'),
				val:           this.get('priceModel').get('val')
			});
		},
		
		removeFromEverywhere: function() {
			this.removeFromFormula();
			this.trigger('removeFromEverywhere');
		},
		
		removeFromFormula: function() {
			console.log('formulapricemodel: remove from formula');
			this.trigger('removeFromFormula', this);
		}
		
	});
	
	FormulaPriceCollection = Backbone.Collection.extend({
		model: FormulaPrice
	})
	
	
	FormulaPriceView = BaseView.extend({
		tagName: 'span',
		className: 'tagLabel tag',
		template: _.template($('#rule-price-template').html()),
		events: {	
			'click .x': 'removePriceFromRule',
			'keyup .multiplier': 'updateMultiplier',
		},
		initialize: function() {
			this.listenTo(this.model, 'removeFromEverywhere', this.dispose);
			this.listenTo(this.model.get('priceModel'), 'change', this.render);
		},			
		render:	function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		removePriceFromRule: function(e) {
			this.model.removeFromFormula();
			this.dispose();
			e.preventDefault();
		},
		updateMultiplier: function() {
			this.model.set('multiplier', this.$('.multiplier').val());
		}
	});
		
	app.dealPriceRules = new DealPriceRules;
		
	if(typeof(existingPriceRules)!='undefined') {
		for(var j=0; j<existingPriceRules.length; j++) {
			app.addDealPriceRule(existingPriceRules[j]);
		}
	}
});