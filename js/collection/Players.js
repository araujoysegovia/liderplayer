var Players = Backbone.Collection.extend({
	url: "/home/player/team",
	model: Player,
	// sync: function(method, model, options) {
	// 	var me = this;
	// 	console.log(options);
 //        var _success = options.success;
 //        $.ajax({
 //        	headers: options.headers,
 //            type: "GET",     
 //            contentType: 'application/json',
 //            dataType: "json",
	// 		url: liderApp.server+me.url,
 //            success: function(data) {
 //                _success(data);
 //            }
 //        });
 //    }
	// initialize: function(){
	// 	console.log(this.url);
	// 	// this.fetch();
	// }
})