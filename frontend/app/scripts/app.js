require.config({
	baseUrl: '/scripts',
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
					'underscore',
					'jquery'
			],
			exports: 'Backbone'
		},
	},
	paths: {
		jquery: '../libs/jquery/jquery',
		backbone: '../libs/backbone-amd/backbone',
		underscore: '../libs/underscore-amd/underscore'
	}
});



define([
		'views/notationview',
		'backbone'
], function(NotationView, Backbone) {
	Backbone.emulateHTTP = true;
	new NotationView();
});