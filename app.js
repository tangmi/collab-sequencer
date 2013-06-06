var express = require('express');
// var routes = require('./routes');
var api = require('./routes/api');
var http = require('http');
var path = require('path');

// var sass = require('node-sass');
var fs = require('fs');

var collection = require('./collection');

var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
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

http.createServer(app).listen(app.get('port'), function() {
	console.log("Collab-sequencer server listening on port " + app.get('port'));
	collection.initialize();
});

//CORS
app.all('/*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
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

//API
app.post('/add', api.add);
app.get('/get', api.get);
app.get('/toggle/:type/:time/:pitch', api.toggle);
app.get('/render', api.render);