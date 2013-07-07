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
					"-" + this.model.get("type")).removeClass("cell-selected");
			} else {
				$("#cell-" + this.model.get("time") +
					"-" + this.model.get("pitch") +
					"-" + this.model.get("type")).addClass("cell-selected");
				Player.playPitch([this.model.get("pitch")]);
			}
		},

		events: {
			'click': 'toggle'
		},

		toggle: function() {
			this.model.set('highlighted', !this.model.get('highlighted'));
			this.model.save();
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