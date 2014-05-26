---
layout: post
title: Determining Mount Status
keywords: [scripting]
---

I've fairly frequently ran into the issue while scripting a mount action of
determining if what I want to mount is already mounted. On Linux, you could
parse `/proc/mounts`, but that's neither cross-platform, nor is the format of
`/proc/mounts` guaranteed not to change. The same problem exists with parsing
the output of the `mount` command, the format of which not only is not
guaranteed to remain the same, it in fact varies greatly between platforms.

To tackle this problem, I looked into how `mount` gets it's information. On BSD
and friends, it uses a function called [`getmntinfo(3)`][getmntinfo]. On Linux,
it uses a function called [`getmntent(3)`][getmntent].

Now that I knew how the different UNIXes that I cared to support got their mount
information, I wrote up a program to retrieve and format this mount information.

Know that currently, I only support OS X, but I plan on supporting more
operating systems in the future.

You can find the sources for my program on my [GitHub page][github].

	Usage: getmntinfo [options] [format]
	  -q, --quiet                  Produce no output
	  -h, --help                   This help message
	  -B, --bsize=SIZE             Fundamental filesystem block size
	  -I, --iosize=SIZE            Optimal transfer block size
	  -b, --blocks=COUNT           Total data blocks in filesystem
	  -F, --bfree=COUNT            Free blocks in filesystem
	  -a, --bavail=COUNT           Free blocks avail to non-superuser
	  -n, --files=COUNT            Total file nodes in filesystem
	  -e, --ffree=COUNT            Free file nodes in filesystem
	  -U, --fsid=ID                Filesystem identifier
	  -S, --fsid0=ID               Top four bytes of filesystem identifier
	  -T, --fsid1=ID               Bottom four bytes of filesystem identifier
	  -O, --owner=USER             User that mounted the filesystem
	  -g, --flags=FLAGS            Copy of mount exported flags
	  -s, --fssubtype=TYPE         Filesystem sub-type (flavor)
	  -t, --type=TYPE              Type of filesystem
	  -o, --mntonname=DIR          Directory on which mounted
	  -f, --mntfromname=NAME       Mounted filesystem

With this program, determining if something is mounted in a script is as simple
as

{% highlight bash %}
if getmntinfo -t hfs -o / -f /dev/disk0s2 -q; then
	echo "Mounted"
else
	echo "Not Mounted"
fi
{% endhighlight %}

[getmntinfo]:http://developer.apple.com/library/mac/#documentation/Darwin/Reference/ManPages/man3/getmntinfo.3.html
[getmntent]:http://linux.die.net/man/3/getmntent
[github]:http://github.com/eatnumber1/getmntinfo

{% comment %}
vim: ft=liquid sw=4 ts=4 sts=4 tw=80 noet
{% endcomment %}
