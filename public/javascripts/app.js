//require.config({
//	paths: {
//		jquery: 'libs/jquery/jquery',
//		underscore: 'libs/underscore-amd/underscore',
//		backbone: 'libs/backbone-amd/backbone'
//	},
//	baseUrl: 'javascripts'
//});

require.config({
	baseUrl: '/javascripts',
	paths: {
		jquery: 'libs/jquery/jquery',
		underscore: 'libs/underscore/underscore',
		backbone: 'libs/backbone/backbone'
	},
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ["underscore", "jquery"],
			exports: 'Backbone'
		}
	}
});



define([
	'views/notationview'
], function(NotationView) {
	new NotationView();
});