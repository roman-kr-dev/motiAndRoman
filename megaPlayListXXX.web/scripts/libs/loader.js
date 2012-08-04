define(['modules/order!libs/jquery/jquery-min', 'modules/order!libs/underscore/underscore-min', 'modules/order!libs/backbone/backbone-min'],
function(){
  return {
    Backbone: Backbone.noConflict(),
    _: _.noConflict(),
    $: jQuery.noConflict()
  };
});