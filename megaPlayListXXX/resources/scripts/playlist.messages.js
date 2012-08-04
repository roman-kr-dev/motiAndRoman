var MegaPlayListXXX = (function () {
	var messageRegExp = /^MegaPlayListXXX\.response\..*/,
		playlistIframeWin;
	
	return {
		init:function () {
			this.initEvents();
		},

		initEvents:function () {
			window.addEventListener('message', function(e){
				//message from iframe
				if  (e.origin === 'http://megaplayer.com') {
					if (e.data.action === 'MegaPlayListXXX.init') playlistIframeWin = e.source;
					
					window.postMessage(e.data, '*');
				}
				//message from extension
				else if (messageRegExp.test(e.data.action)) {
					playlistIframeWin.postMessage(e.data, '*');
				}
			}, false);
		}
	}
})();

MegaPlayListXXX.init();