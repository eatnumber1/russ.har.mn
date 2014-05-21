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
		<a class="comments" href="{{ post.url }}#disqus_thread" data-disqus-identifier="{{ post.id }}">View Comments</a>
	</p>
	<span class="excerpt">{{ post.excerpt | markdownify }}</span>
</div>
{% endfor %}

{% comment %}
<!-- TODO: re-add when I have more than ten posts -->
<p>
	<a href="past.html">Older Posts →</a>
</p>
{% endcomment %}

{% unless site.disqus_shortname == null %}
<script type="text/javascript">
	var disqus_shortname = '{{ site.disqus_shortname }}';

	(function () {
		var s = document.createElement('script'); s.async = true;
		s.type = 'text/javascript';
		s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
		(document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
	}());
</script>
{% endunless %}

{% comment %}
vim: ft=liquid sw=4 ts=4 sts=4 tw=80 noet
{% endcomment %}
