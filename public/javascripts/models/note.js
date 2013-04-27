require([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {
	var Note = Backbone.Model.extend({
		defaults : {
			pitch : 'c',
			time : 0, //column
			user : 'Gus'
		},

		initialize : function() {
			console.log('here I am');
		}
	});

	return Note;
});