var TablePosition = Backbone.View.extend({
	tag: "<div>",
	baseCls: "panel panel-default",
	className: "",
	title: null,
	container: null,
	collection: null,
	columnHeader: {},
	table: null,
	tpl: null,
	constructor : function(config) {
		var self = this;
		self._ensureElement();
		config = config || {};
		_.extend(self, config);
		self.$el = $(self.tag);
		self.$el.addClass(self.baseCls);
		self.$el.addClass(self.className);
		self.table = $("<table></table>").addClass("table");
		self.initialize();
	},
	initialize: function(){
		var me = this;
		var heading = $("<div></div>").addClass("panel-heading").html(this.title);
		var headingTable = $("<thead></thead>");
		var tr = $("<tr></tr>");
		_.each(me.columnHeader, function(val, key){
			var th = $("<th></th>").html(key);
			tr.append(th);
		})
		me.$el.append(heading).append(me.table.append(headingTable.append(tr)));

		if(me.collection){
			var header = liderApp.getHeaders();
			me.collection.url = liderApp.server+me.collection.url;
			me.collection.fetch({
				headers: header,
				success: function(collection, response, options){
					var data = response.data;
				}
			})
		}
		me.createItem();
		me.render();
	},
	render: function(){
		this.container.append(this.$el);
	},
	createItem: function(){
		var me = this;
		var template = _.template(me.tpl);
		this.table.append(template);
	}
})