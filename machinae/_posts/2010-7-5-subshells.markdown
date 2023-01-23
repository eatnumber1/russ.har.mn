---
title: "Bash Scripters: Stop using subshells to call functions."
keywords: [programming, bash]
---

When writing shell scripts, it's almost always better to call a function
directly rather than using a subshell to call the function. The usual convention
that I've seen is to echo the return value of the function and capture that
output using a subshell. For example:

{% highlight bash %}
#!/bin/bash
function get_path() {
    echo "/path/to/something"
}
mypath="$(get_path)"
{% endhighlight %}

This works fine, but there is a significant speed overhead to using a subshell
and there is a much faster alternative. Instead, you can just have a convention
wherein a particular variable is always the return value of the function (I use
_retval_).  This has the added benefit of also allowing you to return arrays
from your functions.

If you don't know what a subshell is, for the purposes of this blog post a
subshell is another bash shell which is spawned whenever you use `$()`
or ```` ` ` ```` and is used to execute the code you put inside.

I did some simple testing to allow you to observe the overhead. For two
functionally equivalent scripts:

This one uses a subshell:
{% highlight bash %}
#!/bin/bash
function a() {
    echo hello
}
for (( i = 0; i < 10000; i++ )); do
    echo "$(a)"
done
{% endhighlight %}
This one uses a variable:
{% highlight bash %}
#!/bin/bash
function a() {
    retval="hello"
}
for (( i = 0; i < 10000; i++ )); do
    a
    echo "$retval"
done
{% endhighlight %}
The speed difference between these two is noticeable and significant.
{% highlight console %}
$ for i in variable subshell; do
> echo -e "\n$i"; time ./$i > /dev/null
> done

variable

real 0m0.367s
user 0m0.346s
sys 0m0.015s

subshell

real 0m11.937s
user 0m3.121s
sys 0m0.359s
{% endhighlight %}

As you can see, when using `variable`, execution takes 0.367 seconds. `subshell`
however takes a full 11.937 seconds!

{% comment %}
vim: ft=liquid sw=4 ts=4 sts=4 tw=80 noet
{% endcomment %}
