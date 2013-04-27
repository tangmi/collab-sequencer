define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {

	/* Notes are initialized with a pitch, time and user name */

	var Note = Backbone.Model.extend({
		defaults : {
			pitch : 'c',
			time : 0, //column
			user : 'Gus'
		},

		initialize : function() {
			//this.id = this.get('pitch') + this.get('time'); /* String hash */
		}
	});

	return Note;
});