define([
	'backbone'
], function(Backbone) {

	var User = Backbone.Model.extend({

		defaults : {
			id: ""
		}
	});

	return User;
});