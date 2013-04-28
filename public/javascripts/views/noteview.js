define([
	'backbone',
	'views/module/drawer',
	'views/module/player',
	'models/note'
], function(Backbone, Drawer, Player, Note) {

	var View = Backbone.View.extend({
		
		events : {
			'click' : 'highlight'
		},

		highlight : function() {
			this.$el.css({'background-color' : 'red'});
		}

	});

	return View;
});