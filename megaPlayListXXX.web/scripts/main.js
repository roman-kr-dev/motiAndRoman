require.config({
  baseUrl: 'scripts/',
  paths: {
    loader: 'libs/loader',
    jQuery: 'libs/jquery/jquery',
    Underscore: 'libs/underscore/underscore',
    Backbone: 'libs/backbone/backbone',
	Mustache: 'libs/mustache/mustache.min',
	Class: 'libs/base.class/base.class',
	Template: 'libs/template/template',
	Helpers: 'libs/helpers/helpers'
  }
});

require(['App'],function(App) {
	App.Init();
});