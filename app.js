var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

// var sass = require('node-sass');
var fs = require('fs');

var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	// app.set('views', __dirname + '/views');
	// app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'frontend/app')));

});


app.configure('production', function() {});

app.configure('development', function() {
	app.use(express.errorHandler());
});

// app.get('/', routes.index);


var data = {};
/*
	data.instrument.time.pitch = {
		user, highlighted
	}
*/

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));


	var pitches = 10, //0-10
		times = 31, //0-31
		user = 'GUS',
		types = ['drums', 'synth'];

	for (var i in types) {
		var type = types[i];
		data[type] = [];

		var t = 0;
		for (t = 0; t <= times; t++) {
			data[type][t] = [];

			var p = 0;
			for (p = 0; p <= pitches; p++) {
				data[type][t][p] = {
					'_toString': '#cell-' + t + '-' + p + '-' + type,
					'user': user,
					'highlighted': false
				}
			}
		}
	}

	// console.log(dataToJson(data));

});

var dataToJson = function(data) {
	var out = [];
	var type, t, p;
	for(type in data) {
		for(t in data[type]) {
			for(p in data[type][t]) {
				var note = data[type][t][p];
				out.push('{"pitch":' + p + ',"time":' + t + ',"user":"' + note.user + '","type":"' + type + '","highlighted":' + note.highlighted + '}');
			}
		}
	}
	return '[' + out.join(',') + ']';
}

//CORS
app.all('/*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	// console.log("CORS");

	next();
});



var redisConfig = {
	port: 6379,
	host: '127.0.0.1',
	options: {}
};
var redis = require("redis");
var client = redis.createClient(redisConfig.port, redisConfig.host, redisConfig.options);

// client.hmset('gus', {'count': 0});

app.get('/gus', function(req, res) {
	client.hgetall("gus", function(err, obj) {
		var count = Number(obj.count) + 1;
		res.send('goodbye gus, #' + count);

		client.hmset('gus', {
			'count': count
		});

	});

	console.log("somebody connected");
});



//testing code
var generateBaseCollection = function(random) {
	var pitches = 10,
		times = 31,
		user = 'GUS',
		types = ['drums', ''];

	var out = [];

	for (var i in types) {
		var type = types[i];
		var t = 0;
		for (t = 0; t <= times; t++) {
			var p = 0;
			for (p = 0; p <= pitches; p++) {
				var val = random ? (Math.random() > 0.5 ? 'false' : 'true') : false;
				out.push('{"pitch":' + p + ',"time":' + t + ',"user":"' + user + '","type":"' + type + '","highlighted":' + val + '}');
			}
		}
	}

	return '[' + out.join(',') + ']';
}

app.get('/reset', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(generateBaseCollection(false));
});

app.get('/reset/random', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(generateBaseCollection(true));
});



//saving
app.post('/add', function(req, res) {

	var p = req.body.pitch,
		t = req.body.time,
		type = req.body.type;

	data[type][t][p].highlighted = req.body.highlighted;
	data[type][t][p].user = req.body.user;

	console.log("=> " + data[type][t][p].user + ": set " + data[type][t][p]._toString + " to " + data[type][t][p].highlighted);

});




app.get('/get', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(dataToJson(data));
});


//manual toglging of stuff
app.get('/toggle/:type/:time/:pitch', function(req, res) {
	res.setHeader('Content-Type', 'text/plain');

	var p = req.params.pitch,
		t = req.params.time,
		type = req.params.type;

	data[type][t][p].highlighted = !data[type][t][p].highlighted;
	data[type][t][p].user = "SYSTEM";

	console.log("=> " + data[type][t][p].user + ": set " + data[type][t][p]._toString + " to " + data[type][t][p].highlighted);

	res.send("=> " + data[type][t][p].user + ": set " + data[type][t][p]._toString + " to " + data[type][t][p].highlighted);
});