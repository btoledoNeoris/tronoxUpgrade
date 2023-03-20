/* eslint-disable strict */
sap.ui.define([], function() {
	var serverMII = {
		serverWork: "https://serverMII(DEV,QA,etc).com/",
		get: function() {
            var server;
            let base = this.serverWork != undefined ? this.serverWork : false;
            if(!base){
                server = window.location.origin;
            }
            if(base.length > 0) {
                server = this.serverWork;
            }
			return server;
		}
	};

	return serverMII;
});
