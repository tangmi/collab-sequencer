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

		currentTime : 0,

		currentTab : "drums",
		
		maxTime : 32,

		tempo : 100, /* ms per tick change */

		_playInterval : null,

		initialize: function () {

			/* Generate controls */
			var controls = $("<div></div>", {
				id: 'controls'
			});

			controls.append($("<button></button>", { id: 'play', text: 'Play' }));
			controls.append($("<button></button>", { id: 'synth_button', text: 'Synth', class: 'tab' }));
			controls.append($("<button></button>", { id: 'drums_button', text: 'Drums', class: 'tab' }));

			this.$el.append(controls);
			this.collection = new NoteCollection();

			this._initializeTab('drums');
			this._initializeTab('synth');

			$("#" + this.currentTab).show();




		},

		_initializeTab : function(tabName) {

			var notes = 11;
			Drawer.initialize(notes, this.maxTime, tabName);
			Player.initialize(notes);

			/* populate collection with all notes */

			var allNotes = [];
			var endTime = 16;

			for (var i = 0; i < this.maxTime; i++) {
				for (var j = 0; j < notes; j++) {
					allNotes.push({pitch : j, time : i, user : 'GUS', type : tabName });
				}
			}

			this.collection.add(allNotes);

			_.each(this.collection.where({type : tabName}), this._renderNote);

		},

		_renderNote : function(noteModel) {
			
			/*Drawer.add*/
			var rowid = '#cell-' + noteModel.get('time') + '-'
								 + noteModel.get('pitch') + '-'
								 + noteModel.get('type');
			noteView = new NoteView( {el : $(rowid), model : noteModel} );

		},


		isPlaying: false,
		
		events : {
			'click #play' : 'togglePlay',
			'click #synth_button' : function() {this.toggleTab('synth')},
			'click #drums_button' : function() {this.toggleTab('drums')}  
		},

		toggleTab : function(tab) {
			if (this.currentTab != tab) {
				this.currentTab = tab;
				$(".roll").hide();
				$("#" + tab).show();
			}
		},

		togglePlay: function() {
			if(this.isPlaying) {
				this.isPlaying = false;
				this.play();
				$("#play").html("Pause");
			} else {
				this.isPlaying = true;
				this.pause();
				$("#play").html("Play");
			}
		},

		play : function() {
			if (!this._playInterval) {
				var _this = this;
				this._playInterval = setInterval(
					function () {
						Drawer.setTickPosition(_this.currentTime, _this.currentTab);
						Player.play(_this.collection.findNotesByTime(_this.currentTime));
						_this.currentTime = (_this.currentTime + 1) % _this.maxTime;
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
