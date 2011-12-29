function doLatitude( id, elem ) {
	var url = "http://www.google.com/latitude/apps/badge/api";
	var data = $.param({
		user: id,
		type: "json"
	});
	var full_url = url + "?" + data;

	$.yql(
		"SELECT features.properties.reverseGeocode FROM json WHERE url=@url",
		{
			url: "http://www.google.com/latitude/apps/badge/api?" + $.param({
				user: id,
				type: "json"
			})
		},
		function( data ) {
			if( data.query.results.json.features == null ) {
				elem.replaceWith($("<span/>", {
					style: "font-style: italic;"
				}).html("location unavailable"));
				return;
			}
			elem.replaceWith(data.query.results.json.features.properties.reverseGeocode);
		},
		function( _, textStatus, errorThrown ) {
			elem.replaceWith(textStatus + ": " + errorThrown);
		}
	);
}
