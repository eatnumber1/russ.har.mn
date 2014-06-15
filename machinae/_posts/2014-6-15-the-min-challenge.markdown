---
layout: post
title: The MIN Challenge
excerpt: It's surprisingly difficult to make a proper function-like macro.
keywords: [programming, c, preprocessor, cpp, macros]
---

# The MIN Challenge

It's surprisingly difficult to make a proper function-like macro. You'd think that it's as simple as
putting your code all on one line in the macro's body, but there's a great deal of considerations
that may not have occurred to you, and in the end it's not even possible to do in the general case
without relying on non-standard extensions to C.

An old challenge that I've heard used to illustrate these difficulties goes as follows:

> Write a function-like macro for finding the smaller of two numbers.

In other words, a `min` macro!

## Attempt 1: If Statements

Taking on the challenge, my first attempt goes as follows:

{% highlight c %}
#define min(a, b, out) \
	if (a < b) { \
		out = a; \
	} else { \
		out = b; \
	}

int main() {
	int out;
	min(1, 2, out);
	return out;
}
{% endhighlight %}

This uses a simple if statement to solve the problem and works in the example given, but doesn't
even compile in the following case:

{% highlight c %}
int main() {
	int out;
	return (min(1, 2, out), out);
}
{% endhighlight %}

This code uses the [comma operator][comma-oper] in order to have the return value of the entire
[expression][stmt-vs-expr] be the value of the output variable.

This doesn't work however because the min macro expands into an if-statement. Here's the
preprocessed code:

{% highlight c %}
int main() {
	int out;
	return (if (1 < 2) { out = 1; } else { out = 2; }, out);
}
{% endhighlight %}

## Attempt 2: Ternary Operation

Trying again, my second attempt goes as follows:

{% highlight c %}
#define min(a, b) a > b ? b : a
int main() {
	return min(1, 2);
}
{% endhighlight %}

This uses a [ternary operation][ternary-op] to make the macro into an expression rather than a
statement like attempt 1 was, but doesn't work correctly for the following program:

{% highlight c %}
int main() {
	return min(3, 2) + 2;
}
{% endhighlight %}

Just looking at the code, it seems as though this program should return `4`, but instead it returns
`2`! Again what happened becomes apparent when we preprocess the code:

{% highlight c %}
int main() {
	return 3 > 2 ? 2 : 3 + 2;
}
{% endhighlight %}

Our `+ 2` got associated with the else branch of the ternary operation, and so not executed! We can
fix this by surrounding the entire macro result in parentheses.

## Attempt 3: Parenthesized Ternary Operation

Trying again, my third attempt goes as follows:

{% highlight c %}
#define min(a, b) (a > b ? b : a)
int main() {
	return min(3, 2) + 2;
}
{% endhighlight %}

This surrounds the entire macro in parentheses in order to make the ternary operation evaluate
before any additional expressions that are placed around it. Unfortunately, this too breaks for the
following program:

{% highlight c %}
int main() {
	return min(2, 3 & 0);
}
{% endhighlight %}

Since `3 & 0` is zero, you would expect this to return `0`, but instead returns `2`. Here's the
preprocessed source:

{% highlight c %}
int main() {
	return (2 > 3 & 0 ? 3 & 0 : 2);
}
{% endhighlight %}

Since the `&` operator has a lower [precedence][c-oper-precedence] than `>`, the expression is
equivalent to `(2 > 3) & 0`, which is always false! We can fix this by surrounding every use of a
macro argument with parentheses.

## Attempt 4: Parenthesized Ternary Operation with Parenthesized Arguments

Trying again, my fourth attempt goes as follows:

{% highlight c %}
#define min(a, b) ((a) > (b) ? (b) : (a))
int main() {
	return min(2, 3 & 0);
}
{% endhighlight %}

This surrounds every use of a macro argument with parentheses in order to force the argument to
evaluate before any additional expressions that are placed around it. Unfortunately (is this getting
tiring yet?), this too breaks for the following program:[^1]

{% highlight c %}
int main() {
	return min(printf("%d\n", 1), 3);
}
{% endhighlight %}

When run, this program prints `1` twice! Lets see the preprocessed code:

{% highlight c %}
int main() {
	return ((printf("%d\n", 1)) > (3) ? (3) : (printf("%d\n", 1)));
}
{% endhighlight %}

It's getting pretty ugly now, but this code ends up calling `printf` twice if the first call to it
returned a number less than `3`.

## Attempt 5: Statement Expressions

Now we're in a bit of a difficult spot. The only way to prevent this case is to create temporary
variables in which to store the result of expanding the macro arguments, but creating temporary
variables will cause this macro to no longer be an expression, bringing us back to the same problems
with attempt 1. If you're writing strictly standards conforming C, this is where you stop. This is
an unsolvable problem. If instead however we can draw from the extensions to C that [GNUC] brings
us, we can leverage [statement expressions][stmt-exprs]. A statement expression is an expression
which may itself contain statements and declarations, enabling us to create our temporary variables.
The syntax for statement expressions is a little odd. You use it by surrounding your code with
`({ })`, and the last statement in your statement expression should itself be an expression and that
expression will be the resulting value of the entire statement expression. This enables us to write
a better `min`:

{% highlight c %}
#define min(a, b) ({ \
	int _a = (a); \
	int _b = (b); \
	_a < _b ? _a : _b; \
})
int main() {
	return min(printf("%d\n", 1), 3);
}
{% endhighlight %}

But wait, there's a problem here. I've built in the assumption that `a` and `b` have type `int`,
where previously we had made no such assumption. Thankfully we can generalize the macro again using
another GNUC extension: [typeof]. This extension to C allows you to refer to the type of an
arbitrary expression, thereby allowing you to declare variables of the type of an arbitrary
expression.

{% highlight c %}
#define min(a, b) ({ \
	typeof(a) _a = (a); \
	typeof(b) _b = (b); \
	_a < _b ? _a : _b; \
})
int main() {
	return min(printf("%d\n", 1), 3);
}
{% endhighlight %}

And now we've finally arrived at a generalized function-like min macro that can be used anywhere
that a normal function can (but you still can't take the address of it).

[^1]: Note that `printf` returns the number of characters printed.

[ternary-op]: http://en.wikipedia.org/wiki/%3F: "Ternary Operation"
[comma-oper]: http://en.wikipedia.org/wiki/Comma_operator "Comma Operator"
[stmt-vs-expr]: http://lambda-the-ultimate.org/node/1044 "Expressions vs Statements"
[c-oper-precedence]: http://en.wikipedia.org/wiki/Operators_in_C_and_C%2B%2B#Operator_precedence "C Operator Precedence"
[GNUC]: https://gcc.gnu.org/onlinedocs/gcc/C-Extensions.html "Extensions to the C Language Family"
[stmt-exprs]: https://gcc.gnu.org/onlinedocs/gcc/Statement-Exprs.html#Statement-Exprs "Statements and Declarations in Expressions"
[typeof]: https://gcc.gnu.org/onlinedocs/gcc/Typeof.html#Typeof "Typeof"

{% comment %}
vim: ft=liquid sw=4 ts=4 sts=4 tw=100 noet
{% endcomment %}
