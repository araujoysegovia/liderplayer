var List = Backbone.View.extend({
	tag: "<ul>",
	container:null,
	baceCls: "nav nav-pills nav-stacked",
	className: "",
	constructor : function(config) {
		var self = this;
		self._ensureElement();
		config = config || {};
		_.extend(self, config);
		self.$el = $(self.tag);
		self.$el.addClass(self.baceCls);
		self.$el.addClass(self.className);
		self.initialize();
	},
	initialize: function(){
		var me = this;
		var user = liderApp.session.getUser();
		var imgPerfil = $("<img/>").attr("src", liderApp.server+"/image/"+user.image+"?width=130&height=130");
		me.createItem(imgPerfil, "img-user");
		var array = {
			"first": {
				"name": "Inicio",
				"cls": "first-element",
				"route": "home"
			},
			"Perfil": "profile",
			"Practicar": "practice",
			"Equipos": "team",
			"Grupos": "group",
			"Jugadores": "player",
			"Reglas": "rule",
			"Ayuda": "help",
			"Sugerencias": "suggestion",
			"Premios": "reward",
			"Cerrar Sesión": "logout"
		}
		_.each(array, function(val, key){
			if(_.isObject(val)){
				var value = $("<a></a>").html(val['name']).attr("href", "#");
				value.click(function(e){
					e.preventDefault();
					window.location = "#"+val['route'];
					// Backbone.history.navigate("#"+val['route'], true);
					$( "#menu-panel" ).panel( "close" );
				})
				var li = me.createItem(value, val['cls']);
			}
			else{ 
				var value = $("<a></a>").html(key).attr("href", "#");
				value.click(function(e){
					e.preventDefault();
					window.location = "#"+val;
					// Backbone.history.navigate("#"+val, true);
					$( "#menu-panel" ).panel( "close" );
				})
				me.createItem(value);
			}
			
		})
		me.render();
	},
	render: function(){
		this.container.append(this.$el);
	},
	createItem: function(val, cls){
		var me = this;
		var li = $("<li></li>").append(val);
		li.addClass(cls);
		me.$el.append(li);
		return li;
	}
})