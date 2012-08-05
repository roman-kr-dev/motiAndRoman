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

			// actions

			play: function(src) {
				elements.player.load({file: src});
				elements.player.play(true);

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
					onPlay: function(e) {  },
					onBufferChange: function(e) {
						updateGlobalObject("onBufferChange",{bufferPercent:e.bufferPercent})
					},
					onTime: function(e) {
						updateGlobalObject("onTimeUpdate",{duration:e.duration,position:e.position})
					},
					onComplete: function(e) {
						updateGlobalObject("onComplete")
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