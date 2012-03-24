---
layout: thesis
title: Home
section: Home
---

# Introduction

Throughout the 20112 academic quarter, I will be detailing my progress in my MS Project/Thesis seminar class below.

# Table of Contents

{% for post in site.categories.thesis %}
<div class="section list">
	<h1>{{ post.date | date_to_string }}</h1>
	<p class="line">
		<a class="title" href="{{ post.url }}">{{ post.title }}</a>
	</p>
	<span class="excerpt">{{ post.excerpt | markdownify }}</span>
</div>
{% endfor %}

{% include definitions.markdown %}

{% comment %}
vim: ft=jekyll sw=4 ts=4 sts=4
{% endcomment %}
