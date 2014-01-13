define([
		'backbone',
		'socketio',
		'collections/usercollection'
], function(Backbone, Socket, UserCollection) {

	var View = Backbone.View.extend({

		el: '#chat',

		collection: new UserCollection(),

		events: {},

		initialize: function() { 

			var _this = this;
			CONFIG.socket.on('message-sent', function(message) {
				_this.postMessage(message);
			});

			this.$users = this.$el.find('#users');
			this.$messages = this.$el.find('#messages');

			this.collection.bind('add', this.addUser, this);
			this.collection.bind('remove', this.removeUser, this);
			this.collection.bind('reset', function() {
				_this.render();
			});

		},

		render: function() {
			var _this = this;			
			_.each(this.collection.models, function(user) {
				_this.addUser(user);
			});
		},

		addUser: function(user) {
			this.$users.append('<div id="user-' + user.id + '">' + user.id + '</div>');
		},

		removeUser: function(user) {
			this.$users.find('#user-' + user.id).remove();
		},

		getUserList: function(data) {
			console.log(data);
		},

		postMessage: function(message) {
			this.$messages.append('<div>' + message.data + '</div>');
		}
	});

	return View;
});