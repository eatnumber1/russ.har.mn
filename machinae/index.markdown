---
layout: default
title: Machinae Elegantiam
section: Home
---

+-- {.section}
{% assign first_post = site.posts.first %}
# [{{ first_post.title }}]({{ first_post.url }})
{{ first_post.content }}
[Read More »]({{ first_post.url }})
=--

+-- {.section}
# recent posts
{% for post in site.posts limit: 7 %}
* [{{ post.title }}]({{ post.url }})
{% endfor %}
=--

{% comment %}
vim: ft=liquid sw=4 ts=4 sts=4
{% endcomment %}
