var ListPanel = Backbone.View.extend({
	tag:"<div>",
	baseCls: "panel panel-list",
	className: "",
	title:null,
	container: null,
	list: null,
	maxHeight: null,
	collection: null,
	tpl: null,
	constructor : function(config) {
		var self = this;
		self._ensureElement();
		config = config || {};
		_.extend(self, config);
		self.$el = $(self.tag);
		self.$el.addClass(self.baseCls);
		self.$el.addClass(self.className);
		self.list = $("<ul></ul>").addClass("panel-list-list");
		self.initialize();
	},
	initialize: function(){
		var me = this;
		var heading = $("<div></div>").addClass("panel-heading");
		heading.html(this.title);
		var body = $("<div></div>").addClass("panel-body");
		if(me.maxHeight){
			body.css("max-height", me.maxHeight);
		}
		body.append(this.list);
		this.$el.append(heading).append(body);
		this.render();		
		if(me.collection){
			var header = liderApp.getHeaders();
			me.collection.url = liderApp.server+me.collection.url;
			me.collection.fetch({
				headers: header,
				success: function(collection, response, options){
					var data = response.data;
					_.each(data, function(value, key){
						me.createItem(value);
					})
				},
				
			})
		}
		
	},
	render: function(){
		this.container.append(this.$el);
	},
	createItem: function(rec){
		var me = this;
		var template = _.template(me.tpl);
		var html = template(rec);
		var li = $("<li></li>");
		li.append(html);
		this.list.append(li);
	}
})