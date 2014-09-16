var Players = Backbone.Collection.extend({
	url: "/home/player/positions",
	model: Player
})