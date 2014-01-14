var express = require('express');

var app = express(),
	http = require('http'),
	server = http.createServer(app),
	socketIo = require('socket.io');

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	// app.use(express.cookieParser('your secret here'));
	// app.use(express.session());
	// app.use(app.router);
	app.use(express.static(require('path').join(__dirname, 'frontend/app')));
});

var io = socketIo.listen(server);

app.configure('production', function() {
	app.use(express.logger('short'));
	io.enable('browser client minification'); //minify sent js client file
	io.set('log level', 1); //reduce logging
});
app.configure('development', function() {
	app.use(express.logger('dev'));
	app.use(express.errorHandler());
});

server.listen(app.get('port'), function() {
	console.log("Collab-sequencer server listening on port " + app.get('port'));
	require('./routes/notes').initialize();
});


//pseudo framework for api routing
var api = require('./api')(io);
for(var i = 0; i < api.length; i++) {
	var route = api[i];
	// console.log(route.verb.toUpperCase() + ' ' + route.path + ' added');
	
	//add routes defined by api to express app
	app[route.verb](route.path, route.fn);
}
