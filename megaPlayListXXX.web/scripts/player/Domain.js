// UI Class (work with DOM and communicate with MegaPlayer.Domain)
/*
	Available Events:
		onReady
		onPlayListAdded
		onPlayListRemoved
		onPlay
		onSyncDone
        onPause
*/
define(['jQuery','Class','Helpers'], function($,Class,Helpers) {

	var This,
		globalObject = null, // store the data of the globalObject
		config = {
			playList: null
		},
		DEBUG = { // at the end, we should remove this
			playlistCounter: 1000,
			songCounter: 2500
		},
		extensionCallbacks = {};

	return Class.extend({

		// General
			"showHide": function() {
				sendToExtension("show/hide");
			},

		// Domain methods
			getList: function() {
				return globalObject.Playlist;
			},

            getPlayBar: function() {
                return globalObject.PlayBar;
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
			},

			getSong: function(iPlayListId, iSongId) {
				var oSong = null;
				$.each(globalObject.Playlist.list, function() {
					if (this.id == iPlayListId)
					{
						$.each(this.songs, function() {
							if (this.id == iSongId)
							{
								oSong = this;
								return false;
							}
						});
						return false;
					}
				});
				return oSong;
			},

			addPlayList: function(sPlayListName,fCallback) {

				console.log("Domain > addPlayList");

				sPlayListName = $.trim(sPlayListName);
				if (sPlayListName == '')
				{
					fCallback({
						success: false,
						message: "MissingName"
					});
					return;
				}

				if 
				(
					!This.search(sPlayListName,{types:["playlist"],accuracy:"partial"}).length 
					|| 
					confirm("You already have a playlist with the same name, add anyway?")
				)
				{
					// brain callback
					setTimeout(function() {
						

							var model = {
								id: ++DEBUG.playlistCounter,
								name: sPlayListName,
								created: new Date(2012,6,27),
								songs: [],
								hasSongs: false
							}

							playList.hasPlayLists = true;
							playList.list.push(model);

							if (fCallback) {
								fCallback({
									success: true,
									message: "done",
									model: model
								});
							}

							This.events.fire("onPlayListAdded");

					},300);
				} else {
					fCallback({
						success: false,
						message: "UserCancelDuplicates"
					});
				}


			},

			removePlayList: function(iPlaylistID,fCallback) {

				console.log("Domain > removePlayList("+iPlaylistID+")");

				$.each(playList.list, function(idx) {
					if (this.id == iPlaylistID)
					{
						playList.list.splice(idx,1);
						playList.hasPlayLists = !!playList.list.length;

						return false;
					}
				});

				var model = iPlaylistID;

				// i dont want to wait for brain
				This.events.fire("onPlayListRemoved",model);
				
				// brain callback
				setTimeout(function() {
					if (fCallback)
						fCallback(model);
				},300);

			},

			search: function(sTerm,options) {

				var settings = {
					accuracy: "partial", // partial || exact
					types: ["playlist","song"]
				};

				$.extend(settings,options);
				

				var aResults = [];

				sTerm = $.trim(sTerm.toLowerCase());

			
				var bPlayList = $.inArray("playlist",settings.types) > -1;
				var bSong = $.inArray("song",settings.types) > -1;
				
				function searchTerm(model,type) {
					var name = model.name.toLowerCase();
					
					if (
						(settings.accuracy == "exact" && name == sTerm)
						||
						(settings.accuracy == "partial" && name.indexOf(sTerm) > -1)
					)
					{
						aResults.push({
							type: type,
							model: model
						});
					}
				}
				
				$.each(playList.list, function() {
					if (bPlayList)
					{
						
						searchTerm(this,"playlist");
					}
					if (bSong)
					{
						$.each(this.songs, function() {
							searchTerm(this,"song");
						});
					}
				});

				return aResults;

			},

			play: function(options) { // song = reference to song object, for example: {id: 500, name: "Queen - Show must go on", source: {type: "youtube", model: {href: "http://www.youtube.com/watch?v=YHOKosvAxcs"}}}

				
				var settings = {
					index: null, // int, play song by index
					next: null // boolean, play the next song in the list, if the next song does not exists, i  play the first song
				};

				$.extend(settings,options);

				updateGlobalObject("play",settings);

			},

			stop: function() {
                sendToBackgroundFrame("stop");
			},

            pause: function() {
                sendToBackgroundFrame("pause");
            },

			addPlayListToPlayBar: function(iPlayListId) {
				updateGlobalObject("addPlayListToPlayBar",{iPlayListId:iPlayListId});
			},

            toggleRepeat: function() {
                updateGlobalObject("toggleRepeat");
            },

            toggleShuffle: function() {
                updateGlobalObject("toggleShuffle");
            },

		// Extension Callbacks

			Extension: {
				getPlaylist: function(playlist) {
					alert("nice" + JSON.stringify(playlist));
				}
			},

		// Background Callbacks

			Background: {
				getGlobalObjectCallback: function(oGlobalObject) {
					globalObject = oGlobalObject;
					This.events.fire("onReady");
				},
				onUpdate: function(oGlobalObject) {
					globalObject = oGlobalObject;
				},
				globalObjectUpdate: {
					"show/hide": function(model) {
						console.log("show/hide update");
					},
					"onBufferChange": function(model) {
						This.events.fire("onBufferChange",model.bufferPercent);
					},
					"onTimeUpdate": function(info) {
						This.events.fire("onTimeUpdate",info);
					},
					"onComplete": function() {
						This.events.fire("onComplete");
					},
                    "onPause": function() {
                        This.events.fire("onPause");
                    },
					"addPlayListToPlayBar": function(model) {
						This.events.fire("onPlayBarUpdate",model.returnObject);
						// aaaaaaaaaaa
					},
					"play": function(model) {
						This.events.fire("onPlay",{
							index: globalObject.PlayBar.selectedIndex,
							song: globalObject.PlayBar.songs[globalObject.PlayBar.selectedIndex],
                            fromPaused: model.returnObject.fromPaused
						});
					},
                    "toggleRepeat": function() {
                        UpdateControllerModeState();
                    },
                    "toggleShuffle": function(){
                        UpdateControllerModeState();
                    }
				}
			},


		// Class methods

			start: function() {

				sendToExtension("init");
				sendToBackground("getGlobalObject");
				listenToMessages();

				/*Helpers.Series(
					[
						sync,
						function(f,oGlobalObject) {
							globalObject = oGlobalObject;
							
						}
					]
				);

				sendToBackgroundFrame("stop",{stop:1});*/
			},

			init: function(options) {
				This = this;
				$.extend(true,config,options);

			}

	});

	// Private Methods

		//function sync() {
			//sendToExtension("sync",null);
			/*
			,function(oGlobalObject) {
				
				fCallback(oGlobalObject);
				This.events.fire("onSyncDone");
			}
			*/
		//}

        function UpdateControllerModeState() {

            This.events.fire("onControllerModeChanged",{
                repeat: globalObject.PlayBar.controllersState.playListOptions.repeat,
                shuffle: globalObject.PlayBar.controllersState.playListOptions.shuffle
            })
        }




		// Communication Methods

			function listenToMessages() {
				var messageRegExp = /^MegaPlayListXXX\.response\.(.*)/;
				window.addEventListener('message', function(e){
					if (messageRegExp.test(e.data.action)) {
						var sAction = RegExp.$1;

						

						if (sAction == "extension_callback")
						{
							var model = e.data.model;
							if (extensionCallbacks[model.id])
							{
								extensionCallbacks[model.id](model.model);
								delete extensionCallbacks[model.id];
							}
							return;
						}

						var oFunc = This;
						while (sAction.indexOf(".") > -1)
						{
							oFunc = oFunc[sAction.split(".")[0]];
							sAction = sAction.substring(sAction.split(".")[0].length+1,sAction.length);
						}

						

						!oFunc[sAction] || oFunc[sAction].call(sAction,e.data.model);
					}
				}, false);
			}

			function updateGlobalObject(action,model) {
				sendToExtension("updateGlobalObject",{action:action,model:model});
			}
			

			function sendToExtension(action,model) {
				model || (model={});

				window.parent.postMessage({
					action: "MegaPlayListXXX." + action,
					model: model
				}, '*');
			}

			function sendToBackground(action,model) {
				window.parent.postMessage({
					action: "MegaPlayListXXX.Domain.sendToBackground",
					model: {action:action,model:model}
				}, '*');
			}

			function sendToBackgroundFrame(action,model) {
				window.parent.postMessage({
					action: "MegaPlayListXXX.Domain.sendToBackgroundFrame",
					model: {action:action,model:model}
				}, '*');
			}




});