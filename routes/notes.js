var storePath = require('../configuration').storePath;
var notesConfig = require('../configuration').instruments,
	timeMax = notesConfig.time + 1, //config is zero based
	instrumentsPitchCount = (function() {
		//get an object where the key is the instrument name and the value is the pitch vount
		var out = {};
		notesConfig.tabs.forEach(function(element, index, array) {
			out[element.name] = element.notes.length;
		});
		return out;
	})();

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

	//set up the storage adapter, can be set to one of many (as per mde/model)
	// this.setAdapter('filesystem', {
	// 	'location': path.join(__dirname, '.model-fs'),
	// 	'filename': 'note'
	// });
	this.setAdapter('level', {
		'db': storePath,
	});
	// this.setAdapter('memory');
});

/*
	CRUD functionality
 */

function createNote(data, cb) {
	assertNotUndefined(data.instrument, 'create needs instrument');
	assertNotUndefined(data.time, 'create needs time');
	assertNotUndefined(data.pitch, 'create needs pitch');
	assertNotUndefined(data.user, 'create needs user');

	assertNoteIsValid(data);

	var input = {
		instrument: data.instrument,
		time: data.time,
		pitch: data.pitch,
		user: data.user,
		highlighted: false
	};

	var note = Note.create(input);

	saveNote(note, cb);
}

function readNote(data, cb) {
	assertNotUndefined(data.instrument, 'read needs instrument');
	assertNotUndefined(data.time, 'read needs time');
	assertNotUndefined(data.pitch, 'read needs pitch');

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

function updateNote(data, cb) {
	assertNotUndefined(data.instrument, 'update needs instrument');
	assertNotUndefined(data.time, 'update needs time');
	assertNotUndefined(data.pitch, 'update needs pitch');
	assertNotUndefined(data.user, 'update needs user');
	assertNotUndefined(data.highlighted, 'update needs highlighted');

	assertNoteIsValid(data);

	readNote(data, function(note) {
		if (note == null) {
			throw new Error('Could not find note in store');
			// createNote(data, function(newNote) {
			// 	cb(newNote);
			// });
			return;
		}

		note['user'] = data.user;
		note['highlighted'] = data.highlighted;

		saveNote(note, function(data) {
			cb(data);
		});
	});
}

function destroyNote(data, cb) {
	assertNotUndefined(data.instrument, 'destroy needs instrument');
	assertNotUndefined(data.time, 'destroy needs time');
	assertNotUndefined(data.pitch, 'destroy needs pitch');

	var query = {
		instrument: data.instrument,
		time: data.time,
		pitch: data.pitch
	};

	Note.remove(query, function(err, data) {
		if (err) {
			throw err;
		}
		cb(data);
	});
}

/*
	helper functions for CRUD functionality
 */

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

/*
	Export get/getAll/set
 */
module.exports.get = function(data, cb) {
	console.log('GET NOTE');

	readNote(data, function(note) {
		cb(noteModelTransform(note));
	});
};
module.exports.set = function(data, cb) {
	console.log('SET NOTE');

	updateNote(data, function(note) {
		cb(noteModelTransform(note));
	});
};

module.exports.getAll = function(cb) {
	console.log('GET ALL NOTES');

	//fill with empty notes

	getAllNotes(function(notes) {
		notes.forEach(function(element, index, array) {
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

function assertNoteIsValid(data) {
	if (data.time < 0 || data.time >= timeMax) {
		throw new Error('note has an invalid time (0 <= t < ' + timeMax + ')');
	}
	if (!instrumentsPitchCount[data.instrument]) {
		throw new Error('note has an invalid instrument (' + data.instrument + ')');
	}
	if (data.pitch < 0 || data.pitch >= instrumentsPitchCount[data.instrument]) {
		throw new Error('note has an invalid pitch (0 <= p < ' + instrumentsPitchCount[data.instrument] + ')');
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

	for (var i = 0; i < properties.length; i++) {
		var propertyName = properties[i];
		out[propertyName] = note[propertyName];
	}

	return out;
}

//return an empty (default) note, placed by the SYSTEM, at a specified instrument, time, and pitch

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

	return note;
}


/*
	other things
 */

module.exports.cleanCollection = function(cb) {
	Note.remove({}, function(err, data) {
		if (err) {
			throw err;
		}
		cb(data);
	});
};

module.exports.initializeCollection = function(cb) {
	var stime = +new Date;

	var notes = [];

	this.cleanCollection(function() {
		for (var instrument in instrumentsPitchCount) {
			var pitchCount = instrumentsPitchCount[instrument];
			for (var p = 0; p < pitchCount; p++) {
				for (var t = 0; t < timeMax; t++) {
					var note = getEmptyNote({
						instrument: instrument,
						pitch: p,
						time: t
					});
					notes.push(note);
				}
			}
		}

		Note.save(notes, function(err, data) {
			if (err) {
				throw err;
			}
			console.log('INITIALIZED COLLECTION (' + ((+new Date - stime) / 1000) + 'ms)');
			cb(data);
		});

	});
};

///test
// module.exports.set({
// 	pitch: 11,
// 	time: 1,
// 	instrument: 'drums',
// 	user: 'Michael',
// 	highlighted: true
// }, function(note) {
// 	console.log(note);
// });

// module.exports.get({
// 	pitch: 5,
// 	time: 1,
// 	instrument: 'drums'
// }, function(note) {
// 	console.log(note);
// });

// module.exports.getAll(function(notes) {
// 	console.log(notes);
// })

// console.log(getEmptyNote({
// 	instrument: 'drums',
// 	time: 1,
// 	pitch: 5
// }));


// destroyNote({
// 	pitch: 5,
// 	time: 1,
// 	instrument: 'drums'
// }, function(a) {
// 	console.log(a);
// });

//TODO: update render method, fix API calls by storage update

//renders the board as text
exports.render = function(cb) {

	var output = {}; // output[instrument][pitch][time]

	module.exports.getAll(function(notes) {
		notes.forEach(function(element, index, array) {
			var instrument = element.instrument,
				pitch = element.pitch,
				time = element.time;
			if (typeof output[instrument] === 'undefined') {
				output[instrument] = [];
			}
			if (typeof output[instrument][pitch] === 'undefined') {
				output[instrument][pitch] = [];
			}
			output[instrument][pitch][time] = element.highlighted ? 'X' : '.';

		});

		var tabs = {};

		for (var instrument in output) {
			var pitches = [];
			for (var p = 0; p < output[instrument].length; p++) {
				pitches.push(output[instrument][p].join(' '));

			}
			tabs[instrument] = pitches.join('\n');
		}

		var text = '';
		for (var instrument in tabs) {
			text += instrument + '\n';
			text += tabs[instrument] + '\n\n';
		}
		
		cb(text);
	});
};

exports.initialize = function() {
	this.getAll(function(data) {
		if (data.length == 0) {
			//initialize only if there's nothing there
			module.exports.initializeCollection(function() {

			});
		}
		// exports.render();
	});
};