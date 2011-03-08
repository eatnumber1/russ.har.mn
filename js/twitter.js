function twitterCallback( tweets ) {
	var element = $("#twitter_update_list");
	if( !tweets || tweets.length == 0 ) {
		element.html("Error: No Data");
	} else {
		var tweet = tweets[0];
		element.html(tweet.text);
	}
}
