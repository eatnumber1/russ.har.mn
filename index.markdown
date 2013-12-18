---
layout: top
title: Home
section: Home
changefreq: always
link:
    - rel: canonical
      href: /

---

![Photo of Russ Harmon](/images/russ_harmon.jpg){: .inset .right width=150 }

Welcome
=======

I'm Russ Harmon, a <span id="age">twenty five or so</span> year old programmer
currently located in <span id="{{ site.google_latitude_id }}">San Francisco,
CA</span>.  What you see below is some ramblings by me about myself or other
things. Look if you want to.

{% comment %} This is here so it can be executed as early as possible. {% endcomment %}
{% comment %} This gets wrapped in CDATA tags which causes javascript syntax
errors.
<script type="text/javascript">
	$("#age").replaceWith(
		new Number(
			Math.floor(
				(
					new Date() -
					new Date("{{ site.birthdate }}")
				) /
				31556926000 /* nanos per year */
			)
		).toWords()
	);
	doLatitude("{{ site.google_latitude_id }}", $("#{{ site.google_latitude_id }}"));
</script>
{% endcomment %}

+-- {: .section }
# Academics
I completed my studies at the [Rochester Institute of
Technology](http://www.rit.edu/) in December, 2013. My thesis can be found
[here][ruminate-thesis].
=--

+-- {: .section }
# Code

I'm actively working on [Ruminate], an introspective library for C.

The vast majority of my other work can be found at my
[GitHub](https://github.com/eatnumber1) page. What you can see below is the five
most recent projects I've worked on at GitHub.
+-- {: #github_{{ site.github_username }} }
Contacting GitHub...
{: #github_loading .loading }
<ul class="compact recent" id="github_list"/>
=--
=--

+-- {: .section }
# Blog
I periodically post to a programming blog entitled
_[Machinae Elegantiam](/machinae)_.

{% for post in site.categories.machinae limit: 3 %}
* [{{ post.title }}]({{ post.url }}){% if post.excerpt %}{: title="{{ post.excerpt }}"}{% endif %}
{: .compact .recent }
{% endfor %}
=--

[Ruminate]: http://rus.har.mn/ruminate/
[ruminate-thesis]: http://rus.har.mn/files/project-report.pdf

{% comment %}
vim: ft=jekyll sw=4 ts=4 sts=4 tw=80
{% endcomment %}
