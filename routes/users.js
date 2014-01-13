var users = {};
var usersOnline = [];
var animal = require('animal-id');
var userTimeouts = {};

exports.getAll = function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(usersOnline);
};

exports.get = function(req, res) {
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

	connect(ip);
};

exports.disconnect = function(req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	disconnect(ip);
	res.send(200);
};

function connect(ip) {
	if (usersOnline.indexOf(users[ip]) === -1) {
		usersOnline.push(users[ip]);
		console.log('User', users[ip], '(' + ip + ') connected');
	}
};

function disconnect(ip) {
	usersOnline.splice(usersOnline.indexOf(users[ip]));
	console.log('User', users[ip], '(' + ip + ') disconnected');
}