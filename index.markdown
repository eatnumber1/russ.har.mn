---
title: Home
section: Home
changefreq: always
link:
  - rel: canonical
    href: /
includes:
  - jquery
---
{::options parse_block_html="true" /}

{% avatar eatnumber1 size=200 %}{: .inset .right }

Welcome
=======

I'm Russ Harmon, a <span id="age">thirty four or so</span> year old programmer
currently located in San Francisco, CA.

<script type="text/javascript">
  $("#age").replaceWith(
    new Number(
        Math.floor(
          (new Date() - new Date("{{ site.birthdate }}"))
            / 31556926000 /* nanos per year */)).toWords());
</script>

<div class="section">
# Work
Since 2016 I've worked at Waymo making self-driving cars.
More details at [LinkedIn].
</div>

<div class="section">
# Academics
I completed my studies at the [Rochester Institute of Technology][RIT] in
December 2013. My thesis can be found [here][ruminate-thesis].
</div>

<div class="section">
# Code

The largest piece of publicly released work I've done is the code for my thesis
which resulted in [Ruminate], an introspective library for C.

The vast majority of my other work can be found at my [GitHub] page. Here's some
projects from there you might find interesting.

  * {%
      assign repo =
        site.github.public_repositories
          | where: "name", "tcheck"
          | first
    %}
    [{{ repo.name }}]({{ repo.html_url }}) - {{ repo.description }}
  * {% assign repo = site.github.public_repositories | where: "name", "macspoof" | first %}
    [{{ repo.name }}]({{ repo.html_url }}) - {{ repo.description }}
  * {% assign repo = site.github.public_repositories | where: "name", "bingehack4" | first %}
    [{{ repo.name }}]({{ repo.html_url }}) - {{ repo.description }}
  * {% assign repo = site.github.public_repositories | where: "name", "ruminate" | first %}
    [{{ repo.name }}]({{ repo.html_url }}) - {{ repo.description }}
  * {% assign repo = site.github.public_repositories | where: "name", "bluez-pulse-loader" | first %}
    [{{ repo.name }}]({{ repo.html_url }}) - {{ repo.description }}
  * {% assign repo = site.github.public_repositories | where: "name", "cue2pb" | first %}
    [{{ repo.name }}]({{ repo.html_url }}) - {{ repo.description }}
  * {% assign repo = site.github.public_repositories | where: "name", "dat2pb" | first %}
    [{{ repo.name }}]({{ repo.html_url }}) - {{ repo.description }}
  * {% assign repo = site.github.public_repositories | where: "name", "resume" | first %}
    [{{ repo.name }}]({{ repo.html_url }}) - {{ repo.description }}
  * {% assign repo = site.github.public_repositories | where: "name", "sqlite-regexp" | first %}
    [{{ repo.name }}]({{ repo.html_url }}) - {{ repo.description }}
  * {% assign repo = site.github.public_repositories | where: "name", "uvb" | first %}
    [{{ repo.name }}]({{ repo.html_url }}) - {{ repo.description }}
  * {% assign repo = site.github.public_repositories | where: "name", "libuseless" | first %}
    [{{ repo.name }}]({{ repo.html_url }}) - {{ repo.description }}
  * {% assign repo = site.github.public_repositories | where: "name", "photohunt" | first %}
    [{{ repo.name }}]({{ repo.html_url }}) - {{ repo.description }}
    {% assign repository = nil %}

</div>

<div class="section">
# Blog
I (rarely) post to a programming blog entitled
_[Machinae Elegantiam](/machinae)_.

{% for post in site.categories.machinae limit: 3 %}
* [{{ post.title }}]({{ post.url }}){: title="{{ post.excerpt | strip_html | truncatewords: 20 }}"}
{: .compact .recent }
{% endfor %}
</div>

[GitHub]: https://github.com/eatnumber1
[LinkedIn]: https://linkedin.com/in/eatnumber1/
[RIT]: http://www.rit.edu/
[Ruminate]: /ruminate
[ruminate-thesis]: /files/project-report.pdf

{% comment %}
vim: ft=liquid sw=4 ts=4 sts=4 tw=80 noet
{% endcomment %}
