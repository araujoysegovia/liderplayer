var Perfil = Backbone.View.extend({
	tag: "<div>",
	container: null,
	baseCls: "perfil",
	panelTable: null,
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
		me.setInfoProfile();
		me.buildTable();
		var header = liderApp.getHeaders();
		var statistics = new Statistics();
		statistics.url = liderApp.server+statistics.url;
		statistics.fetch({
				headers: header,
				success: function(collection, response, options){
					var data = response.data;
					me.insertInfoInTable(response);
				}
			})
		me.render();
	},
	render: function(){
		this.container.append(this.$el);
	},

	setInfoProfile: function(){
		var me = this;
		var user = liderApp.session.getUser();
		var ul = $("<ul></ul>").addClass("list-group");
		var img = $("<img/>").attr("src", liderApp.server+"/image/"+user.image+"?width=130&height=130").addClass("img-user");
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
				$.ajax(config);
			}
		})
	},
	buildTable: function(){
		var me = this;
		me.panelTable = $("<div></div>").addClass("panel panel-default panel-positions");
		var headPanel = $("<div></div>").addClass("panel-heading").html("Estadisticas de juego");
		var table = $("<table></table>").addClass("table table-bordered");
		var trHead = $("<tr></tr>");
		var columns = [{
			"name": "category",
			"value": "Categoria",
			"width": "60%"
		},
		{
			"name": "practice",
			"value": "Practica",
		},
		{
			"name": "duel",
			"value": "Duelos",
		}];
		_.each(columns, function(value){
			var th = $("<th></th>").html(value['value']).css("width", value['width']).css("text-align", "center");
			trHead.append(th);
		})
		var headTable = $("<thead></thead>").append(trHead);
		me.panelTable.append(headPanel).append(table.append(headTable));
		me.$el.append(me.panelTable);
	},
	insertInfoInTable: function(info){
		var me = this;
		var bodyTable = $("<tbody></tbody>");
		_.each(info, function(value, key){
			var tr = $("<tr></tr>");
			var tdCategory = $("<td></td>").html(key).css("vertical-align", "middle");
			var tdPractice = $("<td></td>").html("<h3>"+value.practice.effectiveness.toFixed(2)+"%</h3><p>"+value.practice.win+"/"+value.practice.count+"</p>").css("text-align", "center");
			var tdTournament = $("<td></td>").html("<h3>"+value.tournament.effectiveness.toFixed(2)+"%</h3><p>"+value.tournament.win+"/"+value.tournament.count+"</p>").css("text-align", "center");
			tr.append(tdCategory).append(tdPractice).append(tdTournament);
			bodyTable.append(tr);
		})
		me.panelTable.find("table").append(bodyTable);
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
					var data = {
						oldPassword: $("input[data-id=actual]").val(),
						newPassword: $("input[data-id=new]").val(),
					};
					var header = liderApp.getHeaders();
					var config = {
						headers: header,
						type: "PUT",
						url: liderApp.server+"/home/player/pass",
						data: JSON.stringify(data),
						contentType: 'application/json',
			            dataType: "json",
			            success:function(response, data, c){
			            	modal.modal("hide");
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
		modal.on("hidden.bs.modal", function(){
    		modal.remove();
    	})
	}
})