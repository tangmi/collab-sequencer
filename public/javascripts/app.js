define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	return {
		initialize: function () {


			var canvas = document.getElementById('canvas'),
				context = canvas.getContext('2d');


			context.font = '38pt Arial';
			context.fillStyle = 'cornflowerblue';
			context.strokeStyle = 'blue';


			var config = {
				cell: {
					height: 16,
					width: 24
				},
				roll: {
					cols: 25,
					rows: 10
				}
			};


			var notes = Backbone.Model.extend({

			});

			function drawGrid() {
				context.clearRect(0, 0, canvas.width, canvas.height);
				for (var i = 0; i < config.roll.cols; i++) { //columns
					for (var j = 0; j < config.roll.rows; j++) { //rows
						context.strokeRect(i * config.cell.width, j * config.cell.height, config.cell.width, config.cell.height);
					}
				}
			}


			function onMouseMove(e) {
				drawGrid();
				var pos = getMousePos(canvas, e);
				var mx, my;
				mx = Math.floor(pos.x / config.cell.width);
				my = Math.floor(pos.y / config.cell.height);

				context.fillRect(mx * config.cell.width, my * config.cell.height, config.cell.width, config.cell.height);

			}

			function onMouseDown(e) {
				if (e.button == 0) {
					//left click

				} else if (e.button == 2) {
					//right click
				}
			}


			function getMousePos(canvas, e) {
				var rect = canvas.getBoundingClientRect();
				return {
					x: e.clientX - rect.left,
					y: e.clientY - rect.top
				};
			}

			$(document).mousemove(onMouseMove);
			$(document).mousedown(onMouseDown);

		}
	};
});