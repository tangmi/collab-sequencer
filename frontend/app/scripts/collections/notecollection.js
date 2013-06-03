define(['backbone', 'models/note'], function(Backbone, Note) {
	
	var NoteCollection = Backbone.Collection.extend({	
		
		initialize : function() {
			var _this = this;
			//setInterval( 
				//function() {
					_this.fetch(
						{	reset : true,
							success : function() { console.log("got data");},
							failure : function() { console.log("couldn't grab data"); } 
					});
				//}, 2000);
		},

		model : Note,

		url : 'http://10.150.31.177:3000/get',

		findNotesByTime : function(t) {
			return _.map( this.where({time : t, highlighted : true}),
						  function(note) { return note.attributes.pitch });
		}


		
    });

	return NoteCollection;
});