define(['jquery', 'views/module/player'], function($, Player) {
	var Drawer = {

		initialize: function(pitch, time, name) {
			this.setupDom(pitch, time, name);

		},

		setupDom: function(pitch, time, name) {
			//create a roll div
			var roll = $("<div></div>", {
				id: name,
				class : "roll"
			}).hide();
			$("#app").append(roll);

			//create all the pitch
			for (var i = 0; i < time; i++) {
				var temp = $("<ul></ul>", {
					id: "column-" + i + "-" + name,
					class: "column"
				});
				//create all the cells
				for(var j = 0; j < pitch; j++) {
					temp.append($("<li></li>", {
						id: "cell-" + i + "-" + j + "-" + name,
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

		setTickPosition: function(time, type) {

			var j,
				atags = document.getElementsByClassName("cell"),
				atotal = atags.length;
			for ( j = 0; j < atotal; j++ ) {
				atags[j].className = atags[j].className.replace("cell-highlighted","");
			}

			var i,
				tags = document.getElementById("column-" + time + "-" + type).getElementsByTagName("li"),
				total = tags.length;
			for ( i = 0; i < total; i++ ) {
				tags[i].className = tags[i].className + " cell-highlighted";
			}

		},

		add: function(model) {
			console.log('click');
			$("#cell-" + model.get("time") + 
				"-" + model.get("pitch") +
				"-" + model.get("type")).addClass("cell-selected");
			Player.playPitch([model.get("pitch")]);
		},

		remove: function(model) {
			$("#cell-" + model.get("time") + 
				"-" + model.get("pitch") +
				"-" + model.get("type")).removeClass("cell-selected");
		}

	};
	return Drawer;
})