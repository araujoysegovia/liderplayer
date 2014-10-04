var PanelTable = Backbone.View.extend({
	tag: "<div>",
	baseCls: "panel panel-default",
	className: "",
	title: null,
	columns: [],
	container: null,
	table: null,
	counter: true,
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
		_.each(me.columns, function(val){
			var th = $("<th></th>").html(val['value']).css("width", val['width']);
			tr.append(th);
		})
		me.$el.append(heading).append(me.table.append(headingTable.append(tr)));
		me.render();
	},
	render: function(){
		this.container.append(this.$el);
	},

	buildTableBody: function(data){
		var me = this;
		var tbody = $("<tbody></tbody>");
		var count = 1;
		_.each(data, function(value){
			var tr = $("<tr></tr>");
			if(me.counter)
			{
				var td = $("<td></td>").html(count);
				tr.append(td);
				count ++;
			}
			var template = _.template(me.tpl);
			
			var html = template(value);
			tr.append(html);
			tbody.append(tr);
		})
		me.table.append(tbody);
	}
})