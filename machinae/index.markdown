---
layout: machinae-main
title: Home
section: Home

feed: atom.xml
---

# Thoughts on Elegant Computing

_Machinae Elegantiam_ is [Russ Harmon](/)'s blog on technology, computing,
programming, and anything else computer related he cares to post.

## Recent Posts

{% for post in site.categories.machinae limit: 10 %}
<div class="section list">
	<h1>{{ post.date | date_to_string }}</h1>
	<p class="line">
		<a class="title" href="{{ post.url }}">{{ post.title }}</a>
		<a class="comments" href="{{ post.url }}#disqus_thread">View Comments</a>
	</p>
	<p class="excerpt">{{ post.excerpt }}</p>
</div>
{% endfor %}

{% comment %}
<!-- TODO: re-add when I have more than five posts -->
<p>
	<a href="past.html">Older Posts →</a>
</p>
{% endcomment %}

<script type="text/javascript">
//<![CDATA[
(function() {
		var links = document.getElementsByTagName('a');
		var query = '?';
		for(var i = 0; i < links.length; i++) {
			if(links[i].href.indexOf('#disqus_thread') >= 0) {
				query += 'url' + i + '=' + encodeURIComponent(links[i].href) + '&';
			}
		}
		document.write('<script type="text/javascript" src="http://disqus.com/forums/markreid/get_num_replies.js' + query + '"></' + 'script>');
	})();
//]]>
</script>

{% comment %}
vim: ft=liquid sw=4 ts=4 sts=4
{% endcomment %}
