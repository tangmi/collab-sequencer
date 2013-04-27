define([
	'backbone',
	'views/module/drawer',
	'views/module/player',
	'collections/notecollection'
], function(Backbone, Drawer, Player, NoteCollection) {

	var View = Backbone.View.extend({

		el: "#app",

		initialize: function () {

			//create a roll div
			var roll = $("<div></div>", {
				id: "roll"
			});
			$("#app").append(roll);

			Drawer.initialize(10, 32);

			Drawer.add(1,2);

			Drawer.add(5, 10);

			Drawer.remove(1, 2);



			Drawer.setTickPosition(6);

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

		},


		placeNote : function() {

		},


		play : function() {

		},


		pause : function() {

		}



					/*

			RollDrawer.create();

			var notes = Backbone.Model.extend({

			});




			function onMouseMove(e) {
				var pos = getMousePos(e);

				var cellPos = RollDrawer.getCellPos(pos.x, pos.y);


			}

			function onMouseDown(e) {

				var pos = getMousePos(e);
				var cellPos = RollDrawer.getCellPos(pos.x, pos.y);

				if (e.button === 0) {
					//left click

					RollDrawer.setCell(cellPos.x, cellPos.y, 1);


				} else if (e.button == 2) {
					//right click

					RollDrawer.setCell(cellPos.x, cellPos.y, 0);

				}
			}


			function getMousePos(e) {
				var rect = RollDrawer.getCanvas().getBoundingClientRect();
				return {
					x: e.clientX - rect.left,
					y: e.clientY - rect.top
				};
			}

			$('#canvas').bind('contextmenu', function(){
				// disable right click menu
				return false;
			});

			$(document).mousemove(onMouseMove);
			$(document).mousedown(onMouseDown);

			*/

	});

	return View;
});
