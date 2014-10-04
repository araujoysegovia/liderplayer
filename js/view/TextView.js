var TextView = Backbone.View.extend({
	tag: "<div>",
	container: null,
	baseCls: "panel panel-default",
	className: "",
	text: "",
	constructor : function(config) {
		var self = this;
		self._ensureElement();
		config = config || {};
		_.extend(self, config);
		self.$el = $(self.tag);
		self.$el.addClass(self.baseCls);
		self.$el.addClass(self.className);
		self.initialize();
	},
	initialize: function(){
		var me = this;
		var heading = $("<div></div>").addClass("panel-heading").html("Ayuda");
		var body = $("<div></div>").addClass("panel-body");
		// var p = $("<p></p>").html(me.text);
		var frame = $("<iframe></iframe>").attr("src", "https://docs.google.com/document/d/1ZZxvwtkJ0RhMyTr38knDDre7O7BX5_wwfDHJUA2rCec/pub?embedded=true").attr("width", "100%").attr("height", "100%");
		me.$el.append(heading).append(body.append(frame));
		me.render();
	},
	render: function(){
		this.container.append(this.$el);
	}
})