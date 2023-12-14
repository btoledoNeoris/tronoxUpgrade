sap.ui.define([
	'tronox/controller/LayerController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
	'../../../tools/handler',
],
function (LayerController,MessageBox,MessageToast,handler) {
	"use strict";
	return LayerController.extend("tronox.controller.configurations.workcenters.WorkcenterPanel", {
        PLANT: "1100",
        WORKCENTER: "LAB_____",
		onInit: function () {
            this.getWcenter();
		},
        getI18nText: function(sKey) {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            return oResourceBundle.getText(sKey);
        },
        onChange: function(oEvent){
            console.log("oC")
            // MessageToast.show("change event fired! \n Selected Item id: " + oEvent.getParameters().id);
        },
        getWcenter: function() {
            console.log("WC")
        },
        onSearch: async function(){
            const oView = this.getView();
            const oModel = this.getView().getModel();
            const Plant = this.PLANT;
            const WorkCenter = this.WORKCENTER;
            const sMaterialComboBox = this.byId("materialComboBox").getValue();
            const sMaterialInput = oView.byId("input-material").getValue();
            const Material = sMaterialInput ? sMaterialInput : sMaterialComboBox;
            const sBatchComboBox = oView.byId("batchComboBox").getValue();
            const sBatchInput = oView.byId("input-batch").getValue();
            const BatchCode = sBatchInput ? sBatchInput : sBatchComboBox;
            const StartDate = oView.byId("dateInit").getValue();
            const EndDate = oView.byId("dateEnd").getValue();

            const parameters = { Plant, WorkCenter, Material, BatchCode, StartDate, EndDate };
            console.log({ parameters })
            console.log(oServices.getResultsRecording)
            try {
                this.getView().setBusy(true);
                let getData = '../../localServices/quality/ResultsRecording.json';
                // const data = await handler.requestData(oTransactions.getEventsDetailsByArea, parameters);
               
                const data = await handler.requestData(getData, parameters);
                if (data[0]?.Row?.length === 0) {
                    MessageToast.show(this.getI18nText("messageError"), { duration: 2000 });
                    console.error(this.getI18nText("messageError"));
                } else {
                    console.log(data)
                    oModel.setProperty("/table", []);
                    console.log(oModel.getProperty("/table"));
                }
            } catch (error) {
                oModel.setProperty("/table", []);
                MessageToast.show(this.getI18nText("messageError"), { duration: 2000 });
                console.error(error);
                this.getView().setBusy(false);
            } finally {
                this.getView().setBusy(false);
            }

        }
	});
});
