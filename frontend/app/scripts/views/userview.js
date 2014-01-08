define([
		'backbone',
		'socketio'
], function(Backbone, Socket) {

	var View = Backbone.View.extend({

		initialize: function() { 

			var _this = this;
			CONFIG.socket.on('news', function(res) {
				_this.getUserList(res);
			});

		},

		render: function() {
			_.each(userList, function(name) {
				$el.append('<div>' + name + '</div>');
			});
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