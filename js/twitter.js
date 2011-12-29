function twitter_latest( user, elem ) {
	$.yql(
		"SELECT status.text, status.created_at, status.id FROM twitter.user.timeline(0,1) WHERE screen_name=@username | sanitize(field='status.text')",
		{ username: user },
		function( data ) {
			if( data.query.results == null ) {
				elem.replaceWith(
					$("<p/>", { style: "font-style: italic;" })
						.html("timeline unavailable")
				);
				return;
			}
			data = data.query.results.statuses.status;
			elem.replaceWith(
				$("<p/>")
					.append($("<span/>").append(data.text))
					.append(" ")
					.append(
						$("<a/>", {
							style: "font-size: 85%",
							href: "http://twitter.com/" + user + "/statuses/" + data.id
						}).append(
							$("<abbr/>", {
								class: "timeago",
								title: data.created_at
							}).append(
								$.timeago(data.created_at)
							)
						)
					)
			);
		},
		function( _, textStatus, error ) {
			elem.replaceWith(textStatus + ": " + error.toString());
		}
	);
}

function twitterCallback( tweets ) {
	$("#twitter_update_list").removeAttr("class");
	return twitterCallback2(tweets);
}
