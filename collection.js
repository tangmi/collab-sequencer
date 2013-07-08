var redisConfig = require('./configuration').redis;
var notesConfig = require('./configuration').instruments;
var redis = require("redis");
var client = redis.createClient(redisConfig.port, redisConfig.host, redisConfig.options);

/*

	We store the roll as time 'slices', containing some constant number of pitches

	data[instrument][time][pitch] = {
		user, highlighted
	}

*/
exports.data = {};

var key = 'coll';
exports.storeCollection = function(user) {
	if (!user) {
		user = '';
	}

	var data = {};
	data[key] = JSON.stringify(exports.data)

	client.hmset('cs-data', data);
	console.log('=>', user + ':', 'Storing collection');
	console.log('=>', user + ':', 'Store collection', '\n' + exports.render(exports.data));
};

exports.getCollection = function(user) {
	if (!user) {
		user = '';
	}
	client.hgetall('cs-data', function(err, obj) {

		try {
			exports.data = JSON.parse(obj[key]);
		} catch (e) {
			exports.generateBaseCollection();
			exports.storeCollection();
		}
		console.log('=>', user + ':', 'Retrieved collection');
		console.log('=>', user + ':', 'Get collection', '\n' + exports.render(exports.data));
	});
};

exports.generateBaseCollection = function() {
	var tabs = notesConfig.tabs,
		time = notesConfig.time,
		pitches,
		user = 'SYSTEM';

	var output = {};

	var i,
		tab,
		l = tabs.length;
	for (i = 0; i < l; i++) {
		tab = tabs[i];
		console.log(tab.name);
		output[tab.name] = {};

		pitches = tab.notes.length - 1;

		for (t = 0; t <= time; t++) {
			output[tab.name][t] = [];
			var p = 0;
			for (p = 0; p <= pitches; p++) {
				output[tab.name][t][p] = {
					'_toString': '#cell-' + t + '-' + p + '-' + tab.name, //this is purely for niceness, could be a method on collection
					'user': user,
					'highlighted': false
				}
			}
		}
	}

	exports.data = output;
}


var toObject = function() {
	var data = exports.data;
	var object = [];
	for (type in data) {
		for (t in data[type]) {
			for (p in data[type][t]) {
				var note = data[type][t][p];

				object.push({
					pitch: new Number(p),
					time: new Number(t),
					user: note.user,
					type: type,
					highlighted: note.highlighted
				});

			}
		}
	}
	return object;
}

exports.getModel = function(type, time, pitch) {

	var note = exports.data[type][time][pitch];

	var model = {
		pitch: new Number(pitch),
		time: new Number(time),
		user: note.user,
		type: type,
		highlighted: note.highlighted
	};

	return model;

};

exports.getData = function() {
	return toObject();
};

exports.toJson = function() {

	return JSON.stringify(toObject());

	// var out = [];
	// var type, t, p;
	// for(type in this.data) {
	// 	for(t in this.data[type]) {
	// 		for(p in this.data[type][t]) {
	// 			var note = this.data[type][t][p];
	// 			out.push('{"pitch":' + p + ',"time":' + t + ',"user":"' + note.user + '","type":"' + type + '","highlighted":' + note.highlighted + '}');
	// 		}
	// 	}
	// }
	// return '[' + out.join(',') + ']';
};


//renders the board as text
exports.render = function() {
	var temp = {};
	var out = '';
	//inverts the matrix
	for (type in exports.data) {
		temp[type] = [];
		for (t in exports.data[type]) {
			for (p in exports.data[type][t]) {
				if (typeof(temp[type][p]) === 'undefined') {
					temp[type][p] = [];
				}
				temp[type][p][t] = exports.data[type][t][p];
			}
		}
	}

	//renders matrix
	for (type in temp) {
		// console.log(temp[type]);
		out += type + '\n';
		for (t in temp[type]) {
			for (p in temp[type][t]) {
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


exports.initialize = function() {
	exports.getCollection('SYSTEM');
	// console.log(dataToJson(data));
};