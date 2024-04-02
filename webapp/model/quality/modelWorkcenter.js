sap.ui.define([
    "../../tools/handler",
], function(handler) {
	"use strict";
    var env = 0; // 0 tests environment / 1 PRD environment
    var urlBaseXqt = function (service) {
        return `/XMII/Illuminator?service=Query&QueryTemplate=${service}&Content-Type=text/json`;
    };
	return {
        loadWorkCenterList: function(parameters){
            var getLocalData = '../../localServices/configurations/workcenters/WorkcentersLevels.json';
            var getData = urlBaseXqt('Tronox/Quality/Xacute/RecordResultsXacuteQuery'); //modificar
            var getDataUrl = env ? getData : getLocalData;
            var oModel = handler.requestData(getDataUrl,parameters);
            return oModel
        }
    };
});
