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

// //CORS
// app.all('/*', function(req, res, next) {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type');
// 	next();
// });

app.get('/reset', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	collection.initialize();
	res.send(200);
});

//API
app.post('/add', api.add);
app.get('/get', api.get);
app.get('/get/:type/:time/:pitch', api.getModel);
app.get('/toggle/:type/:time/:pitch', api.toggle);
app.get('/render', api.render);
app.get('/clear', api.clear);
app.get('/config', api.config);