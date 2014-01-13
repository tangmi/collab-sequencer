//Socket is passed in on initialization
module.exports = function(io) {

	var actions = [];

	//no route means root route
	define(function(app) {
		//GET /config
		app.get('config', function(req, res) {
			var minifiedData = JSON.stringify(require('./configuration').instruments);
			res.send(minifiedData);
		});
	});

	define('notes', function(notes, app) {
		io.sockets.on('connection', function(socket) {
			socket.on('edit-note', function(data) {
				console.log(data.user + ': edited note ' + JSON.stringify(data));
				notes.set({
					instrument: data.instrument,
					pitch: data.pitch,
					time: data.time,
					user: data.user,
					highlighted: data.highlighted
				}, function(data) {
					io.sockets.emit('edit-note', data);
				});
			});
		});

		//PUT /notes
		app.put('', function(req, res) {
			var p = req.body.pitch,
				t = req.body.time,
				i = req.body.instrument,
				highlighted = req.body.highlighted,
				user = req.body.user;

			notes.set({
				instrument: i,
				pitch: p,
				time: t,
				user: user,
				highlighted: highlighted
			}, function(data) {
				var minifiedData = JSON.stringify(data);
				res.send(minifiedData);
			});
		});

		//GET /notes
		app.get('', function(req, res) {
			notes.getAll(function(data) {
				var minifiedData = JSON.stringify(data);
				res.send(minifiedData);
			});
		});

		app.delete('', function(req, res) {
			// res.setHeader('Content-Type', 'text/plain');
			// notes.generateBasenotes();
			// notes.storenotes('SYSTEM');
			// res.send(notes.render());
			res.send(501);
		});

		//GET /notes/render
		app.get('/render', function(req, res) {
			notes.render(function(text) {
				res.setHeader('Content-Type', 'text/plain');
				res.send(text);
			});
		});

	});

	define('users', function(users, app) {
		io.sockets.on('connection', function(socket) {
			console.log('user connected');
		});
		
		app.get('new', function(req, res) {
			//assign new username?
		});
		app.get('', function(req, res) {
			//get list of users
		});
		app.get('/:username', function(req, res) {
			//get specific user with req.params.username
		});
		app.delete('', function(req, res) {
			//delete user/disconnect
		});
	});
	
	function use(verb, path, fn) {
		actions.push({
			verb: verb,
			path: path,
			fn: function(req, res) {
				res.setHeader('Content-Type', 'application/json');
				fn(req, res);
			}
		});
	}

	function define() { /* route, fn */
		arguments = Array.prototype.slice.call(arguments);
		var firstArg = arguments.shift();
		if (typeof firstArg === 'function') {
			firstArg(getVerbs(''));
		} else {
			var fn = arguments.shift();
			fn(require('./routes/' + firstArg), getVerbs(firstArg));
		}
	}

	function getVerbs(root) {
		var out = {};
		out.get = function(pathPart, fn) {
			use('get', require('path').join('/', root, pathPart), fn);
		}
		out.put = function(pathPart, fn) {
			use('put', require('path').join('/', root, pathPart), fn);
		}
		out.post = function(pathPart, fn) {
			use('post', require('path').join('/', root, pathPart), fn);
		}
		out.delete = function(pathPart, fn) {
			use('delete', require('path').join('/', root, pathPart), fn);
		}
		return out;
	}

	return actions;
}