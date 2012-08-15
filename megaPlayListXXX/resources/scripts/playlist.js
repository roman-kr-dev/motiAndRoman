MegaPlayListXXX.PlayList = (function ($) {
	var baseCSS = MegaPlayListXXX.Config.baseCSS,
		config = MegaPlayListXXX.Config.PlayList,
		songManager, extensionActionsRouter, playerIframe;

	return Class.extend({
		init:function () {
			songManager = new MegaPlayListXXX.SongManager.Manager();
			extensionActionsRouter = new MegaPlayListXXX.ExtensionActionsRouter();

			initEvents();
			initPlaylistIframe();
		}
	});

	function initEvents() {

		songManager.events.add('saveSong', function (song) {
			sendToBackground('database.saveSong',song);
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

	function initPlaylistIframe() {
		playerIframe = $('<iframe scrolling="no" frameborder="no" id="' + config.iframePlayerId + '" src="' + config.iframePlayerUrl + '" class="' + baseCSS + 'player-iframe' + '" />').appendTo('body');
		extensionActionsRouter.setPlayetIframe(playerIframe);
	}

	// core methods
	function sendToBackground(action, model) {
		route('Domain.sendToBackground', {
			action:action,
			model:model
		});
	}

	function sendToBackgroundFrame(action, model) {
		route('Domain.sendToBackgroundFrame', {
			action:action,
			model:model
		});
	}

	function sendToIframe(action,model) {
		route('sendToIframe', {
			action:action,
			model:model
		});
	}

	function route(action, model) {
		extensionActionsRouter.route(action, model);
	}


})(jQuery);