function github_latest( count, username, elem ) {
	var fetch = function( count, username, elem, page, cur, cont ) {
		$.ajax({
			url: "https://api.github.com/users/" + username + "/repos",
			dataType: "jsonp",
			data: {
				type: "public",
				page: page,
				per_page: 100
			},
			success: function( d ) {
				if( d.meta['X-RateLimit-Remaining'] == 0 ) {
					elem.html(d.data.message);
					return;
				}
				var link = d.meta['Link'];
				var data = cur.concat(d.data);
				if( link != null && link.filter(function( elem ) {
					return elem[1].rel == "next";
				}).length != 0 ) {
					return fetch(count, username, elem, page + 1, data, cont)
				} else {
					return cont(data);
				}
			},
			// TODO: Error handling
		});
	};
	fetch(count, username, elem, 1, [], function( data ) {
		data.sort(function( l, r ) {
			var ldate = new Date(l.pushed_at);
			var rdate = new Date(r.pushed_at);
			if( ldate > rdate ) return -1;
			if( ldate < rdate ) return 1;
			return 0;
		});
		data = data.slice(0, count);
		console.log(data);

		elem.find("#github_loading").remove();
		var list = elem.find("#github_list");
		data.forEach(function( d ) {
			$("<li/>")
				.append(
					$("<a/>", {
						href: d.html_url
					})
					.append(d.name)
				)
				.append(": " + d.description)
				.appendTo(list);
		});
	});
}
