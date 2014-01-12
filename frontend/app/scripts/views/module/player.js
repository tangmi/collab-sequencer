define([], function() {
	var Player = {

		files: {},

		initialize: function(name, rows) {
			for (var i in rows) {
				if (!this.files[name]) {
					this.files[name] = {};
				}
				this.files[name][rows[i].pitch] = rows[i].file;

				this.load({
					instrument: name,
					pitch: rows[i].pitch
				});
			}
		},

		load: function(row) {
			var sound = new Audio('/sounds/' + this.files[row.instrument][row.pitch]);
			sound.preload = true;
			sound.load();
		},

		playPitch: function(instrument, pitch) {
			var audio = new Audio('/sounds/' + this.files[instrument][pitch]);
			// audio.addEventListener("ended", function() {
			// 	document.removeChild(this);
			// }, false);
			audio.play();
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