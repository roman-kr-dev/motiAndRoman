MegaPlayListXXX.SongManager.YouTube = (function ($) {
	var baseCSS = MegaPlayListXXX.Config.baseCSS,
		config = MegaPlayListXXX.Config.SongManager.YouTube,
		thi$, videoId, isInPlatlist;
	
	return Class.extend({
		init:function () {
			thi$ = this;
			
			parseVideoId();
			getIsInPlaylist();
			initSaveButton();
		}
	});

	function parseVideoId() {
		config.videoId.test(location.href);

		videoId = RegExp.$1;
	}

	function getIsInPlaylist() {
		isInPlatlist = false;
	}

	function initSaveButton() {
		var button;
		
		if (config.site.test(top.location.href)) {
			button = $(getButtonHTML())
				.prependTo(config.button.buttonContainer)
				.on('click', saveToPlaylist);
		}
	}

	function saveToPlaylist() {
		var songData = {};
		
		if (isInPlatlist) return removeFromPlaylist();

		songData.videoId = videoId;
		songData.videoUrl = location.href;

		$.when($.getJSON(config.videoDataUrl.replace('{video-id}', videoId))).then(function (json) {
			songData.duration = json.data.duration;
			songData.thumb = json.data.thumbnail.sqDefault;
		}).fail(function () {
			songData.duration = 0;
			songData.thumb = 'N/A';
		}).always(function () {
			thi$.events.fire('saveSong', songData);
		});
	}

	function getButtonHTML() {
		var html = [];
		
		html.push('<button type="button" class="yt-uix-tooltip-reverse yt-uix-button yt-uix-button-default yt-uix-tooltip" data-tooltip-text="' + config.button.tooltipText + '">');
			html.push('<span class="yt-uix-button-icon-wrapper">');
				html.push('<img class="yt-uix-button-icon" src="' + config.button.icon + '">');
				html.push('<span class="yt-valign-trick"></span>');
			html.push('</span>');
			html.push('<span class="yt-uix-button-content">');
				html.push('<span class="addto-label">' + config.button.label + '</span>');
			html.push('</span>');
		html.push('</button>');

		return html.join('');
	}
})(jQuery);