define(['backbone', 'models/note'], function(Backbone, Note) {
	
	var NoteCollection = Backbone.Collection.extend({	
	
		model : Note
		
    });

	return NoteCollection;
});