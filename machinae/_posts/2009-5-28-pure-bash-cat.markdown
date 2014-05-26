---
layout: post
title: Pure Bash Cat
keywords: [programming, bash]
---

So just to see if I could, I wrote a version of cat using pure bash. Pure bash
is a bash script which uses nothing but bash builtins to accomplish it's goal.
To determine if a particular command is a builtin, you can use the command type
-t "command" (the command type, is itself a builtin). Some notable commands
which are builtins include echo, read, exec, return. Some notable commands which
are not builtins include cat and grep. As follows is my implementation of cat in
pure bash.

{% highlight bash linenos %}
#!/bin/bash
INPUTS=( "${@:-"-"}" )
for i in "${INPUTS[@]}"; do
	if [[ "$i" != "-" ]]; then
		exec 3< "$i" || exit 1
	else
		exec 3<&0
	fi
	while read -ru 3; do
		echo -E "$REPLY"
	done
done
{% endhighlight %}

Now, keep reading if you want a small lesson in advanced bash.  I'll go line by
line to explain what this is doing.

{% highlight bash %}
#!/bin/bash
{% endhighlight %}
Line 1 is the [shebang](http://en.wikipedia.org/wiki/Shebang_%28Unix%29)

{% highlight bash %}
INPUTS=( "${@:-"-"}" )
{% endhighlight %}
Line 2 assigns the array variable INPUTS either the arguments provided on the
command line if they exist, or the single character `-`. The way this happens is
as follows: `$@` is the variable to reference the _positional parameters_ (the
arguments to your program). If you have not heard of `$*`, read
[this](http://bash-hackers.org/wiki/doku.php/scripting/posparams#mass_usage).
The way I reference the positional parameters is like `${@}`. That's because the
brackets allow me to add a _default value_ to the variable. A _default value_ is
the value that the variable will seem to have if the variable is not set. The
way to use a _default value_ is with the `:-`, like so: `${@:-"hello"}`. So if
`$@` is not set, it will seem to have the value `"hello"`. You will then notice
that is all enclosed in `()`. That makes an array out of the _positional
parameters_ (the first argument to the program becomes the first element in the
array, the second argument becomes the second element, etc.).

{% highlight bash %}
for i in "${INPUTS[@]}"; do
{% endhighlight %}
Line 3 begins a `for` loop which will assign to `i` each value stored in the
array `INPUTS` which was discussed earlier. The `@` index used is the same for
arrays as `$@` is for the _positional parameters_.

Maybe I'll explain more when I'm less lazy.

{% comment %}
vim: ft=liquid sw=4 ts=4 sts=4 tw=80 noet
{% endcomment %}
