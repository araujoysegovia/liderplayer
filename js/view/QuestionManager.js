var QuestionManager = Backbone.View.extend({
	tag: "<div>",
	container: null,
	baseCls: "game-container",
	className: null,
	currentToken: null,
	currentQuestionId: null,
	lastData: null,
	time: 30000,
	counter: null,
	constructor : function(config) {
		var self = this;
		self._ensureElement();
		config = config || {};
		_.extend(self, config);
		self.$el = $(self.tag);
		self.$el.addClass(self.baseCls);
		self.$el.addClass(self.className);
		self.initialize();
	},
	initialize: function(){
		var me = this;
		var divButtons = $("<div></div>").addClass("div-iniciar");
		var buttonStart = $("<button></button>").html("Empezar").addClass("btn btn-primary btn-iniciar");
		divButtons.append(buttonStart);
		buttonStart.click(function(e){
			me.buildQuestion();
		})
		var img = $("<img />").attr("src", "images/lider-logo.png");
		me.$el.append(img).append(divButtons);
		this.render();
	},

	render: function(){
		this.container.append(this.$el);
	},

	buildQuestion: function(){
		var me = this;
		liderApp.disableHeaders();
		$("div.game-container").empty();
		$("header[data-id=mainHeader]").css("display", "none");
		$("header[data-id=questionHeader]").css("display", "block");
		var progressBar = $(".progress-bar", ".progress-header");
		var spanCount = $("#question-time-counter");
		var percent = me.time/100;
		var totalSecond = me.time/1000;
		var secNumber = totalSecond;
		var divQuestion = $("<div></div>").addClass("div-question");
		me.showMessage(divQuestion);
		this.$el.append(divQuestion);
		var loader = $(document.body).loaderPanel();
		loader.show();
		var header = liderApp.getHeaders();
		$.ajax({
		  	type: "GET",
		  	headers: header,
			url: liderApp.server+"/home/question/test",
			//contentType: 'application/json',
            //dataType: "json",
			success: function(data){
				me.lastData = JSON.stringify(data);
				me.currentToken = data.token;
				var q = data.question[0];
				var category = q.category.name;
				$("#questionCategory").html(category);
				me.currentQuestionId = q.id;
				var question = $("<p></p>").html(q['question']);
				var d = $("<div></div>").append(question);
				divQuestion.append(d);
				if(q.image){
					var imageQuestion = $("<img />").attr("src", liderApp.server+"/image/"+q.image).css("width", "80px").css("height", "80px");
					divQuestion.append(imageQuestion);
				}
				var divHeight = divQuestion.height()/2;
				var pHeight = d.height()/2
				var h = divHeight - pHeight
				question.css("margin-top", h+"px");
				me.randomAnswer(q);
				me.counter = new Worker("js/QuestionCounter.js");
				me.counter.addEventListener('message', function(e) {
					var data = e.data;
					switch (data.cmd) {
				  		case "time":
				  			spanCount.html(data.value+"'");
				  			break;
				  		case "timeout":
				  			me.checkQuestion("no-answer");
				  			me.showTimeExpireMessage();
				  			setTimeout(function(){
								me.responseAnswer();
							},1000)
				  			break;
				  		case "pbar":
				  			progressBar.css("width", data.value+"%");
				  			break;
				  		case "stop":
				  			me.counter.terminate();
				  			break;
				  	}
				}, false);
				me.counter.postMessage({'cmd': 'start', "totalSecond": totalSecond, "percent": percent});

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
	    	complete: function(){
	    		loader.hide();
	    	}
		});
	},

	showTimeExpireMessage: function(){
		var me = this;
		$("span", ".div-question").html("Tiempo Agotado").css("color", "#F0AD4E");
		$("div[data-alert=true]", me.$el).fadeIn(100);
	},

	showSuccessMessage: function(answerId){
		var bId = $("div[data-id='"+answerId+"']");
		$("span", ".div-question").html("Correcto").css("color", "#5CB85C");
		bId.addClass("btn-success");
	},

	showWrongMessage: function(answerId){
		var bId = $("div[data-id='"+answerId+"']");
		$("span", ".div-question").html("Incorrecto").css("color", "#D9534F");
		bId.addClass("btn-danger");
	},

	showMessage: function(container){
		var divAlert = $('<div></div>').attr("data-alert", "true")
		 	.css("position", "absolute")
		 	.css("top", "0px")
		 	.css("width", "100%")
		 	.css("height", "100%")
		 	.css("display", "none")
		 	.css("z-index", "99");
		 var msg = $("<span></span>").addClass("alert-msg");
		 divAlert.append(msg);
		 container.append(divAlert);
	},
	randomAnswer: function(q){
		var me = this;
		var c = q.answers.length;
		var a = new Array();
		_.each(q['answers'], function(value){
			a.push(value);
		})
		for(var i=c; i > 0; i--){
			var rnd = Math.random();
			var pos = parseInt(rnd*i);
			if(pos<0)pos++;
			if(pos > (a.length - 1))pos++;
			var button = me.addAnswer(a[pos]);
			button.click(function(e){
				var bId = $(this).attr("data-id");
				me.checkQuestion(bId);
			})
			a.splice(pos,1);

			me.$el.append(button);
		}
		if(me.$el.children("button").length > 4){
			liderApp.reportError("Mas de 4 preguntas", me.lastData);
		}
	},

	addAnswer: function(answer){
		var button = $("<div></div>").attr("data-id", answer['id']).html(answer['answer']).addClass("btn btn-default btn-answer");
		return button;

	},
	checkQuestion: function(answerId){
		var me = this;
		me.counter.postMessage({'cmd': 'stop'});
		$("div.btn", me.$el).unbind("click");
		var header = liderApp.getHeaders();
		var data = {
			questionId: me.currentQuestionId,
			answerId: answerId,
			token: me.currentToken
		};
		if(answerId != "no-answer"){
			var loader = $(document.body).loaderPanel();
			loader.show();
		}
		var config = {
			headers: header,
			type: "POST",
			url: liderApp.server+"/home/question/answer/check",
			data: JSON.stringify(data),
			contentType: 'application/json',
            dataType: "json",
			success: function(response, data, c){
				
				if(answerId != "no-answer"){
					if(response.success){
						me.showSuccessMessage(answerId)
						liderApp.session.addQuestion(true);
					}
					else{
						if(response.code == "02"){
							me.showWrongMessage(answerId);
						}
						else if(response.code == "01"){
							me.showTimeExpireMessage();
						}
						liderApp.session.addQuestion(false);
					}
					$("div[data-alert=true]", me.$el).fadeIn(100);
					setTimeout(function(){
						me.responseAnswer();
					}, 1000);
				}
			},
			error: function(){
			},
			complete: function(){
				if(answerId != "no-answer"){
					loader.hide();
				}
			}
		}
		$.ajax(config);
	},
	endGame: function(){
		liderApp.enableHeaders();
	},
	responseAnswer: function(){
		var me = this;
		var divButtons = $("<div></div>").addClass("div-iniciar");
		var buttonStart = $("<button></button>").html("Siguiente").addClass("btn btn-success btn-iniciar ").attr("data-id", "btniniciar");
		var buttonExit = $("<button></button>").html("Salir").addClass("btn btn-danger btn-iniciar").attr("data-id", "btnsalir");
		var reportq = $("<a></a>").html("Reportar Pregunta");
		var divReport = $("<div></div>").append(reportq).addClass("report-question");
		divButtons.append(buttonExit).append(buttonStart);
		
		var img = $("<img />").attr("src", "images/lider-logo.png");
		// me.$el.append(img).append(divButtons);
		var principalDiv = $("<div></div>").addClass("question-notify").append(img).append(divButtons).append(divReport);
		var modal = $("<div></div>")
			.css("position", "absolute")
		 	.css("width", "100%")
		 	.css("height", "100%")
		 	.css("opacity", "0.7")
		 	.css("background-color", "#888")
		 	.css("z-index", "1");
		var divAns = $('<div></div>')
		 	.css("position", "absolute")
		 	.css("top", "0px")
		 	.css("width", "100%")
		 	.css("height", "100%")
		 	// .css("background-color", "#888")
		 	.css("display", "none")
		 	.css("z-index", "100")
		 	.append(modal)
		 	.append(principalDiv);

		$(document.body).append(divAns);
    	// divAns.css("display", "block");
    	divAns.fadeIn(500);
    	buttonStart.click(function(e){
    		divAns.fadeOut(500, function(){
    			me.buildQuestion();
    			divAns.remove();
    		})
		})
		buttonExit.click(function(e){
    		divAns.fadeOut(500, function(){
    			Backbone.history.navigate("#home", true);
    			divAns.remove();
    		})
		})
		reportq.click(function(){
			// console.log("fda");
			me.reportQuestion();
		})
	},

	reportQuestion: function(){
		var me = this;
		var divReasons = $("<div></div>").addClass("list-group");
		var arrayElements = {
			"ortografia": {
				"title": "Ortografia y Gramatica",
				"description": "La pregunta tiene errores ortograficos o gramaticales"
			},
			"resIncorrecta": {
				"title": "Respuesta Incorrecta",
				"description": "La respuesta esta mal"
			},
			"catIncorrecta": {
				"title": "Categoria Incorrecta",
				"description": "La pregunta pertenece a otra categoria"
			},
			"malFormulada": {
				"title": "Pregunta Mal formulada",
				"description": "No se entiende la pregunta"
			}
		}
		var modal = $("<div></div>").addClass("modal fade");
		_.each(arrayElements, function(value, key){
			var link = $("<a></a>").attr("href", "#").addClass("list-group-item");
			var title = $("<h4></h4>").addClass("list-group-item-heading").html(value['title']);
			var description = $("<p></p>").addClass("list-group-item-text").html(value['description']);
			link.append(title).append(description);
			divReasons.append(link);
			link.click(function(){
				var data = {
					questionId: me.currentQuestionId,
					reportText: value['title'],
				};
				var header = liderApp.getHeaders();
				var config = {
					headers: header,
					type: "POST",
					url: liderApp.server+"/home/question/report",
					data: JSON.stringify(data),
					contentType: 'application/json',
		            dataType: "json",
		            success:function(response, data, c){
		            	modal.modal("hide");
		            	$("div.report-question").css("display", "none");
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
			})
		})
		var modalDialog = $("<div></div>").addClass("modal-dialog");
		var modalHeader = $("<div></div>").addClass("modal-header");
		var btnClose = $("<button></button>").attr("type", "button").attr("data-dismiss", "modal").addClass("close");
		var spanClose = $("<span></span>").attr("aria-hidden", "true").html("&times;");
		var spanClose2 = $("<span></span>").addClass("sr-only").html("Close");
		btnClose.append(spanClose).append(spanClose2);
		var titleHeading = $("<h4></h4>").addClass("modal-title").html("Reportar Pregunta");
		modalHeader.append(btnClose).append(titleHeading);
		var modalBody = $("<div></div>").addClass("modal-body").append(divReasons);
		var modalContent = $("<div></div>").addClass("modal-content");
		modal.append(modalDialog.append(modalContent.append(modalHeader).append(modalBody)));
		$(document.body).append(modal);
		modal.modal("show");
		modal.on("hidden.bs.modal", function(){
    		modal.remove();
    	})
	}
})