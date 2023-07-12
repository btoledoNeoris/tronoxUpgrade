sap.ui.define([
	'tronox/controller/LayerController',
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast',
	"../../../tools/handler",
	'sap/ui/core/Fragment',
],
	function (LayerController, JSONModel, MessageToast, handler, Fragment) {
		"use strict";
        var idPlnt;
		return LayerController.extend("tronox.controller.configurations.workcenters.WorkcenterPanel", {
			onInit: async function () {
                let title = await this.getPlant();
				this.getWcenter();
                let setPLant = this.byId("idPlant");
                setPLant.setText(title);
				this._formFragments = {};
				// this._showFormFragment("Display");
			},
            onAfterRendering: function() {

            },
			onChange: function (oEvent) {
				console.log(oEvent.getParameters())
				// MessageToast.show("change event fired! \n Selected Item id: " + oEvent.getParameters().id);
			},
			getPlant: async function () {
                let getPlant = '../../localServices/configurations/PlantByUserSelectQuery.json';
                let parameters = {};
                try{
                    // const data = await handler.requestData(oServices.getPlant, parameters);
                    const data = await handler.requestData(getPlant, parameters);
                    const [textPlant,idPlnt] = [data[0].Row[0].DS_PLANT,data[0].Row[0].ID_PLANT];
                    console.log(textPlant)
                    return textPlant;
                }catch(err){
                    console.error(err);
                }
			},
			getWcenter: async function () {
				let getWorkcenterTree = '../../localServices/configurations/WorkCenterDetailSelectQuery.json';
                let parameters = {};
                try{
                    // const data = await handler.requestData(oServices.getWorkcenterTree, parameters);
                    const data = await handler.requestData(getWorkcenterTree, parameters);
                    console.log({data})
                }catch(err){
                    console.error(error);
                }
			},
			onOpenDialog: function () {

				// create dialog lazily
				if (!this.pDialog) {
					this.pDialog = this.loadFragment({
						name: "tronox.view.configurations.workcenters.HelloDialog"
					});
				}
				this.pDialog.then(function (oDialog) {
					oDialog.open();
				});
			},

			onCloseDialog: function () {
				// note: We don't need to chain to the pDialog promise, since this event-handler
				// is only called from within the loaded dialog itself.
				this.byId("helloDialog").close();
			},

			handleEditPress: function () {

				//Clone the data
				this._oSupplier = Object.assign({}, this.getView().getModel().getData().SupplierCollection[0]);
				this._toggleButtonsAndView(true);

			},

			handleCancelPress: function () {

				//Restore the data
				var oModel = this.getView().getModel();
				var oData = oModel.getData();

				oData.SupplierCollection[0] = this._oSupplier;

				oModel.setData(oData);
				this._toggleButtonsAndView(false);

			},

			handleSavePress: function () {

				this._toggleButtonsAndView(false);

			},

			_getFormFragment: function (sFragmentName) {
				console.log({ sFragmentName })
				var pFormFragment = this._formFragments[sFragmentName];
				var oView = this.getView();
				console.log({ pFormFragment })
				if (!pFormFragment) {
					pFormFragment = Fragment.load({
						id: oView.getId(),
						name: "tronox.view.configurations.workcenters." + sFragmentName
					});
					this._formFragments[sFragmentName] = pFormFragment;
				}

				return pFormFragment;
			},

			_showFormFragment: function (sFragmentName) {
				var oPage = this.byId("configurationsListPage");

				// oPage.removeAllContent();
				this._getFormFragment(sFragmentName).then(function (oVBox) {
					oPage.insertContent(oVBox);
				});
			}




		});
	});
