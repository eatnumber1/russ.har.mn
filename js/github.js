function github_latest( count, username, elem, excludes ) {
	var id_idx = 0, argmap = {};
	$.yql(
		"SELECT repository.name, repository.url, repository.description, repository.pushed-at FROM github.user.repos WHERE id=@id" +
		excludes.map(function( elem, idx ) {
			var ret = "", argname = "name" + id_idx++;
			if( idx == 0 ) ret += " AND repository.name NOT IN ( ";
			ret += "@" + argname;
			if( idx == excludes.length - 1 ) ret += " )";
			argmap[argname] = elem;
			return ret;
		}).join(", ") +
		" | sort(field='repository.pushed-at', descending='true') | truncate(count=@count)",
		$.extend({
			id: username,
			count: count
		}, argmap),
		function( data ) {
			elem.find("#github_loading").remove();
			var list = elem.find("#github_list");
			data.query.results.repositories.forEach(function( d ) {
				d = d.repository;
				if( excludes.indexOf(d.name) != -1 ) return;
				$("<li/>")
					.append(
						$("<a/>", { href: d.url })
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
