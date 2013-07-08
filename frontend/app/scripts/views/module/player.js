define([], function() {
	var Player = {

		sounds: {},

		initialize: function(name, rows) {
			this.sounds[name] = [];
			this._loading[name] = [];
			this._deferredPlay[name] = [];
			for (var i in rows) {
				this.load({
					instrument: name,
					file: rows[i].file,
					pitch: rows[i].pitch
				});
			}
		},

		_loading: {},
		load: function(row) {

			if (this.sounds[row.instrument][row.pitch]) {
				return;
			}

			var sound = new Audio();
			sound.src = '/sounds/' + row.file;
			sound.preload = true;
			sound.instrument = row.instrument
			sound.pitch = row.pitch;
			document.body.appendChild(sound);

			this._loading[row.instrument][row.pitch] = true;

			sound.load();
			var _this = this;
			sound.addEventListener('canplay', function() { // When audio has loaded enough to play
				_this._loading[this.instrument][this.pitch] = false;
				if (_this._deferredPlay[this.instrument][this.pitch]) {
					_this.sound(this.instrument, this.pitch);
				}
			}, false);

			sound.addEventListener("error", function(e) {
				console.log("Logging playback error: " + e);
			});

			this.sounds[row.instrument][row.pitch] = sound;
		},

		_deferredPlay: {},
		playPitch: function(instrument, pitch) {
			if (this._loading[instrument][pitch]) {
				this._deferredPlay[instrument][pitch] = true;
			} else {
				this.sounds[instrument][pitch].currentTime = 0;
				this.sounds[instrument][pitch].play();
			}
		},

		play: function(rowsToPlay) {
			for (var i = 0; i < rowsToPlay.length; i++) {
				var row = rowsToPlay[i];
				this.playPitch(row.type, row.pitch);
			}
		}

	};
	return Player;
})