define(['views/module/drawer'], function(Drawer) {
	var Player = {

		sounds: [],

		initialize: function(rows) {
			this._filesToLoad = rows;
			this._loadCount =  0,
			this._isReady = false;

			this.setupAudioElements();
		},

		setupAudioElements: function() {

			this._loadSound(0, "808/hconga.wav");
			this._loadSound(1, "808/mconga.wav");
			this._loadSound(2, "808/lconga.wav");
			this._loadSound(3, "808/htom.wav");
			this._loadSound(4, "808/mtom.wav");
			this._loadSound(5, "808/ltom.wav");
			this._loadSound(6, "808/cymbal.wav");
			this._loadSound(7, "808/ohihat.wav");
			this._loadSound(8, "808/chihat.wav");
			this._loadSound(9, "808/sdrum.wav");
			this._loadSound(10, "808/kdrum.wav");
			this._loadSound(11, "hit.wav");

		},

		_loadSound: function(index, path) {
			var sound = new Audio();
			sound.src = '/sounds/' + path;
			sound.id = 'audio-' + index;

			sound.load();

			var _this = this;
			sound.addEventListener('canplay', function() { // When audio has loaded enough to play
				_this._updateLoadState();
			});



			this.sounds[index] = sound;
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
				var column = rowsToPlay[i];
				this.playPitch(column);
			}
		},

		playPitch: function(pitch) {
			if(!this._isReady) {
				this._deferredQueue.push(this.sounds[pitch]);
			} else {
				this.sounds[pitch].currentTime=0;
				this.sounds[pitch].play()
			}
		}

	};
	return Player;
})