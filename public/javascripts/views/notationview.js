define([
	'backbone',
	'views/module/drawer',
	'views/module/player',
	'collections/notecollection',
	'models/note',
	'views/noteview'
], function(Backbone, Drawer, Player, NoteCollection, Note, NoteView) {

	var View = Backbone.View.extend({


		// javascript game loop
		// http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html

		//Collection : holds a notecollection

		el: "#app",


		initialize: function () {

			/* Render the board */
			var roll = $("<div></div>", {
				id: "roll"
			});
			$(this.el).append(roll);
			Drawer.initialize(11, 32);
			Drawer.setTickPosition(6);
			Player.initialize(11);

			/* populate collection with all notes */

			var allNotes = [];
			//var noteNames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
			var endTime = 16;

			for (var i = 0; i < 32; i++) {
				for (var j = 0; j < 11; j++) {
					allNotes.push(  {pitch : j, time : i, user : 'GUS' });
				}
			}

			this.collection = new NoteCollection();
			this.collection.add(allNotes);

			this.collection.each(this.renderNote);

		},

		renderNote : function(noteModel) {
			
			/*Drawer.add*/
			var rowid = '#cell-' + noteModel.get('time') + '-' + noteModel.get('pitch');
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
