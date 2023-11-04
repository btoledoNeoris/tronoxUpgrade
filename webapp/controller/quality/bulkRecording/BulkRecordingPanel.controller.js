sap.ui.define([
	'tronox/controller/LayerController',
	"sap/ui/model/json/JSONModel",
    'sap/m/MessageToast'
],
function (LayerController,JSONModel,MessageToast) {
	"use strict";
	return LayerController.extend("tronox.controller.configurations.workcenters.WorkcenterPanel", {
		onInit: function () {
            this.getPlant();
            this.getWcenter();
		},
        onChange: function(oEvent){
            console.log(oEvent.getParameters())
            // MessageToast.show("change event fired! \n Selected Item id: " + oEvent.getParameters().id);
        },
        getPlant: function() {
            let plant = '1100';
            console.log({plant})
        },
        getWcenter: function() {
           console.log('getWcenter')
        },
        onSearch: function(){
            console.log('search data')
        }
	});
});
