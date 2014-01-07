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
	this.isBeingEdited = false;

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
			if (that.todoStatusCode == val.id) {
				todoStatus = val.decode;
				return false;
			}
		});

		return todoStatus;
	}
};

var componentIndex = 0;
$('[class*="todo-component"]').each(function(i, element) {
	var todoDiv = this;
	var todoComponentName = "ToDo" + componentIndex++;

	window[todoComponentName] = {
		init: function() {
			this.sortDirection = true;
			this.sortColumn = "todoName";
			this.isValidNewTodo = false;
			this.render();
		},

		cacheElements: function() {
			this.todoApp = $(todoDiv);
			this.headerCacheElements();
			this.newTodoCacheElements();
			this.todoListCacheElements();
		},
		headerCacheElements: function() {
			this.headerRow = this.todoApp.find('.header-row');
		},
		newTodoCacheElements: function() {
			this.newTodoRow = this.todoApp.find('.new-row');
			this.newTodoButtonDiv = this.newTodoRow.find('.column-5');
			this.newTodoButton = this.newTodoRow.find('.btn');
			this.newTodoNameField = this.newTodoRow.find(":input[name='todoName']");
			this.newTodoStatusCodeField = this.newTodoRow.find(":input[name='todoStatusCode']");
			this.newTodoTargetCompletionDate = this.newTodoRow.find(":input[name='targetCompletionDate']");
		},
		todoListCacheElements: function() {
			this.items = this.todoApp.find('.items');
		},

		bindEvents: function() {
			this.headerBindEvents();
			this.todoFormFieldBindEvents();
			this.newTodoBindEvents();
			this.todoListBindEvents();
		},
		headerBindEvents: function() {
			this.headerRow.find("[class*=column-]").on('click', this.sortByColumn);
		},
		newTodoBindEvents: function() {
			this.newTodoButton.on('click', this.insertTodo);
		},
		todoFormFieldBindEvents: function() {
			this.todoApp.find("input").on('blur', this.checkTodo);
			this.todoApp.find("input").on('keyup', this.checkTodo);
			this.todoApp.on('change', '.status-code-options',  this.checkTodo);
			this.todoApp.on('blur', '.status-code-options',  this.checkTodo);
		},
		todoListBindEvents: function() {
			this.items.on('click', '.todo-edit-button', this.toggleEditRow);
			this.items.on('click', '.todo-delete-not-confirmed-button', this.showEditResetButtons);
			this.items.on('click', '.todo-delete-confirmed-button', this.deleteTodo);
			this.items.on('click', '.todo-reset-button', this.toggleEditRow);
			this.items.on('click', '.todo-delete-button', this.showDeleteConfirmationButtons);
			this.items.on('click', '.todo-save-button', this.updateTodo);
		},

		render: function() {
			this.todoApp = $(todoDiv);
			this.todoApp.html("");
			Handlebars.registerPartial("status_code_options", window.statusCodesTemplate(StatusCodes));
			Handlebars.registerPartial("todos_listing", window.todoListTemplate(this.todos));
			Handlebars.registerPartial("new_todo_button", window.todoNewTodoButtonTemplate(this));
			$(todoDiv).append(window.todosTemplate(window[todoComponentName]));
			this.cacheElements();
			this.bindEvents();
			this.todoListSetStatusCodes();
		},
		headerRender: function() {
			this.headerRow.find("[class*=column-]").removeClass('todo-sorted');

			if(this.sortColumn == "todoName") 
				$(this.headerRow.find('.column-1')).addClass('todo-sorted');
			else if(this.sortColumn == "todoStatusCode") 
				$(this.headerRow.find('.column-2')).addClass('todo-sorted');
			else if(this.sortColumn == "targetCompletionDate") 
				$(this.headerRow.find('.column-3')).addClass('todo-sorted');
			else if(this.sortColumn == "actualCompletionDate") 
				$(this.headerRow.find('.column-4')).addClass('todo-sorted');

		},
		todoListRender: function() {
			this.items.html("");
			$(this.items).append(window.todoListTemplate(this.todos));
			this.todoListSetStatusCodes();
			this.todoFormFieldBindEvents();
		},
		newTodoButtonRender: function() {
			this.newTodoButtonDiv.html("");
			$(this.newTodoButtonDiv).append(window.todoNewTodoButtonTemplate(window[todoComponentName]));
			this.cacheElements();
			this.bindEvents();
		},

		todoListSetStatusCodes: function() {
			var listRows = $(".todo-list").find("li.todo-list-row");
			var that = window[todoComponentName];

			$.each(listRows, function(ii, editRow) {
				var id = $(editRow).data("id");
				var targetStatusCode = $(".todo-list").find("li.todo-update-row[data-id='" + id + "']").find("select");
				for(var ii=0;ii<that.todos.length;ii++){
					if(id == that.todos[ii].id) {
						targetStatusCode.val(that.todos[ii].todoStatusCode);
						break;
					}
				}
			});
		},
		showDeleteConfirmationButtons: function() {
			var id = $(this).parents("li").data("id");
			var editRow = $(".todo-list").find("li.todo-list-row[data-id='" + id + "']");

			editRow.find(".todo-delete-button").addClass("hide");
			editRow.find(".todo-edit-button").addClass("hide");
			editRow.find(".todo-delete-not-confirmed-button").removeClass("hide");
			editRow.find(".todo-delete-confirmed-button").removeClass("hide");
		},
		showEditResetButtons: function() {
			var id = $(this).parents("li").data("id");
			var editRow = $(".todo-list").find("li.todo-list-row[data-id='" + id + "']");

			editRow.find(".todo-delete-not-confirmed-button").addClass("hide");
			editRow.find(".todo-delete-confirmed-button").addClass("hide");
			editRow.find(".todo-delete-button").removeClass("hide");
			editRow.find(".todo-edit-button").removeClass("hide");
		},
		toggleEditRow: function() {
			var that = window[todoComponentName];
			var id = $(this).parents("li").data("id");

			for(var ii=0;ii<that.todos.length;ii++){
				if(id == that.todos[ii].id) {
					that.todos[ii].isBeingEdited = !that.todos[ii].isBeingEdited;
					break;
				}
			}

			that.todoListRender();
		},

		deleteTodo: function(){
			var that = window[todoComponentName],
				id = $(this).parents("li").data("id");

			for(var ii=0;ii<that.todos.length;ii++){
				if(id == that.todos[ii].id) {
					that.todos.splice(ii, 1);
				}
			}
			that.todoListRender();
		},
		createNewID: function() {
			var id;

			if (Date.now)
				id = Date.now();
			else
				id = new Date().valueOf();

			return id;
		},
		insertTodo: function() {
			var that = window[todoComponentName];
			var isValid = that.validateTodo(0);

			if(!isValid)
				return;

			var newTodo = new Todo({"id": that.createNewID(), "todoName": that.newTodoNameField.val(), "todoStatusCode": that.newTodoStatusCodeField.val(), "targetCompletionDate": new Date(that.newTodoTargetCompletionDate.val()), "actualCompletionDate": null});

			that.todos.push(newTodo);
			that.todos.sort(window[todoComponentName].sortTodos);

			that.clearNewTodoForm();

			that.todoListRender();
			that.newTodoButtonRender();
		},
		clearNewTodoForm: function() {
			this.newTodoNameField.val("");
			this.newTodoStatusCodeField.val("A");
			this.newTodoTargetCompletionDate.val("");
		},
		updateTodo: function() {
			var that = window[todoComponentName];
			var id = $(this).parents("li").data("id");
			var editRow = $(".todo-list").find("li.todo-update-row[data-id='" + id + "']");
			var todoName = $(editRow).find(".todo-name-input-field").val();
			var todoStatusCode = $(editRow).find(".status-code-options").val();
			var todoTargetDate = $(editRow).find(".target-date").val();
			var todoActualDate = $(editRow).find(".actual-date").val();
			var isValid = that.validateTodo(id);

			if(!isValid)
				return;

			for(var ii=0;ii<that.todos.length;ii++){
				if(id == that.todos[ii].id) {
					that.todos[ii].todoName = todoName;
					that.todos[ii].todoStatusCode = todoStatusCode;
					that.todos[ii].targetCompletionDate = todoTargetDate;
					that.todos[ii].actualCompletionDate = todoActualDate;
					that.todos[ii].isBeingEdited = false;
					break;
				}
			}
			
			that.todos.sort(window[todoComponentName].sortTodos);
			that.todoListRender();
		},

		checkTodo: function(event) {
			var that = window[todoComponentName],
				thisRow = $(event.currentTarget).parents("li"),
				id = $(thisRow).data("id"),
				isValid = false;

			isValid = that.validateTodo(id);

			if(id > 0) {
				var todoSaveButton = $(thisRow).find(".todo-save-button");
				var todoCheckButton = $(thisRow).find(".todo-edit-warning");
				if(isValid){
					todoSaveButton.removeClass("hide");
					todoCheckButton.addClass("hide");
				}
				else {
					todoSaveButton.addClass("hide");
					todoCheckButton.removeClass("hide");
				}

			}
			else {
				if(isValid != that.isValidNewTodo){
					that.isValidNewTodo = isValid;
					that.newTodoButtonRender();
				}
			}

			return isValid;
		},
		validateTodo: function(id) {
			var isValid = true,
				thisRow = $(this.todoApp).find("li[data-id='" + id + "']"),
				todoName = $(thisRow).find(".todo-name-input-field").val(),
				todoStatusCode = $(thisRow).find(".status-code-options").val(),
				todoTargetCompletionDate = $(thisRow).find(".target-date").val(),
				todoActualCompletionDate = null;

			if(id > 0) {
				todoActualCompletionDate = $(thisRow).find(".actual-date").val();
			}

			if(IAM.isBlank(todoName)) 
				isValid = false;
			else if(IAM.isBlank(todoStatusCode))
				isValid = false;
			else if(!IAM.isValidDate(todoTargetCompletionDate)) 
				isValid = false;
			else if(todoActualCompletionDate != null && todoActualCompletionDate != "") 
				if(!IAM.isValidDate(todoActualCompletionDate)) 
					isValid = false;


			return isValid;
		},

		sortByColumn: function(e) {
			var that = window[todoComponentName],
				sortColumn = "";

			if($(e.currentTarget).hasClass("column-1"))
				sortColumn = "todoName";
			else if($(e.currentTarget).hasClass("column-2"))
				sortColumn = "todoStatusCode";
			else if($(e.currentTarget).hasClass("column-3"))
				sortColumn = "targetCompletionDate";
			else if($(e.currentTarget).hasClass("column-4"))
				sortColumn = "actualCompletionDate";
			else
				return

			if (that.sortColumn == sortColumn)
				that.sortDirection = !window[todoComponentName].sortDirection;
			else {
				that.sortColumn = sortColumn;
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
		new Todo({ "id": 21 + i, "todoName": "Todo " + i + 1, "todoStatusCode": "A", "targetCompletionDate": new Date("09/03/2013"), "actualCompletionDate": null}),
		new Todo({ "id": 22 + i, "todoName": "Todo " + i + 2, "todoStatusCode": "I", "targetCompletionDate": new Date("10/08/2013"), "actualCompletionDate": null}),
		new Todo({ "id": 23 + i, "todoName": "Todo " + i + 3, "todoStatusCode": "C", "targetCompletionDate": new Date("10/01/2013"), "actualCompletionDate": new Date("09/30/2013")}),
		new Todo({ "id": 24 + i, "todoName": "Todo " + i + 4, "todoStatusCode": "A", "targetCompletionDate": new Date("10/16/2013"), "actualCompletionDate": null})
	];

	window[todoComponentName].init();
});
	
