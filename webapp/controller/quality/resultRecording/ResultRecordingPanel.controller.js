sap.ui.define([
	'tronox/controller/LayerController',
	'tronox/model/quality/modelResultRecording',
    'tronox/model/quality/modelWorkCenter',
    'tronox/model/quality/modelMaterial',
    'tronox/model/quality/modelBatch',
    'sap/m/MessageToast',
    'sap/ui/model/json/JSONModel',
    'sap/viz/ui5/controls/VizFrame',
    'sap/viz/ui5/data/FlattenedDataset',
    'sap/m/Dialog',
    'sap/m/Button',
    'sap/ui/core/Fragment',
],
function (LayerController,modelResultRecording,modelWorkCenter,modelMaterial,modelBatch,MessageToast,JSONModel,VizFrame,FlattenedDataset,Dialog,Button,Fragment) {
	"use strict";
	return LayerController.extend("tronox.controller.configurations.workcenters.WorkcenterPanel", {
        PLANT: "1100",
        WORKCENTER: "LAB_____",

		onInit: function () {
            var oModel = new JSONModel();
            oModel.setData({ table: [] });
            this.getView().setModel(oModel);
            this.getWcenter();
		},
        getI18nText: function(sKey) {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            return oResourceBundle.getText(sKey);
        },
        onChange: function(oEvent){
            console.log("oC")
        },
        getWcenter: function() {
            console.log("WC")
        },
        onCDInspePointListChange: function(sValue) {
            var aItems = sValue ? sValue.split("||").map(function(item) {
                return { key: item };
            }) : [];

            var oModel = new JSONModel({ items: aItems });
            this.getView().setModel(oModel, "itemsModel");
        },
        createComboBoxItems: function(sId, oContext) {
            var sValue = oContext.getProperty("CD_INSPE_POINT_LIST");
            var aItems = sValue.split("||");
            return aItems.map(function(item) {
                return new sap.ui.core.Item({
                    key: item,
                    text: item
                });
            });
        },
        onSearch1: async function(){
            const oView = this.getView();
            const oModel = this.getView().getModel();
            const Plant = this.PLANT;
            const WorkCenter = this.WORKCENTER;
            const Material = oView.byId("materialComboBox").getValue();
            const BatchCode = oView.byId("batchComboBox").getValue();
            const StartDate = oView.byId("dateInit").getValue();
            const EndDate = oView.byId("dateEnd").getValue();

            const parameters = { Action:"SELECT", Plant, WorkCenter, Material, BatchCode, StartDate, EndDate };
            console.log({ parameters })
            try {
                this.getView().setBusy(true);
                const data = await modelResultRecording.loadReportResult(parameters);
                console.log({data})
                if (data[0]?.Row?.length === 0) {
                    MessageToast.show(this.getI18nText("messageError"), { duration: 2000 });
                    console.error(this.getI18nText("messageError"));
                } else {
                    console.log(data)
                    let item = (data[0]?.Row).map(itm=> {
                        console.log(itm)
                        console.log(itm.CD_INSPE_POINT_LIST)

                        if(itm.CD_INSPE_POINT_LIST) {
                            console.log("itm")
                        }
                    })

                    oModel.setProperty("/table", data[0]?.Row || []);
                }
            } catch (error) {
                MessageToast.show(this.getI18nText("messageError"), { duration: 2000 });
                console.error(error);
                this.getView().setBusy(false);
            } finally {
                this.getView().setBusy(false);
            }

        },
        onSearch: async function() {
            const oView = this.getView();
            const oModel = this.getView().getModel();
            const Plant = this.PLANT;
            const WorkCenter = this.WORKCENTER;
            const Material = oView.byId("materialComboBox").getValue();
            const BatchCode = oView.byId("batchComboBox").getValue();
            const StartDate = oView.byId("dateInit").getValue();
            const EndDate = oView.byId("dateEnd").getValue();

            const parameters = { Action: "SELECT", Plant, WorkCenter, Material, BatchCode, StartDate, EndDate };
            console.log({ parameters })
            try {
                this.getView().setBusy(true);
                const data = await modelResultRecording.loadReportResult(parameters);
                console.log({ data })
                if (data[0]?.Row?.length === 0) {
                    MessageToast.show(this.getI18nText("messageError"), { duration: 2000 });
                    console.error(this.getI18nText("messageError"));
                } else {
                    console.log(data[0]?.Row)
                    console.log(data[1]?.Row)
                    let adjustedData = data[0]?.Row.map(row => {
                        const idInspePointList = row.ID_INSPE_POINT_LIST.split("||");
                        const cdInspePointList = row.CD_INSPE_POINT_LIST.split("||");
                        const splitItems = idInspePointList.map((item, index) => {
                            return {
                                key: item,
                                text: cdInspePointList[index] || '---'
                            };
                        });

                        let selectedKey = splitItems.length > 0 ? splitItems[0].key : "";

                        return {
                            ...row,
                            CD_INSPE_POINT_LIST_ITEMS: splitItems,
                            SelectedKey: selectedKey
                        };
                    });
                    oModel.setProperty("/table", adjustedData || []);
                    oModel.setProperty("/tableSec", data[1]?.Row || []);

                }
            } catch (error) {
                MessageToast.show(this.getI18nText("messageError"), { duration: 2000 });
                console.error(error);
                this.getView().setBusy(false);
            } finally {
                this.getView().setBusy(false);
            }
        },


        /*
        *DIALOG - CHART
        */
        onShowChart: async function(oEvent, oChar) {
            const oView = this.getView();
            var oTable = oView.byId("Table");
            var iRowIndex = 0;  //For First row in the table
            var oModel = oTable.getModel();

            var length = oEvent.getSource().getModel().oData.tableSec.length
            var array = oEvent.getSource().getModel().oData.tableSec
            var datos = [];
            var model = new sap.ui.model.json.JSONModel();

            array.map(function(item) {
               if (item.ID_CHARA_MASTE === oChar){
                    var object = {CD_INSPE_POINT: item.CD_INSPE_POINT,DS_RESUL:item.DS_RESUL}
                    datos.push(object);
                }
            });
            model.setData(datos);
            this.getView().setModel(model, "chartModel");
            this.onShowChartDialog()
        },
        onShowChartDialog: async function(oEvent) {
            const oView = this.getView();
            const oModel = oView.getModel();
            const oVizFrame = new VizFrame({
                uiConfig: { applicationSet: "fiori" },
                vizType: "line",
                dataset: new FlattenedDataset({
                    dimensions: [
                        { name: "INSPECTION LOTS", value: "{CD_INSPE_POINT}"  }
                    ],
                    measures: [
                       { name: "RESULTS", value: "{DS_RESUL}" }
                    ],
                    data: {
                        path: "/"
                    }
                }),
                feeds: [{
                    uid: "valueAxis",
                    type: "Measure",
                    values: ["RESULTS"]
                }, {
                    uid: "categoryAxis",
                    type: "Dimension",
                    values: ["INSPECTION LOTS"]
                }],
                vizProperties: {
                    title: { visible: true, text: "SPC Chart" },
                    plotArea: {dataLabel: {visible: true }}
                }
            });

            try {
                this.getView().setBusy(true);
                const oModel = oView.getModel("chartModel");
                oVizFrame.setModel(oModel);
            } catch (error) {
                console.error(error);
            } finally {
                this.getView().setBusy(false);
            }

            const oDialog = new Dialog({
                contentWidth: "80%",
                contentHeight: "60%",
                content: [oVizFrame],
                beginButton: new Button({ text: "Close",press: () => oDialog.close() })
            });

            oView.addDependent(oDialog);
            oVizFrame.setWidth("100%");
            oDialog.open();
        },
        onShowChart2: async function(oEvent) {
            const oView = this.getView();
            // const sTitle = oEvent.getSource()._oTitle.getText();
            const oModel = oView.getModel();
            const oVizFrame = new VizFrame({
                uiConfig: { applicationSet: "fiori" },
                vizType: "line",
                dataset: new FlattenedDataset({
                    dimensions: [
                        { name: "Date", value: "{DATE}" },
                        { name: "Line", value: "{LINE}" }
                    ],
                    measures: [
                        { name: "Minutes" }
                    ],
                    data: {
                        path: "/datas",
                        sort: { key: "Line", descending: false }
                    }
                }),
                feeds: [{
                    uid: "valueAxis",
                    type: "Measure",
                    values: ["Minutes"]
                }, {
                    uid: "categoryAxis",
                    type: "Dimension",
                    values: ["Date"]
                }, {
                    uid: "color",
                    type: "Dimension",
                    values: ["Line"]
                }],
                vizProperties: {
                    title: { text: "" },
                    plotArea: {
                        dataLabel: {
                            visible: true
                        }
                    },
                    tooltip: {
                        visible: true,
                        customData: [
                            {
                                type: "dimension",
                                name: "Line",
                                value: "{LINE}"
                            },
                            {
                                type: "measure",
                                name: "Minutes",
                            }
                        ]
                    }
                },
            });


            try {
                this.getView().setBusy(true);
                // const data = await handler.requestData(oTransactions.getEventGraph, {});
                const data = {};
                const datas = data[0]?.Row || [];
                const oLoad = new JSONModel({ datas });
                oVizFrame.setVizProperties({ title: { text: "" } });
                oVizFrame.setModel(oLoad);
            } catch (error) {
                console.error(error);
            } finally {
                this.getView().setBusy(false);
            }

            const oDialog = new Dialog({
                contentWidth: "80%",
                contentHeight: "80%",
                content: [oVizFrame],
                beginButton: new Button({ text: "Close",press: () => oDialog.close() })
            });

            oView.addDependent(oDialog);
            oVizFrame.setWidth("100%");
            oDialog.open();
        },
        onComboBoxSelectionChange: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("value");
            var oSelectedKey = oEvent.getSource().getSelectedKey();
            if (!oSelectedItem) { return }

            var oContext = oEvent.getSource().getBindingContext();
            var selectedLot = oEvent.getSource().getBindingContext().getObject().ID_INSPE_LOT;
            console.log({selectedLot,oSelectedKey})

            var oModel = this.getView().getModel();
            var tableDetails = oModel.getProperty("/tableSec");

            var matchingItems = tableDetails.filter(item => {
                return item.ID_INSPE_LOT === selectedLot && item.ID_INSPE_POINT === oSelectedKey;
            });

            var resultsMapping = {};

            if (matchingItems.length > 0) {
                matchingItems.forEach(item => {
                    resultsMapping[item.ID_CHARA_MASTE] = item.DS_RESUL;
                });

                oContext.getModel().setProperty(oContext.getPath() + "/resultsMapping", resultsMapping);
            } else {
                MessageToast.show(this.getI18nText("messageErrorSel"), { duration: 2000 });
            }
        },
        getDynamicResult: function(sResult) {
            if(!sResult) { return }
            if (sResult === "---") { return ""}
            var number = parseFloat(sResult);
            if (!isNaN(number) && typeof number !== 'string') {
                return number.toFixed(2);
            } else { return sResult }
        },
        getStyle: function(sColor) {
            console.log("getStyle", sColor);
            // return `background-color: ${sColor};`;
            return "background-color:" + sColor + ";";
        },


        /*
        *DIALOG - WORK CENTER SELECTION
        */
        onWorkCenterChange: function(){
            this.onGetWorkCenterList()
            //this.onOpenWorkCenterDialog().open();
        },
        onGetWorkCenterList: async function() {
            const oView = this.getView();
            const oModel = this.getView().getModel();
            const parameters = { Action: "SELECT"};

            try{
                this.getView().setBusy(true);
                const data = await modelWorkCenter.loadWorkCenterList(parameters);

                if (data[0]?.Row?.length === 0) {
                    MessageToast.show(this.getI18nText("messageError"), { duration: 2000 });
                    console.error(this.getI18nText("messageError"));
                } else {
                    oModel.setProperty("/", data[0]?.Row || []);
                    this.onOpenWorkCenterDialog().open();
                }

             } catch (error) {
                MessageToast.show(this.getI18nText("messageError"), { duration: 2000 });
                console.error(error);
                this.getView().setBusy(false);
            } finally {
                this.getView().setBusy(false);
            }
        },
        onOpenWorkCenterDialog: function(){
            if (!this.oDialog) {
                this.oDialog = sap.ui.xmlfragment("idWorkCenterDialog", "tronox.view.fragments.workCenter", this);
                this.getView().addDependent(this.oDialog);
            }
            return this.oDialog;
        },
        onCloseWorkCenterDialog: function() {
            this.oDialog.close();
            this.oDialog.destroy();
            this.oDialog = null;
        },
        onWorkCenterSelected:function(event){
            const oView = this.getView();
            const oPath = event.getSource().getSelectedContexts()[0].sPath
            var oWorkCenterPath = [], oParentPath;
            var myPath = [];
            this.ROUTEPATH = "";

            oWorkCenterPath = oPath.split("nodes")
            oWorkCenterPath.forEach(function(item, i){
                  if(i>0){
                        myPath.push(myPath[i-1]+"nodes" + item)
                    }else{
                         myPath.push(item)
                    }
                    this.ROUTEPATH = this.ROUTEPATH == "" ?  oView.getModel().getProperty(myPath[i]).text : this.ROUTEPATH + " > "+ oView.getModel().getProperty(myPath[i]).text;
                }, this);

            this.WORKCENTER = oView.getModel().getProperty(oPath).text
        },
         onSelectWorkCenterDialog: function() {
            const oView = this.getView();
            oView.byId("wkInput").setValue(this.ROUTEPATH);
            this.oDialog.close();
            this.oDialog.destroy();
            this.oDialog = null;
            this.onGetMaterialList(this.WORKCENTER);
        },

        /*
        *COMBOBOX - MATERIAL
        */
        onGetMaterialList: async function(oWorkCenter) {
            const oView = this.getView();
            const oModel = this.getView().getModel();
            const parameters = { Action: "SELECT"};

            try{
                this.getView().setBusy(true);
                const data = await modelMaterial.loadMaterialList(parameters);

                if (data[0]?.Row?.length === 0) {
                    MessageToast.show(this.getI18nText("messageError"), { duration: 2000 });
                    console.error(this.getI18nText("messageError"));
                } else {
                    oModel.setProperty("/mtsd", data[0]?.Row || []);
                }

             } catch (error) {
                MessageToast.show(this.getI18nText("messageError"), { duration: 2000 });
                console.error(error);
                this.getView().setBusy(false);
            } finally {
                this.getView().setBusy(false);
            }
        },
        onMaterialComboBoxChange:function(oEvent){
            var oSelectedKey = oEvent.getSource().getSelectedKey();
            console.log(oSelectedKey)
            this.onGetBatchList();
        },

        /*
        *COMBOBOX - BATCH
        */
         onGetBatchList: async function(oMaterial) {
            const oView = this.getView();
            const oModel = this.getView().getModel();
            const parameters = { Action: "SELECT"};

            try{
                this.getView().setBusy(true);
                const data = await modelBatch.loadBatchList(parameters);

                if (data[0]?.Row?.length === 0) {
                    MessageToast.show(this.getI18nText("messageError"), { duration: 2000 });
                    console.error(this.getI18nText("messageError"));
                } else {
                    oModel.setProperty("/batchs", data[0]?.Row || []);
                }

             } catch (error) {
                MessageToast.show(this.getI18nText("messageError"), { duration: 2000 });
                console.error(error);
                this.getView().setBusy(false);
            } finally {
                this.getView().setBusy(false);
            }
        },
        onBatchComboBoxChange:function(oEvent){
            var oSelectedKey = oEvent.getSource().getSelectedKey();
        }
    });
});
