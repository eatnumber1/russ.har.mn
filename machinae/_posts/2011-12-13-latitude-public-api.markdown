---
layout: post
title: Getting Public Information From Latitude
excerpt: Getting public information about a person from Latitude is no simple task. Google has no public API for retrieving non-authenticated information about a person.
---

In making this website, I wanted to put on my [homepage](/#latitude) my Google
Latitude determined current location (at the statewide level). Google provides the
[Latitude API](http://code.google.com/apis/latitude/), but this is only for
authenticated users, and therefore cannot be used by people wishing to publicly
publish their location.

The Latitude website provides a location widget that can be placed on your
website to show your current location, but it uses an undocumented API. After a
bit of effort reverse engineering the location widget, I eventually came up with
the following URL:

	http://www.google.com/latitude/apps/badge/api?user=4048757213362106746&type=json

This is an undocumented API by Google, and notably cannot use JSONP. That
means that I couldn't use that URL directly from within my static-page
Jekyll-generated website thanks to the
[same origin policy](http://en.wikipedia.org/wiki/Same-origin_policy).

In order to work around this rather severe limitation, I leveraged the power of
[YQL](http://en.wikipedia.org/wiki/Yahoo!_query_language), which is able to
effectively turn a JSON-only data source into a JSONP data source. At the end of
the day, I'm able to retrieve my current location from Latitude by going through
Yahoo with the following code:

{% highlight javascript %}
function doLatitude( id, elem ) {
  var url = "http://www.google.com/latitude/apps/badge/api";
  var data = $.param({
    user: id,
    type: "json"
  });
  var full_url = url + "?" + data;
  $.ajax({
    url: "http://query.yahooapis.com/v1/public/yql",
    dataType: "jsonp",
    data: {
      q: "SELECT * FROM json WHERE url='" + full_url + "'",
      format: "json"
    },
    success: function( data ) {
      if( data.query.results.json.features == null ) {
        elem.html("<span style=\"font-style:italic\">location unavailable</span>");
      } else {
        elem.html(data.query.results.json.features.properties.reverseGeocode);
      }
    },
    // TODO: Error handling
  });
}
{% endhighlight %}

{% include definitions.mkd %}

{% comment %}
vim: ft=mkd sw=4 ts=4 sts=4 tw=80
{% endcomment %}
