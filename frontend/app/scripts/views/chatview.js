define([
		'backbone',
		'socketio',
		'collections/usercollection'
], function(Backbone, Socket, UserCollection) {

	var View = Backbone.View.extend({

		el: '#chat',

		collection: new UserCollection(),

		events: { 'click button': 'sendMessage' },

		initialize: function() { 

			var _this = this;
			CONFIG.socket.on('message', function(message) {
				_this.postMessage(message);
			});

			this.getOldMessages();

			CONFIG.ls = this.collection;
			this.$users = this.$el.find('#users');
			this.$messages = this.$el.find('#messages');
			this.$input = this.$el.find('input');

			this.collection.bind('add', this.addUser, this);
			this.collection.bind('remove', this.removeUser, this);
			this.render();

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

		getOldMessages: function() {
			var _this = this;
			$.get(CONFIG.endpoint + '/users/chats')
			 .done(function(data) {
			 	for (var i = 0; i < data.length; i++) {
			 		_this.postMessage(data[i]);
			 	}
			 })
			 .fail(function() {
			 	console.log('couldn\'t get old chats');
			 });
		},

		postMessage: function(message) {
			this.$messages.append('<div>' + message.body + '</div>');
		},

		sendMessage: function() {
			console.log('push');
			CONFIG.socket.emit('message', this.$input.val());
		}
	});

	return View;
});