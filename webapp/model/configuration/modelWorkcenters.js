sap.ui.define([
    "../../tools/handler",
], function(handler) {
	"use strict";
    var env = 0; // 0 tests environment / 1 PRD environment
    var urlBaseXqt = function (service) {
        return `/XMII/Illuminator?service=Query&QueryTemplate=${service}&Content-Type=text/json`;
    };
	return {
        loadTreeWorkcenter: function(parameters){
            var getLocalData = '../../localServices/Configurations/workcenters/HIERACHY_TREE.json';
            var getData = urlBaseXqt('Tronox/Quality/Xacute/RecordResultsXacuteQuery');
            var getDataUrl = env ? getData : getLocalData;
            var oModel = handler.requestData(getDataUrl,parameters);
            console.log("Model workcenters: " + oModel)
            return oModel
        }
    };
});

