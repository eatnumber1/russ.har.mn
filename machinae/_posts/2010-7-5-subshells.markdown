---
layout: post
title: "Bash Scripters: Stop using subshells to call functions."
categories: [programming, bash]
---

When writing in bash, zsh, sh, etc... __stop__ using subshells to call functions.
There is a significant speed overhead to using a subshell and there is a much
better alternative. Instead, you should just have a convention where a
particular variable is always the return value of the function (I use _retval_).
This has the added benefit of also allowing you to return arrays from your
functions.

If you don't know what a subshell is,  a subshell is another bash shell which is
spawned whenever you use `$()` or ```` ` ` ```` and is used to execute the code
you put inside.

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
vim: ft=mkd sw=4 ts=4 sts=4 tw=80
{% endcomment %}
