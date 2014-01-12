define([
		'backbone',
		'views/module/player',
		'models/note'
], function(Backbone, Player, Note) {

	var View = Backbone.View.extend({

		initialize: function() {
			_.bindAll(this, 'render');
			this.model.on('change:highlighted', this.render);
		},

		render: function() {
			if (!this.model.get('highlighted')) {
				$("#cell-" + this.model.get("time") +
					"-" + this.model.get("pitch") +
					"-" + this.model.get("instrument")).removeClass("cell-selected");
			} else {
				$("#cell-" + this.model.get("time") +
					"-" + this.model.get("pitch") +
					"-" + this.model.get("instrument")).addClass("cell-selected");
			}
		},

		events: {
			'click': 'toggle'
		},

		toggle: function() {
			
			if (!this.model.get('highlighted')) {
				Player.playPitch(this.model.get("instrument"), this.model.get("pitch"));
			}

			this.model.set('highlighted', !this.model.get('highlighted'));
			this.model.set('user', CONFIG.user);

			CONFIG.socket.emit('edit-note', this.model.toJSON());
		},

		highlight: function() {
			this.model.set('highlighted', true);
		},

		unhighlight: function() {
			this.model.set('highlighted', false);
		}

	});

	return View;
});