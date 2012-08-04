MegaPlayListXXX.SongManager = {};

MegaPlayListXXX.SongManager.Manager = (function ($) {
	var config = MegaPlayListXXX.Config.SongManager,
		thi$, providers = {};
	
	return Class.extend({
		init:function () {
			thi$ = this;

			providers.YouTube = new MegaPlayListXXX.SongManager.YouTube();

			initEvents();
		}
	});

	function initEvents() {
		for (var i in providers) {
			providers[i].events.add('saveSong', thi$.events.bindFireEvent('saveSong'));
		}
	}
})(jQuery);