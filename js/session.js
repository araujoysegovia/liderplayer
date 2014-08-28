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
	},

	createSession: function(mod){
		var jsonModel = JSON.stringify(mod);
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
	}
}