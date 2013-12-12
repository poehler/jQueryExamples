(function() {
	"use strict";
	
	$.get('/components/todo/status_codes.hbs', function(content) {
		var template = Handlebars.compile(content);
//		$('body').append(template(statusCodes));
		Handlebars.registerPartial("status_code_options", template(statusCodes));
	});
	
	$.get('/components/todo/tasks.hbs', function(content) {
		var template = Handlebars.compile(content);
		$('body').append(template(tasks));
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

