MegaPlayListXXX.ActionsRouter = (function ($) {
	var This,
		baseCSS = MegaPlayListXXX.Config.baseCSS,
		config = MegaPlayListXXX.Config.ActionsRouter,
		globalObject,
		playerIframe;

	var actions = {
		// core methods
		"sendToIframe": function(model) {
			postToIframe(model.action, model.model);
		},

		"Domain.sendToBackground": function(model) {
			postToBackground(model.action, model.model);
		},

		"Domain.sendToBackgroundFrame": function(model) {
			postToBackground("sendToBackgroundFrame", {action:model.action, model:model.model});
		},

		// action methods
		"play": function(song) {
			postToBackground(this,song);
		},
		"show/hide": function() {
			var bShow = $(playerIframe).css("display") == "none";

			$(playerIframe).css("display",bShow ? "block" : "none");
			
			updateGlobalObject(this,bShow);
		}
	};

	return Class.extend({
		init: function() {
			This = this;
			//globalObject = new MegaPlayListXXX.GlobalObject();
		},
		route:function (action, model) {	
			!actions[action] || actions[action].call(action, model);
		},
		setPlayetIframe: function(oIframeEl) {
			playerIframe = oIframeEl;
		}
	});

	function updateGlobalObject(action,model) {
		postToBackground('updateGlobalObject', {action:action, model:model});
	}

	function postToBackground(action,model) {
		//globalObject.updateObject(action,model);
		appAPI.message.toBackground({
			action:action,
			model: model
		});
	}

	function postToIframe(action, model) {
		//globalObject.updateObject(action,model);
		window.postMessage({action:'MegaPlayListXXX.response.' + action, model:model}, '*');
	}
})(jQuery);