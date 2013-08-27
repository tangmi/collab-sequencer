define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {

	var Note = Backbone.Model.extend({
		
		url : config.endpoint + '/add',

		defaults: {
			pitch: 0, 			//To be interpreted, a little more durable for octaves / drums
			time: 0, 			//column
			user: 'Gus',		//User who placed note
			highlighted: false,//whether the note will play
			type: 'none'		//board that the note belongs to
		},

		getUserColor: function() {
			var name = this.get('user');
			var	hash = 0xBEEF;
			for (var i = 0; i < name.length; i++) {
				char = name.charCodeAt(i);
		        hash = ((hash << 7) - hash) + char;
		        hash = hash & hash; // Convert to 32bit integer
    		}
    		return "#" + hash.toString(16).substr(0, 6);
		} 

	});

	return Note;
});