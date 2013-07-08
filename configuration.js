var config = {};


config.redis = {
	port: 6379,
	host: '127.0.0.1',
	options: {}
};

config.instruments = {
	tabs: [{
			name: 'drums',
			color: 'red',
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
					file: "hit.wav"
				}
			]
		}, {
			name: 'synth',
			color: 'green',
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
				}
			]
		}, {
			name: 'dickballs',
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
			color: 'purple',
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