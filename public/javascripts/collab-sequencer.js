require.config({
	paths: {
		jquery: 'libs/jquery/jquery',
		underscore: 'libs/underscore-amd/underscore',
		backbone: 'libs/backbone-amd/backbone'
	},
	baseUrl: 'javascripts'

});

require([
	'jquery',
	'underscore',
	'backbone',
	'app'
], function($, _, Backbone, App) {
	$(document).ready(function() {
		App.initialize();
	});
});
