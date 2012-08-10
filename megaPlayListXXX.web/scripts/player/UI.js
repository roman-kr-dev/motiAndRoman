// UI Class (work with DOM and communicate with MegaPlayer.Domain)
/*
	Events:
		onReady
*/
define(['jQuery','Class','Helpers','Template','player/domain'], function($,Class,Helpers,Template,Domain) {

	var This, // hold the context of current class
		domain, // hold reference to MegaPlayer.Domain class
		templates, // i am using this variable for hold the code of mustache templates
		config = { // configutation, we can override this from the constructor
			images: {
				defaultSongCover: "images/player-bar/empty.gif"
			}
		},
		elements = {

			// player area
				hideWindow: null,

			// playlist area
				tabPlayList: null, // reference to the playlist tab content
				playList: null, // reference to play list container
				playListInputAdd: null,
				songsList: null, // reference to play bar container

			// progress area
				progressFill: null,
				progressBuffer: null,

			// controller area
                controllers: null,
                playPauseButton: null,
                repeatButton: null,
                shuffleButton: null,

			// current song info area
				currentSongThumbnail: null,
				currentSongName: null,
				currentSongTime: null
		},
		state = {
			repeatMode: false, // are we in repeat mode? (you can change this in "changeState" method)
			shuffleMode: false, // are we in shuffle mode? (you can change this in "changeState" method)
			lastSong: null, // hold the last song that played, read only
			currentSong: null // hold the current song id that play, read only
		};
	
	return Class.extend({

		start: function() {

			setElements();
			setPlaylistLoader();

			Helpers.Series(
				[
					function(f) {
						domain = new Domain();
						domain.events.add("onReady", f);
						domain.events.add("onPlayListAdded", Domain_PlayListAdded);
						domain.events.add("onPlayListRemoved", Domain_PlayListRemoved);
						domain.events.add("onPlay", Domain_PlayStart);
						domain.events.add("onBufferChange", Domain_BufferChange);
						domain.events.add("onTimeUpdate", Domain_TimeUpdate);
						domain.events.add("onComplete", Domain_SongComplete);
                        domain.events.add("onPlayBarUpdate", Domain_PlayBarUpdate);
                        domain.events.add("onPause", Domain_SongPause);
                        domain.events.add("onControllerModeChanged", Domain_ControllerModeChanged);


						domain.start();
					},
					function(f) {
						loadElements();
						setEvents();
						This.events.fire("onReady");
					}
				]
			);	

		},

		init:function (options) {

			This = this;
			$.extend(true,config,options);
			
		},

		hideWindow: function() {
			domain.showHide();
		},

		changeState: function(key) {

			var stateOptions = {
				"shuffle": function() { // shuffle/unshuffle
					state.shuffleMode = !state.shuffleMode;
				},
				"repeat": function() { // repeat/unrepeat
					state.repeatMode = !state.repeatMode;
				}
			};

			if (stateOptions[key])
				stateOptions[key]();
		},

		play: function(options) {

			console.log("UI > play");

			var settings = {
				index: null, // int, play song by index
				next: null, // boolean, play the next song in the list, if the next song does not exists, i  play the first song
				prev: null // boolean, play the previous song in the list, if the previous song does not exists, play the last song
			};

			$.extend(settings,options);

			domain.play(settings);
		},

		stop: function() {
			console.log("UI > stop");
			domain.stop();
		},

		addPlayListToPlayListBar: function(sPlayListName) {

			domain.addPlayList(sPlayListName, function(result) {
				if (!result.success)
				{
					var ohMessages = {
						"Unknown": "An error occured, try again later",
						"MissingName": "Please type a playlist name"
					};
					if (ohMessages[result.message])
						alert(ohMessages[result.message]);
				}
			});

		},

		addPlayListToPlayBar: function(iPlayListId) {
			
			domain.addPlayListToPlayBar(iPlayListId);

			/*
			var oPlayList = domain.getPlayListById(iPlayListId);
			if (!oPlayList) return;

			alert(JSON.stringify(oPlayList));

			Template.RenderAndUpdate(
				"Template_SongItem",
				{
					model: oPlayList,
					to: elements.songsList,
					mode: "append"
				},
				function(s) {
					elements.songsList.find("ul:gt(0)").each(function() { $(this).children().appendTo($(this).prev("ul")); $(this).remove(); });
					elements.songsList.find("li:not(.added)").css("display","none").addClass("added").fadeIn(300);
				}
			);
			*/

		},

		listenToPlayList: function(iPlayListId) {
			this.removeAllSongsFromPlayBar();
			this.addPlayListToPlayBar(iPlayListId);
			this.play({
				index: 0	
			});
		},

		removePlayList: function(iPlayListId) {
			if (!confirm("Are you sure?")) return;
			domain.removePlayList(iPlayListId);

		},

		removeAllSongsFromPlayBar: function() {
			this.stop();
			elements.songsList.html("");			
		},

		removeSongFromPlayBar: function(index) {
			elements.songsList.find(".song-item:eq("+index+")").remove();
		}
	});

	function Domain_PlayStart(model) {

		var song = model.song;

        if (!model.fromPaused) {
		    elements.progressFill.css("width","0%");
		    elements.progressBuffer.css("width","0%");
        }

		elements.songsList.find("li.song-item").removeClass("selected").filter(":eq("+model.index+")").addClass("selected");
		elements.currentSongThumbnail.attr("src", song.thumbnail || config.images.defaultSongCover);
		elements.currentSongName.html(song.name);

        elements.playPauseButton.removeClass("ico-play").removeClass("disabled").addClass("ico-pause");

	}

    function Domain_ControllerModeChanged(model) {



        var buttons = {
            "repeat": elements.repeatButton,
            "shuffle": elements.shuffleButton
        }

        $.each(buttons, function(key) {
            buttons[key].removeClass("selected");
        });

        $.each(model, function(key) {

            if (model[key]) {
                buttons[key].addClass("selected");
            }
        });

    }

	function Domain_BufferChange(bufferPercent) {
		elements.progressBuffer.css("width",bufferPercent + "%");
	}


	function Domain_TimeUpdate(info) {

		elements.progressFill.css("width",Math.min((info.position/(info.duration-1)*100),100) + "%");

		var totalSec = Math.floor(info.position);

		var hours = parseInt( totalSec / 3600 ) % 24;
		var minutes = parseInt( totalSec / 60 ) % 60;
		var seconds = totalSec % 60;

		var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);

		elements.currentSongTime.html(result);
		// info.buffer
		// info.seconds
		// info.totalSeconds
		// info.model
	}

	function Domain_SongComplete() {
		
		setTimeout(function() {
			elements.progressFill.animate({
				width: "100%"
			},200);
			domain.play({
				next: true
			});
		},30);

	}

    function Domain_SongPause() {
        elements.playPauseButton.removeClass("ico-pause").addClass("ico-play");
    }

	function Domain_PlayBarUpdate(songs) {

		var modelForTemplate = {
			hasSongs: !!songs.length,
			songs: songs
		}

		Template.RenderAndUpdate(
			"Template_SongItem",
			{
				
				model: modelForTemplate,
				to: elements.songsList,
				mode: "append"
			},
			function(s) {
				elements.songsList.find("ul:gt(0)").each(function() { $(this).children().appendTo($(this).prev("ul")); $(this).remove(); });
				elements.songsList.find("li:not(.added)").css("display","none").addClass("added").fadeIn(300);
			}
		);

	}

	function Domain_PlayStop() {

	}

	function Domain_PlayPause() {

	}

	function Domain_PlayListAdded(model) {

		// reset the input
		var oInput = elements.tabPlayList.find(".playlist-add input");
		oInput.val(oInput.attr("oldVal"));

		


			Template.RenderAndUpdate(
				"Template_PlaylistItem",
				{
					model: {hasPlaylists:true,list:[model]},
					to: elements.playList,
					mode: "append"
				},
				function(s) {

					elements.playList.children("ul:gt(0)").each(function() { $(this).children().appendTo($(this).prev("ul")); $(this).remove(); });
					elements.playList.find("li.playlist-item:not(.added)").css("display","none").addClass("added").fadeIn(300);

					elements.playListInputAdd.focus();
					updatePlayListScroller();

				}
			);




	}

	function Domain_PlayListRemoved(iPlayListId) {
		elements.playList.find(".playlist-item[data-id='"+iPlayListId+"']").remove();
	}


	function setPlaylistLoader() {
		elements.playList.html("<div style=\"text-align:center;margin-top:15px;\"><span class=\"loader\"><!-- //--></span></div>");
	}

	function updatePlayListScroller() {
		// elements.playList.mCustomScrollbar("update");
	}

	// store references of dom elements
	function setElements() {

		$(".focused").each(function() {
			$(this).attr("oldVal",$(this).val());
		}).bind("focus", function() {
			if ($(this).val() == $(this).attr("oldVal"))
				$(this).val("");	
		}).bind("blur", function() {
			if ($.trim($(this).val()) == '')
				$(this).val($(this).attr("oldVal"));
		});

		// Player area
			elements.hideWindow = $("#hideWindow");

		// Playlist area
			elements.tabPlayList = $("#tab-playlist");
			elements.playList = elements.tabPlayList.find(".playlist-thelist");
			elements.playListInputAdd = elements.tabPlayList.find(".playlist-add input");
			elements.songsList = $("#songslist-thelist");

		// Progress area
			elements.progressFill = $("#ProgressFill");
			elements.progressBuffer = $("#ProgressBuffer");

		// Current song area
			elements.currentSongThumbnail = $("#CurrentSongInfo .song-thumbnail");
			elements.currentSongName = $("#CurrentSongInfo .song-name");
			elements.currentSongTime = $("#songTimer");
			elements.currentSongThumbnail.attr("src", config.images.defaultSongCover);
			

		// Scrollers
			/*elements.playList.mCustomScrollbar({
				scrollInertia: 0,
				advanced: {
					updateOnBrowserResize:true, 
					updateOnContentResize:true,
					autoExpandHorizontalScroll: true
				}
			});*/

        // Controllers area

            elements.controllers = $(".controllers");

            elements.playPauseButton = elements.controllers.find(".ico-play");
            elements.repeatButton = elements.controllers.find(".ico-repeat");
            elements.shuffleButton = elements.controllers.find(".ico-shuffle");

		// Templates
			templates = {};
			$("#Player_Templates").children().each(function() {
				templates[$(this).attr("class")] = $(this).html();
			});

	}

	function loadElements() {	

		Template.RenderAndUpdate(
			"Template_PlaylistItem",
			{
				model: domain.getList(),
				to: elements.playList
			},
			function(s) {
				elements.playList.find("li.playlist-item:not(.added)").addClass("added")
				elements.playList.children().css("display","none").fadeIn(300);
				updatePlayListScroller();
			}
		);

		elements.tabPlayList.find(".playlist_count_num").html(domain.getList().list.length);



	}

	function setEvents() {

		$(document).on("selectstart", function() {
			return false;
		});

		function getPlayListId(oEl) {
			return +$(oEl).parents("LI:first").attr("data-id");
		}

		function getSongId(oEl) {
			return +$(this).parents("LI:first").attr("data-id");
		}

		function getSongIndex(oEl) {
			var oLI = $(oEl).is("li") ? $(oEl) : $(oEl).parents("LI:first");
			return oLI.parent().children().index(oLI);
		}

		// Events of player

			// close window
			elements.hideWindow.bind("click", function() {
				This.hideWindow();
			});
			

		// Events of playlist area

			// add playlist when click "Enter" on Input 
			elements.playListInputAdd.bind("keydown", function(e) {
				if (e.keyCode == 13)
				{
					This.addPlayListToPlayListBar(
						elements.playListInputAdd.val()
					);
				}
			});

			// add a new playlist
			elements.tabPlayList.find(".playlist-add .blue-button-add").bind("click", function() {
				This.addPlayListToPlayListBar(
					elements.playListInputAdd.val()
				);
			});

			// expand/unexpand playlist item
			elements.playList.find(".playlist-main .ico-arrow").live("click", function() {

				var oLI = $(this).parents("LI:first");

				if (oLI.hasClass("open"))
				{
					oLI.removeClass("open");
					oLI.find(".playlist-main .ico-arrow").removeClass("ico-arrow-bottom");
					oLI.children("UL").stop(true,true).slideUp(300);
				} else {		
					oLI.addClass("open");
					oLI.find(".playlist-main .ico-arrow").addClass("ico-arrow-bottom");
					oLI.children("UL").stop(true,true).slideDown(300);
				}

			});

			// actions per playlist item

				// double click on playlist item and play the songs
				elements.playList.find(".playlist-main .playlist-name").live("dblclick", function() {
					var iPlayListId = getPlayListId(this);
					This.listenToPlayList(iPlayListId);
				});

				// click on play icon
				elements.playList.find(".playlist-main .ico-play").live("click", function() {
					var iPlayListId = getPlayListId(this);
					This.listenToPlayList(iPlayListId);
				});

				// append play list songs to Play bar
				elements.playList.find(".playlist-main .move-right").live("click", function() {
					var iPlayListId = getPlayListId(this);
					This.addPlayListToPlayBar(iPlayListId);
				});

				// remove play list item
				elements.playList.find(".playlist-main .ico-remove").live("click", function() {
					var iPlayListId = getPlayListId(this);
					This.removePlayList(iPlayListId);
				});


		// Events of songs area (Play bar)

			// play song

				elements.songsList.find("li.song-item").live("mousedown", function() {

					var iIndex = getSongIndex(this);
					
					
					This.play({
						index: iIndex
					});
					

				});

			// remove song item from the Play bar (not playlist bar)
				elements.songsList.find(".ico-remove").live("click", function(e) {
					e.stopPropagation();
					var index = getSongIndex(this);
					console.log(index);
					This.removeSongFromPlayBar(index);
				});
			
		// Events of controllers area

            elements.playPauseButton.bind("click", function() {

                var oEl = $(this);

                if (oEl.hasClass("disabled"))
                    return;

                if (oEl.hasClass("ico-play")) {
                    var oPlayBar = domain.getPlayBar();
                    This.play({index: oPlayBar.selectedIndex > -1 ? oPlayBar.selectedIndex : 0})
                } else if (oEl.hasClass("ico-pause")) {
                    domain.pause();
                }

            });

            elements.repeatButton.bind("click",function(){
               domain.toggleRepeat();
            });

            elements.shuffleButton.bind("click",function(){
                domain.toggleShuffle();
            });

	}

	
});