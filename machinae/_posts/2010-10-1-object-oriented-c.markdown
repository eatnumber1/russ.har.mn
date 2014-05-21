---
layout: post
title: Object Oriented C
categories: [programming, c]
---

So, thanks to [blocks](http://thirdcog.eu/pwcblocks/), Apple's new extension to
C, you can now do basic object-orientation. Have a look over at
[GitHub](http://gist.github.com/605457) for a short example on how to do it.

To break it down, an object is a struct, which contains both fields and
[blocks](http://thirdcog.eu/pwcblocks/) which act as the object's methods.

{% highlight c %}
typedef struct {
	Object super;
	char *_value;
	const char *(^getValue)();
	void (^setValue)( const char * );
} String;
{% endhighlight %}

This creates a `String` object which inherits from `Object` and has a field
`_value`, and methods `getValue` and `setValue`.

More to come... _maybe_.

{% comment %}
vim: ft=liquid sw=4 ts=4 sts=4 tw=80 noet
{% endcomment %}
