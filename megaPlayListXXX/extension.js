appAPI.ready(function($) {
	// we assure that we are not inside iframe
	if (top != self) return;

	// adding resources
	appAPI.resources.includeJS("scripts/assets/base.class.js");
	appAPI.resources.includeJS("scripts/assets/jquery.ui.position.js");

	appAPI.resources.includeJS("scripts/playlist.config.js");
	appAPI.resources.includeJS("scripts/playlist.router.js");
	appAPI.resources.includeJS("scripts/playlist.database.js");
	appAPI.resources.includeJS("scripts/playlist.js");

	appAPI.resources.includeJS("scripts/song.managers/manager.js");
	appAPI.resources.includeJS("scripts/song.managers/manager.youtube.js");

	appAPI.resources.addInlineJS("scripts/playlist.messages.js");

	appAPI.resources.includeCSS("styles/manager.css");

	var megaPlayListXXX = new MegaPlayListXXX.PlayList();

	//var moti = gay;
	//moti is gay
});