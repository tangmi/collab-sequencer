var currentTime = 0;
var maxTime = 32

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

		tempo : 100, /* ms per tick change */

		_playInterval : null,

		initialize: function () {

			/* Render the board */
			Drawer.initialize(10, maxTime);
			Player.initialize(10);

			/* populate collection with all notes */

			var allNotes = [];
			//var noteNames = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
			var endTime = 16;

			for (var i = 0; i < maxTime; i++) {
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
			'click #play' : 'play',
			'click #pause' : 'pause'
		},

		play : function() {
			if (!this._playInterval) {
				this._playInterval = setInterval(
					function () {
						Drawer.setTickPosition(currentTime);
						currentTime = (currentTime + 1) % maxTime;
					}, this.tempo);
			}

		},

		pause : function() {
			clearInterval(this._playInterval);
			this._playInterval = null;
		}

	});

	return View;
});
