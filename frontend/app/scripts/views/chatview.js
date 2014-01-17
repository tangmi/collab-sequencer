define([
		'backbone',
		'socketio',
		'underscore',
		'collections/usercollection'
], function(Backbone, Socket, _, UserCollection) {

	var View = Backbone.View.extend({

		el: '#chat',

		collection: new UserCollection(),

		events: { 
			'click button': 'sendMessage',
			'keypress input':  'postMessageOnEnter' 
		},

		initialize: function() { 

			
			var _this = this;
			//Listen for message postings
			CONFIG.socket.on('message', function(message) {
				_this.postMessage(message);
			});

			//Listen for users leaving
			CONFIG.socket.on('user-disconnect', function(data) {
				_this.removeUser(data.id);
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

		postMessageOnEnter: function(e) {
			if (e.which == 13) {
				this.sendMessage();
			}
		},

		postMessage: function(message) {
			var date = new Date(message.timestamp);
			var mins = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
			message.timestamp = date.getHours() % 12 + ':' + mins;

			this.$messages.append(
				_.template( $('#message-template').html(), message)
			);
		},

		sendMessage: function() {
			CONFIG.socket.emit('message', this.$input.val());
			this.$input.val('');
		}
	});

	return View;
});