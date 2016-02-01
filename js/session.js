var Session = function(){
	if(typeof this.constructor == 'function'){
		this.constructor.apply(this, arguments);
	}
}
Session.prototype = {
	sessionName: 'user',
	constructor : function(config) {
		var me = this;
		config = config || {};
		_.extend(this, config);
		_.extend(me, Backbone.Events);

	},

	createSession: function(mod){
		var me = this;
		var jsonModel = JSON.stringify(mod);
		me.trigger("createSession", mod);
		localStorage[this.sessionName] = jsonModel;
	},

	updateSession: function(obj){
		var session = JSON.parse(localStorage[this.sessionName]);
		session['user'] = obj;
		localStorage[this.sessionName] = JSON.stringify(session);
	},

	deleteSession: function(){
		localStorage.clear();
	},

	getToken: function(){
		var ses =  JSON.parse(localStorage[this.sessionName]);
		return ses.token;
	},

	getConfig: function(){
		var ses =  JSON.parse(localStorage[this.sessionName]);
		return ses.config;
	},

	getUser: function(){
		var ses =  JSON.parse(localStorage[this.sessionName]);
		return ses.user;
	},

	isCreated: function(){
		return localStorage[this.sessionName] ? true : false;
	},
	verificateChangePassword: function(){
		var ses =  JSON.parse(localStorage[this.sessionName]);
		return ses.user.changePassword;
	},
	setChangePassword: function(){
		var ses =  JSON.parse(localStorage[this.sessionName]);
		ses.user.changePassword = false;
		this.updateSession(ses.user);
	},
	getEffectiveness: function(){
		var ses =  JSON.parse(localStorage[this.sessionName]);
		if(ses.user.counteffectiveness > 0){
			return (ses.user.wineffectiveness*100)/ses.user.counteffectiveness
		}
		return 0;
	},
	addQuestion: function(ok){
		var ses =  JSON.parse(localStorage[this.sessionName]);
		if(!ses.user.counteffectiveness){
			ses.user.counteffectiveness = 0;	
		}
		ses.user.countEffectiveness ++;	
		if(ok){
			if(!ses.user.wineffectiveness){
				ses.user.wineffectiveness = 0;	
			}
			ses.user.wineffectiveness ++;
		}
		this.updateSession(ses.user);
		
	}
}