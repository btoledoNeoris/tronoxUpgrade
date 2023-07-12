sap.ui.define([
	'tronox/controller/LayerController',
	"sap/ui/model/json/JSONModel",
    'sap/m/MessageToast',
	"../../tools/build",
],
function (LayerController,JSONModel,MessageToast,serverMII) {
	"use strict";
	return LayerController.extend("tronox.controller.configurations.ConfigurationsList", {
		onInit: function () {
            this.getPlant();
            this.getWcenter();
		},
        onChange: function(oEvent){
            console.log(oEvent.getParameters())
            MessageToast.show("change event fired! \n Selected Item id: " + oEvent.getParameters().id);
        },
        getPlant: function() {
            let plant = '1100';
            let url = serverMII.getEnv() == "LOCAL"
                ? '../../localServices/configurations/PlantByUserSelectQuery.json'
                : serverMII.get() + getTrx.getPlantByUserSelectQuery;
            var data = [];

            var oModel = new JSONModel(url);
            oModel.loadData(url, {"Param.1": plant}, true, "POST");
            oModel.attachRequestCompleted(function() {
                let allRes = oModel.getData().Rowsets.Rowset[0].Row;
                console.log({allRes})
                allRes.map(itm => { data.push(itm) })
                console.log({data})
                oModel.setData(data);
                console.log(oModel)
                // this.getView().setModel(oModel);

            }.bind(this))

        },
        getWcenter: function() {
            let url = serverMII.getEnv() == "LOCAL" ? '../../localServices/configurations/WorkCenterDetailSelectQuery.json' : serverMII.get() + getTrx.getWorkCenterDetailSelectQuery;
			console.log({url})
            var data = [];

            var oModel = new JSONModel(url);
            oModel.loadData(url, {}, true, "POST");
            oModel.attachRequestCompleted(function() {
                let allRes = oModel.getData().Rowsets.Rowset[0].Row;
                allRes.map(itm => { data.push(itm) })
                oModel.setData(data);
                this.getView().setModel(oModel);

            }.bind(this))
        }
	});
});
