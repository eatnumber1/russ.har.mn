---
layout: main
title: Home
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
# Chat
You can chat with me via _xmpp_ and Google's chatback widget.
<br/>
<img height="9" width="9" style="padding:0 2px 0 0;margin:0;border:none" src="http://www.google.com/talk/service/badge/Show?tk=z01q6amlq69k34bqdpiumkcmscad4d6g93v358un157gamspjobu1q8jikb4chn8fqjjsvq3mhc8ihhq60hgbu4iq7g1a7ffmvi0u9s8ch94d2qgpp2ssbepstoj19p3lu8eaaq4msnfksfrll6a6iqsaiddia4j40eatqt1r&amp;w=9&amp;h=9" alt="">
<a href="http://www.google.com/talk/service/badge/Start?tk=z01q6amlq69k34bqdpiumkcmscad4d6g93v358un157gamspjobu1q8jikb4chn8fqjjsvq3mhc8ihhq60hgbu4iq7g1a7ffmvi0u9s8ch94d2qgpp2ssbepstoj19p3lu8eaaq4msnfksfrll6a6iqsaiddia4j40eatqt1r" target="_blank" title="Click here to chat with Russell Harmon">Chat with Russell Harmon</a>
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
