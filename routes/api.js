var collection = require('../collection');
var config = require('../configuration');
var animal = require('animal-id');
var options = require('../configuration').options;

// function Note(pitch, time, type, user, highlighted) {
// 	this.pitch = pitch;
// 	this.time = time;
// 	this.type = type;
// 	this.user = user;
// 	this.highlighted = highlighted;
// }
var userTimeouts = {};

exports.get = function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(collection.getData());

	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	if (userTimeouts[ip]) {
		userConnect(ip);
		clearTimeout(userTimeouts[ip]);
	}
	userTimeouts[ip] = setTimeout(function() {
		userDisconnect(ip);
	}, 1000 * options.userTimeout);
};

exports.getModel = function(req, res) {
	res.setHeader('Content-Type', 'application/json');

	var p = req.params.pitch,
		t = req.params.time,
		type = req.params.type;

	console.log(type + " " + t + " " + p)

	res.send(collection.getModel(type, t, p));
};


exports.add = function(req, res) {
	var p = req.body.pitch,
		t = req.body.time,
		type = req.body.type;

	collection.data[type][t][p].highlighted = req.body.highlighted;
	collection.data[type][t][p].user = req.body.user;

	console.log("=> " + collection.data[type][t][p].user + ": set " + collection.data[type][t][p]._toString + " to " + collection.data[type][t][p].highlighted);

	collection.storeCollection(collection.data[type][t][p].user);
	res.send(200);
};


//manual toggling of stuff
exports.toggle = function(req, res) {
	res.setHeader('Content-Type', 'text/plain');

	var p = req.params.pitch,
		t = req.params.time,
		type = req.params.type;

	collection.data[type][t][p].highlighted = !collection.data[type][t][p].highlighted;
	collection.data[type][t][p].user = "SYSTEM";



	var note = collection.data[type][t][p];
	var msg = "=> " + note.user + ": set " + note._toString + " to " + note.highlighted;
	console.log(msg);

	collection.storeCollection(note.user);
	res.send(collection.render() + '\n' + msg);
};

exports.render = function(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	res.send(collection.render());
};

exports.clear = function(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	collection.generateBaseCollection();
	collection.storeCollection('SYSTEM');
	res.send(collection.render());
};

exports.config = function(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	res.send(config.instruments);
};

var users = {};
exports.getUsername = function(req, res) {
	var ip;
	if (options.oneNamePerBrowser) {
		ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	} else {
		ip = +new Date; //use the unix timestamp so it'll probably be unique
	}

	if (!users[ip]) {
		users[ip] = animal.getId();
		console.log('Assigning IP address', ip, 'with name', users[ip]);
	}

	res.setHeader('Content-Type', 'application/json');
	res.send({
		"user": users[ip]
	});

	userConnect(ip);
};

exports.getUsers = function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(usersOnline);
};

var usersOnline = [];

userConnect = function(ip) {
	if (usersOnline.indexOf(users[ip]) === -1) {
		usersOnline.push(users[ip]);
		console.log('User', users[ip], '(' + ip + ') connected');
	}
};

userDisconnect = function(ip) {
	usersOnline.splice(usersOnline.indexOf(users[ip]));
	console.log('User', users[ip], '(' + ip + ') disconnected');
}

exports.userDisconnect = function(req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	userDisconnect(ip);
	res.send(200);
};