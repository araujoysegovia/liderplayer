var Suggestion = Backbone.View.extend({
	tag: '<div>',
	container: null,
	baseCls: 'panel panel-default',
	className: '',
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
		var panelBody = $('<div></div>').addClass('panel-body');
		var form = $('<form></form>').attr('role', 'form').css('text-align', 'center');
		var formGroupLabel = $('<div></div>').addClass('form-group');
		var label = $('<label></label>').html('Ayudanos a mejorar, danos tu sugerencia');
		var formGroupSubject = $('<div></div>').addClass('form-group');
		var subject = $('<input></input>').attr('type', 'text').attr("width", "100%").addClass('form-control').attr('placeholder', 'Asunto').attr('data-id', 'subject');
		var formGroupContent = $('<div></div>').addClass('form-group');
		var content = $('<textarea></textarea>').attr('rows', '6').attr('placeholder', 'Contenido').addClass('form-control').attr('data-id', 'content');
		var buttonSubmit = $('<button></button>').attr('type', 'submit').addClass('btn btn-primary btn-send').html('Enviar');
		buttonSubmit.click(function(e){
			e.preventDefault();
			var data = {
				subject: $("input[data-id=subject]").val(),
				text: $("textarea[data-id=content]").val(),
			};
			var header = liderApp.getHeaders();
			var config = {
				headers: header,
				type: "POST",
				url: liderApp.server+"/home/player/suggestion",
				data: JSON.stringify(data),
				contentType: 'application/json',
	            dataType: "json",
	            success:function(response, data, c){
	            	var n = noty({
			    		text: 'Sugerencia Enviada',
			    		timeout: 1000,
			    		type: "success"
			    	});
			    	window.location = "#home";
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
		formGroupLabel.append(label);
		formGroupSubject.append(subject);
		formGroupContent.append(content);
		form.append(formGroupLabel).append(formGroupSubject).append(formGroupContent).append(buttonSubmit);
		me.$el.append(panelBody.append(form));
		me.render();
	},
	render: function(){
		this.container.append(this.$el);
	}
})