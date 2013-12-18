"use strict";
var StatusCodes = [
	   	{ "id": "A", "decode": "Active"},
		{ "id": "I", "decode": "Inactive"},
		{ "id": "O", "decode": "On Hold"},
		{ "id": "C", "decode": "Completed"}
];

var Task = function(options) {
    this.id = options.id || 0;
    this.taskName = options.taskName || "";
    this.taskStatusCode = options.taskStatusCode || "";
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
    	var taskStatus = "";
    	
		$.each(StatusCodes, function (i, val) {
			if (that.taskStatusCode == val.id) 
				taskStatus = val.decode;
		});
		
		return taskStatus;
	}
    
};

var componentIndex = 0;
$('[class*="todo-component"]').each(function(i, element) {
	var todoDiv = this;
	var todoComponentName = "ToDo" + componentIndex++;
	window[todoComponentName] = {
		init : function() {
			this.isSortedByTaskName = true;
			this.isSortedByTaskStatus = false;
			this.isSortedByTargetCompletionDate = false;
			this.isSortedByActualCompletionDate = false;
			this.sortDirection = true;
			this.sortColumn = "taskName";
			this.isValidNewTask = false;
			
			this.setSortColumn();
			this.render();
		},
		cacheElements: function() {
			this.$todoApp = $(todoDiv);
			this.$appTitle = this.$todoApp.find('.header');
			this.$headerRow = this.$todoApp.find('.header-row');
			this.$newTaskRow = this.$todoApp.find('.new-row');
			this.$newTaskButtonDiv = this.$newTaskRow.find('.column-5');
			this.$newTaskButton = this.$newTaskRow.find('.btn');
			this.$newTaskNameField = this.$newTaskRow.find(":input[name='newTaskName']");
			this.$newTaskStatusCodeField = this.$newTaskRow.find(":input[name='newTaskStatusCode']");
			this.$newTaskTargetCompletionDate = this.$newTaskRow.find(":input[name='newTargetCompletionDate']");
			this.$items = this.$todoApp.find('.items');
		},
		validateNewTask: function(e){
			var that = window[todoComponentName];
			var isNowValid = true;
			
			console.log("record was " + that.isValidNewTask)
			if(IAM.isBlank(that.$newTaskNameField.val())) 
				isNowValid = false;
			else if(IAM.isBlank(that.$newTaskStatusCodeField.val())) 
				isNowValid = false;
			else if(!IAM.isValidDate(that.$newTaskTargetCompletionDate.val())) 
				isNowValid = false;
			if(isNowValid != that.isValidNewTask){
				that.isValidNewTask = isNowValid;
				that.renderNewTaskButton();
			}
				
			return isNowValid;
		},
		bindEvents: function() {
			this.$headerRow.on('click', '.column-1', {"column": "taskName"}, this.sortByColumn);
			this.$headerRow.on('click', '.column-2', {"column": "taskStatusCode"}, this.sortByColumn);
			this.$headerRow.on('click', '.column-3', {"column": "targetCompletionDate"}, this.sortByColumn);
			this.$headerRow.on('click', '.column-4', {"column": "actualCompletionDate"}, this.sortByColumn);
			this.$newTaskNameField.on('blur', this.validateNewTask);
			this.$newTaskNameField.on('keyup', this.validateNewTask);
			this.$newTaskStatusCodeField.on('blur', this.validateNewTask);
			this.$newTaskStatusCodeField.on('change', this.validateNewTask);
			this.$newTaskTargetCompletionDate.on('blur', this.validateNewTask);
			this.$newTaskTargetCompletionDate.on('keyup', this.validateNewTask);
			this.$newTaskButton.on('click', this.addNewTask);
		},
		addNewTask: function() {
			var that = window[todoComponentName];
			if(!that.validateNewTask())
				return;
			var newTask = new Task({ "id": Date.UTC(new Date()), "taskName": that.$newTaskNameField.val(), "taskStatusCode": that.$newTaskStatusCodeField.val(), "targetCompletionDate": new Date(that.$newTaskTargetCompletionDate.val()), "actualCompletionDate": null});
			that.tasks.push(newTask);
			that.renderTaskItems();
			that.$newTaskNameField.val("");
			that.$newTaskStatusCodeField.val("A");
			that.$newTaskTargetCompletionDate.val("");
			that.renderNewTaskButton();
		},
		render: function() {
			this.$todoApp = $(todoDiv);
			this.tasksTemplate = window.tasksTemplate;
			this.$todoApp.html("");
			Handlebars.registerPartial("status_code_options", window.statusCodesTemplate(StatusCodes));
			Handlebars.registerPartial("tasks_listing", window.taskListTemplate(this.tasks));
			Handlebars.registerPartial("new_task_button", window.taskNewTaskButtonTemplate(this));
			Handlebars.registerPartial("header", window.taskHeaderTemplate(this));
			$(todoDiv).append(this.tasksTemplate(window[todoComponentName]));
			this.cacheElements();
			this.bindEvents();
		},
		renderTaskHeader: function() {
			this.$headerRow.html("");
			$(this.$headerRow).append(window.taskHeaderTemplate(window[todoComponentName]));
			this.cacheElements();
			this.bindEvents();
		},
		renderNewTaskButton: function() {
			this.$newTaskButtonDiv.html("");
			$(this.$newTaskButtonDiv).append(window.taskNewTaskButtonTemplate(window[todoComponentName]));
			this.cacheElements();
			this.bindEvents();
		},
		renderTaskItems: function() {
			this.$items.html("");
			Handlebars.registerPartial("tasks_listing", window.taskListTemplate(this.tasks));
			$(this.$items).append(window.taskListTemplate(this.tasks));
		},
		setSortColumn: function() {
			var that = window[todoComponentName];
			that.isSortedByTaskName = false;
			that.isSortedByTaskStatus = false;
			that.isSortedByTargetCompletionDate = false;
			that.isSortedByActualCompletionDate = false;
			
			if(that.sortColumn == "taskName") 
				that.isSortedByTaskName = true;
			else if(that.sortColumn == "taskStatusCode") 
				that.isSortedByTaskStatus = true;
			else if(that.sortColumn == "targetCompletionDate") 
				that.isSortedByTargetCompletionDate = true;
			else if(that.sortColumn == "actualCompletionDate") 
				that.isSortedByActualCompletionDate = true;
		},
		sortByColumn: function(e) {
			var that = window[todoComponentName];
			if (that.sortColumn == e.data.column)
				that.sortDirection = !window[todoComponentName].sortDirection;
			else {
				that.sortColumn = e.data.column;
				that.sortDirection = true;
				that.setSortColumn();
				that.renderTaskHeader();
			}
			
			that.tasks.sort(window[todoComponentName].sortTasks);
			that.renderTaskItems();
		},
		sortTasks: function(a, b) {
			var aValue = a[window[todoComponentName].sortColumn];
			var bValue = b[window[todoComponentName].sortColumn];
			
			if(window[todoComponentName].sortDirection)
				return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
			else
				return ((aValue > bValue) ? -1 : ((aValue < bValue) ? 1 : 0));
		}
	};
	
	window[todoComponentName].tasks = [
		new Task({ "id": 21, "taskName": "Task " + i + 1, "taskStatusCode": "A", "targetCompletionDate": new Date("09/03/2013"), "actualCompletionDate": null}),
		new Task({ "id": 22, "taskName": "Task " + i + 2, "taskStatusCode": "I", "targetCompletionDate": new Date("10/08/2013"), "actualCompletionDate": null}),
		new Task({ "id": 23, "taskName": "Task " + i + 3, "taskStatusCode": "C", "targetCompletionDate": new Date("10/01/2013"), "actualCompletionDate": new Date("09/30/2013")}),
		new Task({ "id": 24, "taskName": "Task " + i + 4, "taskStatusCode": "A", "targetCompletionDate": new Date("10/16/2013"), "actualCompletionDate": null})
	];

	window[todoComponentName].init();
});
	
                   