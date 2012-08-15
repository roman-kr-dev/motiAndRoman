MegaPlayListXXX.DataBase = (function ($) {
	var config = MegaPlayListXXX.Config.DataBase,
		dataBase;

	return Class.extend({
		init:function () {
			initDefaultData();
		},

		getPlaylistData:function (callback) {
			callback({
				playListData:appAPI.db.get('playListData'),
				playListSongs:appAPI.db.get('playListSongs')
			});
		},

		saveSong:function (songData) {
			var playListId = songData.playListId !== undefined ? songData.playListId : 0,
				playlistSongs = appAPI.db.get('playListSongs');

			playlistSongs[songData.videoId] = $.extend(songData, {playListId:playListId});

			appAPI.db.set('playListSongs', playlistSongs);
			
			console.log('yyyyy', playlistSongs);
		}
	});

	function initDefaultData() {
		var playlist = appAPI.db.get('playListData'),
			playlistSongs = appAPI.db.get('playListSongs');

		if (!playlist) {
			appAPI.db.set('playListData', {
				0:{
					name:config.defaultPlaylist.name
				}
			});
		}

		if (!playlistSongs) {
			appAPI.db.set('playListSongs', {});
		}
	}
})(jQuery);