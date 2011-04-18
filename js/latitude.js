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
			elem.html(data.query.results.json.features.properties.reverseGeocode);
		},
		// TODO: Error handling
	});
}
