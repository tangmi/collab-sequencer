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
			var addr = socket.handshake.address.address;

			var users = require('./routes/users');

			socket.on('edit-note', function(data) {

				var user = users.getUser(addr);
				if (user) {
					console.log(user + ': edited note ' + JSON.stringify(data));
					notes.set({
						instrument: data.instrument,
						pitch: data.pitch,
						time: data.time,
						user: user,
						highlighted: data.highlighted
					}, function(data) {
						socket.broadcast.emit('edit-note', data);
					});
				} else {
					console.warn('bad user: ' + addr);
				}
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
			var addr = socket.handshake.address.address;

			socket.on('request-username', function() {
				users.getUsername(addr, function(username) {
					socket.emit('assign-username', {
						id: username
					});
					io.sockets.emit('user-connect', {
						id: username
					});
				});
			});

			socket.on('message', function(data) {
				users.chat.addMessage(addr, data, function(message) {
					io.sockets.emit('message', message);
				});
			});
		});

		io.sockets.on('disconnect', function(socket) {
			var addr = socket.handshake.address.address;

			users.disconnect(addr, function(username) {
				io.sockets.emit('user-disconnect', {
					id: username
				});
			});
		});

		app.get('chats', function(req, res) {
			users.chat.getMessages(function(messages) {
				res.send(messages);
			});
		})

		app.get('new', function(req, res) {
			res.send(501);
			return;

			var addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			users.getUsername(addr, function(username) {
				res.send({
					user: username
				});
			});
		});

		app.get('', function(req, res) {
			//get list of users
			users.getAll(function(users) {
				res.send(users);
			});
		});

		app.get('/:username', function(req, res) {
			//get specific user with req.params.username
		});

		app.delete('', function(req, res) {
			res.send(501);
			return;

			var addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			users.disconnect(addr, function(username) {
				res.send({
					user: username
				});
			});
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