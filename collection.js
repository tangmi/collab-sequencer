exports.data = {};

/*

	We store the roll as time 'slices', containing some constant number of pitches

	data[instrument][time][pitch] = {
		user, highlighted
	}

*/

var generateBaseCollection = function(random) {
	var pitches = 10, //0-10
		times = 31, //0-31
		user = 'GUS',
		types = ['drums', 'synth'];

	for (var i in types) {
		var type = types[i];
		exports.data[type] = [];
		var t = 0;
		for (t = 0; t <= times; t++) {
			exports.data[type][t] = [];
			var p = 0;
			for (p = 0; p <= pitches; p++) {
				exports.data[type][t][p] = {
					'_toString': '#cell-' + t + '-' + p + '-' + type,
					'user': user,
					'highlighted': false
				}
			}
		}
	}
}

exports.initialize = function() {
	generateBaseCollection();
	// console.log(dataToJson(data));
};

exports.toJson = function() {
	var out = [];
	var type, t, p;
	for(type in this.data) {
		for(t in this.data[type]) {
			for(p in this.data[type][t]) {
				var note = this.data[type][t][p];
				out.push('{"pitch":' + p + ',"time":' + t + ',"user":"' + note.user + '","type":"' + type + '","highlighted":' + note.highlighted + '}');
			}
		}
	}
	return '[' + out.join(',') + ']';
};


//renders the board as text
exports.render = function() {
	var temp = {};
	var out = '';
	for(type in exports.data) {
		temp[type] = [];
		for(t in exports.data[type]) {
			for(p in exports.data[type][t]) {
				if(typeof(temp[type][p]) === 'undefined') {
					temp[type][p] = [];
				}
				temp[type][p][t] = exports.data[type][t][p];
			}
		}
	}

	for(type in temp) {
		console.log(temp[type]);
		out += type + '\n';
		for(t in temp[type]) {
			for(p in temp[type][t]) {
				var note = temp[type][t][p];
				out += note.highlighted ? 'X' : '.';
				out += ' ';
			}
			out += '\n';
		}
		out += '\n';
	}

	return out;
};