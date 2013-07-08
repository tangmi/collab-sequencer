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

	var request = $.ajax({
		url: config.endpoint + '/config'
	})
	request.done(function(res) {
		mainSetup.init(JSON.parse(res));
	});
	request.fail(function(jqXHR, textStatus) {
		console.log("Request failed: " + textStatus);
	});



});