$.fn.outerHTML = function(s) {
	return (s) ? this.before(s).remove() : $("&lt;p&gt;").append(this.eq(0).clone()).html();
};