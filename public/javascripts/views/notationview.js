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
			Drawer.setTickPosition(6);
			Player.initialize(10);

			/* populate collection with all notes */

			var allNotes = [];
			//var noteNames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
			var endTime = 16;

			for (var i = 0; i < 32; i++) {
				for (var j = 0; j < 10; j++) {
					allNotes.push(  {pitch : i, time : j, user : 'GUS' });
				}
			}

			this.collection = new NoteCollection();
			this.collection.add(allNotes);

			this.collection.each(this.renderNote);

		},

		renderNote : function(noteModel) {
			
			/*Drawer.add*/
			var rowid = '#cell-' + noteModel.get('pitch') + '-' + noteModel.get('time');
			noteView = new NoteView( {el : $(rowid), model : noteModel} );

		},


		events : {
			/*
			click play : play
			click pause : pause
			*/
		},

		play : function() {

		},


		pause : function() {

		}

	});

	return View;
});
