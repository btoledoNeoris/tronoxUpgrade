sap.ui.define([
	"tronox/controller/LayerController"
], function (LayerController) {
	"use strict";

	return LayerController.extend("tronox.controller.Home", {


		onDisplayNotFound : function () {
			this.getRouter().getTargets().display("notFound", { fromTarget : "home" });
		},
		onNavToWorkcenters : function (){
			this.getRouter().navTo("workcenterPanel");
		},
		onNavToInspection : function (){
			this.getRouter().navTo("inspectionPanel");
		}



		// onNavToConfigurations : function (){
		// 	this.getRouter().navTo("configurationsGrid");
		// },
		// onNavToQuality : function (){
		// 	this.getRouter().navTo("qualityList");
		// }
	});

});
