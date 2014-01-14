var users = {};
var usersOnline = [];
var animal = require('animal-id');
var userTimeouts = {};

exports.getAll = function(cb) {
	cb(usersOnline);
};

exports.getUsername = function(addr, cb) {
	var ip;
	if (require('../configuration').options.oneNamePerBrowser) {
		ip = addr;
	} else {
		ip = +new Date; //use the unix timestamp so it'll probably be unique
	}

	if (!users[ip]) {
		users[ip] = animal.getId();
		console.log('Assigning IP address', ip, 'with name', users[ip]);
	}

	connect(ip);
	cb(users[ip]);
};

exports.disconnect = function(addr, cb) {
	var ip = addr;
	disconnect(ip);
	cb(users[ip]);
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

var messages = [];
exports.chat = {
	addMessage: function(addr, body, cb) {
		//any validation goes here
		var msg = {
			timestamp: +new Date,
			ip: addr,
			username: users[addr],
			body: body
		};
		messages.push(msg);
		
		cb({
			timestamp: msg.timestamp,
			username: msg.username,
			body: msg.body
		});
	},
	getMessages: function(cb) {
		var out = [];
		for(var i = 0; i < messages.length; i++) {
			var msg = messages[i];
			out.push({
				timestamp: msg.timestamp,
				username: msg.username,
				body: msg.body
			});
		}
		cb(out);
	}
};