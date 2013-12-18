(function() {
	"use strict";
	$.get('/components/todo/tasks.handlebars', function(content) {
		window.tasksTemplate = Handlebars.compile(content);
	});
	$.get('/components/todo/tasks__status_codes.handlebars', function(content) {
		window.statusCodesTemplate = Handlebars.compile(content);
	});
	$.get('/components/todo/tasks__list.handlebars', function(content) {
		window.taskListTemplate = Handlebars.compile(content);
	});
	$.get('/components/todo/tasks__header.handlebars', function(content) {
		window.taskHeaderTemplate = Handlebars.compile(content);
	});
	$.get('/components/todo/tasks__new_task_button.handlebars', function(content) {
		window.taskNewTaskButtonTemplate = Handlebars.compile(content);
	});
	
    /*
    function loadTemplate(template, componentName) {
        var templateName = template.split('/todo/').reverse()[0].replace('.hbs', '');
        var processedHandlebarTemplate = "";
    	$.get(template, function(contents) {
            processedHandlebarTemplate= contents.replace(/#todoComponentName#/g, componentName);
            Ember.TEMPLATES[componentName + "/" + templateName ] = Ember.Handlebars.template(Ember.Handlebars.precompile(processedHandlebarTemplate));
    	});
    }
    var componentIndex = 0;
	$('[class*="todo-component"]').each(function(i, element) {
        var todoDiv = this;
        var todoComponentName = "ToDo" + componentIndex++;

    	loadTemplate("/components/todo/application.hbs", todoComponentName);
    	loadTemplate("/components/todo/about.hbs", todoComponentName);
    	loadTemplate("/components/todo/tasks.hbs", todoComponentName);
        
    	var emberLoadPollingDelay = 100;
    	var timer = window.setInterval(function() {
    		if (typeof window[todoComponentName] === "object") {
//    			$(todoDiv).addClass("done");
    			window.clearInterval(timer);
    		}
    	}, emberLoadPollingDelay);
	});	
    */
})()

