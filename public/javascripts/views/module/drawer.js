define(['jquery', 'views/module/player'], function($, Player) {
	var Drawer = {

		initialize: function(pitch, time) {
			this.setupDom(pitch, time);

		},

		setupDom: function(pitch, time) {
			//create a roll div
			var roll = $("<div></div>", {
				id: "roll"
			});
			$("#app").append(roll);

			//create all the pitch
			for (var i = 0; i < time; i++) {
				var temp = $("<ul></ul>", {
					id: "column-" + i,
					class: "column"
				});
				//create all the cells
				for(var j = 0; j < pitch; j++) {
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

		setTickPosition: function(time) {

			var j,
				atags = document.getElementsByClassName("cell"),
				atotal = atags.length;
			for ( j = 0; j < atotal; j++ ) {
				atags[j].className = atags[j].className.replace("cell-highlighted","");
			}

			var i,
				tags = document.getElementById("column-" + time).getElementsByTagName("li"),
				total = tags.length;
			for ( i = 0; i < total; i++ ) {
				tags[i].className = tags[i].className + " cell-highlighted";
			}

		},

		add: function(pitch, time) {
			$("#cell-" + time + "-" + pitch).addClass("cell-selected");
			Player.playRow([pitch]);
		},

		remove: function(pitch, time) {
			$("#cell-" + time + "-" + pitch).removeClass("cell-selected");
		}

	};
	return Drawer;
})