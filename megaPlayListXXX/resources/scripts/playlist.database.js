MegaPlayListXXX.DataBase = (function ($) {
	var config = MegaPlayListXXX.Config.DataBase,
		dataBase;

	return Class.extend({
		init:function () {
			initDefaultData();
		},

		saveSong:function (songData, playListId) {
			var playListId = playListId !== undefined ? playListId : 0,
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