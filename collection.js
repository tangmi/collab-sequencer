var notesConfig = require('./configuration').instruments;

var path = require('path');

var model = require('model');

var noteProperties = {
	pitch: {
		type: 'number',
		required: true
	},
	time: {
		type: 'number',
		required: true
	},
	user: {
		type: 'string',
		required: true
	},
	instrument: {
		type: 'string',
		required: true
	},
	highlighted: {
		type: 'boolean',
		required: true
	},
};

Note = model.register('Note', function() {
	this.defineProperties(noteProperties);
	// this.setAdapter('memory');
	this.setAdapter('filesystem', {
		'location': path.join(__dirname, '.model-fs'),
		'filename': 'note'
	});
});

function getNote(data, cb) {
	assertNotUndefined(data.instrument, 'get needs instrument');
	assertNotUndefined(data.time, 'get needs time');
	assertNotUndefined(data.pitch, 'get needs pitch');

	var query = {
		instrument: data.instrument,
		time: data.time,
		pitch: data.pitch
	};
	Note.first(query, function(err, note) {
		if (err) {
			throw err;
		}

		cb(note);
	});
}

function setNote(data, cb) {
	assertNotUndefined(data.instrument, 'set needs instrument');
	assertNotUndefined(data.time, 'set needs time');
	assertNotUndefined(data.pitch, 'set needs pitch');
	assertNotUndefined(data.user, 'set needs user');
	assertNotUndefined(data.highlighted, 'set needs highlighted');

	getNote(data, function(note) {
		if (note == null) {
			createNote(data, function(newNote) {
				cb(newNote);
			});
			return;
		}

		note['user'] = data.user;
		note['highlighted'] = data.highlighted;

		saveNote(note, function(data) {
			cb(data);
		});
	});
}

function createNote(data, cb) {
	assertNotUndefined(data.instrument, 'create needs instrument');
	assertNotUndefined(data.time, 'create needs time');
	assertNotUndefined(data.pitch, 'create needs pitch');
	assertNotUndefined(data.user, 'create needs user');

	var input = {
		instrument: data.instrument,
		time: data.time,
		pitch: data.pitch,
		user: data.user
	};

	var note = Note.create(input);

	saveNote(note, cb);
}

function saveNote(note, cb) {
	note.save(function(err, data) {
		if (err) {
			console.log(err);
			throw err;
		}
		console.log('note saved');
		cb(data);
	});
}

function getAllNotes(cb) {
	Note.all({}, function(err, notes) {
		if (err) {
			throw err;
		}
		cb(notes);
	});
}

module.exports.get = function(data, cb) {
	console.log('GET NOTE');

	getNote(data, function(note) {
		cb(noteModelTransform(note));
	});
};
module.exports.set = function(data, cb) {
	console.log('SET NOTE');

	setNote(data, function(note) {
		cb(noteModelTransform(note));
	});
};

module.exports.getAll = function(cb) {
	console.log('GET ALL NOTES');

	getAllNotes(function(notes) {
		notes.forEach(function (element, index, array) {
			array[index] = noteModelTransform(array[index]);
		});

		cb(notes);
	});
};

/*
	helper methods
 */

function assertNotUndefined(prop, msg) {
	if (typeof prop === 'undefined') {
		throw new Error(msg);
	}
}

//transforms a mde/model to an object that backbone wants
var properties = (function() {
	var arr = [];
	for (var key in noteProperties) {
		arr.push(key);
	}
	return arr;
})();

function noteModelTransform(note) {
	var out = {};

	for(var i = 0; i < properties.length; i++) {
		var propertyName = properties[i];
		out[propertyName] = note[propertyName];
	}

	return out;
}

function getEmptyNote(data) {
	assertNotUndefined(data.instrument, 'create needs instrument');
	assertNotUndefined(data.time, 'create needs time');
	assertNotUndefined(data.pitch, 'create needs pitch');

	var input = {
		instrument: data.instrument,
		time: data.time,
		pitch: data.pitch,
		user: 'SYSTEM',
		highlighted: 'false'
	};

	var note = Note.create(input);

	return noteModelTransform(note);
}



module.exports.set({
	pitch: 5,
	time: 1,
	user: 'Michael',
	instrument: 'drums',
	highlighted: true
}, function(note) {
	console.log(note);
});

module.exports.get({
	instrument: 'drums',
	time: 1,
	pitch: 5
}, function(note) {
	console.log(note);
});

module.exports.getAll(function(notes) {
	console.log(notes);
})

console.log(getEmptyNote({
	instrument: 'drums',
	time: 1,
	pitch: 5
}));


//TODO: update render method, fix API calls by storage update

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
	// exports.getCollection('SYSTEM');
	// console.log(dataToJson(data));
};