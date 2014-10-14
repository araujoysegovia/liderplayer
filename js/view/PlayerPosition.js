var PlayerPosition = Backbone.View.extend({
	tag: "<div>",
	className: "",
	container: null,
	collection: null,
	constructor : function(config) {
		var self = this;
		self._ensureElement();
		config = config || {};
		_.extend(self, config);
		self.$el = $(self.tag);
		self.$el.addClass(self.className);
		self.initialize();
	},
	initialize: function(){
		var me = this;
		if(me.collection){
			var header = liderApp.getHeaders();
			me.collection.url = liderApp.server+me.collection.url;
			me.collection.fetch({
				headers: header,
				success: function(collection, response, options){
					var data = response.data;
					var panelTable = new PanelTable({
						container: me.$el,
						title: "Posiciones Jugadores",
						columns: [{
							"name": "posicion",
							"value": "#"
						},
						{
							"name": "name",
							"value": "Jugador",
							"width": "50%"
						},
						{
							"name": "Preguntas jugadas",
							"value": "PJ"
						},
						{
							"name": "win",
							"value": "PC"
						},
						{
							"name": "win whit help",
							"value": "PCA"
						},
						{
							"name": "loose",
							"value": "PI"
						},
						{
							"name": "points",
							"value": "P"
						}],
						tpl: "<td><%= fullname %></td>"+
							 "<td><%= total %></td>"+
							 "<td><%= win %></td>"+
							 "<td><%= winHelp %></td>"+
							 "<td><%= lost %></td>"+
							 "<td><%= totalPoint %></td>"
					});
					panelTable.buildTableBody(data);
				}
			})
		}
		me.render();
	},
	render: function(){
		this.container.append(this.$el);
	}
})