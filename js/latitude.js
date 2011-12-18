function doLatitude( id, elem ) {
	var url = "http://www.google.com/latitude/apps/badge/api";
	var data = $.param({
		user: id,
		type: "json"
	});
	var full_url = url + "?" + data;
	$.ajax({
		url: "http://query.yahooapis.com/v1/public/yql",
		dataType: "jsonp",
		data: {
			q: "SELECT * FROM json WHERE url='" + full_url + "'",
			format: "json"
		},
		success: function( data ) {
			if( data.query.results.json.features == null ) {
				elem.replaceWith($("<span/>", { style: "font-style: italic;" }).html("location unavailable"));
			} else {
				elem.replaceWith(data.query.results.json.features.properties.reverseGeocode);
			}
		},
		error: function( _, textStatus, errorThrown ) {
			elem.replaceWith(textStatus + ": " + errorThrown);
		}
	});
}