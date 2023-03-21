sap.ui.define([
	"tronox/controller/LayerController"
], function (LayerController) {
	"use strict";

	return LayerController.extend("tronox.controller.Home", {


		onDisplayNotFound : function () {
			this.getRouter().getTargets().display("notFound", { fromTarget : "home" });
		},
		// Configurations
		onNavToWorkcenters : function (){
			this.getRouter().navTo("workcenterPanel");
		},
		onNavToInspection : function (){
			this.getRouter().navTo("inspectionPanel");
		},
		onNavToMaterial : function (){
			this.getRouter().navTo("materialPanel");
		},
		onNavToCharacteristic : function (){
			this.getRouter().navTo("characteristicPanel");
		},
		onNavToRule : function (){
			this.getRouter().navTo("rulePanel");
		},
		onNavToActionCatalog : function (){
			this.getRouter().navTo("actionCatalogPanel");
		},

		// Quality
		onNavToUsage : function (){
			this.getRouter().navTo("usagePanel");
		},
		onNavToStatistic : function (){
			this.getRouter().navTo("statisticPanel");
		},
		onNavToAlarm : function (){
			this.getRouter().navTo("alarmPanel");
		},
		onNavToDashboard : function (){
			this.getRouter().navTo("dashboardPanel");
		},
		onNavToLotBatch : function (){
			this.getRouter().navTo("lotBatchPanel");
		},
		onNavToResultRecording : function (){
			this.getRouter().navTo("resultRecordingPanel");
		},
		onNavToBulkRecording : function (){
			this.getRouter().navTo("bulkRecordingPanel");
		},
		onNavToSampleDashboard : function (){
			this.getRouter().navTo("sampleDashboardPanel");
		}

		// onNavToConfigurations : function (){
		// 	this.getRouter().navTo("configurationsGrid");
		// },
		// onNavToQuality : function (){
		// 	this.getRouter().navTo("qualityList");
		// }
	});

});
