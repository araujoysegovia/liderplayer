var QuestionManager = Backbone.View.extend({
	tag: "<div>",
	container: null,
	baseCls: "game-container",
	className: null,
	currentToken: null,
	currentQuestionId: null,
	time: 30000,
	interval: null,
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
		$("header[data-id='mainHeader").css("display", "none");
		$("header[data-id='questionHeader").css("display", "block");
		var progressBar = $(".progress-bar", ".progress-header");
		var spanCount = $("#question-time-counter");
		var percent = me.time/100;
		
		var count = 0;
		var totalSecond = me.time/1000;
		var beforeIterator = 0;
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
				me.currentToken = data.token;
				var q = data.question[0];
				var category = q.category.name;
				$("#questionCategory").html(category);
				me.currentQuestionId = q.id;
				var question = $("<p></p>").html(q['question']);
				var d = $("<div></div>").append(question);
				divQuestion.append(d);
				var divHeight = divQuestion.height()/2;
				var pHeight = d.height()/2
				var h = divHeight - pHeight
				question.css("margin-top", h+"px");
				me.randomAnswer(q);
				me.interval = setInterval(function(){
					count ++;
					progressBar.css("width", count+"%");
					var iterations = parseInt(totalSecond * (count/100));
					if(iterations != beforeIterator){
						secNumber --;
						spanCount.html(secNumber);
						beforeIterator = iterations;
					}
					
					if(count > 100){
						window.clearInterval(me.interval);
						$("div.btn", me.$el).unbind("click");
						$("span", ".div-question").html("Tiempo Agotado").css("color", "#F0AD4E");
						$("div[data-alert=true]", me.$el).fadeIn(100);
						me.checkQuestion("no-answer");
						setTimeout(function(){
							me.responseAnswer();
						},1000)
					}

				},percent)
			},
			error: function(xhr, status, error) {
		    	try{
			    	var obj = jQuery.parseJSON(xhr.responseText);
	            	$.notify(obj.message, { 
	            		className:"error", 
	            		globalPosition:"top center" 
	            	});
		    	}catch(ex){
		    		$.notify("Error", { 
	            		className:"error", 
	            		globalPosition:"top center" 
	            	});
		    	}
	    	},
	    	complete: function(){
	    		loader.hide();
	    	}
		});
	},

	showMessage: function(container){
		var divAlert = $('<div></div>').attr("data-alert", "true")
		 	.css("position", "absolute")
		 	.css("top", "0px")
		 	.css("width", "100%")
		 	.css("height", "100%")
		 	.css("display", "none")
		 	.css("z-index", "1000000");
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
	},
	addAnswer: function(answer){
		var button = $("<div></div>").attr("data-id", answer['id']).html(answer['answer']).addClass("btn btn-default btn-answer");
		return button;

	},
	checkQuestion: function(answerId){
		var me = this;
		window.clearInterval(me.interval);
		$("div.btn", me.$el).unbind("click");
		var header = liderApp.getHeaders();
		var data = {
			questionId: me.currentQuestionId,
			answerId: answerId,
			token: me.currentToken,
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
				var bId = $("div[data-id='"+answerId+"']");
				if(answerId != "no-answer"){
					if(response.success){
						$("span", ".div-question").html("Correcto").css("color", "#5CB85C");
						bId.addClass("btn-success");
					}
					else{
						$("span", ".div-question").html("Incorrecto").css("color", "#D9534F");
						bId.addClass("btn-danger");
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
		divButtons.append(buttonExit).append(buttonStart);
		
		var img = $("<img />").attr("src", "images/lider-logo.png");
		// me.$el.append(img).append(divButtons);
		var principalDiv = $("<div></div>").addClass("question-notify").append(img).append(divButtons);
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
		 	.css("z-index", "1000000")
		 	.append(modal)
		 	.append(principalDiv);

		$(document.body).append(divAns);
    	// divAns.css("display", "block");
    	divAns.fadeIn(500);
    	buttonStart.click(function(e){
    		divAns.fadeOut(500, function(){
    			me.buildQuestion();
    		})
		})
		buttonExit.click(function(e){
    		divAns.fadeOut(500, function(){
    			Backbone.history.navigate("#home", true);
    		})
		})
	},

	sendAnser: function(){
		
	}
})