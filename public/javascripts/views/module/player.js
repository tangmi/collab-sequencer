define([], function() {
	var Player = {

		sounds: [],

		initialize: function(rows) {
			this._filesToLoad = rows;

			this.setupAudioElements(rows);


		},

		setupAudioElements: function(rows) {

			for (var i = 0; i < rows; i++) {
				var sound = new Audio();
				sound.src = '/sounds/hit.wav';
				sound.id = 'audio-' + i;

				sound.load();

				_this = this;
				sound.addEventListener('canplay', function() { // When audio has loaded enough to play
					_this._updateLoadState();
				});

				this.sounds[i] = sound;

			}
		},

		_filesToLoad: 0,
		_loadCount: 0,
		_isReady: false,
		_updateLoadState: function() {
			++this._loadCount;
			if(this._loadCount == this._filesToLoad) {
				this._isReady = true;
				this._playSoundQueue();
				console.log("done loading files");
			}
		},

		_deferredQueue: [],
		_playSoundQueue: function() {
			for (var i = 0; i < this._deferredQueue.length; i++) {
				var sound = this._deferredQueue[i];
				sound.play();
			}
		},

		play: function(rowsToPlay) {
			for (var i = 0; i < rowsToPlay.length; i++) {
				var row = rowsToPlay[i];
				this.playRow(row);
			}
		},

		playRow: function(row) {
			console.log("this._isReady = " + this._isReady);
			if(!this._isReady) {
				this._deferredQueue.push(this.sounds[row]);
			} else {
				this.sounds[row].play()
			}
		}

	};
	return Player;
})