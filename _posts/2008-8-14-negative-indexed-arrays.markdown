---
layout: post
title: Negative Indexed Arrays
uuid: 0CC46073-9E87-4B2D-812C-2608D5B6962A
---

In first describing how ridiculous C and C++ was to my class when I was in my
first C++ programming course, I remember him saying that you can even create
negative indexed arrays. Now that I am a bit wiser in the ways of C++ and memory
management, I actually know how to do it!

The following small C++ program illustrates:
{% highlight c %}
#include <iostream>
using namespace std;
int main() {
    const char** array = new const char*[2];
    array[0] = "Hello";
    array[1] = "World!";
    cout << (++array)[-1] << endl;
    delete --array;
}
{% endhighlight %}
When executed, it gives us this:
{% highlight console %}
$ g++ -Wall NegArray.cpp -o NegArray && ./NegArray
Hello
{% endhighlight %}
The reason this happens is that since arrays in C and C++ are linear in memory,
you can do math on them (the `++array` and `--array`).
So if the array looks like this:

	0xFADC  0xFADD  <-- This is the address
	-----------------
	| Hello | World |
	-----------------

If you printed your array (without an index), you would see `0xFADC`; the
address of the first element.  Therefore if you add one to that, your array's
element 0 would point at memory address `0xFADD`, and it's element `-1` would
point at memory address `0xFADC`.

__Remember__: Don't try to `delete` an array like this before restoring it to
the way it originally was or you will get a segfault.

A shorter way of doing it that doesn't involve using `new` is:
{% highlight cpp %}
#include <iostream>
#include <string>
using namespace std;
int main() {
    const string array[2] = { "Hello", "World!" };
    cout << ((const string*) &array + 1)[-1] << endl;
}
{% endhighlight %}

A probably more readable way to do it in C is as follows:
{% highlight c %}
#include <stdio.h>
int main() {
	char *array[] = { "Hello", "World!" };
	char **ptr = array + 1;
	printf("%s\n", ptr[-1]);
}
{% endhighlight %}

{% comment %}
vim: ft=mkd sw=4 ts=4 sts=4 tw=80
{% endcomment %}
