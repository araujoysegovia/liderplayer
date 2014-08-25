var routerManager = Backbone.Router.extend({
	application: null,
	routes: {
		"" : "login",
		"home": "home"
	},

	login: function(){
		if(this.checkSession()){
			Backbone.history.navigate("home", true);
			return;
		}else{
			this.application.session.deleteSession();
		}
		$('div.login').css("display", "block");
		$('div.home').css("display", "none");
	},

	home: function(){
		if(!this.checkSession()){
			Backbone.history.navigate("login", true);
			return;
		}
		$('div.login').css("display", "none");
		$('div.home').css("display", "block");
		this.application.createHomePanels();
	},

	checkSession: function(){
		return this.application.session.isCreated();
	}
	
});