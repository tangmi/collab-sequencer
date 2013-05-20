define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {

	var Note = Backbone.Model.extend({
		defaults : {
			pitch : 0, //To be interpreted, a little more durable for octaves / drums
			time : 0, //column
			user : 'Gus',
			highlighted : false
		}
	});

	return Note;
});