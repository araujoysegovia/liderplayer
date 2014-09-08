var routerManager = Backbone.Router.extend({
	application: null,
	routes: {
		"" : "login",
		"login": "login",
		"home": "home",
		"profile": "perfil",
		"practice": "practice",
		"simulator": "simulator",
		"logout": "logout"
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
		this.defaultValues();
		var span = $("span.location-span").html("Inicio");
		span.css("margin-left", "-"+span.width()/2)
		this.application.createHomePanels();
	},

	perfil: function(){
		if(!this.checkSession()){
			Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Perfil");
		span.css("margin-left", "-"+span.width()/2)
		this.application.createPerfilPanels();
	},

	logout: function(){
		this.application.session.deleteSession();
		Backbone.history.navigate("login", true);
	},

	practice: function(){
		if(!this.checkSession()){
			Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Práctica");
		span.css("margin-left", "-"+span.width()/2)
		this.application.createSimulator();
	},

	defaultValues: function(){
		$('div.login').css("display", "none");
		$('div.home').css("display", "block");
		$("header[data-id=mainHeader").css("display", "block");
		$("header[data-id=questionHeader").css("display", "none");
		$("div.navbar").css("display", "block");
		$("#win", "div.navbar").html(this.application.session.getUser().gameInfo.win);
		$("#loose", "div.navbar").html(this.application.session.getUser().gameInfo.lost);
		$("#points", "div.navbar").html(this.application.session.getUser().gameInfo.points);
	},

	simulator: function(){
	},

	checkSession: function(){
		return this.application.session.isCreated();
	}
	
});