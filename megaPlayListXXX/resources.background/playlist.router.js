MegaPlayListXXX.ActionsRouter = (function ($) {
	var This,
		config = MegaPlayListXXX.Config.ActionsRouter,
		playerIframeWin, globalObject;

	var actions = {

		// core methods
		"player.sendToIframe": function(model) {
			sendMessageToIframe(model.action,model.model);
		},
		"sendToBackgroundFrame": function(model) {
			sendMessageToBackgroundIframe(model.action,model.model);
		},
		"getGlobalObject": function() { // load the global object, we call this function from the Domain
			if (!globalObject.getObject().hasLoaded)
				globalObject.getPlayListFromDB(function() { sendMessageToIframe("Background.getGlobalObjectCallback", globalObject.getObject()); });
			else
				sendMessageToIframe("Background.getGlobalObjectCallback",globalObject.getObject());
		},
		"updateGlobalObject": function(model) {
			//alert(model.action);
			globalObject.updateObject(model.action,model.model);
		},
		"player.init": function(e) {
			playerIframeWin = e.source;
		},

		// action methods
		"show/hide": function() {
			sendMessageToExtension("show/hide");
		},

		"play": function(song) {

			if (song.source.type == "youtube")
			{
				//alert(song.source.model.href);
				sendMessageToBackgroundIframe(this,song.source.model.href);
			}
		}
	}

	function sendMessageToBackgroundIframe(action,model) {
		playerIframeWin.postMessage({action:config.baseEvent + action,model:model}, '*');
	}

	return Class.extend({
		init: function() {
			This = this;
			globalObject = new MegaPlayListXXX.GlobalObject({
				actionsRouter: This	
			});
		},
		route:function (action, model) {
			!actions[action] || actions[action].call(action,model);
		},
		sendMessageToBackgroundIframe: function(action,model) {
			sendMessageToBackgroundIframe(action,model);
		}
	});
})(jQuery);

function sendMessageToExtension(action, model) {
	appAPI.message.toActiveTab({action:action, model:model});
}

function sendMessageToIframe(action,model) {
	appAPI.message.toActiveTab({action:"sendToIframe", model:{action:action, model:model}});
}