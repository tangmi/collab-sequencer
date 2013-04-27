require([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {
	var Note = Backbone.Model.extend({
		defaults : {pitch : 'c', user : 'Anonymous', time : 0},

		initialize : function() { console.log('here I am'); }
	});

	return Note;
});