sap.ui.define([
    'tronox/controller/LayerController',
    "sap/ui/model/json/JSONModel",
    "../../../tools/handler",
    'sap/ui/core/Fragment',
    'sap/m/MessageToast'
  ],
    function (LayerController, JSONModel, handler, Fragment, MessageToast) {
      "use strict";

      return LayerController.extend("tronox.controller.configurations.workcenters.WorkcenterPanel", {
        onInit: function () {
          this.getWcenter();
          this.getTree();
          this._loadDetailsFragment();
        },
        onAfterRendering: async function() {
          let title = await this.getPlant();
          let setPLant = this.byId("idPlant");
          setPLant.setText(title);
          this.getSelWorkcenter();
          this.getWorkcenters();

        },
        getPlant: async function () {
          let getPlant = '../../localServices/configurations/PlantByUserSelectQuery.json';
          let parameters = {};
          try{
            const data = await handler.requestData(getPlant, parameters);
            const [textPlant, idPlnt] = [data[0].Row[0].DS_PLANT, data[0].Row[0].ID_PLANT];
            return textPlant;
          }catch(err){
            console.error(err);
          }
        },
        getWcenter: async function () {
          let getWorkcenterTree = '../../localServices/configurations/WorkCenterDetailSelectQuery.json';
          let parameters = {};
          try{
            const data = await handler.requestData(getWorkcenterTree, parameters);
          }catch(err){
            console.error(err);
          }
        },
        getTree: async function(){
          let getTree = '../../localServices/configurations/workcenters/WorkcentersLevels.json';
          let parameters = {};
          const oModel = new JSONModel();

          try{
            const data = await handler.requestData(getTree, parameters);
            oModel.setData(data[0].Row);

            this.getView().setModel(oModel);

          }catch(err){
            console.error(err);
          }
        },
        _loadDetailsFragment: async function() {
            if (!this.oDetailsFragment) {
                try {
                    this.oDetailsFragment = await Fragment.load({
                        id: "myFragment",
                        name: "tronox.view.configurations.workcenters.FormDetails",
                        controller: this
                    });
                } catch (error) {
                    console.error(error);
                }
                this._resetSelectedItem();
                this._updateFlexibleColumnLayout(sap.f.LayoutType.TwoColumnsMidExpanded);
            }
        },
        onRowSelectionChange: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("rowContext").getObject();
            var oModel = this.getView().getModel();

            oModel.setProperty("/selectedItem", oSelectedItem);

            this._updateFlexibleColumnLayout(sap.f.LayoutType.TwoColumnsMidExpanded);
        },
        _resetSelectedItem: function() {
            var oModel = this.getView().getModel();
            oModel.setProperty("/selectedItem", { text:"",order:"",level:"",gParent:"",gId:"" });
        },
        _updateFlexibleColumnLayout: function(layoutType) {
            var oFlexibleColumnLayout = this.byId("flexibleColumnLayout");
            var i18nModel = this.getView().getModel("i18n");
            var oMidColumnPage = new sap.m.Page({
                content: [this.oDetailsFragment],
                showHeader: true,
                customHeader: new sap.m.Bar({
                    contentMiddle: [new sap.m.Label({ text: i18nModel.getProperty("workcenterConfigurationTitle") })]
                })
            });

            oFlexibleColumnLayout.removeAllMidColumnPages();
            oFlexibleColumnLayout.addMidColumnPage(oMidColumnPage);
            oFlexibleColumnLayout.setLayout(layoutType);
        },
        async getDataAndUpdateModel({ defaultObject, transactionHandler, parameters, modelProperty }) {
          const oModel = this.getView().getModel();

          try {
            const data = await handler.requestData(transactionHandler, parameters);
            if (!data[0] || !data[0].Row || !Array.isArray(data[0].Row) || data[0].Row.length === 0) {
              console.error('No data.');
              MessageToast.show("No data.");
              oModel.setProperty(modelProperty, [defaultObject]);

              return;
            }
            console.log(data)
            const arrayData = [defaultObject, ...data[0].Row];
            oModel.setProperty(modelProperty, arrayData);
          } catch (error) {
            console.error(error);
          }
        },
        getSelWorkcenter: async function () {
          let getSelectedWorkcenters = '../../localServices/configurations/workcenters/WorkcenterTable.json';
          await this.getDataAndUpdateModel({
            defaultObject: { ID: "-1", DESCRIPTION: "Seleccione" },
            transactionHandler: getSelectedWorkcenters,
            parameters: {},
            modelProperty: "/wcs"
          });
        },
        getWorkcenters: async function () {
            let getSelectedWorkcenters = '../../localServices/configurations/workcenters/WorkcenterTable.json';
            let parameters = {};
            const oModel = new JSONModel();
            try{
                const data = await handler.requestData(getSelectedWorkcenters, parameters);
                oModel.setData(data[0].Row);
                console.log({data})
                const oTable = this.getView().byId("table");
                oTable.setModel(oModel);

              }catch(err){
                console.error(err);
              }
        },
        onAdd: function(){
          MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("MessageAdd"))
        },
        onUpdate: function(){
          MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("MessageUpdate"))
        },
        onDelete: function(){
          MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("MessageDelete"))
        },
        onCancel: function() {
          var oFlexibleColumnLayout = this.byId("flexibleColumnLayout");
          oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
        },
        onExit: function() {
          if (this._oDetailsFragment) {
            this._oDetailsFragment.destroy();
            this._oDetailsFragment = null;
          }
        },
      });
    });
