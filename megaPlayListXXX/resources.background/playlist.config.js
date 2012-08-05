var MegaPlayListXXX = {};

MegaPlayListXXX.Config = {
	Background:{
		messageRegExp:/^MegaPlayListXXX\.(.*)/,
		iframePlayerUrl:'http://megaplayer.com/megaPlayList/megaPlayListXXX.web/player.background.html?r=' + Math.random(),
	},
	ActionsRouter:{
		baseEvent:'MegaPlayListXXX.'
	}
}