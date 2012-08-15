var MegaPlayListXXX = {};

MegaPlayListXXX.Config = {
	baseCSS:'MegaPlayListXXX-',
	
	PlayList:{
		iframePlayerId:'MegaPlayListXXX-player',
		iframePlayerBaseUrl:'http://megaplayer.com',
		iframePlayerUrl:'http://megaplayer.com/megaPlayList/megaPlayListXXX.web/player.html?x='+new Date().getTime(),
		messageRegExp:/^MegaPlayListXXX\.(.*)/
	},

	DataBase:{
		defaultPlaylist:{
			name:'Main Playlist'
		}
	},

	SongManager:{
		YouTube:{
			site:/https?:\/\/(?:www\.)?youtube\.com/i,
			videoId:/\?v\=(.*?)(?:&|$)/,
			videoDataUrl:'http://gdata.youtube.com/feeds/api/videos/{video-id}?v=2&alt=jsonc',
			button:{
				buttonContainer:'#watch-actions',
				label:'Mega Playlist',
				icon:'http://crossrider.com/system/button1s/13859/px24/Untitled-1.png?1344001049',
				tooltipText:'Add this to mega playlist'
			}
		}
	},

	extensionActionsRouter: {

	}
};