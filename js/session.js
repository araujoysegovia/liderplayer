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
		sessionStorage[this.sessionName] = jsonModel;
	},

	updateSession: function(obj){
		var session = JSON.parse(sessionStorage[this.sessionName]);
		session['user'] = obj;
		sessionStorage[this.sessionName] = JSON.stringify(session);
	},

	deleteSession: function(){
		sessionStorage.clear();
	},

	getToken: function(){
		var ses =  JSON.parse(sessionStorage[this.sessionName]);
		return ses.token;
	},

	getUser: function(){
		var ses =  JSON.parse(sessionStorage[this.sessionName]);
		return ses.user;
	},

	isCreated: function(){
		return sessionStorage[this.sessionName] ? true : false;
	},
	verificateChangePassword: function(){
		var ses =  JSON.parse(sessionStorage[this.sessionName]);
		return ses.user.changePassword;
	},
	setChangePassword: function(){
		var ses =  JSON.parse(sessionStorage[this.sessionName]);
		ses.user.changePassword = false;
		this.updateSession(ses.user);
	},
	getEffectiveness: function(){
		var ses =  JSON.parse(sessionStorage[this.sessionName]);
		if(ses.user.countEffectiveness > 0){
			return (ses.user.winEffectiveness*100)/ses.user.countEffectiveness
		}
		return 0;
	},
	addQuestion: function(ok){
		var ses =  JSON.parse(sessionStorage[this.sessionName]);
		if(!ses.user.countEffectiveness){
			ses.user.countEffectiveness = 0;	
		}
		ses.user.countEffectiveness ++;	
		if(ok){
			if(!ses.user.winEffectiveness){
				ses.user.winEffectiveness = 0;	
			}
			ses.user.winEffectiveness ++;
		}
		this.updateSession(ses.user);
		
	}
}