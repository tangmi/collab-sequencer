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
		socketio: '../socket.io/socket.io'
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




require([
	'mainSetup',
	'backbone',
	'socketio'
], function(mainSetup, Backbone, io) {
	Backbone.emulateHTTP = true;

	//Request username on server
	CONFIG.socket.on('assign-username', function(data) {
		CONFIG.user = data.id;
	});
	CONFIG.socket.emit('request-username');



	var request = $.ajax({
		url: CONFIG.endpoint + '/config'
	});
	request.done(function(res) {
		mainSetup.init(res);
	});
	request.fail(function(jqXHR, textStatus) {
		console.log("Request failed: " + textStatus);
	});
});