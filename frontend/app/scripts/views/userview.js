define([
		'backbone',
		'socketio'
], function(Backbone, Socket) {

	var View = Backbone.View.extend({

		initialize: function() { 

			var _this = this;

			CONFIG.socket.on('user-connect', function(res) {
				_this.addUser(res.name);
			});

		},

		render: function() {
			_.each(userList, function(name) {
				$el.append('<div>' + name + '</div>');
			});
		},

		addUser: function(user) {
			$el.append('<div>' + user + '</div>');
		},

		el: '#users',

		userList : [],

		events: {
			'click': 'toggle'
		},

		getUserList : function(data) {
			console.log(data);
		}
	});

	return View;
});