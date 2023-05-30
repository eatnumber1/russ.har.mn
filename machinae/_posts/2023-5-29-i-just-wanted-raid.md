---
title: I Just Wanted a RAID Array
excerpt: How I went from `mdadm --create` to contributing to the Linux kernel.
keywords: [linux, md, mdadm, raid, dm-integrity]
published: false
---

# I Just Wanted a RAID Array

This is a story about how I went from "just" wanting to create a RAID array, something [very well
documented](https://raid.wiki.kernel.org/index.php/RAID_setup) and done for decades by... presumably
everyone who runs a storage server, myself included... to contributing to Systemd and the Linux
kernel.

I'm also not kidding that almost everyone who runs a storage server has done this. A [simple Google
search](https://www.google.com/search?q=create+a+raid+array+linux) indicates that besides the Linux
wiki, there's also documentation on how to do this from RedHat, Ubuntu, Debian, Arch, Alpine,
Gentoo, Digital Ocean, Oracle, Suse, Alibaba, and even Amazon. It's an exaggeration, but I don't
think it's too much of an exaggeration to say that Linux software RAID via `mdadm` is the most
widely deployed storage solution in the world.

## The RAID5 Write Hole

Given what I just said above, it may surprise you to lose that Linux's software RAID can lose your
data.

It *probably* won't, in the same way that unplugging a FAT32 USB stick from your computer when
Windows ([before
10](https://learn.microsoft.com/en-us/windows/client-management/client-tools/change-default-removal-policy-external-storage-media))
which has been doing write-behind caching won't... and by that I mean just don't unsafe power-off
your computer and you'll be fine. But who does that? Well... I do. I get power outages sometimes.

Ok let's dig deeper. What's the problem here?

There's something called the RAID5 write hole... and it's a misnomer. First let me explain what it
is, then I'll explain why it's a misnomer.

When you write let's say 100 MiB into a RAID5 array containing n disks, RAID chops up that 100 MiB
into n-1 *chunks*, and writes that to n-1 of your disks. The remaining disk receives parity
information about the data written so you can lose any one out of those n disks and still recover
the data.

Think hard about that algorithm. We're going to unplug the computer in the middle of this operation.
What happens? There's ways this can work under the hood that don't have problems, and *mdadm
implements some of them*, but none of them are used by default. The default is the dumb (simple)
way.

If RAID finishes writing the data to your parity disk and all but one of your n-1 data disks then
the power goes out, leaving the last remaining data disk half-written, when you read the data on the
next reboot you'll get see the (corrupt) half-written data. RAID *could* notice that it's corrupt by
checking against the parity, but it doesn't, and there's no guarantee the parity is correct anyway.

You can "scrub" your RAID array to "correct" this, but during a scrub RAID5 arrays have no way to
know which set of drives is "correct" when it sees an inconsistency. So it always assumes that the
parity is incorrect and overwrites the existing parity. The result after this is an array that looks
"clean", but you've now internalized data corruption.

There's a somewhat "obvious" way to solve this with RAID6 though... if your data drives and one of
the parity drives disagree, ask the second parity drive. Essentially, take a three-way vote on which
data is correct. I'd always just assumed that this is how RAID6 worked... oh how I was wrong.

## The RAID6 Write Hole & Man Pages

It's taken a long time, but I've learned to read... basically every [man
page](https://en.wikipedia.org/wiki/Man_page) I come across. I highly recommend you do the same; my
understanding on how Linux *actually* works got 1000x better once I started doing that. So unlike
the last time I created a RAID array, I decided not to follow a tutorial, and instead read the
"real" documentation.

There's [mdadm(8)](https://man7.org/linux/man-pages/man8/mdadm.8.html), which is great
documentation... for the administrative frontend to the
[md(4)](https://man7.org/linux/man-pages/man4/md.4.html) subsystem in the kernel.

Aside, "md" is a terrible name for a kernel subsystem. It's impossible to search for, and even more
impossible to discover organically. I found it via the "SEE ALSO" section of mdadm(8).

md(4) is the documentation I'd always been looking for. It's got details on how reads work (reads go
to the data drives, not the parity, and parity is not checked), the difference between "chunks" and
"stripes", and importantly, in the section of "RAID WRITE HOLE" it describes the RAID5 write hole.

Uwu what's this? The RAID5 write hole isn't just RAID5?

> Due to non-atomicity nature of RAID write operations,
> interruption of write operations (system crash, etc.) to RAID456
> array can lead to inconsistent parity and data loss (so called
> RAID-5 write hole).

RAID6 is subject to the write hole!?

Well, okay, the documentation then goes on to describe two optional features that can be used to
close the write hole (dirty stripe journal and partial parity log), so I can just turn that on.

However there's another option too.

## Silent Data Corruption

Modern hard drives do their own internal form of error detection and correction called [Forward
Error Correction](https://en.wikipedia.org/wiki/Error_correction_code#Forward_error_correction)
(FEC).  When an error occurs and is detectable (it's possible, albeit unlikely, that corruption of
data in exactly the right way to still pass the error check happens), drives will first try to
recover the correct data by reading that part of the drive many many times, and failing that will
return an error to the kernel. As long as this always works, on a read RAID will see this as an
error and reconstruct the missing data, thereby not returning bad data to the caller.

I use lots of hand-me-down hard drives though, so I don't trust those drives even a little bit.
Error rates are high, and although the chance of undetectable corruption is small, I roll the dice
often enough that I expect it to happen... and when it happens, RAID won't fix it (even if I deploy
the write-hole fixes, it still won't fix this).

There's another way. [lvmraid(7)](https://man7.org/linux/man-pages/man7/lvmraid.7.html) has a "DATA
INTEGRITY" section discussing combining
[dm-raid](https://docs.kernel.org/admin-guide/device-mapper/dm-raid.html) (which is just a bridge
from [Device Mapper](https://docs.kernel.org/admin-guide/device-mapper/index.html) to md(4)) with
the [dm-integrity](https://docs.kernel.org/admin-guide/device-mapper/dm-integrity.html) target.

DM Integrity is interesting. It places checksums of data written *inline* with the data, and checks
them when you read the data. If it sees a checksum failure, it fails the read.

This is a great combo for untrustworthy drives which might have silent data corruption. So I started
by using lvmraid with data integrity turned on... and the performance was abysmal. More than a 50%
slowdown.

A careful read of the dm-integrity documentation explains why. The default is to journal all writes
to another section of the drive first, calculate integrity data, write that to the journal too, then
copy all the data from the journal to its final resting place. This makes a single write into at
best two writes to two different sections of the disk, hence the 50% perf penalty.

The thing that this journal is protecting against is that if a power outage occurs, the data on-disk
may not match its checksum, causing dm-integrity to produce read errors next time you read that
data.

... but so what? That's kind of exactly what we want to happen. By layering RAID on top of this,
when an error occurs it'll reconstruct the data and fix the corrupt blocks, so this isn't a problem
at all. The only important thing is that a flush only returns when both the data and the checksums
are fully written, and a careful read of the kernel sources says that yes it does.

Thankfully, there's an option to disable journaling.

Aside, there's a third way to use dm-integrity, specifically with an on-disk bitmap that's used to
track partially written sectors, and on a reboot checksums inside the region covered by the bitmap
will be recalculated. I have no idea why anyone would ever use this. If you use it and a power
outage occurs any data corruption that occurred will be recalculated as if it was correct, producing
silent data corruption and defeating the purpose of dm-integrity entirely.

Anyway, back to disabling journaling.

## Disabling the Journal in dm-integrity

First off, this is not supported *at all* by lvmraid(7), so in order to do this we have to stop
using LVM entirely (at least at this level). So to do this "by hand" we'll pull out
[dmsetup(8)](https://man7.org/linux/man-pages/man8/dmsetup.8.html) and
[integritysetup(8)](https://man7.org/linux/man-pages/man8/integritysetup.8.html).

integritysetup has a `--integrity-no-journal` option that you can use when opening an integrity
device. Great, that makes this easy to test with.

How do we set this up to work at boot?

Oh this is a mess. Because dm-integrity was originally intended for use with LUKS (full-disk
encryption), there's [not enough
information](https://github.com/systemd/systemd/issues/7757#issuecomment-822867467) in a standalone
dm-integrity superblock to open it automatically. Because of this, the Systemd folks introduced an
[systemd-integritysetup@.service(8)](https://man7.org/linux/man-pages/man8/systemd-integritysetup@.service.8.html)
which reads the needed additional information from
[integritytab(5)](https://man7.org/linux/man-pages/man5/integritytab.5.html), and it was introduced
after the version in my Ubuntu machine. Great.

After backporting `systemd-integritysetup@.service` to Ubuntu Jammy I discover that there's no way
to pass the `--integrity-no-journal` option via `/etc/integritytab`. So [I added
it](https://github.com/systemd/systemd/pull/27824).

Also, because of this lack of superblock information, there's no room for UUIDs, labels, etc. So
without additional work the only way to configure integritytab is with the `/dev/sd*` device names.

There's a way out however, GPT *partitions* support UUIDs and labels, so I just placed my dm-integrity
device inside a full-disk partition and can now refer to it in integritytab.

So the final resulting integritytab looks like this:

```
integrity_sdc PARTLABEL=integrity-sdc - no-journal
```

## dm-integrity's Data Layout

Ok well, the integrity devices are *working*, but you should have some questions. If the checksums
are stored *inline*, how much data do you store before a run of checksums? That will significantly
affect the decision of how to configure the various block/chunk/stripe sizes of the layers above
it... and this is where I fell down a rabbit hole within the rabbit hole we're already within.

Lots of small-but-important details for dm-integrity are undocumented... so I read the code. At this
point I've probably read most of the dm-integrity source code. It's only about 5k lines.

In particular, I'm looking to configure the dm-integrity target so that for my expected workload
(large-ish media files on RAID), we're most likely to be passing over a metadata area during reads
and writes, thereby avoiding seeks.

TODO link to patch
I've sent a patch to the kernel documentation with my findings, but the relevant ones are:

- Sectors in the kernel (including in the dm-integrity settings) are *always* 512 bytes, even if you
  create the target with `integritysetup format --sectors-size 4096`. If you do that (you should!),
  the disk will be accessed in 4k sectors, but the kernel will track it as if it was eight 512 byte
  sectors that were accessed.
- Accesses to the on-disk metadata area containing checksums is buffered. When an access to any
  given metadata area occurs, each unique metadata area gets its own buffer(s). The buffer size is
  capped at the size of the metadata area, but may be smaller, thereby requiring multiple buffers to
  represent the full metadata area. A smaller buffer size will produce a smaller resulting read/write
  operation to the metadata area for small reads/writes.

I additionally added documentation of the current defaults and the way those defaults relate, but
unfortunately, the defaults seem to be set up for drives using 512 byte sectors, so we've got to
decipher some new ones.

With a sector size of 4096, and the default hash of crc32c (with its checksum size of 4 bytes per
sector), that will require 4 bytes of checksum per 4 KiB. That means that we can store checksums for
at most 1024 sectors in a single 4 KiB metadata sector. If we don't store at least this much, the
remaining space in the metadata sector is wasted. Therefore if we configure the drive to store 1024
data sectors per metadata sectors, that gives us a data-to-metadata relationship of 4 MiB of data
per 4 KiB of metadata. So ideally, we'll configure the higher levels to write in at least 4 MiB
chunks, since a contiguous 4 MiB write will allow us to skip reading the metadata sector entirely...
right?

No. The code has no support for this notion. The metadata sector is always read. This would be a
nice improvement.

Ok, well, let's at least confirm that we're correctly ordering writes to the data+metadata so we end
up with a linear stream of writes going to the drive. To do that I learned about
[blktrace](https://git.kernel.org/pub/scm/linux/kernel/git/axboe/blktrace.git) which allows you to
see the stream of IO going to the drive.

```
$ dd if=/dev/urandom of=/dev/mapper/test-integrity bs=8k count=1 seek=7G oflag=seek_bytes,direct,sync

 65,0    7        4     0.000023069   411  D   R 14694800 + 8 [kworker/7:1H]
 65,0    7       10     0.000041662   411  D  WS 14694808 + 16 [kworker/7:1H]
 65,0    3        1     0.002346281     0  C   R 14694800 + 8 [0]
 65,0    7       16     0.002379086 11984  D   W 14694800 + 8 [kworker/7:20]
 65,0    3        2     0.002352703     0  C  WS 14694808 + 16 [0]
 65,0    3        3     0.002466207     0  C   W 14694800 + 8 [0]
```

Note: requests handled by different cores (column 2 above) do not perfectly interleave in an
a-comes-after-b order. I've adjusted the above so it reads more naturally in the way events *likely*
occurred.

What this says is that an 8 (512-byte) sector read (D R) starting at sector 14694800 went to the
drive (this is our metadata read), followed immediately by a 16 512-byte sector write (D WS)
starting at sector 14694808 (this is our 8k data write). We then wait for the metadata read to
complete (C R) and then issue the modified metadata write (D W) to sector 14694800. Then the data
write completes (C WS) followed by the metadata write (C W) and we're done.

This interaction implies that the metadata section *precedes* the data section (which matches the
kernel documentation), which means that we've got a nice linear read to access the metadata, but a
seek in order to write the modified metadata. I guess this is an okay trade-off, as it optimizes
reads over writes, especially considering that even a full 4 MiB block write will still perform the
metadata read.

## Conclusion

If you've come this far... I'm sorry. I'm not done with this setup. I'm currently overwriting all my
drives through dm-integrity in order to force it to calculate checksums for all the data, after
which I can start setting up the RAID array. More to come later.

{% comment %}
vim: ft=liquid sw=4 ts=4 sts=4 tw=100 noet
{% endcomment %}
