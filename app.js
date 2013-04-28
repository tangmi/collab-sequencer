var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var sass = require('node-sass');
var fs = require('fs');

var app = express();

app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

var cssPath = __dirname + '/public/stylesheets/style.build.css';
var sassPath = __dirname + '/stylesheets/style.scss';

app.configure('production', function() {
	//build the sass file for use in production
	fs.writeFileSync(cssPath, sass.renderSync(fs.readFileSync(sassPath), {
		includePaths: [__dirname + '/stylesheets'],
		outputStyle: 'compressed'
	}), 'utf8');
});

app.configure('development', function () {
	app.use(express.errorHandler());

	//delete the built sass file and insert middleware to build on every request during development (slow)
	try {
		fs.unlinkSync(cssPath);
		console.log("Deleted built CSS file (from production build)");
	} catch(e) {}
	app.use('/stylesheets/style.build.css', function(req, res, next) {
		console.log("Rendering SASS file to CSS...");
		res.end(sass.renderSync(fs.readFileSync(sassPath), {
			includePaths: [__dirname + '/stylesheets'],
			outputStyle: 'compressed'
		}));
	});
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));

	console.log(sass.renderSync('', {includePaths: [__dirname + '/stylesheets']}));
});