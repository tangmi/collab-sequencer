define([
	'backbone',
	'views/module/drawer',
	'views/module/player',
	'collections/notecollection',
	'models/note',
	'views/noteview'
], function(Backbone, Drawer, Player, NoteCollection, Note, NoteView) {

	var View = Backbone.View.extend({
		
		//Collection : holds a notecollection

		el: "#app",


		initialize: function () {
			
			/* Render the board */
			var roll = $("<div></div>", {
				id: "roll"
			});
			$(this.el).append(roll);

			Drawer.initialize(10, 32);

			Drawer.add(1,2);

			Drawer.add(5, 10);

			Drawer.remove(1, 2);

			Drawer.setTickPosition(6);


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

			//associate all notes with an element and render them

			this.collection.each(this.renderNote);

		},

		renderNote : function(noteModel) {
			
			/*Drawer.add*/

			var row = ['c', 'd', 'e', 'f', 'g', 'a', 'b', 'c'].indexOf(noteModel.get('pitch'));
			var rowid = '#cell-' + row + '-' + noteModel.get('time');
			noteView = new NoteView( {el : $(rowid), model : noteModel} );

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
