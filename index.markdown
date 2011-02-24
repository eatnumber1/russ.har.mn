---
layout: main
title: Russell Harmon
section: Home
---

+-- {.section}
# Blog
I periodically post to a programming blog entitled
_[Machinae Elegantiam](/machinae)_.
{% for post in site.categories.machinae limit: 3 %}
<ul class="compact recent">
	<li>
		<a href="{{ post.url }}" title="{{ post.excerpt }}">{{ post.title }}</a>
		<span class="date">{{ post.date | date_to_string }}</span>
	</li>
</ul>
{% endfor %}
=--

+-- {.section}
# [Twitter](http://twitter.com/eatnumber1)
Contacting Twitter...
{: #twitter_update_list }
=--

+-- {.section}
# [Reading](http://librarything.com/home/eatnumber1)
Contacting LibraryThing...
{: .LT_Preload }
<div id="{{ site.librarything_id }}"> </div>
=--

{% comment %}
vim: ft=liquid sw=4 ts=4 sts=4 tw=80
{% endcomment %}
