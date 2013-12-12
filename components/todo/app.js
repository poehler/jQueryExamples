"use strict";
var Tasks = [
	{ "id": 21, "taskName": "Task 31", "taskStatusCode": "A", "targetCompletionDate": new Date("09/03/2013"), "actualCompletionDate": null},
	{ "id": 22, "taskName": "Task 32", "taskStatusCode": "I", "targetCompletionDate": new Date("10/08/2013"), "actualCompletionDate": null},
	{ "id": 23, "taskName": "Task 33", "taskStatusCode": "C", "targetCompletionDate": new Date("10/01/2013"), "actualCompletionDate": new Date("09/30/2013")},
	{ "id": 24, "taskName": "Task 34", "taskStatusCode": "A", "targetCompletionDate": new Date("10/16/2013"), "actualCompletionDate": null}
];
var StatusCodes = [
   	{ "id": "A", "decode": "Active"},
	{ "id": "I", "decode": "Inactive"},
	{ "id": "O", "decode": "On Hold"},
	{ "id": "C", "decode": "Completed"}
];
                   
/*
var StatusCode = Backbone.Model.extend();
var StatusCodes = Backbone.Collection.extend({
  url: '/status_codes',
  model: StatusCode
});

var StatusCodeView = Backbone.View.extend({
  tagName: "option",

  initialize: function(){
    _.bindAll(this, 'render');
  },
  render: function(){
    $(this.el).attr('value', this.model.get('id')).html(this.model.get('decode'));
    return this;
  }
});

var StatusCodesView = Backbone.View.extend({
  initialize: function(){
    _.bindAll(this, 'addOne', 'addAll');
      this.collection.bind('reset', this.addAll);
  },
  addOne: function(statusCode){
    $(this.el).append(new StatusCodeView({ model: statusCode }).render().el);
    console.log($(this.el));
  },
  addAll: function(){
    this.collection.each(this.addOne);
  }
});

var statusCodes = new StatusCodes();
statusCodes.fetch().complete(function() {
    new StatusCodesView({el: $('[class*="status-list"]'), collection: statusCodes}).addAll();
});

var componentIndex = 0;
$('[class*="todo-component"]').each(function(i, element) {
    var todoComponentName = "ToDo" + componentIndex++;

	var ToDo = Backbone.Model.extend({
	    default: {
	    	taskName: "",
	    	taskStatusCode: "A",
	    	targetCompletionDate: "",
	        actualCompletedDate: ""
	    }
	});
    
    	window[todoComponentName] = new ToDo({
    	    completed: true,
    	    taskName: todoComponentName,
    	    taskStatusCode: "A"
    	})
	
    	var ToDoView = Backbone.View.extend({
    		tagName:  'li',
            statusCodeList: window["statusCodeList"],
	
    		  // Cache the template function for a single item.
    		  todoTpl: Handlebars.compile( $('#item-template').html() ),
	
    		  events: {
    		    'dblclick label': 'edit',
    		    'keypress .edit': 'updateOnEnter',
    		    'blur .edit':   'close'
    		  },
	
    		  // Called when the view is first created
    		  initialize: function() {
    		    this.$el = $('#page .todo-component:nth-child(' + componentIndex + ')');
    		    // this.listenTo(someCollection, 'all', this.render);
    		    // but you can actually run this example right now by
    		    // calling todoView.render();
    		  },
    	
    		  // Re-render the titles of the todo item.
    		  render: function() {
    		    this.$el.html( this.todoTpl( this.model.toJSON() ) );
    		    // $el here is a reference to the jQuery element 
    		    // associated with the view, todoTpl is a reference
    		    // to an Underscore template and toJSON() returns an 
    		    // object containing the model's attributes
    		    // Altogether, the statement is replacing the HTML of
    		    // a DOM element with the result of instantiating a 
    		    this.input = this.$('.edit');
    		    return this;
    		  },
    	
    		  edit: function() {
    		    // executed when todo label is double clicked
    		  },
    	
    		  close: function() {
    		    // executed when todo loses focus
    		  },
    	
    		  updateOnEnter: function( e ) {
    		    // executed on each keypress when in todo edit mode, 
    		    // but we'll wait for enter to get in action
    		  }
        });
	
		// create a view for a todo
    	window[todoComponentName].todoView = new ToDoView({model: window[todoComponentName]});
    	window[todoComponentName].todoView.render();
});
*/
