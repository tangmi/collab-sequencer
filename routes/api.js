var collection = require('../collection');


exports.get = function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(collection.toJson());
};


exports.add = function(req, res) {

	var p = req.body.pitch,
		t = req.body.time,
		type = req.body.type;

	collection.data[type][t][p].highlighted = req.body.highlighted;
	collection.data[type][t][p].user = req.body.user;

	console.log("=> " + collection.data[type][t][p].user + ": set " + collection.data[type][t][p]._toString + " to " + collection.data[type][t][p].highlighted);

	res.send(200);
};


 //manual toglging of stuff
exports.toggle = function (req, res) {
	res.setHeader('Content-Type', 'text/plain');

	var p = req.params.pitch,
		t = req.params.time,
		type = req.params.type;

	collection.data[type][t][p].highlighted = !collection.data[type][t][p].highlighted;
	collection.data[type][t][p].user = "SYSTEM";

	console.log("=> " + collection.data[type][t][p].user + ": set " + collection.data[type][t][p]._toString + " to " + collection.data[type][t][p].highlighted);

	res.send(collection.render() + '\n' + "=> " + collection.data[type][t][p].user + ": set " + collection.data[type][t][p]._toString + " to " + collection.data[type][t][p].highlighted);
};

exports.render = function(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	res.send(collection.render());
};