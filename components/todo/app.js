"use strict";
var StatusCodes = [
	   	{ "id": "A", "decode": "Active"},
		{ "id": "I", "decode": "Inactive"},
		{ "id": "O", "decode": "On Hold"},
		{ "id": "C", "decode": "Completed"}
];

var Todo = function(options) {
    this.id = options.id || 0;
    this.todoName = options.todoName || "";
    this.todoStatusCode = options.todoStatusCode || "";
    this.targetCompletionDate = options.targetCompletionDate || new Date();
    this.actualCompletionDate = options.actualCompletionDate || null;
    
	this.formattedTargetCompletionDate = function() {
		return IAM.getFormattedDateOrEmptyString(this.targetCompletionDate);
	};
	
	this.formattedActualCompletionDate = function() {
		return IAM.getFormattedDateOrEmptyString(this.actualCompletionDate);
	};
	
    this.getStatus = function() {
    	var that = this;
    	var todoStatus = "";
    	
		$.each(StatusCodes, function (i, val) {
			if (that.todoStatusCode == val.id) 
				todoStatus = val.decode;
		});
		
		return todoStatus;
	}
    
};

var componentIndex = 0;
$('[class*="todo-component"]').each(function(i, element) {
	var todoDiv = this;
	var todoComponentName = "ToDo" + componentIndex++;
	window[todoComponentName] = {
		init : function() {
			this.sortDirection = true;
			this.sortColumn = "todoName";
			this.isValidNewTodo = false;
			
			this.render();
		},
		cacheElements: function() {
			this.$todoApp = $(todoDiv);
			this.$appTitle = this.$todoApp.find('.header');
			this.headerCacheElements();
			this.newTodoCacheElements();
			this.todoListCacheElements();
		},
		headerCacheElements: function() {
			this.$headerRow = this.$todoApp.find('.header-row');
		},
		newTodoCacheElements: function() {
			this.$newTodoRow = this.$todoApp.find('.new-row');
			this.$newTodoButtonDiv = this.$newTodoRow.find('.column-5');
			this.$newTodoButton = this.$newTodoRow.find('.btn');
			this.$newTodoNameField = this.$newTodoRow.find(":input[name='newTodoName']");
			this.$newTodoStatusCodeField = this.$newTodoRow.find(":input[name='newTodoStatusCode']");
			this.$newTodoTargetCompletionDate = this.$newTodoRow.find(":input[name='newTargetCompletionDate']");
		},
		todoListCacheElements: function() {
			this.$items = this.$todoApp.find('.items');
		},
		bindEvents: function() {
			this.headerBindEvents();
			this.newTodoBindEvents();
			this.todoListBindEvents();
		},
		headerBindEvents: function() {
			this.$headerRow.on('click', '.column-1', {"column": "todoName"}, this.sortByColumn);
			this.$headerRow.on('click', '.column-2', {"column": "todoStatusCode"}, this.sortByColumn);
			this.$headerRow.on('click', '.column-3', {"column": "targetCompletionDate"}, this.sortByColumn);
			this.$headerRow.on('click', '.column-4', {"column": "actualCompletionDate"}, this.sortByColumn);
		},
		newTodoBindEvents: function() {
			this.$newTodoNameField.on('blur', this.validateNewTodo);
			this.$newTodoNameField.on('keyup', this.validateNewTodo);
			this.$newTodoStatusCodeField.on('blur', this.validateNewTodo);
			this.$newTodoStatusCodeField.on('change', this.validateNewTodo);
			this.$newTodoTargetCompletionDate.on('blur', this.validateNewTodo);
			this.$newTodoTargetCompletionDate.on('keyup', this.validateNewTodo);
			this.$newTodoButton.on('click', this.addNewTodo);
		},
		todoListBindEvents: function(){
		},
		render: function() {
			this.$todoApp = $(todoDiv);
			this.$todoApp.html("");
			Handlebars.registerPartial("status_code_options", window.statusCodesTemplate(StatusCodes));
			Handlebars.registerPartial("todos_listing", window.todoListTemplate(this.todos));
			Handlebars.registerPartial("new_todo_button", window.todoNewTodoButtonTemplate(this));
			$(todoDiv).append(window.todosTemplate(window[todoComponentName]));
			this.cacheElements();
			this.bindEvents();
		},
		headerRender: function() {
			
			$(this.$headerRow.find('.column-1')).removeClass('todo-sorted');
			$(this.$headerRow.find('.column-2')).removeClass('todo-sorted');
			$(this.$headerRow.find('.column-3')).removeClass('todo-sorted');
			$(this.$headerRow.find('.column-4')).removeClass('todo-sorted');
			
			if(this.sortColumn == "todoName") 
				$(this.$headerRow.find('.column-1')).addClass('todo-sorted');
			else if(this.sortColumn == "todoStatusCode") 
				$(this.$headerRow.find('.column-2')).addClass('todo-sorted');
			else if(this.sortColumn == "targetCompletionDate") 
				$(this.$headerRow.find('.column-3')).addClass('todo-sorted');
			else if(this.sortColumn == "actualCompletionDate") 
				$(this.$headerRow.find('.column-4')).addClass('todo-sorted');

		},
		newTodoRender: function() {
		},
		todoListRender: function() {
			this.$items.html("");
			Handlebars.registerPartial("todos_listing", window.todoListTemplate(this.todos));
			$(this.$items).append(window.todoListTemplate(this.todos));
		},
		newTodoButtonRender: function() {
			this.$newTodoButtonDiv.html("");
			$(this.$newTodoButtonDiv).append(window.todoNewTodoButtonTemplate(window[todoComponentName]));
			this.cacheElements();
			this.bindEvents();
		},
		
		addNewTodo: function() {
			var that = window[todoComponentName];
			if(!that.validateNewTodo())
				return;
			var newTodo = new Todo({ "id": Date.UTC(new Date()), "todoName": that.$newTodoNameField.val(), "todoStatusCode": that.$newTodoStatusCodeField.val(), "targetCompletionDate": new Date(that.$newTodoTargetCompletionDate.val()), "actualCompletionDate": null});
			that.todos.push(newTodo);
			that.todos.sort(window[todoComponentName].sortTodos);
			that.todoListRender();
			that.$newTodoNameField.val("");
			that.$newTodoStatusCodeField.val("A");
			that.$newTodoTargetCompletionDate.val("");
			that.newTodoButtonRender();
		},
		validateNewTodo: function(e){
			var that = window[todoComponentName];
			var isNowValid = true;
			
			if(IAM.isBlank(that.$newTodoNameField.val())) 
				isNowValid = false;
			else if(IAM.isBlank(that.$newTodoStatusCodeField.val())) 
				isNowValid = false;
			else if(!IAM.isValidDate(that.$newTodoTargetCompletionDate.val())) 
				isNowValid = false;
			if(isNowValid != that.isValidNewTodo){
				that.isValidNewTodo = isNowValid;
				that.newTodoButtonRender();
			}
				
			return isNowValid;
		},
		sortByColumn: function(e) {
			var that = window[todoComponentName];
			
			if (that.sortColumn == e.data.column) 
				that.sortDirection = !window[todoComponentName].sortDirection;
			else {
				that.sortColumn = e.data.column;
				that.sortDirection = true;
				that.headerRender();
			}
			that.todos.sort(window[todoComponentName].sortTodos);
			that.todoListRender();
		},
		sortTodos: function(a, b) {
			var aValue = a[window[todoComponentName].sortColumn];
			var bValue = b[window[todoComponentName].sortColumn];
			
			if(window[todoComponentName].sortDirection)
				return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
			else
				return ((aValue > bValue) ? -1 : ((aValue < bValue) ? 1 : 0));
		}
	};
	
	window[todoComponentName].todos = [
		new Todo({ "id": 21, "todoName": "Todo " + i + 1, "todoStatusCode": "A", "targetCompletionDate": new Date("09/03/2013"), "actualCompletionDate": null}),
		new Todo({ "id": 22, "todoName": "Todo " + i + 2, "todoStatusCode": "I", "targetCompletionDate": new Date("10/08/2013"), "actualCompletionDate": null}),
		new Todo({ "id": 23, "todoName": "Todo " + i + 3, "todoStatusCode": "C", "targetCompletionDate": new Date("10/01/2013"), "actualCompletionDate": new Date("09/30/2013")}),
		new Todo({ "id": 24, "todoName": "Todo " + i + 4, "todoStatusCode": "A", "targetCompletionDate": new Date("10/16/2013"), "actualCompletionDate": null})
	];

	window[todoComponentName].init();
});
	
                   