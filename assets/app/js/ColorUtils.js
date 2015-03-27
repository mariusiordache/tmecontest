var ColorUtils = {

	hexvals: ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"],

	rgbaToHex: function(rgba) {
		var rgb = [rgba.r, rgba.g, rgba.b];
		var a = rgba.a;
		
		var c, current;
		var hexColor = '';
		for (c = 0; c < 3; c++) {
			// RGB
			current = parseInt(rgb[c], 10);
			if (current < 0) {
				current = 0;
			} else if (current > 255) {
				current = 255;
			}
			// division gives us the first hex component and the modulo gives us the second
			hexColor += this.numToHex(current);
		}
					
		a = parseFloat(a, 10);

		if (a < 0) {
			a = 0;
		} else if (a > 1) {
			a = 1;
		}
		a = a * 255;

		return ('#' + this.numToHex(a) + hexColor).toLowerCase();
	},

	numToHex: function(num) {
		return this.hexvals[parseInt((num / 16), 10)] + this.hexvals[parseInt((num % 16), 10)]; 
	},

	hexToNum: function(hex) {
		return parseInt(hex, 16);
	},
	
	hexToAlphaNum: function(hex) {
		return (this.hexToNum(hex)/255).toFixed(2);
	},

	hexToRGBA: function(hex) {
		hex = hex.replace('#', '');
		
		if(hex.length == 6 || hex.length == 8) {
			if(hex.length==6)
				hex = 'FF' + hex;
			
			return {
				r: this.hexToNum(hex.substr(2, 2)),
				g: this.hexToNum(hex.substr(4, 2)),
				b: this.hexToNum(hex.substr(6, 2)),			
				a: this.hexToAlphaNum(hex.substr(0,2))
			};
		}
		return hex;	
	},
	
	rgbaCSS: function(rgba) {		
		return 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';		
	}
	
}