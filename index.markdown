---
layout: top
title: Home
section: Home
---

![Photo of Russ Harmon](/images/russ_harmon.jpg){: .inset .right width=150}

Welcome
=======

I'm Russ Harmon, a mid-twenties American programmer. What you see below is some
ramblings by me about myself or other things. Look if you want to.

+-- {.section}
# Academics
The main focus of my work at the moment is the completion of my studies at the
[Rochester Institute of Technology](http://www.rit.edu/) which I attend as a
full-time student. Studying computer science, I hope to complete my studies at
the end of February, 2012.
=--

+-- {.section}
# Code
The vast majority of my work can be found at my
[GitHub](https://github.com/eatnumber1) page. What you can see below is the five
most recent projects I've worked on at GitHub.
<div id="github_{{ site.github_username }}">
	<span id="github_loading">(loading)</span>
	<ul class="compact recent" id="github_list"/>
</div>
=--

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
![](http://www.google.com/talk/service/badge/Show?tk=z01q6amlq69k34bqdpiumkcmscad4d6g93v358un157gamspjobu1q8jikb4chn8fqjjsvq3mhc8ihhq60hgbu4iq7g1a7ffmvi0u9s8ch94d2qgpp2ssbepstoj19p3lu8eaaq4msnfksfrll6a6iqsaiddia4j40eatqt1r&amp;w=9&amp;h=9){: height="9" width="9"}
[Chat with Russell Harmon](http://www.google.com/talk/service/badge/Start?tk=z01q6amlq69k34bqdpiumkcmscad4d6g93v358un157gamspjobu1q8jikb4chn8fqjjsvq3mhc8ihhq60hgbu4iq7g1a7ffmvi0u9s8ch94d2qgpp2ssbepstoj19p3lu8eaaq4msnfksfrll6a6iqsaiddia4j40eatqt1r){: target="_blank" title="Click here to chat with Russell Harmon"}
=--

+-- {.section}
# Latitude
I'm currently located in <span id="{{ site.latitude_id }}">(loading)</span>
=--

+-- {.section}
# [Twitter](http://twitter.com/eatnumber1)
Contacting Twitter...
{: #twitter_update_list }
=--

{% comment %}
vim: ft=markdown sw=4 ts=4 sts=4 tw=80
{% endcomment %}
