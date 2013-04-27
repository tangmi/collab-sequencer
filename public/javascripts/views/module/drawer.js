define(['jquery'], function($) {
	var Drawer = {

		initialize: function(rows, columns) {
			this.setupDom(rows, columns);

		},

		setupDom: function(rows, columns) {
			//create the roll object
			var roll = $("#roll");

			//create all the rows
			for (var i = 0; i < columns; i++) {
				var temp = $("<ul></ul>", {
					id: "column-" + i,
					class: "column"
				});
				//create all the cells
				for(var j = 0; j < rows; j++) {
					temp.append($("<li></li>", {
						id: "cell-" + i + "-" + j,
						class: "cell"
						,text: "(" + i + "," + j + ")"
					}));
				}
				roll.append(temp);
			}

			roll.append($("<div></div>", {
				id: "tick"
			}));
		},

		setTickPosition: function(column) {

			/* this might be an expensive way of getting this info */
			var rollPadding = parseInt($("#roll").css('padding-left').replace(/[^-\d\.]/g, ''))
			var nodeWidth = parseInt($("#cell-0-0").css('width').replace(/[^-\d\.]/g, ''));
			var margin = parseInt($("#cell-0-0").css('margin-right').replace(/[^-\d\.]/g, ''))
				+ parseInt($("#cell-0-0").css('margin-left').replace(/[^-\d\.]/g, ''));


			$("#tick").css({
				left: rollPadding + column * (nodeWidth + margin) + "px"
			});
		},

		add: function(row, column) {
			$("#cell-" + row + "-" + column).addClass("cell-selected");
		},

		remove: function(row, column) {
			$("#cell-" + row + "-" + column).removeClass("cell-selected");
		}

	};
	return Drawer;
})