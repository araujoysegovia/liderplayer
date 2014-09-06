var liderApp;
$(document).ready(function(){
	$("button","header").click(function(){
		$( "#menu-panel" ).panel( "open" );
		$( "#menu-panel" ).empty();
		var list = new List({
			container: $("div.menu-panel")
		});
		
	})
	try{
		liderApp = new Application();
	}catch(e){
		console.error(e);
	}
	

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
	// server: "http://10.101.1.46/lider/web/app_dev.php",
	//server: "http://10.101.1.135/lider/web/app_dev.php",
	server: "http://soylider.sifinca.net",
	constructor: function(){
		var me = this;
		// this.editCollections();
		this.session = new Session();
		this.router = new routerManager();
		this.router.application = this;
		setTimeout(function(){
			Backbone.history.start();
		}, 10);
	},
	changePasswordModel: function(){
		var me = this;
		var form = $("<form></form>").attr("role", "form").addClass("form-horizontal");
		var array = {
			"new": "Contraseña Nueva",
			"repeat": "Repita la contraseña"
		}
		_.each(array, function(value, key){
			var div = $("<div></div>").addClass("form-group");
			var label = $("<label></label>").html(value).attr("for", value).addClass("col-sm-2 control-label");
			var input = $("<input></input>").attr("type", "password").addClass("form-control").attr("data-id", key);
			var divInput = $("<div></div>").addClass("col-sm-10").append(input).attr("d-id", key);
			div.append(label).append(divInput);
			form.append(div);
			if(key == "repeat"){
				input.change(function(){
					if($("input[data-id=new]").val() != null && $("input[data-id=new]").val() != "" && $("input[data-id=repeat]").val() != null && $("input[data-id=repeat]").val() != ""){
						if($("input[data-id=new]").val() == input.val()){
							divInput.removeClass("has-error");
							divInput.addClass("has-success");
						}
						else{
							divInput.removeClass("has-success");
							divInput.addClass("has-error");
						}
					}
					else{
						divInput.removeClass("has-error");
						divInput.removeClass("has-success");
					}
				})
			}
		})
		var modal = $("<div></div>").addClass("modal fade");
		var modalDialog = $("<div></div>").addClass("modal-dialog");
		var modalHeader = $("<div></div>").addClass("modal-header");
		var titleHeading = $("<h4></h4>").addClass("modal-title").html("Cambiar Contraseña");
		modalHeader.append(titleHeading);
		var modalBody = $("<div></div>").addClass("modal-body").append(form);
		var buttonSend = $("<button></button>").attr("type", "submit").addClass("btn btn-primary").html("Guardar");
		buttonSend.click(function(){
			$("div[d-id=new]").removeClass("has-warning");
			$("div[d-id=repeat]").removeClass("has-warning");
			if($("input[data-id=new]").val() != null && $("input[data-id=new]").val() != "" && $("input[data-id=repeat]").val() != null && $("input[data-id=repeat]").val() != ""){
				if($("input[data-id=new]").val() == $("input[data-id=repeat]").val()){
					console.log("entre");
					var data = {
						password: $("input[data-id=new]").val(),
					};
					var header = me.getHeaders();
					var config = {
						headers: header,
						type: "POST",
						url: me.server+"/home/player/pass",
						data: JSON.stringify(data),
						contentType: 'application/json',
			            dataType: "json",
			            success:function(response, data, c){
			            	modal.modal("hide");
			            	me.session.setChangePassword();
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
				}
			}
			else{
				if($("input[data-id=new]").val() == ""){
					$("div[d-id=new]").addClass("has-warning");
				}
				if($("input[data-id=repeat]").val() == ""){
					$("div[d-id=repeat]").addClass("has-warning");
				}
			}
		})
		var modalFooter = $("<div></div>").addClass("modal-footer").append(buttonSend);
		var modalContent = $("<div></div>").addClass("modal-content");
		modal.append(modalDialog.append(modalContent.append(modalHeader).append(modalBody).append(modalFooter)));
		$(document.body).append(modal);
		modal.modal({
			backdrop: "static",
			keyboard: false,
			show: true
		});

	},
	createHomePanels: function(){
		$("div.body-container").empty();
		var chartContainer = $("<div></div>").addClass("chart-container").css({
			width: "200px",
			height: "200px",
			display:"inline-block",
			position:"relative",
			left: "50%"
		});

		var cont = $("<div></div>").css({
			width: "160px",
			height: "160px",
			marginLeft: "20px",
			marginTop: "4px"
		});
		chartContainer.append(cont);

		$("div.body-container").append(chartContainer);
		$("div.body-container").append($("<center>").html((this.session.getEffectiveness().toFixed(2) || 0) + "% de eficacia"));
		chartContainer.css("margin-left", "-" + (chartContainer.width()/2) + "px");
		this.drawChart(cont, this.session.getEffectiveness() || 0);
		

		// this.changePasswordModel();
		var duelPanel = new ListPanel({
			title: "Duelo Actual",
			container: $("div.body-container"),
			className: "panel-success",
			maxHeight: 180,
			collection: new Duels(),
			tpl: "<div class='player-item-list'>"+
					"<div class='player-img'>"+
						"<img src='https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-128.png' width='40px' height='40px' />"+
					"</div>"+
					"<div class='player-info'>"+
						"<h5><%= name %></h5>"+
						"<h6><span class='glyphicon glyphicon-envelope'></span>  <%= email %></h6>"+
						"<div class='games-info'>"+
							"<div class='match-info your-question'>"+
								"<span>Tu</span>"+
								"<span>2</span>"+
							"</div>"+
							"<div class='match-info rival-question'>"+
								"<span>Rival</span>"+
								"<span>3</span>"+
							"</div>"+
							"<div class='match-info total-question'>"+
								"<span>Total</span>"+
								"<span>5</span>"+
							"</div>"+
						"</div>"+
					"</div>"+					
				  "</div>"
		})
		var team = typeof this.session.getUser().team.name ? "No Asignado" : this.session.getUser().team.name;
		var teamPanel = new ListPanel({
			title: "Mi Equipo: " + team,
			container: $("div.body-container"),
			className: "panel-primary",
			maxHeight: 215,
			collection: new PlayerTeam(),
			tpl: "<div class='player-item-list'>"+
					"<div class='player-img'>"+
						"<img src='"+this.server+"/image/<%= image %>' width='40px' height='40px'/>"+
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
		var duelCollection = new Duels();
		duelCollection.url = "/home/player/duel/history";
		var finishDuel = new ListPanel({
			title: "Duelos Terminados",
			container: $("div.body-container"),
			className: "panel-danger",
			maxHeight: 180,
			collection: duelCollection,
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
			container: $("div.body-container")
		})
	},
	createSimulator: function(){
		$("div.body-container").empty();
		var quiestionManager = new QuestionManager({
			container: $("div.body-container")
		})
	},
	createTeamPanels: function(){
		$("div.body-container").empty();
		var teams = new TeamView({
			className: "panel-positions",
			collection: new Teams(),
			container: $("div.body-container")
		})
		// var teams = new Teams();
		// teams.url = this.server+teams.url;
		// var header = this.getHeaders();
		// teams.fetch({
		// 	headers: header,
		// 	success: function(collection, response, options){
		// 		var data = response.data;
		// 		_.each(data, function(value, key){
		// 			console.log(value);
		// 		})
		// 	},
		// 	error: function(){
		// 	}
		// })
	},

	createGroups: function(){
		$("div.body-container").empty();
		var teamPosition = new TeamPosition({
			container: $("div.body-container"),
			className: "panel-positions"
		})
	},

	createPlayers: function(){
		$("div.body-container").empty();
		var teamPosition = new PlayerPosition({
			className: "panel-positions",
			container: $("div.body-container"),
			collection: new Players()
		})
	},

	createHelp: function(){
		$("div.body-container").empty();
		var help = new TextView({
			container: $("div.body-container"),
			className: "div-text",
			text: "Este es el texto largo de prueba para poner textos largos y entonces no se que mas escribir y aja empiezo a escribir lo primero que se me ocurra porque la idea es generar un texto largo de varios renglones para probar, ya que aqui irá un texto redactado por geobel y necesito hacerlo",
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
	reportError: function(title, content){
		var data = {
			title: title,
			content: content,
		};
		var config = ({
			type: "GET",
		  	headers: this.getHeaders(),
			url: liderApp.server+"/home/error",
			data: JSON.stringify(data),
			contentType: 'application/json',
            dataType: "json",
		})
		$.ajax(config);
	},
	drawChart: function(container, total){
		container.kendoRadialGauge({
            pointer: {
                value: total.toFixed(2)
            },

            scale: {
                minorUnit: 5,
                startAngle: -30,
                endAngle: 210,
                max: 100,
                labels: {
                    position: "outside" //|| "inside"
                },
                ranges: [
                    {
                        from: 30,
                        to: 50,
                        color: "#ffc700"
                    }, {
                        from: 15,
                        to: 30,
                        color: "#ff7a00"
                    }, {
                        from: 0,
                        to: 15,
                        color: "#c20000"
                    }
                ]
            }
        });
	}
}




// Template vs
// tpl: "<div class='player-item'>"+
// 					"<div class='player-item-container'>"+
// 						"<div class='player-img'>"+
// 							"<img src='"+this.server+"/image/"+this.session.getUser().image+"' width='40px' height='40px' />"+
// 						"</div>"+
// 						"<div class='player-info'>"+
// 							"<h5><%= name %></h5>"+
// 							"<div class='games-info'>"+
// 								"<div class='match-info player-win'>"+
// 									"<img src='images/icons/win.png' style='width:20px; margin-top:-7px'/>"+
// 									"<span>2</span>"+
// 								"</div>"+
// 								"<div class='match-info player-loose'>"+
// 									"<img src='images/icons/loose.png' style='width:20px; margin-top:-7px;'/>"+
// 									"<span>3</span>"+
// 								"</div>"+
// 							"</div>"+
// 						"</div>"+
// 					"</div>"+
// 					"<div class='player-item-vs'>"+
// 						"<img src='http://www.ccbetania.org/alianzaextrema/wp-content/uploads/2012/02/VS-1.png' />"+
// 					"</div>"+
// 					"<div class='player-item-container player-item-container-2'>"+
// 						"<div class='player-img'>"+
// 							"<img src='https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-128.png' width='40px' height='40px' />"+
// 						"</div>"+
// 						"<div class='player-info'>"+
// 							"<h5><%= name %></h5>"+
// 							"<div class='games-info'>"+
// 								"<div class='match-info player-win'>"+
// 									"<img src='images/icons/win.png' />"+
// 									"<span>2</span>"+
// 								"</div>"+
// 								"<div class='match-info player-loose'>"+
// 									"<img src='images/icons/loose.png' />"+
// 									"<span>3</span>"+
// 								"</div>"+
// 							"</div>"+
// 						"</div>"+
// 					"</div>"+
// 				  "</div>"

