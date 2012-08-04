// manage the GlobalObject (the global object store everything about the state of the player)
MegaPlayListXXX.GlobalObject = (function ($) {
	var This,
		GlobalObject = {
			hasLoaded: false, // used to check if we need to sync or return the object
			windowIsOpen: false, // used to check if the player window is open or close
			Playlist: {}, // getPlayListFromDB()
			PlayBar: {
				selectedIndex: -1,
				songs:
				[
					{id: 501, playListId: 1, name: "BALADA BOA GUSTTAVO LIMA NOVO DVD", source: {type: "youtube", model: {href: "http://www.youtube.com/watch?v=5NNi4JIwsCo&feature=related"}}},
					{id: 502, playListId: 1, name: "Euphoria", source: {type: "youtube", model: {href: "http://www.youtube.com/watch?v=t5qURKt4maw"}}},
				],
				hasSongs: true,
				controllersState: {
					playListOptions: {
						repeat: false,
						shuffle: false,
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
		"show/hide": function(bShow) {
			GlobalObject.windowIsOpen = bShow;
		},
		"onBufferChange": function(bufferPercent) {
			GlobalObject.PlayBar.controllersState.progress.bufferPercent = bufferPercent;
		},
		"onTimeUpdate": function(info) {
			GlobalObject.PlayBar.controllersState.progress.duration = info.duration;
			GlobalObject.PlayBar.controllersState.progress.position = info.position;
		},
		"onComplete": function() {
			GlobalObject.PlayBar.controllersState.progress.position = GlobalObject.PlayBar.controllersState.progress.duration;
		}
	};

	return Class.extend({
		init: function() {
			This = this;
		},
		getObject: function() {
			return GlobalObject;
		},
		updateObject: function (action, model) {
			!actions[action] || (function() {
				actions[action].call(action,model);
				This.updateChangesOnPlayerDomain(action, model);
			})();

			//console.log("GlobalObject > " + JSON.stringify({action:action,model:model}));
		},
		updateChangesOnPlayerDomain: function(action,model) {
			sendMessageToIframe('Background.onUpdate', GlobalObject);
			sendMessageToIframe('Background.GlobalObjectUpdate.' + action, model);

		},
		getPlayListFromDB: function(fCallback) {
			setTimeout(function() {
				GlobalObject.hasLoaded = true;
				GlobalObject.Playlist = {
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
		}
	});

})(jQuery);