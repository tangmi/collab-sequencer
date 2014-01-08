var notesConfig = require('./configuration').instruments;

var Storage = require('node-document-storage-fs');
var storage = new Storage(require('./configuration').storeLocation, {});

/*

	We store the roll as time 'slices', containing some constant number of pitches

	data[instrument][time][pitch] = {
		user, highlighted
	}

*/
exports.data = {};

exports.storeCollection = function(user, cb) {
	var callback = typeof cb === 'function' ? cb : function() {};

	if (!user) {
		user = '';
	}

	var data = JSON.stringify(exports.data);

	storage.set('notes', data, function(err, results) {

		console.log('=>', user + ':', 'Storing collection');
		// console.log('=>', user + ':', 'Store collection', '\n' + exports.render(exports.data));

		callback(err, results[0]);
	});

};

exports.getCollection = function(user, cb) {
	var callback = typeof cb === 'function' ? cb : function() {};
	if (!user) {
		user = '';
	}

	storage.get('notes', function(err, results) {

		var obj = results[0];

		console.log('=>', user + ':', 'Retrieved collection');
		// console.log('=>', user + ':', 'Get collection', '\n' + exports.render(exports.data));

		try {
			exports.data = JSON.parse(obj);
		} catch (e) {
			exports.generateBaseCollection();
			exports.storeCollection(user);
		}

		callback(err, obj);
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

		pitches = tab.notes.length - 1; //minus one because we are zero-indexed on the server side

		for (t = 0; t <= time; t++) {
			output[tab.name][t] = [];
			var p = 0;
			for (p = 0; p <= pitches; p++) {
				output[tab.name][t][p] = {
					'_toString': 'cell-' + tab.name + '-' + t + '-' + p, //this is purely for niceness, could be a method on collection
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
					highlighted: note.highlighted,
					id: note._toString
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
		highlighted: note.highlighted,
		id: note._toString
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