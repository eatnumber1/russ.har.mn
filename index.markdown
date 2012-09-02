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

I'm Russ Harmon, a <span id="age">twenty four or so</span> year old programmer
currently located in
<span id="{{ site.google_latitude_id }}">New York, USA</span>.  What you see below is
some ramblings by me about myself or other things. Look if you want to.

{% comment %} This is here so it can be executed as early as possible. {% endcomment %}
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

+-- {: .section }
# Academics
The main focus of my work at the moment is the completion of my graduate studies
at the [Rochester Institute of Technology](http://www.rit.edu/) which I attend
as a full-time student. Studying computer science, I hope to complete my studies
at the end of February, 2013.
=--

+-- {: .section }
# Code
The vast majority of my work can be found at my
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

+-- {: .section }
# [Twitter](http://twitter.com/{{ site.twitter_username }})
Contacting Twitter...
{: #twitter_update_list .loading }
=--

{% comment %}
vim: ft=jekyll sw=4 ts=4 sts=4 tw=80
{% endcomment %}
