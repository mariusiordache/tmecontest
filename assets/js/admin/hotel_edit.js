function map_init() {
	var latitude  = $('#latitude').val() || -33.8665433;
	var longitude = $('#longitude').val() || 151.1956316;

	var hotel_position = new google.maps.LatLng(latitude,longitude);
	
	geocoder = new google.maps.Geocoder();
	
	hotel_map = new google.maps.Map(document.getElementById('hmap'), {
	  mapTypeId: google.maps.MapTypeId.ROADMAP,
	  center: hotel_position,
	  zoom: 15,
	  draggable: true
	});
	
	addMarker(hotel_position);
	
	google.maps.event.addListener(hotel_map, 'click', function(event) {	
		if(typeof(marker)!=='undefined')
			marker.setMap(null);
		addMarker(event.latLng);
		$('#latitude').val(event.latLng.lat());
		$('#longitude').val(event.latLng.lng());
	});
}

function addMarker(location) {
	marker = new google.maps.Marker({
		position: location,
		map: hotel_map
	});
}

function onGeocodeResults(results, status) {
	if (status == google.maps.GeocoderStatus.OK) {
        hotel_map.setCenter(results[0].geometry.location);
     } else {
        $('#map-notice').html("Geocode was not successful for the following reason: " + status);
     }
}

google.maps.event.addDomListener(window, 'load', map_init);

function onSearchHotelResults(response) {
	console.log(response);
	for (var i = 0; i < response.items.length; i++) {
		var item = response.items[i];
		// in production code, item.htmlTitle should have the HTML entities escaped.
		document.getElementById("hotelResults").innerHTML += _.template($('#hotelResultTemplate').html(), item);
	}
	$('#hotelResultsDialog').dialog({width: 620, height: 400, zIndex:10000, buttons: {Done: function() { $( this ).dialog( "close" ); }}});
	
	$('#fetchLinksButton').setState('loaded');
}

function search_hotel_links() {
	$('#fetchLinksButton').setState('loading');	
	var search_url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyCamvIYhsNAmCb3cMkAuHhIIWZeUKrQRHA&cx=012693665334095345735:drk_oqffnso&q='+ escape($('input[name="label"]').val()) + '%20' + escape($('#location_name').html()) +'&callback=onSearchHotelResults';
	if($('#googleCustomSearch').length==0) {
		$('body').append('<script id="googleCustomSearch" src="' + search_url + '"></script>');
	} else {
		$('#googleCustomSearch').attr('src', search_url);
	}
}

function fetch_remote_data() {
	$('#fetchDataButton').setState('loading');
	$.post('/admin/hotels/ajax_fetch_remote_details', {booking_com_url: $('#booking_com_url').val(), tripadvisor_url: $('#tripadvisor_url').val()}, function(response) {
		$('#booking_com_rating').val(response.booking_rating);
		$('#tripadvisor_rating').val(response.tripadvisor_rating);
		$('#latitude').val(response.latitude);
		$('#longitude').val(response.longitude);
		$('#address').val(response.address);
		$('#starButton' + parseInt(response.stars)).trigger('click');
		$('#booking_com_name').html('Booking.com: ' + response.booking_com_name);
		$('#tripadvisor_name').html('TripAdvisor.com: ' + response.tripadvisor_name);
		
		var hotel_position = new google.maps.LatLng(response.latitude,response.longitude);
		addMarker(hotel_position);		
        hotel_map.setCenter(hotel_position);
		$('#fetchDataButton').setState('loaded');
	});	
}

function setHotelLink(e) {
	var hotel_link = $(e).data('link');
	if(hotel_link.indexOf('booking.com')>=0) {
		$('#booking_com_url').val(hotel_link);
		$('#hotelResults tr').each(function() {
			if($(this).find('button').data('link').indexOf('booking.com')>=0)
				$(this).fadeTo(300, 0.5);
		});
	} else 
	if(hotel_link.indexOf('tripadvisor.com')>0){
		$('#tripadvisor_url').val(hotel_link);
		$('#hotelResults tr').each(function() {
			if($(this).find('button').data('link').indexOf('tripadvisor.com')>=0)
				$(this).fadeTo(300, 0.5);
		});
	}
}

$(document).ready(function() {
	
	$('#fetchLinksButton').click(search_hotel_links);
	$('#fetchDataButton').click(fetch_remote_data);
	
	$('#hotelLocationSelector').TagSelector({ 	
		context: 'tag_relation',
		select: function (event, ui) {
			$('#location_name').html(ui.item.label);
			$('#location_id').val(ui.item.id);
			$('.search').val('');
		}
	});	
	
	/*
	$('.search').each(function() {		
		$(this).autocompleter({
			ajax: {
				url: $(this).data('source'),
				add_url: $(this).data('add-url'),
				displayField: 'name',
				valueField: 'id',
				triggerLength: 1
			},
			updater: function(item) {
				var relation = this.$element.data('relation');
				$('#' + relation).val(item[this.options.ajax.valueField]);
				$('#' + relation + '_name').html(item[this.options.ajax.displayField]);
				geocoder.geocode({'address': item[this.options.ajax.displayField]}, onGeocodeResults)
				return '';
			}
		});					
	});
	*/
	$('#streetsearch').keydown(function(e){
		if(e.which==13) {
			console.log($(this).val() + ', ' + $('#location_name').html());
			geocoder.geocode({'address': $(this).val() + ', ' + $('#location_name').html()}, onGeocodeResults);
			e.preventDefault();
			e.stopPropagation();
		}
	});
	
	$('[data-plugin="radiobuttons"]').each(function() {
		$(this).children('button').data('radio_field', $(this).data('relation')).click(function() {
			$('#' + $(this).data('radio_field')).val($(this).data('value'));
		});
	});
	
	$('#search_booking').click(function() {
		window.open('https://www.google.ro/search?q=booking.com' + '%20' + escape($('input[name="name"]').val()) + '%20' + escape($('#location_id_name').html()));
	});
	
	$('#search_tripadvisor').click(function() {
		window.open('https://www.google.ro/search?q=tripadvisor.com' + '%20' + escape($('input[name="name"]').val()) + '%20' + escape($('#location_id_name').html()));
	});
});