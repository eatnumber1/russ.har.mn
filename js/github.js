function github_latest( count, username, elem ) {
	$.yql(
		"SELECT repository.name, repository.url, repository.description, repository.pushed-at FROM github.user.repos WHERE id=@id | sort(field='repository.pushed-at', descending='true') | truncate(count=@count)",
		{
			id: username,
			count: count
		},
		function( data ) {
			elem.find("#github_loading").remove();
			var list = elem.find("#github_list");
			data.query.results.repositories.forEach(function( d ) {
				d = d.repository;
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
