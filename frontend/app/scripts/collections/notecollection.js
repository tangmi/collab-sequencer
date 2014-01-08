define(['backbone', 'models/note'], function(Backbone, Note) {

	var NoteCollection = Backbone.Collection.extend({

		initialize: function() {

			var _this = this;

			console.log(CONFIG);

			CONFIG.socket.on('add-note', function(data) {
				_this.add(data);
			});

			CONFIG.socket.on('remove-note', function(data) {
				_this.remove(data);
			});

			this.fetch({
				reset: true,
				success: function() {
					console.log("got data");
				},
				failure: function() {
					console.log("couldn't grab data");
				}
			});
		},

		model: Note,

		url: CONFIG.endpoint + '/get',

		findNotesByTime: function(t) {
			return _.map(this.where({
				time: t,
				highlighted: true
			}), function(note) {
				return note.attributes;
			});
		}



	});

	return NoteCollection;
});