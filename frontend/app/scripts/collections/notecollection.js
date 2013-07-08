define(['backbone', 'models/note'], function(Backbone, Note) {

	var NoteCollection = Backbone.Collection.extend({

		fetchInitialData: function() {
			var _this = this;
			_this.fetch({
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

		url: config.endpoint + '/get',

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