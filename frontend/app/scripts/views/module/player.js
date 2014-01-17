define([], function() {

	var context;
	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();
	} catch (e) {
		alert('Web Audio API is not supported in this browser');
	}

	var compressor = context.createDynamicsCompressor();
	// var reverb = context.createConvolver();
	// var volume = context.createGainNode();

	// compressor.connect(reverb);
	// reverb.connect(context.destination);

	var Player = {

		files: {},

		initialize: function(name, rows) {

			for (var i in rows) {
				if (!this.files[name]) {
					this.files[name] = {};
				}
				this.files[name][rows[i].pitch] = {
					url: '/sounds/' + rows[i].file,
					buffer: null
				};

				this.load({
					instrument: name,
					pitch: rows[i].pitch
				});
			}
		},

		load: function(row) {
			var url = this.files[row.instrument][row.pitch].url;

			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';

			var _this = this;
			request.onload = function() {
				context.decodeAudioData(request.response, function(buffer) {
					_this.files[row.instrument][row.pitch].buffer = buffer;
				}, function(err) {
					console.err(err)
				});
			}
			request.send();
		},

		playPitch: function(instrument, pitch) {
			var source = context.createBufferSource();
			source.buffer = this.files[instrument][pitch].buffer;
			source.connect(compressor);
			compressor.connect(context.destination);
			// source.connect(context.destination); //destination=speakers
			source.start(0);
		},

		play: function(rowsToPlay) {
			for (var i = 0; i < rowsToPlay.length; i++) {
				var row = rowsToPlay[i];
				this.playPitch(row.instrument, row.pitch);
			}
		}

	};
	return Player;
})