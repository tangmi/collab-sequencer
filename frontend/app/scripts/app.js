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
	},
	user: 'default'
};

(function() {
	//for a one-time setting of the user
	var user;
	var isSet = false;
	config.__defineSetter__("user", function(val) {
		if (!isSet) {
			user = val;
			isSet = true;
		}
	});
	config.__defineGetter__("user", function() {
		return user;
	});
})();

define([
	'mainSetup',
	'backbone'
], function(mainSetup, Backbone) {
	Backbone.emulateHTTP = true;

	$(window).unload(function() {
		$.ajax(config.endpoint + '/user/disconnect', {
			timeout: 500
		});
	});

	$.ajax(config.endpoint + '/username', {
		timeout: 500
	}).done(function(data) {
		if (typeof data.user !== 'undefined') {
			config.user = data.user;
			console.log('set user: ' + config.user);
		}

		//we should have some case where it can't get a unique user ID for us
	}).always(function() {
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

});