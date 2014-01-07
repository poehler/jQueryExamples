(function() {
	"use strict";
	$.get('/components/todo/todos.handlebars', function(content) {
		window.todosTemplate = Handlebars.compile(content);
	});
	$.get('/components/todo/todos.status-codes.handlebars', function(content) {
		window.statusCodesTemplate = Handlebars.compile(content);
	});
	$.get('/components/todo/todos.list.handlebars', function(content) {
		window.todoListTemplate = Handlebars.compile(content);
	});
	$.get('/components/todo/todos.new-todo-button.handlebars', function(content) {
		window.todoNewTodoButtonTemplate = Handlebars.compile(content);
	});
})()

