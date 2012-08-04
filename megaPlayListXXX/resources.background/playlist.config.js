var MegaPlayListXXX = {};

MegaPlayListXXX.Config = {
	Background:{
		messageRegExp:/^MegaPlayListXXX\.(.*)/,
		iframePlayerUrl:'http://megaplayer.com/megaPlaylist/megaPlayListXXX.web/player.background.html?r=' + Math.random(),
	},

	ActionsRouter:{
		baseEvent:'MegaPlayListXXX.'
	}
}