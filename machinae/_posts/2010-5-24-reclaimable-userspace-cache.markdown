---
layout: post
title: Reclaimable Userspace Cache Memory
keywords: [programming]
---

Caches are used all over your computer and for a huge variety of purposes. From
apache to your physical CPU, cache is everywhere. Normally, when you want to
cache something in memory, you `malloc(3)` a chunk of memory, and store
data in that. This works well in the small scale, but when you and 30+ others
want to cache some information, that can quickly turn into a large amount of
memory taken up by information which can be (easily, or not so easily)
regenerated, and there is no way for the operating system to reclaim that memory
when it really needs it.

In Java, that's not the case. In Java, you can create
[SoftReference](http://java.sun.com/javase/6/docs/api/java/lang/ref/SoftReference.html)
objects which are collected by the garbage collector when the VM is running out
of memory. This exact idea is what I'd like to see in an operating system.

I propose a system, whereby you can allocate memory which the operating system
can reclaim at it's own discretion. This would work by using `malloc(3)`
to get some memory, then using `madvise(2)` to advise to the kernel that
this is reclaimable memory. Then, before you read or write to the memory, you
lock the memory (for read or write) using reclock, during which time the kernel
guarantees not to reclaim the memory. Then, when you are done reading / writing
to that memory, recunlock it.

The function prototypes for the reclock and recunlock functions (which don't
exist) would be:
{% highlight c %}
// Returns 0 on success, -1 if the memory
// is no longer available
int reclock( const void *addr, int perms );
void recunlock( const void *addr );
{% endhighlight %}
Under the hood, what would happen is that when you `madvise(2)` the kernel that
a particular space is reclaimable, it would add it to a list of reclaimable
addresses. Then, when the system is low on memory, it would scan the list for a
chunk of memory large enough, check that the memory isn't locked (read next
paragraph), mark that element in the list as reclaimed and with the pid that it
was taken from, and give it to someone else.

Before simply giving a chunk of memory to someone else however, the kernel has
to check to see if the memory is in use. In order to do that, there has to be a
lock bit somewhere. I had originally thought to put it in the kernel's memory,
but [Clockfort](http://www.clockfort.com) noted that locking and unlocking would
require a system call, which would be quite slow. Therefore, the bit can be kept
in the processes memory space, and simply read by the kernel before reclaiming
memory. That way, reclock and recunlock can be implemented entirely without
syscalls.

{% comment %}
vim: ft=liquid sw=4 ts=4 sts=4 tw=80 noet
{% endcomment %}
