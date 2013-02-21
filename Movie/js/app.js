//create a global namespace and some properies for the sample - **important** not a best practice - that I'm aware of, but we can do what we like if it works well.
var Theater = {
    Models: {},
    Collections: {},
    Views: {}
}

//this is just a model nothing defined we need it so we have a construct that we can work with in code.
Theater.Models.Movie = Backbone.Model.extend({});

//Define a collection for the movie models - think List<Movie>
Theater.Collections.Movies = Backbone.Collection.extend({
    model: Theater.Models.Movie, //define the underlying model the collection will hold.
    url: "data/movies.json", //this is the url to use when fetch is called, in a full rest api this would be more generic for creation and delete based on verbs.
    initialize: function(){ //just an initialization method - **note** you should never do fetches of an objects model within its init, why? because it will never work.
        console.log("Movies initialize");
    }
});


//Define the view for the list of movies
Theater.Views.Movies = Backbone.View.extend({
//  Don't do this:  el: $("#mainContainer") - because it will result in a bad ref instead do this:
    el: "#mainContainer",
    template: _.template($("#tmplt-Movies").html()),
    initialize: function () {
	    this.collection.bind("reset", this.render, this);
        this.collection.bind("add", this.addOne, this);
    },
	events: { //Wire up events on teh view -these can be almost anything you like its jQuery, or underscore not sure which they are mostly the same.
		"click #butAddItem": "demoCreateOne" //I have a button in my view template that I wire an event to that adds a dummy movie for the demo.
	},
	demoCreateOne: function() {
		var movie = new Theater.Models.Movie(
			{
				"Id": "BVP3s",
				"Name": "Lord of the Rings ",
				"AverageRating": 4.3,
				"ReleaseYear": 2003,
				"Url": "http://www.netflix.com/.....",
				"Rating": "PG-13"
			});

		this.collection.add(movie); //notice that I add it to the collection and the view fires the addOne function because I bound the add of the collection to trigger the render. Cool.
		console.log(this.collection.length);
	},
    render: function () {
        console.log("render");
        console.log(this.collection.length);
        $(this.el).html(this.template());
        this.addAll();
    },
    addAll: function () { //we call this from render to add each item in the collection to the view.
        console.log("addAll");
        this.collection.each(this.addOne);
    },
    addOne: function (model) {
        console.log("addOne");
        view = new Theater.Views.Movie({ model: model });
        $("ul", this.el).append(view.render());
    }
});

Theater.Views.Movie = Backbone.View.extend({
    tagName: "li", //this specifies the tag to create when we render the view, if not specified creates a div.
    template: _.template($("#tmplt-Movie").html()),
    initialize: function () {
        _.bindAll(this, 'render');
    },
    render: function () {
        return $(this.el).append(this.template(this.model.toJSON()));
    }
});

//define the router this is what drives the application.
Theater.Router = Backbone.Router.extend({
    routes: {
		"tellBob": "bobAlert", //this is for demo purposes, add #tellBob at the end of the url and see what happens. Think anchor tags with an href that changes the url
        "": "defaultRoute" //default route handler
    },
    bobAlert: function(){
		alert("Bob look at this woohoo!");
	},
    defaultRoute: function () {
        console.log("defaultRoute");

		var movies =new Theater.Collections.Movies() ;
		var movieListView = new Theater.Views.Movies({ collection: movies });
		movies.fetch();

        console.log(movieListView.collection.length);
    }
});

//spool up the router.
var appRouter = new Theater.Router();
//this is what actually starts the application creating a router does nothing untill you call this next line.
Backbone.history.start();

