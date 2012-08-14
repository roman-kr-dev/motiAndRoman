MegaPlayListXXX.PlayList = (function ($) {
	var baseCSS = MegaPlayListXXX.Config.baseCSS,
		config = MegaPlayListXXX.Config.PlayList,
		songManager, actionsRouter, playerIframe;

	return Class.extend({
		init:function () {
			songManager = new MegaPlayListXXX.SongManager.Manager();
			actionsRouter = new MegaPlayListXXX.ActionsRouter();

			initEvents();
			initPlaylistIframe();
		}
	});

	function initEvents() {
		songManager.events.add('saveSong', function (song) {
			route('Domain.sendToBackground', {
				action:'database.saveSong',
				model:song
			});
		});
		
		window.addEventListener('message', function(e){
			if (e.origin !== config.iframePlayerBaseUrl && config.messageRegExp.test(e.data.action)) {
				route(RegExp.$1, e.data.model);
			}
		}, false);

		appAPI.message.addListener(function(msg) {
			route(msg.action, msg.model);
		});
	}

	function route(action, model) {
		actionsRouter.route(action, model);
	}

	function initPlaylistIframe() {
		//playerIframe = $('<iframe scrolling="no" frameborder="no" id="' + config.iframePlayerId + '" src="' + config.iframePlayerUrl + '" class="' + baseCSS + 'player-iframe' + '" />').appendTo('body');
		//actionsRouter.setPlayetIframe(playerIframe);
	}
})(jQuery);