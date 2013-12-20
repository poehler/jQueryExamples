(function() {
	"use strict";
	$.get('/components/todo/todos.handlebars', function(content) {
		window.todosTemplate = Handlebars.compile(content);
	});
	$.get('/components/todo/todos__status_codes.handlebars', function(content) {
		window.statusCodesTemplate = Handlebars.compile(content);
	});
	$.get('/components/todo/todos__list.handlebars', function(content) {
		window.todoListTemplate = Handlebars.compile(content);
	});
	$.get('/components/todo/todos__new_todo_button.handlebars', function(content) {
		window.todoNewTodoButtonTemplate = Handlebars.compile(content);
	});
})()

