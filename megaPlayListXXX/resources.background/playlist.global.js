// manage the globalObject (the global object store everything about the state of the player)
MegaPlayListXXX.GlobalObject = (function ($) {
	var This,
		actionsRouter,
		globalObject = {
			hasLoaded: false, // used to check if we need to sync or return the object
			windowIsOpen: false, // used to check if the player window is open or close
			Playlist: {}, // getPlayListFromDB()
			PlayBar: {
				selectedIndex: -1,
				songs: [],
				hasSongs: true,
				controllersState: {
					playListOptions: {
						repeat: false,
						shuffle: false,
						_shufflePreviousIndexes: [], // present the previous indexes that shuffled
						pause: false,
						play: false
					},
					progress: {
						position: 0,
						duration: 0,
						bufferPercent: 0
					}
				}
			},
			Social: {
				
			}
		};

	var actions = {
		"show/hide": function(model) {
			globalObject.windowIsOpen = model.bShow;
		},
		"onBufferChange": function(bufferPercent) {
			globalObject.PlayBar.controllersState.progress.bufferPercent = bufferPercent;
		},
		"onTimeUpdate": function(info) {
			globalObject.PlayBar.controllersState.progress.duration = info.duration;
			globalObject.PlayBar.controllersState.progress.position = info.position;
		},
		"onComplete": function() {
			globalObject.PlayBar.controllersState.progress.position = globalObject.PlayBar.controllersState.progress.duration;
		},
		"addPlayListToPlayBar": function(model) {
			var oPlayList = This.getPlayListById(model.iPlayListId);
			var aSongsToAdd = oPlayList.songs;
			globalObject.PlayBar.songs = globalObject.PlayBar.songs.concat(aSongsToAdd);
			return aSongsToAdd; 
		},
		"play": function(options) {

			var settings = {
				index: null, // int, play song by index
				next: null // boolean, play the next song in the list, if the next song does not exists, i  play the first song
			};
			$.extend(settings,options);

			var iSongIndex,oPlayBar,playListOptions;

			function updateVars() {
				oPlayBar = globalObject.PlayBar;
				playListOptions = oPlayBar.controllersState.playListOptions;
			}

			updateVars();

			if ($.type(settings.index) == "number")
			{
				iSongIndex = settings.index;
			} else if (settings.next)
			{
				if (playListOptions.shuffle)
				{

					if ((oPlayBar.songs.length+1) == playListOptions._shufflePreviousIndexes.length) globalObject.PlayBar.controllersState.playListOptions._shufflePreviousIndexes = [];
					globalObject.PlayBar.controllersState.playListOptions._shufflePreviousIndexes.push(oPlayBar.selectedIndex);

					updateVars();

					var ohIndexes = {}, aIndexes = [];
					for (var i=0;i<oPlayBar.songs.length;i++) ohIndexes[i] = true;
					for (var i=0;i<playListOptions._shufflePreviousIndexes.length;i++) delete ohIndexes[playListOptions._shufflePreviousIndexes[i]];
					$.each(ohIndexes, function() { aIndexes.push[this]; });

					iSongIndex = aIndexes[Math.round(Math.random()*(aIndexes.length-1))];
					globalObject.PlayBar.controllersState.playListOptions._shufflePreviousIndexes.push(iSongIndex);

					updateVars();					

				} else {
					if ((oPlayBar.selectedIndex+1) == oPlayBar.songs.length)
					{
						if (playListOptions.repeat)
						{
							iSongIndex = 0;
						}
					} else {
						iSongIndex = oPlayBar.selectedIndex+1;
					}
				}
				song = globalObject.PlayBar.songs[globalObject.PlayBar.selectedIndex + 1];
			}

			

			oPlayBar.selectedIndex = iSongIndex;
			song = globalObject.PlayBar.songs[iSongIndex];

			
			
			if (song.source.type == "youtube")
			{
				//alert(song.source.model.href);
				actionsRouter.sendMessageToBackgroundIframe(this,song.source.model.href);
			}
			

			
		
		}
	};

	return Class.extend({
		init: function(options) {
			This = this;
			actionsRouter = options.actionsRouter;
		},
		getObject: function() {
			return globalObject;
		},
		updateObject: function (action, model) {
			!actions[action] || (function() {
				model || (model = {});		
				model.returnObject = actions[action].call(action,model);
				This.updateChangesOnPlayerDomain(action, model);
			})();

			//console.log("globalObject > " + JSON.stringify({action:action,model:model}));
		},
		updateChangesOnPlayerDomain: function(action,model) {
			sendMessageToIframe('Background.onUpdate', globalObject);
			sendMessageToIframe('Background.globalObjectUpdate.' + action, model);

		},
		getPlayListFromDB: function(fCallback) {
			setTimeout(function() {
				globalObject.hasLoaded = true;
				globalObject.Playlist = {
					hasPlaylists: true,
					list:
					[
						{
							id: 1,
							name: "Romania",
							created: new Date(2012,6,21),
							songs: // thumbnail property is not required
							[	
								{id: 499, playListId: 1, name: "Suprise Mother Fucker!!", source: {type: "youtube", model: {href: "http://www.youtube.com/watch?v=5CfNarCjSHM&feature=related"}}},
								{id: 500, playListId: 1, name: "CRBL feat. Helen - KBoom (Radio Edit)", source: {type: "youtube", model: {href: "http://www.youtube.com/watch?v=0Sy3J7O5bxM"}}},
								{id: 501, playListId: 1, name: "BALADA BOA GUSTTAVO LIMA NOVO DVD", source: {type: "youtube", model: {href: "http://www.youtube.com/watch?v=5NNi4JIwsCo&feature=related"}}},
								{id: 502, playListId: 1, name: "Euphoria", source: {type: "youtube", model: {href: "http://www.youtube.com/watch?v=t5qURKt4maw"}}},
							],
							hasSongs: true
						}
					]
				};
				fCallback();
			},1000);
		},
		getPlayListById: function(iPlayListId) {
			var oPlayList;
			$.each(globalObject.Playlist.list, function() {
				if (this.id == iPlayListId)
				{
					oPlayList = this;
					return false;
				}
			});
			return oPlayList;

		}
	});

})(jQuery);