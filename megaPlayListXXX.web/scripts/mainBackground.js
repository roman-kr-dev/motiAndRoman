require.config({
  baseUrl: 'scripts/',
  paths: {
    loader: 'libs/loader',
    jQuery: 'libs/jquery/jquery',
    Underscore: 'libs/underscore/underscore',
	Class: 'libs/base.class/base.class',
	Helpers: 'libs/helpers/helpers'
  }
});


require(['AppBackground'],function(AppBackground) {
	
	var myApp = new AppBackground();
	myApp.start();
});