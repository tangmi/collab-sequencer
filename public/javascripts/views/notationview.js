define([
	'backbone'
], function(Backbone) {

	var View = Backbone.View.extend({
		initialize: function () {

			alert("hi gus");
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

		}



	});

	console.log(View.toSource());


//	new NotationView();

	return View;
});
