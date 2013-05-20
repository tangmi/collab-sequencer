define([
	'backbone',
	'views/module/drawer',
	'views/module/player',
	'models/note'
], function(Backbone, Drawer, Player, Note) {

	var View = Backbone.View.extend({
		
		initialize : function() {
			_.bindAll(this, 'render');
			this.model.on('change:highlighted', this.render);
		},

		render : function() {
			if (this.model.get('highlighted')) {
				Drawer.add(this.model);
			} else {
				Drawer.remove(this.model);
			}
		},

		events : {
			'click': 'toggle'
		},

		toggle: function() {
			this.model.set('highlighted', !this.model.get('highlighted'));
		},

		highlight : function() {
			this.model.set('highlighted', true);
		},

		unhighlight : function() {
			this.model.set('highlighted', false);
		}

	});

	return View;
});