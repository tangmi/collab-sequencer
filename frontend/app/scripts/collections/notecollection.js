define(['backbone', 'models/note'], function(Backbone, Note) {
	
	var NoteCollection = Backbone.Collection.extend({	
	
		model : Note,

		findNotesByTime : function(t) {
			return _.map( this.where({time : t, highlighted : true}),
						  function(note) { return note.attributes.pitch });
		}
		
    });

	return NoteCollection;
});