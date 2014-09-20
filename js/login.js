$(document).ready(function(){
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	    po.src = 'https://apis.google.com/js/client:plusone.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	var form = $("form", ".login-form");
	form.submit(function(e){
		e.preventDefault();
		var loader = $(document.body).loaderPanel();
		loader.show();
		$.ajax({
		  	type: "GET",     
			url: liderApp.server+"/login",
			data: {
				user: form.find("input[type=email]").val(),
				pass: form.find("input[type=password]").val()
			},
			//contentType: 'application/json',
            //dataType: "json",
			success: function(data){
				liderApp.session.createSession(data);
				window.location = "#home";
				// Backbone.history.navigate("home", true);
			},
			error: function(xhr, status, error) {
		    	try{
		    		liderApp.session.deleteSession();
			    	var obj = jQuery.parseJSON(xhr.responseText);
			    	var n = noty({
			    		text: obj.message,
			    		timeout: 1000,
			    		type: "error"
			    	});
		    	}catch(ex){

		    		var n = noty({
			    		text: "Error",
			    		timeout: 1000,
			    		type: "error"
			    	});
		    	}

	    	},
	    	complete: function(){
	    		loader.hide();
	    	}
		});
	})
})

function signinCallback(authResult) {
	
	  if(authResult['access_token']) {
		  var formData = new FormData();
		  formData.append("access_token", authResult['access_token']);
		  formData.append("code", authResult['code']);
		  formData.append("authenticated", true)
		  
		  // var form = $("form", ".login-form");
		  // form.attr("action", "login-check/google");
		  // form.append($("<input>")
				//   .attr("type", "hidden")
				//   .attr("name", "access_token")
				//   .attr("value", authResult['access_token']));
		  // form.append($("<input>")
				//   .attr("type", "hidden")
				//   .attr("name", "code")
				//   .attr("value", authResult['code']));
		  
		  // form.submit();
		  var loader = $(document.body).loaderPanel();
		  loader.show();
		  $.ajax({
		  	type: "POST",     
			url: liderApp.server+"/login/google",
			data: formData,
			contentType: false,
            processData: false,
			//contentType: 'application/json',
            //dataType: "json",
            statusCode: {
                302: function(jqXHR) {
                    console.log(jqXHR)
                }
            },
            success: function(data){
				liderApp.session.createSession(data);
				Backbone.history.navigate("home", true);
			},
			error: function(xhr, status, error) {	
//				loader.hide();
//		    	try{
//			    	var obj = jQuery.parseJSON(xhr.responseText);
//	            	$.notify(obj.message, { 
//	            		className:"error", 
//	            		globalPosition:"top center" 
//	            	});
//		    	}catch(ex){
//		    		$.notify("Error", { 
//	            		className:"error", 
//	            		globalPosition:"top center" 
//	            	});
//		    	}
	    	},
	    	complete: function(){
	    		loader.hide();
	    	}
		});
		  
	  } else if (authResult['error']) {
	    // Se ha producido un error.
	    // Posibles códigos de error:
	    //   "access_denied": el usuario ha denegado el acceso a la aplicación.
	    //   "immediate_failed": no se ha podido dar acceso al usuario de forma automática.
	    // console.log('There was an error: ' + authResult['error']);
	  }
}
