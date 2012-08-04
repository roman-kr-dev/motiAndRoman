define(
	[
		'jQuery',
		'Underscore',
		'Backbone',
		'Mustache',
		'Class',
		'Template',
		'player/domain',
		'player/ui'
	],
	function($,_,Backbone,Mustache,Class,Template,Domain,UI) {
		
		var Init = function() {

			Template.Render("Layout_Player",{}, function(s) {

				$("body").html(s);

				var oMegaPlayerUI = new UI();
					oMegaPlayerUI.events.add("onReady", function() {
						// alert("ready!");
					});
					oMegaPlayerUI.start();

			});
			
		}

		return {
			Init: Init
		};

	}
);