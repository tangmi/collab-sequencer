//Passed socket component
function thing(io) {

	io.sockets.on('connection', function (socket) {

	  socket.on('user-connect', function (data) {
	    socket.emit('user-connect', { hello: 'world' });
	  });

	  socket.on('message', function (data) {
	  	socket.emit('message', {message: data});
	  });

	});

	io.sockets.on('disconnect', fucntion (socket) {
		socket.emit('user-disconnect', { user: 'gone'});
	});

}