"use strict";
Modernizr.load([
	//ToDo jQuery Template
	{
		test : typeof Handlebars == 'undefined',
        yep: ['/js/libs/handlebars-1.0.0.js']
	},
	//ToDo jQuery Component
	{
		test : typeof Backbone == 'undefined',
	    both: ['/js/libs/iam-globals.js', '/components/todo/app.js', '/components/todo/layout.js', '/components/todo/style.css']
	}
	
]);
