define(function() {

	var Helpers = {

		// used for manage multiple async requests
		Series: function(a,obj) {
			if (!a.length) return;
			a[0](function(o,bcontinue) {
				if (!bcontinue) a.shift();
				Helpers.Series(a,o);
			},obj);
		},

		FireEvent: function(oEvent,oEventArgs,Context) {
			return !oEvent || ((Context ? oEvent.call(Context,oEventArgs) : oEvent(oEventArgs)) !== false);
		}

	};

	return Helpers;

});
