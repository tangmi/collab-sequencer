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
		underscore: '../libs/underscore-amd/underscore',
		socketio: '../libs/socket.io'
	}
});


require(['socketio'], function(io) {

	//CONFIGuration for all everything everywhere
	window.CONFIG = {
		endpoint: 'http://localhost:3000',
		timing: {
			skipTicks: 60000, //calculated later
			nextTick: 0,
			currentTime: 0,
			maxTime: 32,
			bpm: 200
		},
		user: 'default',
		models: {},
		views: {},
		collections: {},
		socket: io.connect(this.endpoint)
	};
});

/*(function() {
	//for a one-time setting of the user
	var user;
	var isSet = false;
<<<<<<< HEAD
	CONFIG.__defineSetter__("user", function(val) {
=======
	config.__defineSetter__("user", function(val) {
>>>>>>> master
		if (!isSet) {
			user = val;
			isSet = true;
		}
	});
	CONFIG.__defineGetter__("user", function() {
		return user;
	});
})();*/




require([
	'mainSetup',
	'backbone',
	'socketio'
], function(mainSetup, Backbone, io) {
	Backbone.emulateHTTP = true;

	$(window).unload(function() {
		$.ajax(CONFIG.endpoint + '/user/disconnect', {
			timeout: 500
		});
	});

	$.ajax(CONFIG.endpoint + '/username', {
		timeout: 500
	}).done(function(data) {
		if (typeof data.user !== 'undefined') {
			CONFIG.user = data.user;
			console.log('set user: ' + CONFIG.user);
		}
		//we should have some case where it can't get a unique user ID for us
	}).always(function() {
		var request = $.ajax({
			url: CONFIG.endpoint + '/config'
		})
		request.done(function(res) {
			mainSetup.init(JSON.parse(res));
		});
		request.fail(function(jqXHR, textStatus) {
			console.log("Request failed: " + textStatus);
		});
	});
});