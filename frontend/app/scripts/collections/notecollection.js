define(['backbone', 'models/note'], function(Backbone, Note) {

	var NoteCollection = Backbone.Collection.extend({

		initialize: function() {

			var _this = this;

			CONFIG.socket.on('edit-note', function(data) {
				_this.setNote(data);
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
		},

		setNote: function(note) {
			this.findWhere({
				pitch: note.pitch,
				time: note.time,
				instrument: note.instrument
			}).set(note);
		}

	});

	return NoteCollection;
});