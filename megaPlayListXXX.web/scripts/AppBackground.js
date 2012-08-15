define(
	[
		'jQuery',
		'Underscore',
		'Class'
	],
	function($,_,Class) {	

		var This,
			config = {},
			elements = {
				player: null
			};

		return Class.extend({		
			init: function(options) {
				This = this;
				$.extend(true,config,options);
				
			},
			start: function() {
				sendMessage("init");
				setElements();
				setEvents();
			},

			stop: function(model) {
				elements.player.stop();
			},

            pause: function(model) {
                elements.player.pause(true);
            },

			// actions

			play: function(song) {

				var src;
				if (song.source.type == "youtube")
					src = song.source.model.href;

                var oPlayList = elements.player.getPlaylist()[0];
                if (elements.player.getState() == "PAUSED" && oPlayList.file == src) {
                    elements.player.pause(false); // resume
                } else {
                    elements.player.load({file: src});
                    elements.player.play(true);
                }
    		},

            seek: function(iPercent) {
                elements.player.seek(Math.round(iPercent * elements.player.getPlaylist()[0].duration / 100));
            }
		});

		function sendMessage(action, model) {
			window.parent.postMessage({action:"MegaPlayListXXX.player."+action,model:model}, '*');
		}

		function sendMessageToIframe(action, model) {
			window.parent.postMessage({action:"MegaPlayListXXX.player.sendToIframe",model:{action:"Background."+action,model:model}}, '*');
		}

		function updateGlobalObject(action,model) {
			window.parent.postMessage({action:"MegaPlayListXXX.updateGlobalObject",model:{action:action,model:model}}, '*');
		}

        function CovertJWPlayerStateToOurState(sState) {
            var ohStates = {
                "BUFFERING": "Buffering",
                "PLAYING": "Playing",
                "PAUSED": "Paused",
                "IDLE": "Idle"
            }
            return ohStates[sState];
        }

		function setElements() {
			$("body").append('<div class="container" id="container"></div>');

			elements.player = jwplayer("container");
			elements.player.setup({
				file: "http://www.youtube.com/watch?v=EgT_us6AsDg",
				flashplayer: "scripts/modules/mediaplayer/player.swf",
				autostart: false,
				events: {
					onReady: function() {
						// alert("ready");
					},

					onBufferChange: function(e) {
						updateGlobalObject("onBufferChange",{bufferPercent:e.bufferPercent})
					},
					onTime: function(e) {
						updateGlobalObject("onTimeUpdate",{duration:e.duration,position:e.position})
					},
					onComplete: function(e) {
						updateGlobalObject("onComplete");
					},

                    onPlay: function(e) {
                        updateGlobalObject("onStateChange",{state:"Playing",oldstate:CovertJWPlayerStateToOurState(e.oldstate)});
                    },
                    onPause: function(e) {
                        updateGlobalObject("onStateChange",{state:"Pause",oldstate:CovertJWPlayerStateToOurState(e.oldstate)});
                    },
                    onBuffer: function(e) {
                        updateGlobalObject("onStateChange",{state:"Buffering",oldstate:CovertJWPlayerStateToOurState(e.oldstate)});
                    },
                    onIdle: function(e) {
                        updateGlobalObject("onStateChange",{state:"Idle",oldstate:CovertJWPlayerStateToOurState(e.oldstate)});
                    }
				}
			});

		}

		function setEvents() {
			listenToMessages();
			
		}



		function listenToMessages() {

			var	originRegExp = /^chrome\-extension\:\/\//,
				messageRegExp = /^MegaPlayListXXX\.(.*)/;
		
			window.addEventListener('message', function(e){



				if (originRegExp.test(e.origin) && messageRegExp.test(e.data.action)) {
					var sAction = RegExp.$1;
						
					!This[sAction] || This[sAction].call(sAction,e.data.model);
				}
			}, false);

		}

	}
);