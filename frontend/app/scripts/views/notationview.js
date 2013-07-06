define([
		'backbone',
		'views/module/drawer',
		'views/module/player',
		'collections/notecollection',
		'models/note',
		'views/noteview'
], function(Backbone, Drawer, Player, NoteCollection, Note, NoteView) {


	//these mush be scoped to this file, cannot be scoped to the backbone object, currently.
	currentTime = 0;
	currentTab = "";
	maxTime = 32;
	bpm = 100;
	nextTick = 0;
	skipTicks = 60000 / bpm;
	collection = new NoteCollection();

	$("#tempo").keyup(function() {
		bpm = $("#tempo").val();
		if(bpm > 0) {
			nextTick = (new Date).getTime();
			skipTicks = 60000 / bpm;
			// console.log("bpm = " + bpm);
		}
	});

	var View = Backbone.View.extend({


		// javascript game loop
		// http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html

		//Collection : holds a notecollection

		el: "#app",

		// currentTime: 0,

		// currentTab: "drums",

		// maxTime: 32,

		// tempo: 100,
		/* ms per tick change */

		_playInterval: null,

		initialize: function() {
			$("#tempo").val(bpm);
			// /* Generate controls */
			// var controls = $("<div></div>", {
			// 	id: 'controls'
			// });

			// controls.append($("<button></button>", {
			// 	id: 'play',
			// 	text: 'Play'
			// }));
			// controls.append($("<button></button>", {
			// 	id: 'synth_button',
			// 	text: 'Synth',
			// 	class: 'tab'
			// }));
			// controls.append($("<button></button>", {
			// 	id: 'drums_button',
			// 	text: 'Drums',
			// 	class: 'tab'
			// }));

			// this.$el.append(controls);
			var _this = this;
			collection.bind('reset', function() { 
				_this._initializeTab('drums');
				_this._initializeTab('synth');
			});


			this._initializeTab('drums', 11);
			this._initializeTab('synth', 7);

			this.selectTab('drums');


		},

		_initializeTab: function(tabName, notes) {

			Drawer.initialize(notes, maxTime, tabName);
			Player.initialize(notes);

			/* populate collection with all notes */

			var allNotes = [];
			var endTime = 16;

			/*for (var i = 0; i < maxTime; i++) {
				for (var j = 0; j < notes; j++) {
					allNotes.push({
						pitch: j,
						time: i,
						user: 'GUS',
						type: tabName
					});
				}
			}*/

			//collection.add(allNotes);

			_.each(collection.where({
				type: tabName
			}), this._renderNote);

		},

		_renderNote: function(noteModel) {

			/*Drawer.add*/
			var rowid = '#cell-' + noteModel.get('time') + '-' + noteModel.get('pitch') + '-' + noteModel.get('type');
			noteView = new NoteView({
				el: $(rowid),
				model: noteModel
			});
			noteView.render();

		},


		isPlaying: false,

		events: {
			'click #play': 'togglePlay',
			'click #synth_button': function() {
				this.selectTab('synth')
			},
			'click #drums_button': function() {
				this.selectTab('drums')
			}
		},

		selectTab: function(tab) {
			if (currentTab != tab) {
				currentTab = tab;
				$(".roll").hide();
				$("#" + tab).show();

				$(".tab").removeClass('selected');
				$("#" + tab + "_button").addClass('selected');
				Drawer.setTickPosition(currentTime, currentTab);
			}
		},

		togglePlay: function() {
			if (!this.isPlaying) {
				this.isPlaying = true;
				this.play();
				$("#play").html("Pause");
			} else {
				this.isPlaying = false;
				this.pause();
				$("#play").html("Play");
			}
		},

		play: function() {
			if (!this._playInterval) {
				nextTick = (new Date).getTime();
				this._playInterval = window.setInterval(this._interval, 0);
			}
		},

		pause: function() {
			clearInterval(this._playInterval);
			this._playInterval = null;
		},

		_interval: (function() {

			var loops = 0,
				maxFrameSkip = 10;

			console.log(nextTick);

			return function() {

				loops = 0;

				while ((new Date).getTime() > nextTick && loops < maxFrameSkip) {
					//update player position

					Drawer.setTickPosition(currentTime, currentTab);
					Player.play(collection.findNotesByTime(currentTime));
					currentTime = (currentTime + 1) % maxTime;

					nextTick += skipTicks;
					loops++;
				}

				// update logic
				// console.log("tick");

			}

		})(),

	});

	return View;
});