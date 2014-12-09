dvar routerManager = Backbone.Router.extend({
	application: null,
	routes: {
		"" : "login",
		"login": "login",
		"home": "home",
		"profile": "perfil",
		"practice": "practice",
		"team": "team",
		"group": "group",
		"player": "player",
		"rule": "rule",
		"help": "help",
		"suggestion": "suggestion",
		"reward": "reward",
		"logout": "logout",
		"duel-:duelId": "duel"
	},

	login: function(){
		if(this.checkSession()){
			Backbone.history.navigate("home", true);
			return;
		}else{
			this.application.session.deleteSession();
		}
		document.cookie =  'PHPSESSID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		$('div.login').css("display", "block");
		$('div.home').css("display", "none");
	},

	home: function(){
		if(!this.checkSession()){
			// window.location = "#login";
			this.login();
			// Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Inicio");
		span.css("margin-left", "-"+span.width()/2)
		this.application.createHomePanels();
	},

	perfil: function(){
		if(!this.checkSession()){
			// window.location = "#login";
			this.login();
			// Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Perfil");
		span.css("margin-left", "-"+span.width()/2);
		this.application.createPerfilPanels();
	},

	practice: function(){
		if(!this.checkSession()){
			// window.location = "#login";
			this.login();
			// Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Práctica");
		span.css("margin-left", "-"+span.width()/2)
		this.application.createSimulator();
	},

	duel: function(id){
		if(!this.checkSession()){
			// window.location = "#login";
			this.login();
			// Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Duelo");
		span.css("margin-left", "-"+span.width()/2)
		var idDecode = window.atob(id);
		this.application.createDuel(idDecode);
	},


	team: function(){
		if(!this.checkSession()){
			// window.location = "#login";
			this.login();
			// Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Equipos");
		span.css("margin-left", "-"+span.width()/2)
		this.application.createTeamPanels();
	},

	group: function(){
		if(!this.checkSession()){
			// window.location = "#login";
			this.login();
			// Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Grupos");
		span.css("margin-left", "-"+span.width()/2)
		this.application.createGroups();
	},

	player: function(){
		if(!this.checkSession()){
			// window.location = "#login";
			this.login();
			// Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Jugadores");
		span.css("margin-left", "-"+span.width()/2)
		this.application.createPlayers();
	},

	rule: function(){
		if(!this.checkSession()){
			// window.location = "#login";
			this.login();
			// Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Reglas");
		span.css("margin-left", "-"+span.width()/2)
	},

	help: function(){
		if(!this.checkSession()){
			// window.location = "#login";
			this.login();
			// Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Ayuda");
		span.css("margin-left", "-"+span.width()/2)
		this.application.createHelp();
	},

	suggestion: function(){
		if(!this.checkSession()){
			// window.location = "#login";
			this.login();
			// Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Sugerencias");
		span.css("margin-left", "-"+span.width()/2)
		this.application.createSuggestion();
	},

	reward: function(){
		if(!this.checkSession()){
			// window.location = "#login";
			this.login();
			// Backbone.history.navigate("login", true);
			return;
		}
		this.defaultValues();
		var span = $("span.location-span").html("Premios");
		span.css("margin-left", "-"+span.width()/2)
	},

	logout: function(){
		this.application.session.deleteSession();
		// window.location = "#login";
		this.login();
		// Backbone.history.navigate("login", true);
	},

	defaultValues: function(){
		if(this.application.session.verificateChangePassword()){
			this.application.changePasswordModel();
		}
		var header = this.application.getHeaders();
		var config = {
			headers: header,
			type: "GET",
			url: this.application.server+"/home/player/gameinfo",
			contentType: 'application/json',
            dataType: "json",
            success:function(response, data, c){
            	$("#win", "div.navbar").html(response.win);
				$("#loose", "div.navbar").html(response.lost);
				$("#points", "div.navbar").html(response.points);
            },
            error: function(xhr, status, error) {
		    	try{
			    	var obj = jQuery.parseJSON(xhr.responseText);
			    	var n = noty({
			    		text: obj.message,
			    		timeout: 1000,
			    		type: "error"
			    	});
		    	}catch(ex){
		    		var n = noty({
			    		text: "Error",
			    		timeout: 1000,
			    		type: "error"
			    	});
		    	}

	    	},
		}
		$.ajax(config)
		$('div.login').css("display", "none");
		$('div.home').css("display", "block");
		$("header[data-id=mainHeader]").css("display", "block");
		$("header[data-id=questionHeader]").css("display", "none");
		$("div.navbar").css("display", "block");
		
	},

	checkSession: function(){
		return this.application.session.isCreated();
	}

	
});