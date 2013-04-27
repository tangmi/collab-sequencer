define(['jquery'], function($) {
	var Drawer = {

		initialize: function(rows, columns) {
			this.setupDom(rows, columns);



		},

		setupDom: function(rows, columns) {
			//create the roll object
			var roll = $("#roll");

			//create all the rows
			for (var i = 0; i < rows; i++) {
				var temp = $("<div></div>", {
					id: "row-" + i,
					class: "row"
				});
				//create all the cells
				for(var j = 0; j < columns; j++) {
					temp.append($("<div></div>", {
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