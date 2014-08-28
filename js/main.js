var liderApp;
$(document).ready(function(){
	$("button","header").click(function(){
		$( "#menu-panel" ).panel( "open" );
		$( "#menu-panel" ).empty();
		var list = new List({
			container: $("div.menu-panel"),
		})
		
	})
	
	liderApp = new Application();

	// liderApp.session.deleteSession();
})
// var server = "http://soylider.sifinca.net/lider/web/app.php";
var Application = function(){
	if(typeof this.constructor == 'function'){
		this.constructor.apply(this, arguments);
	}
}
Application.prototype = {
	session: null,
	router: null,
	// server: "http://10.102.1.22/lider/web/app_dev.php",
	server: "http://soylider.sifinca.net",
	constructor: function(){
		// this.editCollections();
		this.session = new Session();
		this.router = new routerManager();
		this.router.application = this;
		setTimeout(function(){
			Backbone.history.start();
		}, 10);
	},
	createHomePanels: function(){
		$("div.body-container").empty();
		var duelPanel = new ListPanel({
			title: "Duelo Actual",
			container: $("div.body-container"),
			className: "panel-success",
			maxHeight: 180,
			collection: new Players(),
			tpl: "<div class='player-item'>"+
					"<div class='player-item-container'>"+
						"<div class='player-img'>"+
							"<img src='"+this.server+"/image/"+this.session.getUser().image+"' width='40px' height='40px' />"+
						"</div>"+
						"<div class='player-info'>"+
							"<h5><%= name %></h5>"+
							"<div class='games-info'>"+
								"<div class='match-info player-win'>"+
									"<img src='images/icons/win.png' style='width:20px; margin-top:-7px'/>"+
									"<span>2</span>"+
								"</div>"+
								"<div class='match-info player-loose'>"+
									"<img src='images/icons/loose.png' style='width:20px; margin-top:-7px;'/>"+
									"<span>3</span>"+
								"</div>"+
							"</div>"+
						"</div>"+
					"</div>"+
					"<div class='player-item-vs'>"+
						"<img src='http://www.ccbetania.org/alianzaextrema/wp-content/uploads/2012/02/VS-1.png' />"+
					"</div>"+
					"<div class='player-item-container player-item-container-2'>"+
						"<div class='player-img'>"+
							"<img src='https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-128.png' width='40px' height='40px' />"+
						"</div>"+
						"<div class='player-info'>"+
							"<h5><%= name %></h5>"+
							"<div class='games-info'>"+
								"<div class='match-info player-win'>"+
									"<img src='images/icons/win.png' />"+
									"<span>2</span>"+
								"</div>"+
								"<div class='match-info player-loose'>"+
									"<img src='images/icons/loose.png' />"+
									"<span>3</span>"+
								"</div>"+
							"</div>"+
						"</div>"+
					"</div>"+
				  "</div>"
		})
		var teamPanel = new ListPanel({
			title: "Mi Equipo: "+this.session.getUser().team.name,
			container: $("div.body-container"),
			className: "panel-primary",
			maxHeight: 215,
			collection: new Players(),
			tpl: "<div class='player-item-list'>"+
					"<div class='player-img'>"+
						"<img src='https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-128.png' width='40px' height='40px' />"+
					"</div>"+
					"<div class='player-info'>"+
						"<h5><%= name %></h5>"+
						"<h6><span class='glyphicon glyphicon-envelope'></span>  <%= email %></h6>"+
						"<div class='games-info'>"+
							"<div class='match-info player-win'>"+
								"<img src='images/icons/win.png' style='width:20px; margin-top:-7px'/>"+
								"<span>2</span>"+
							"</div>"+
							"<div class='match-info player-loose'>"+
								"<img src='images/icons/loose.png' style='width:20px; margin-top:-7px;'/>"+
								"<span>3</span>"+
							"</div>"+
						"</div>"+
					"</div>"+					
				  "</div>"
		})
		var finishDuel = new ListPanel({
			title: "Duelos Terminados",
			container: $("div.body-container"),
			className: "panel-danger",
			maxHeight: 180,
			collection: new Players(),
			tpl: "<div class='player-item'>"+
					"<div class='player-item-container item-win'>"+
						"<div class='player-img'>"+
							"<img src='"+this.server+"/image/"+this.session.getUser().image+"' width='40px' height='40px' />"+
						"</div>"+
						"<div class='player-info'>"+
							"<h5><%= name %></h5>"+
							"<div class='games-info'>"+
								"<div class='match-info score'>"+
									"<img src='images/icons/win.png' style='width:20px; margin-top:-7px'/>"+
									"<span>2</span>"+
								"</div>"+
							"</div>"+
						"</div>"+
					"</div>"+
					"<div class='player-item-vs'>"+
						"<img src='http://www.ccbetania.org/alianzaextrema/wp-content/uploads/2012/02/VS-1.png' />"+
					"</div>"+
					"<div class='player-item-container player-item-container-2 item-loose'>"+
						"<div class='player-img'>"+
							"<img class='gray-scale' src='https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-128.png' width='40px' height='40px' />"+
						"</div>"+
						"<div class='player-info'>"+
							"<h5><%= name %></h5>"+
							"<div class='games-info'>"+
								"<div class='match-info score'>"+
									"<img src='images/icons/win.png' style='width:20px; margin-top:-7px' />"+
									"<span>2</span>"+
								"</div>"+
							"</div>"+
						"</div>"+
					"</div>"+
				  "</div>"
		})
	},

	createPerfilPanels: function(){
		$("div.body-container").empty();
		var perfil = new Perfil({
			container: $("div.body-container"),
		})
	},
	createSimulator: function(){
		$("div.body-container").empty();
		var quiestionManager = new QuestionManager({
			container: $("div.body-container"),
		})
	},

	disableHeaders: function(){
		// $("header.header").css("display", "none");
		$("div.navbar").css("display", "none");
	},
	getHeaders: function(){
		return {
			'x-login': 'Username Username="'+this.session.getUser().email+'", Token="'+this.session.getToken()+'"'
		};
	},
}


