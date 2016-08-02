function github_latest( count, username, elem, excludes ) {
	var id_idx = 0, argmap = {};
	$.yql(
		/* TODO(eatnumber1): Delete this custom repo spec when https://github.com/yql/yql-tables/pull/478 is accepted. */
		"USE 'https://raw.githubusercontent.com/eatnumber1/yql-tables/9dfd26064c4a3d2ea9fad3bcdf1086f2b2c2e836/github/github.user.repos.xml' AS github.user.repos;" +
		"SELECT json.name, json.html_url, json.description, json.pushed_at FROM github.user.repos(0) WHERE id='" + username + "'" +
		excludes.map(function( elem, idx ) {
			var ret = "", argname = "name" + id_idx++;
			if( idx == 0 ) ret += " AND json.name NOT IN ( ";
			ret += "@" + argname;
			if( idx == excludes.length - 1 ) ret += " )";
			argmap[argname] = elem;
			return ret;
		}).join(", ") +
		" | sort(field='json.pushed_at', descending='true') | truncate(count=@count)",
		$.extend({count: count}, argmap),
		function( data ) {
			elem.find("#github_loading").remove();
			var list = elem.find("#github_list");
			data.query.results.json.forEach(function( d ) {
				d = d.json;
				if( excludes.indexOf(d.name) != -1 ) return;
				$("<li/>")
					.append(
						$("<a/>", { href: d.html_url })
							.append(d.name)
					).append(": " + d.description)
					.appendTo(list);
			});
		},
		function( _, textStatus, error ) {
			elem.replaceWith(textStatus + ": " + error.toString());
			return;
		}
	);
}
