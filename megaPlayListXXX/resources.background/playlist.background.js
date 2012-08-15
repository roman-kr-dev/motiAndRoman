MegaPlayListXXX.PlayListBackground = (function ($) {
	var This,
		config = MegaPlayListXXX.Config.Background,
		playerIframeWin, globalObject, database;

	var actions = {

		// core methods
		'player': {
			'sendToIframe': function(model) {
				sendMessageToIframe(model.action,model.model);
			}
		},
		'sendToBackgroundFrame': function(model) {
			sendMessageToBackgroundIframe(model.action,model.model);
		},
		'getGlobalObject': function() { // load the global object, we call this function from the Domain
			if (!globalObject.getObject().hasLoaded) {
				dataBase.getPlaylistData(function (data) {
					globalObject.setPlaylistData(data);

					sendMessageToIframe('Background.getGlobalObjectCallback', globalObject.getObject());
				});
			}
			else {
				sendMessageToIframe("Background.getGlobalObjectCallback", globalObject.getObject());
			}
		},
		'updateGlobalObject': function(model) {
			//alert(model.action);
			globalObject.updateObject(model.action,model.model);
		},

		// action methods
		'show/hide': function() {
			sendMessageToExtension("show/hide");
		},

		'play': function(song) {

			if (song.source.type == "youtube")
			{
				//alert(song.source.model.href);
				sendMessageToBackgroundIframe(this,song.source.model.href);
			}
		},

		//database methods
		'database': {
			'saveSong': function (model) {
				dataBase.saveSong(model);
			}
		}
	}

	function sendMessageToBackgroundIframe(action,model) {
		playerIframeWin.postMessage({action:config.baseEvent + action ,model:model}, '*');
	}

	return Class.extend({
		init: function() {
			This = this;

			dataBase = new MegaPlayListXXX.DataBase();
			globalObject = new MegaPlayListXXX.GlobalObject();

			initPlayerIframe();
			initEvents();
		},
		route:function (action, model) {

			var oFunc = actions;
			var sAction = action;
			
			while (sAction.indexOf('.') > -1)
			{	
				oFunc = oFunc[sAction.split('.')[0]];
				sAction = sAction.substring(sAction.split(".")[0].length+1, sAction.length);
			}

			!oFunc[sAction] || oFunc[sAction].call(sAction, model);

			//!actions[action] || actions[action].call(this ,model);

		},
		sendMessageToBackgroundIframe: function(action,model) {
			sendMessageToBackgroundIframe(action,model);
		}
	});

	function initEvents() {

		// Global Object Evnents
		globalObject.events.add('playSong', function(song) {
			sendMessageToBackgroundIframe("play",song);
		});

		// General Events

		appAPI.browserAction.onClick(function() {
			This.route('show/hide');
		});

		// Router Events
		
		appAPI.message.addListener(function(msg) {
			This.route(msg.action, msg.model);
		});

		window.addEventListener('message', function(e){
			if (config.messageRegExp.test(e.data.action)) {
				var action = RegExp.$1;
				if (action == 'player.init')
				{
					playerIframeWin = e.source;
					return;
				}
				This.route(action, e.data.model);
			}
		}, false);

		/*setInterval(function() {
			// todo: check if the ActiveTabID has changed, if yes, then send onReady event
		},500);	*/

	}

	function initPlayerIframe() {

		//alert(config.iframePlayerUrl);
		playerIframe = $('<iframe src="' + config.iframePlayerUrl + '" />').appendTo('body');
	}

})(jQuery);

function sendMessageToExtension(action, model) {
	appAPI.message.toActiveTab({action:action, model:model});
}

function sendMessageToIframe(action,model) {
	appAPI.message.toActiveTab({action:"sendToIframe", model:{action:action, model:model}});
}



new MegaPlayListXXX.PlayListBackground();