define([
	'backbone',
	'views/module/drawer',
	'views/module/player',
	'collections/notecollection',
	'models/note'
], function(Backbone, Drawer, Player, NoteCollection, Note) {

	var View = Backbone.View.extend({
		
		//Collection : holds a notecollection

		initialize: function () {
			/* populate collection with all notes */

			var allNotes = [];
			var noteNames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
			var endTime = 16;

			for (var i = 0; i < 16; i++) {
				for (var j = 0; j < noteNames.length; j++) {
					allNotes.push(  {pitch : noteNames[j], time : i, user : 'GUS' });
				}
			}

			this.collection = new NoteCollection();
			this.collection.add(allNotes);
			
		},


		events : {
			/*
			rightclick a highlighted note : removeNote
			click an unhighlighted note : placeNote
			click play : play
			click pause : pause
			*/
		},


		removeNote : function() {
			/* call drawer remove */
		},


		placeNote : function() {
			/* CALL draw add */
		},


		play : function() {

		},


		pause : function() {

		}

	});

	return View;
});
