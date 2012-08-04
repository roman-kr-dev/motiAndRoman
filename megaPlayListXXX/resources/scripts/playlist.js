MegaPlayListXXX.PlayList = (function ($) {
	var baseCSS = MegaPlayListXXX.Config.baseCSS,
		config = MegaPlayListXXX.Config.PlayList,
		dataBase, songManager, actionsRouter, playerIframe;

	return Class.extend({
		init:function () {
			dataBase = new MegaPlayListXXX.DataBase();
			songManager = new MegaPlayListXXX.SongManager.Manager();
			actionsRouter = new MegaPlayListXXX.ActionsRouter();

			initEvents();
			initPlaylistIframe();
		}
	});

	function initEvents() {
		songManager.events.add('saveSong', dataBase.saveSong);
		
		window.addEventListener('message', function(e){
			if (e.origin !== config.iframePlayerBaseUrl && config.messageRegExp.test(e.data.action)) {
				route(RegExp.$1, e.data.model);
			}
		}, false);

		appAPI.message.addListener(function(msg) {
			route(msg.action,msg.model);
		});
	}

	function route(action,model) {
		actionsRouter.route(action,model);
	}

	function initPlaylistIframe() {
		//playerIframe = $('<iframe frameborder="no" id="' + config.iframePlayerId + '" src="' + config.iframePlayerUrl + '" class="' + baseCSS + 'player-iframe' + '" />').appendTo('body');
		
		//actionsRouter.setPlayetIframe(playerIframe);
	}
})(jQuery);