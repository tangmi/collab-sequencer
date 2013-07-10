define([
		'backbone',
		'views/module/player',
		'views/notationview',
		'collections/notecollection',
		'models/note',
		'views/noteview'
], function(Backbone, Player, NotationView, NoteCollection, Note, NoteView) {

	var MainSetup = {

		/*
		tabs: list of objects with
			* name: name of tab to be initialized
			* notes: number of notes (height) of tab 
		*/
		init: function(options) {

			this._generateControls();

			for (var i = 0; i < options.tabs.length; i++) {
				this._generateTab(options.tabs[i]);
			}

			//This is the wrong place to do this but It has to be added after most of the 
			//rest of the global config has been initialized due to immediate evaluation
			window.config.timing.interval = (function() {
				var $incrementor = $('#incrementor');
				var loops = 0;
				var maxFrameSkip = 10;
				//Scoping....
				var timing = window.config.timing;

				return function() {
					loops = 0;
					while ((new Date).getTime() > timing.nextTick && loops < maxFrameSkip) {

						//we communicate with the notationView through DOM interactions so this
						//avoids exposing its collection
						$incrementor.click();
						timing.currentTime = (timing.currentTime + 1) % timing.maxTime;

						timing.nextTick += timing.skipTicks;
						loops++;
					}
				}

			})();

			//Same deal here, would rather keep one global object
			window.config.timing.skipTicks /= window.config.timing.bpm;

			//Create interactive controls and then bind a view to them
			new NotationView({
				tabs: options.tabs
			});
		},

		_generateControls: function() {
			/* Generate controls */
			var $controls = $('#controls');

			$controls.append($("<button></button>", {
				id: 'play',
				text: 'Play'
			}));

			$controls.append($("<input>", {
				id: 'tempo',
				type: 'text',
			}));

			$controls.append($("<div></div>", {
				id: 'incrementor'
			}));
		},

		_generateTab: function(tabData) {

			var pitch = tabData.notes.length;
			var name = tabData.name;
			var time = window.config.timing.maxTime;
			var $tabs = $('#tabs');

			var $newTab = $("<div></div>", {
				id: name + '_button',
				text: name,
				class: 'tab'
			});
			$tabs.append($newTab);

			var $rolls = $("#rolls");

			//create a roll div
			var $roll = $("<div></div>", {
				id: name,
				class: "roll"
			});
			tabData.initShow ? $newTab.addClass('selected') : $roll.hide();
			$rolls.append($roll);


			//create all the pitch
			for (var i = 0; i < time; i++) {
				var temp = $("<ul></ul>", {
					id: "column-" + i + "-" + name,
					class: "column"
				});
				//create all the cells
				for (var j = 0; j < pitch; j++) {
					temp.append($("<li></li>", {
						id: "cell-" + i + "-" + j + "-" + name,
						class: "cell",
						text: "(" + i + "," + j + ")"
					}));
				}
				$roll.append(temp);
			}

			$roll.append($("<div></div>", {
				id: "tick"
			}));


			//set color of tab/roll
			$roll.css({
				'background-color': tabData.color
			});
			$newTab.css({
				'background-color': tabData.color
			});


			Player.initialize(name, tabData.notes);
		}
	};

	return MainSetup;
});