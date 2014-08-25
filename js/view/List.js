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
		var imgPerfil = $("<img/>").attr("src", "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-128.png");
		me.createItem(imgPerfil, "img-user");
		var array = [
				[
					"Perfil",
					"first-element"
				],
				"Practicar",
				"Equipos",
				"Posiciones Equipos",
				"Posiciones Jugadores",
				"Reglas",
				"Ayuda",
				"Cerrar Session"
			]
		_.each(array, function(val){
			if($.isArray(val)){
				var value = $("<a></a>").html(val[0]);
				me.createItem(value, val[1]);
			}
			else{
				var value = $("<a></a>").html(val);
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