/* eslint-disable strict */
sap.ui.define([], function() {
	var serverMII = {
		serverWork: "http://10.160.96.21:50000/",
        env: "LOCAL",
		get: function() {
            var server;
            let base = this.serverWork != undefined ? this.serverWork : false;
            if(!base){
                server = window.location.origin;
            }
            if(base.length > 0 && this.env != "LOCAL") {
                server = this.serverWork;
            }
            if(this.env == "LOCAL") {
                server = '../../localServices/';
            }
			return server;
		},
        getEnv: function() {
            return this.env;
        }
	};

	return serverMII;
});
