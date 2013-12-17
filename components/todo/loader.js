"use strict";
Modernizr.load([
	{
		test : typeof Handlebars == 'undefined',
        yep: ['/js/libs/handlebars-1.0.0.js']
	},
	{
		test : typeof IAM == 'undefined',
        yep: ['/js/libs/iam-globals.js']
	},
	{
		test : typeof Backbone == 'undefined',
	    both: ['/js/libs/iam-globals.js', '/components/todo/layout.js', '/components/todo/app.js', '/components/todo/style.css']
	}
	
]);
