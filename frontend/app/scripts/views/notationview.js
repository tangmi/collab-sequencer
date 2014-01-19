define([
		'backbone',
		'views/module/player',
		'collections/notecollection',
		'models/note',
		'views/noteview'
], function(Backbone, Player, NoteCollection, Note, NoteView) {

	var timing = CONFIG.timing;

	var View = Backbone.View.extend({

		//tabs: (passed dynamically in initialization) list of tabs
		el: "#app",
		collection: new NoteCollection(),
		currentTab: "",


		initialize: function() {
			$(document).on('keydown', _.bind(this.handleKeyInput, this));

			$("#tempo").val(timing.bpm);
			this.$chat = $('#chat-wrapper');


			this.tabs = this.options.tabs;
			this.currentTab = this.tabs[0].name;
			var _this = this;

			//a collection is reset when it is first loaded in
			this.collection.bind('reset', function() {
				for (var i = 0; i < _this.tabs.length; i++) {
					_this._hookUpTab(_this.tabs[i].name);
				}
			});

			this.setTickPosition(0, false);
			this._adjustChatSize();
		},

		_hookUpTab: function(tabName) {
			_.each(this.collection.where({
				instrument: tabName
			}), this._hookUpNote);

		},

		_hookUpNote: function(noteModel) {

			var rowid = '#cell-' + noteModel.get('time') + '-' + noteModel.get('pitch') + '-' + noteModel.get('instrument');
			noteView = new NoteView({
				el: $(rowid),
				model: noteModel
			});
			noteView.render();
		},

		_adjustChatSize: function() {
			this.$chat.height(
				$(window).height() - this.$el.height() - 150
			);
		},

		events: {
			'click #play': 'togglePlay',
			'keyup #tempo': 'setTempo',
			'click .tab': 'selectTab',
			'click #incrementor': 'tick',
			'click .timeHandle': 'moveTimeHandle'
		},

		selectTab: function(e) {
			//shitty
			var tab = $(e.target).text();

			if (this.currentTab != tab) {
				this.currentTab = tab;
				$(".roll").hide();
				$("#" + tab).show();

				$(".tab").removeClass('selected');
				$("#" + tab + "_button").addClass('selected');
				this.setTickPosition(timing.currentTime, false);
			}

			this._adjustChatSize();
		},

		togglePlay: function() {
			if (this.isPlaying) {
				this.isPlaying = false;
				this.pause();
				$("#play").html("Play");
			} else {
				this.isPlaying = true;
				this.play();
				$("#play").html("Pause");
			}
		},

		play: function() {
			if (!this._playInterval) {
				timing.nextTick = (new Date).getTime();
				this._playInterval = window.setInterval(timing.interval, 0);
			}
		},

		pause: function() {
			clearInterval(this._playInterval);
			this._playInterval = null;
		},

		setTempo: function() {

			var newBPM = parseInt($('#tempo').val());
			newBPM = Math.min(newBPM, 1500);
			if (_.isNumber(newBPM) && newBPM >= 0) {

				timing.bpm = newBPM;
				timing.nextTick = (new Date).getTime();
				timing.skipTicks = 60000 / timing.bpm;
			}
		},

		moveTimeHandle: function(e) {
			var $handleCol = $(e.target).parent();

			//parse the row number from the parent column
			var time = $handleCol.attr('id').split('-')[1];
			this.setTickPosition(parseInt(time));
		},

		handleKeyInput: function(e) {
			if (document.activeElement.nodeName != "BODY") { return; }
			if (e.keyCode == 39 && !this.isPlaying) {
				this.arrowNavigate(true);
			}
			else if (e.keyCode == 37 && !this.isPlaying) {
				this.arrowNavigate(false);
			} else if (e.keyCode == 32) {
				this.togglePlay();
			}

		},

		arrowNavigate: function(left) {
           if (left) {
               this.setTickPosition(
                    (CONFIG.timing.currentTime + 1) % CONFIG.timing.maxTime, false
               );
           } else {
               this.setTickPosition(
                     (CONFIG.timing.currentTime + CONFIG.timing.maxTime - 1) % CONFIG.timing.maxTime, false
               );
           }
       	},

		tick: function() {
			this.setTickPosition(timing.currentTime);
		},

		setTickPosition: function(time, isPlayed) {
			if (isPlayed === undefined) { isPlayed = true };
			if (time >= 0 && time < timing.maxTime) {
				var j,
					atags = document.getElementsByClassName("cell"),
					atotal = atags.length;
				for (j = 0; j < atotal; j++) {
					atags[j].className = atags[j].className.replace("cell-highlighted", "");
				}

				$('.timeHandle.highlighted').removeClass('highlighted');

				var $col = $("#column-" + time + "-" + this.currentTab);
				var $tags = $col.find("li.cell");
				
				$tags.addClass('cell-highlighted');
				$col.find('.timeHandle').addClass('highlighted');

				timing.currentTime = time;

				if (isPlayed) {
					Player.play(this.collection.findNotesByTime(time));
				}
			}
		},

		isPlaying: false,

		//Interval object to be cleared by pause and set by play
		_playInterval: null,

	});

	return View;
});