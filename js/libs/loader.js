(function ($) {
	var pluginName = "loaderPanel";
	
	var loaderClass = function(element, options) {
		this._settings = options;
        this.$element = $(element);
        this.init();
    };   
	    
	loaderClass.prototype = {
		_mainDiv: null,
		init: function() {
			var me = this;
			me._mainDiv = me.createLoaderDiv();
			this.$element.append(me._mainDiv);
		},
		createLoaderDiv: function(){
			var me = this;
	    	 return $('<div></div>')
	    	 	.addClass("loader-main")
	    	 	.css("position", "absolute")
	    	 	.css("top", "0px")
	    	 	.css("width", "100%")
	    	 	.css("height", "100%")
	    	 	.css("background-color", "#888")
	    	 	.css("display", "none")
	    	 	.css("z-index", "1000000")
	    	 	.append(me.createMessaje());  	
	    },
	    createMessaje: function(){
	    	var me = this;
	    	 var msgDiv = $('<center></center>')
	    	 	.css("position", "relative")
	    	 	.css("top", "45%")
	    	 	.css("color", "#FFFFFF")
	    	 	.html(me._settings.message);	    	 
	    	 return msgDiv;
	    },
	    show: function(){
	    	var me = this;
	    	$(me._mainDiv).css("opacity", "0");
	    	$(me._mainDiv).css("display", "block");
	    	$(me._mainDiv).fadeTo(300, 0.7);
	    },
	    hide: function(){
	    	var me = this;
	    	$(me._mainDiv).fadeTo(300, 0, function(){
	    		$(me._mainDiv).css("display", "none");
	    		$(me._mainDiv).remove();
	    	});
	    	//$(me._mainDiv).hide(800);
	    }
	};	
	
	$.fn[pluginName] = function (options) {
		var settings = $.extend({
            message: "Loading...",
        }, options );	 	
    	return new loaderClass(this, settings);
	}   
	
    $.fn[pluginName].Constructor = loaderClass;	
	
})(jQuery);