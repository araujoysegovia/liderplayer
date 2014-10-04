var TeamPosition = Backbone.View.extend({
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
					_.each(data, function(value){
						var panelTable = new PanelTable({
							container: me.$el,
							title: value.name,
							columns: [{
								"name": "posicion",
								"value": "#"
							},
							{
								"name": "name",
								"value": "Equipo",
								"width": "50%"
							},
							{
								"name": "total",
								"value": "PJ"
							},
							{
								"name": "win",
								"value": "PG"
							},
							{
								"name": "loose",
								"value": "PP"
							},
							{
								"name": "points",
								"value": "P"
							}],
							tpl: "<td><%= name %></td>"+
								 "<td><%= total %></td>"+
								 "<td><%= win %></td>"+
								 "<td><%= loose %></td>"+
								 "<td><%= points %></td>"
						});
						panelTable.buildTableBody(value.teams);
					})
				}
			})
		}
		me.render();
	},
	render: function(){
		this.container.append(this.$el);
	}
})