---
layout: thesis
title: Projects
section: Projects
---

This page details thoughts I've had for potential thesis/project topics.

* This gets filled in with a table of contents.
{: toc}

# Graphing Non-Determinism
Optimization in the compiler is a hard problem, and frequently considered a
black magic. Those intimately familiar with the architecture which they are
developing for will frequently find potential optimizations while examining the
compiler output which the compiler was not able to perform.

In theory, all code which produces no non-deterministic side-effects, and
handles no non-deterministic data can be optimally optimized. In order to better
understand what kinds of optimizations can be performed, I wish to perform a
similar operation to what optimizers do when performing constant inlining and
starting from a set of implicitly non-deterministic functions, graph the
"pollution" of the otherwise deterministic code. Theoretically, all other code
should be able to be optimally optimized.

# Probabilistic Non-Determinism Elimination
It can be determined that some non-deterministic variables will "probably" take
a value. Assuming a finite set of probable values, an optimizing compiler can
create multiple code paths, assuming one of those probable values for each code
path.

The following code would become optimizable if my proposed changes were
introduced.
{% highlight c %}
int main( int argc, char *argv[] ) {
	uint32_t i = atoi(argv[1]);
	if( i < 2 ) {
		// The compiler could create three different code paths for i here; one
		// each for 1, 2 and 3, and then constant inline those values.
	} else {
		// The compiler doesn't know what the value is.
	}
}
{% endhighlight %}

# Reclaimable Anonymous Cache Memory in Linux
There are many programs today which generate "cached" values, which while
regeneratable, are expensive to do. When the system is memory constrained
however, it is frequently desirable to dump those caches so execution may
continue. I would like to add a facility to Linux whereby specific memory
regions may be marked as "reclaimable," allowing the kernel to reclaim and reuse
that memory when under heavy load.

# Re-designing the build system
Coming soon...

# LLVM Language "Agnostic" Introspection
Coming soon...

{% include definitions.markdown %}

{% comment %}
vim: ft=jekyll sw=4 ts=4 sts=4
{% endcomment %}
