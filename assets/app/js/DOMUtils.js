var DOMUtils = {

	changeShadowColor: function(element, shadow_property, rgba) {
		if(typeof(rgba)!='string')
			rgba = ColorUtils.rgbaCSS(rgba);
			  
		var old_shadow = $(element).css(shadow_property) || '';
		if(old_shadow.length > 0) {
			var parts = old_shadow.match(/(-?\d+px)|(rgba?\(.+\))/g);	
			if(parts) {
				parts.shift();
				new_shadow = parts.join(' ') + ' ' + rgba;
				$(element).css(shadow_property, new_shadow);
			} else {
				console.log('error parsing shadow from CSS', old_shadow);
			}
		} else {
			console.log('.css error: Default ' + shadow_property + ' not set for ', element);
		}
	}

}