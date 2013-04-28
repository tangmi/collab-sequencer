define([
	'backbone',
	'views/module/drawer',
	'views/module/player',
	'models/note'
], function(Backbone, Drawer, Player, Note) {

	var View = Backbone.View.extend({
		
		events : {
			'click' : 'highlight',
			'dblclick' : 'unHighlight'
		},

		highlight : function() {
			Drawer.add(this.model.get('pitch'), this.model.get('time'));
			this.model.set('highlighted', true);
		},

		unHighlight : function() {
			Drawer.remove(this.model.get('pitch'), this.model.get('time'));
			this.model.set('highlighted', true);
		}

	});

	return View;
});