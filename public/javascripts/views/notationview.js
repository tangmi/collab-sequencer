require([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {
	var NotationView = Backbone.View.extend({
		el: 'body'
	});
	return NotationView;
});
