sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "../tools/build"
], function (Controller,serverMII) {
	"use strict";

	return Controller.extend("tronox.controller.App", {

		onInit: function () {
            console.log(serverMII.get())
		}
	});

});
