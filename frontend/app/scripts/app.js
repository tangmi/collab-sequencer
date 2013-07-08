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


//configuration for all everything everywhere
var config = {
	endpoint: 'http://localhost:3000',
	timing: {
		skipTicks: 60000, //calculated later
		nextTick: 0,
		currentTime: 0,
		maxTime: 32,
		bpm: 200
	}
};

define([
		'mainSetup',
		'backbone'
], function(mainSetup, Backbone) {
	Backbone.emulateHTTP = true;


	var initialConfig = {
		tabs: [{
				name: 'drums',
				notes: 10,
				initShow: true,
				color: 'red'
			}, {
				name: 'synth',
				notes: 7,
				initShow: false,
				color: 'green'
			}, {
				name: 'ball',
				notes: 2,
				initShow: false,
				color: 'black '
			}, {
				name: 'cornbread',
				notes: 3,
				initShow: false,
				color: 'purple'
			}
		]
	};

	mainSetup.init(initialConfig);

});