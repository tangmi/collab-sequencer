define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {

	/* Notes are initialized with a pitch, time and user name */

	var Note = Backbone.Model.extend({
		defaults : {
			pitch : 0,
			time : 0, //column
			user : 'Gus',
			highlighted : false
		}
	});

	return Note;
});