var config = {};

config.instruments = {
	time: 31, //0-index? actually 32 beats
	tabs: [{
			name: 'drums',
			initShow: true, //this should get removed at some point
			color: '#DA5858',
			notes: [{
					pitch: 0,
					file: "808/hconga.wav"
				}, {
					pitch: 1,
					file: "808/mconga.wav"
				}, {
					pitch: 2,
					file: "808/lconga.wav"
				}, {
					pitch: 3,
					file: "808/htom.wav"
				}, {
					pitch: 4,
					file: "808/mtom.wav"
				}, {
					pitch: 5,
					file: "808/ltom.wav"
				}, {
					pitch: 6,
					file: "808/cymbal.wav"
				}, {
					pitch: 7,
					file: "808/ohihat.wav"
				}, {
					pitch: 8,
					file: "808/chihat.wav"
				}, {
					pitch: 9,
					file: "808/sdrum.wav"
				}, {
					pitch: 10,
					file: "808/kdrum.wav"
				}, {
					pitch: 11,
					file: "808/hconga.wav"
				}
			]
		}, {
			name: 'synth',
			color: '#4E6A50',
			notes: [{
					pitch: 0,
					file: "synth_test/hiC.mp3"
				}, {
					pitch: 1,
					file: "synth_test/B.mp3"
				}, {
					pitch: 2,
					file: "synth_test/A.mp3"
				}, {
					pitch: 3,
					file: "synth_test/G.mp3"
				}, {
					pitch: 4,
					file: "synth_test/F.mp3"
				}, {
					pitch: 5,
					file: "synth_test/E.mp3"
				}, {
					pitch: 6,
					file: "synth_test/D.mp3"
				}, {
					pitch: 7,
					file: "synth_test/loC.mp3"
				}, {
					pitch: 8,
					file: "synth_test/F.mp3"
				}

			]
		}, {
			name: 'ball',
			color: 'black',
			notes: [{
					pitch: 0,
					file: "808/hconga.wav"
				}, {
					pitch: 1,
					file: "808/mconga.wav"
				}
			]
		}, {
			name: 'cornbread',
			color: '#B25D89',
			notes: [{
					pitch: 0,
					file: "808/hconga.wav"
				}, {
					pitch: 1,
					file: "808/mconga.wav"
				}, {
					pitch: 2,
					file: "808/lconga.wav"
				}
			]
		}
	]
};



module.exports = config;