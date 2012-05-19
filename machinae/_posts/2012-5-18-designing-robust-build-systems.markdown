---
layout: post
title: Designing Robust Build Systems
excerpt: A correct build system must be able to solve the problem of traversal-time dependency detection.
---

A few years ago, I took a hard look at the current state of the art of build
systems. The ones I looked at were the ones that I had heard of, specifically
[Make][make], [SCons][scons], [CMake][cmake], [Jam][jam]. I slowly came to
the realization every build system designer since the creators of Make (which
arguably does it right) have been thinking about building software all wrong.

Understand that the entire purpose of a build system is to compile your complex
piece of software _correctly every time_. Peter Miller discusses the importance
of a correct build system in his paper [Recursive Make Considered
Harmful][recursive-make]. In order to build correctly always, the system must
fully understand the _dependency tree_ of the software.  This dependency tree
is, composed in part by any `#include` directives in your C files. For example,
lets say we're making a simple game, with a dependency tree like the following:

<!-- TODO: Don't use <center> -->
<center>
{% graphviz %}
digraph example1 {
	rankdir = "LR";

	common_h [label = "common.h"];
	player_h [label = "player.h"];
	game_c [label = "game.c"];
	game_exe [label = "game.exe"];

	common_h -> game_c;
	player_h -> game_c;
	game_c -> game_exe;
}
{% endgraphviz %}
</center>

This means that before `game.c` can be built, `common.h` and `player.h` must
exist, and before `game.exe` can be built, `game.c` must exist. Additionally,
`game.exe` can be said to _transitively depend_ upon `common.h` and `player.h`.

Now, this works fine always because you wrote `common.h`, `player.h` and
`game.c`, but lets say you were writing a game, and wanted to create a
domain-specific language to express the levels. This DSL's compiler would output
C code, which would then be used from within your code. This can be expressed
like so:

<center>
{% graphviz %}
digraph example2 {
	common_h [label = "common.h"];
	player_h [label = "player.h"];
	game_c [label = "game.c"];
	game_exe [label = "game.exe"];

	levcomp_c [label = "level_compiler.c"];
	levcomp [label = "level_compiler.exe"];
	levels_c [label = "levels.c"];

	common_h -> levcomp_c -> levcomp -> levels_c;
	player_h -> levels_c [style = "dashed"];
	common_h -> levels_c [style = "dashed"];
	levels_c -> game_exe;

	common_h -> game_c;
	player_h -> game_c;
	game_c -> game_exe;
}
{% endgraphviz %}
</center>

The dependencies `common.h → levels.c` and `player.h → levels.c` is not
detected in this case unless you explicitly write that dependency into your
build system. That is undesirable however as doing so is fragile. What you
really want, is to  _dynamically_ introduce dependencies into the build system.
In other words, in order for a build system to be _correct_, it sometimes must
be able to detect dependencies while it's traversing the dependency tree it is
detecting dependencies for!

GCC provides a facility for outputting a Make compatible list of a file's dependencies with the `-M` option. From GCC's [docs][gcc-M]:

	-M
		Instead of outputting the result of preprocessing, output a rule
		suitable for make describing the dependencies of the main source file.

GNU Make has introduced the `include` extension that allows you to generate and
include these files, albeit in a more limited fashion. From the
[include][gnumake-include] directive's documentation:

	After reading in all makefiles, make will consider each as a goal target and
	attempt to update it. If a makefile has a rule which says how to update it
	(found either in that very makefile or in another one) or if an implicit
	rule applies to it (see Using Implicit Rules), it will be updated if
	necessary. After all makefiles have been checked, if any have actually been
	changed, make starts with a clean slate and reads all the makefiles over
	again.

This mechanism can be leveraged to create a limited solution to the
_traversal-time dependency detection_ problem, which our game suffered from.
Unfortunately, this works only for a single "level" of traversal-time dependency
detection. E.g. the following does not work:

<center>
{% graphviz %}
digraph example3 {
	//rankdir = "LR";

	a_c [label = "a.c"];
	a_exe [label = "a.exe"];
	b_c [label = "b.c"];
	b_exe [label = "b.exe"];

	c_h [label = "c.h"];
	c_c [label = "c.c"];
	c_exe [label = "c.exe"];

	a_c -> a_exe -> b_c -> b_exe -> c_c -> c_exe;
	c_h -> c_c;
}
{% endgraphviz %}
</center>

I've built a functional build system for Nethack which leverages these concepts.
You can see an abbreviated dependency graph for Nethack [here][nh-deps], and I
also gave a presentation on the Nethack build system which can be seen
[here][nh-prezi]. The build system itself is hosted [here][bingehack].

[make]: http://dev/null
[scons]: http://dev/null
[cmake]: http://dev/null
[jam]: http://dev/null

[clockfort]: https://clockfort.com/
[nethack]: http://www.nethack.org/
[recursive-make]: http://aegis.sourceforge.net/auug97.pdf
[gcc-M]: http://gcc.gnu.org/onlinedocs/cpp/Invocation.html#index-M-141
[gnumake-include]: http://www.gnu.org/software/make/manual/html_node/Remaking-Makefiles.html#Remaking-Makefiles
[nh-deps]: /files/nethack-dependencies.pdf
[nh-prezi]: http://prezi.com/vzxavg014qlf/nethack-compilation/
[bingehack]: https://github.com/ComputerScienceHouse/bingehack

{% include definitions.markdown %}

{% comment %}
vim: sw=4 ts=4 sts=4 tw=80
{% endcomment %}
