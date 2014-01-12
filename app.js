var express = require('express')
  , path = require('path')
  , fs = require('fs')
  , collection = require('./collection');

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io')
  , api = require('./routes/api')(io);

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


server.listen(app.get('port'), function() {
	console.log("Collab-sequencer server listening on port " + app.get('port'));
	collection.initialize();
});



io = io.listen(server);
io.sockets.on('connection', function (socket) {

	socket.on('edit-note', function(data) {
		console.log('\n\nedit-note');
		io.sockets.emit('edit-note', data);
	});

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
app.put('/add', api.add);
app.get('/get', api.get);
app.get('/config', api.config);

app.get('/username', api.getUsername);
app.get('/users', api.getUsers);
app.get('/user/disconnect', api.userDisconnect);

app.get('/render', api.render);
app.get('/clear', api.clear);
