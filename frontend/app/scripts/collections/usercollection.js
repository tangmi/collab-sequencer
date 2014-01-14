define(['backbone', 'models/user'], function(Backbone, User) {

	var NoteCollection = Backbone.Collection.extend({

		initialize: function() {

			var _this = this;
			CONFIG.socket.on('user-connect', function(data) {
				_this.add(data);			
			});

			CONFIG.socket.on('user-disconnect', function(uid) {
				_this.remove(
					_this.where({id: uid})
				);
			});

			this.getInitialData();
		},

		model: User,

		url: CONFIG.endpoint + '/getUsers',

		getInitialData: function() {

			this.fetch({
				reset: true,
				success: function() {
					console.log("got users");
				},
				failure: function() {
					console.log("couldn't get users");
				}
			});
		}

	});

	return NoteCollection;
});