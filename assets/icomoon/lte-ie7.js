/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'rfcicomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'rfcicon-cog' : '&#xe000;',
			'rfcicon-star' : '&#xe001;',
			'rfcicon-checkmark-circle' : '&#xe002;',
			'rfcicon-flag' : '&#xe003;',
			'rfcicon-info' : '&#xe004;',
			'rfcicon-arrow-left' : '&#xe005;',
			'rfcicon-arrow-left-2' : '&#xe006;',
			'rfcicon-arrow-left-3' : '&#xe007;',
			'rfcicon-arrow-left-4' : '&#xe008;',
			'rfcicon-pencil' : '&#xe009;',
			'rfcicon-cancel-circle' : '&#xe00a;',
			'rfcicon-plus-alt' : '&#xe00b;',
			'rfcicon-airplane' : '&#xe00c;',
			'rfcicon-calendar' : '&#xe00d;',
			'rfcicon-menu' : '&#xe00e;',
			'rfcicon-help' : '&#xe00f;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/rfcicon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};