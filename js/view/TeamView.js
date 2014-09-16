var TeamView = Backbone.View.extend({
	tag: "<div>",
	className: "",
	collection: null,
	container: null,
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
					_.each(data, function(value, key){
						var teams = new ListPanel({
							title: value.name,
							container: me.$el,
							className: "panel-primary",
							maxHeight: 215,
							// collection: new Players(),
							tpl: "<div class='player-item-list'>"+
									"<div class='player-img'>"+
										'<img src="'+liderApp.server+'/image/<%= image %>" />'+
									"</div>"+
									"<div class='player-info'>"+
										"<h5><%= name %> <%= lastname %></h5>"+
										"<h6><span class='glyphicon glyphicon-envelope'></span>  <%= email %></h6>"+
										"<div class='games-info'>"+
											"<div class='match-info player-win'>"+
												"<img src='images/icons/win.png' style='width:20px; margin-top:-7px'/>"+
												"<span><%= wonGames %></span>"+
											"</div>"+
											"<div class='match-info player-loose'>"+
												"<img src='images/icons/loose.png' style='width:20px; margin-top:-7px;'/>"+
												"<span><%= wonGames %></span>"+
											"</div>"+
										"</div>"+
									"</div>"+					
								  "</div>"
						})
						_.each(value.players, function(val){
							teams.createItem(val);
						})
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