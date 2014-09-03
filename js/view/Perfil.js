var Perfil = Backbone.View.extend({
	tag: "<div>",
	container: null,
	baseCls: "perfil",
	constructor : function(config) {
		var self = this;
		self._ensureElement();
		config = config || {};
		_.extend(self, config);
		self.$el = $(self.tag);
		self.$el.addClass(self.baseCls);
		self.initialize();
	},
	initialize: function(){
		var me = this;
		var user = liderApp.session.getUser();
		var ul = $("<ul></ul>").addClass("list-group");
		var img = $("<img/>").attr("src", liderApp.server+"/image/"+user.image).addClass("img-user");
		var name = $("<li></li>").append($("<label></label>").html(user.name+" "+user.latname)).addClass("list-group-item");
		var email = $("<li></li>").append($("<label></label>").html(user.email)).addClass("list-group-item");
		var team = $("<li></li>").append($("<label></label>").html(user.team.name)).addClass("list-group-item");
		var office = $("<li></li>").append($("<label></label>").html(user.office.name)).addClass("list-group-item");
		var btnPassword = $("<button></button>").attr("type", "button").addClass("btn btn-default").html("Cambiar Contraseña");
		btnPassword.click(function(){
			me.changePassword();
		})
		var input = $("<input/>").attr("type", "file").attr("accept","image/*").addClass("add-file");
		ul.append(name).append(email).append(office).append(team).append(btnPassword);
		me.$el.append(img).append(ul).append(input);
		img.click(function(){
			input.click();
		})
		input.change(function(){
			var filename = $(this).val();
			console.log(filename);
			if(filename){
				var formdata = new FormData();
				formdata.append("imagen", $(this).get(0).files[0]);
				var header = liderApp.getHeaders();
				var config = {
					"headers": header,
					"type": "POST",
					"url": liderApp.server+"/home/player/profile",
					"data": formdata,
					"contentType": false,
					"processData": false,
					"success": function(response, data, c){
						var user = liderApp.session.getUser();
						user.image = response['image'];

						liderApp.session.updateSession(user);
						// console.log(liderApp.session.getUser().image);
						liderApp.createPerfilPanels();

						console.info("Perfil Actualizado");
					},
					"error": function(){

					}
				}
				$.ajax(config);
			}
		})
		me.render();
	},
	render: function(){
		this.container.append(this.$el);
	},
	changePassword: function(){
		var form = $("<form></form>").attr("role", "form").addClass("form-horizontal");
		var array = {
			"actual": "Contraseña Actual",
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
		var btnClose = $("<button></button>").attr("type", "button").attr("data-dismiss", "modal").addClass("close");
		var spanClose = $("<span></span>").attr("aria-hidden", "true").html("&times;");
		var spanClose2 = $("<span></span>").addClass("sr-only").html("Close");
		btnClose.append(spanClose).append(spanClose2);
		var titleHeading = $("<h4></h4>").addClass("modal-title").html("Cambiar Contraseña");
		modalHeader.append(btnClose).append(titleHeading);
		var modalBody = $("<div></div>").addClass("modal-body").append(form);
		var buttonSend = $("<button></button>").attr("type", "submit").addClass("btn btn-primary").html("Guardar");
		var buttonClose = $("<button></button>").attr("type", "button").attr("data-dismiss", "modal").addClass("btn btn-default").html("Cerrar");
		buttonSend.click(function(){
			$("div[d-id=new]").removeClass("has-warning");
			$("div[d-id=actual]").removeClass("has-warning");
			$("div[d-id=repeat]").removeClass("has-warning");
			if($("input[data-id=new]").val() != null && $("input[data-id=new]").val() != "" && $("input[data-id=repeat]").val() != null && $("input[data-id=repeat]").val() != "" && $("input[data-id=actual]").val() != null && $("input[data-id=actual]").val() != ""){
				if($("input[data-id=new]").val() == $("input[data-id=repeat]").val()){
					console.log("entre");
					var data = {
						oldPassword: $("input[data-id=actual]").val(),
						newPassword: $("input[data-id=new]").val(),
					};
					var header = liderApp.getHeaders();
					var config = {
						headers: header,
						type: "POST",
						url: liderApp.server+"/home/user",
						data: JSON.stringify(data),
						contentType: 'application/json',
			            dataType: "json",
			            success:function(response, data, c){
			            }
					}
					$.ajax(config)
				}
			}
			else{
				if($("input[data-id=new]").val() == ""){
					$("div[d-id=new]").addClass("has-warning");
				}
				if($("input[data-id=actual]").val() == ""){
					$("div[d-id=actual]").addClass("has-warning");
				}
				if($("input[data-id=repeat]").val() == ""){
					$("div[d-id=repeat]").addClass("has-warning");
				}
			}
		})
		var modalFooter = $("<div></div>").addClass("modal-footer").append(buttonClose).append(buttonSend);
		var modalContent = $("<div></div>").addClass("modal-content");
		modal.append(modalDialog.append(modalContent.append(modalHeader).append(modalBody).append(modalFooter)));
		$(document.body).append(modal);
		modal.modal("show");
	}
})