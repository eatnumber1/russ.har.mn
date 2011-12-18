function twitterCallback( tweets ) {
	$("#twitter_update_list").removeAttr("class");
	return twitterCallback2(tweets);
}
