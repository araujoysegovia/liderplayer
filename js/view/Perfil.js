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
		var input = $("<input/>").attr("type", "file").attr("accept","image/*").addClass("add-file");
		ul.append(name).append(email).append(office).append(team);
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
	}
})