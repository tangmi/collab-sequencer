define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {

	var Note = Backbone.Model.extend({
		
		initialize: function() {
			this.on('change:highlighted', function() {
				console.log('yeah');
			});
		},

		defaults: {
			pitch : 0, 			//To be interpreted, a little more durable for octaves / drums
			time : 0, 			//column
			user : 'Gus',		//User who placed note
			highlighted : false,//whether the note will play
			instrument : 'none'		//board that the note belongs to
		}

	});

	return Note;
});