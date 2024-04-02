sap.ui.define([
    "../../tools/handler",
], function(handler) {
	"use strict";
    var env = 0; // 0 tests environment / 1 PRD environment
    var urlBaseXqt = function (service) {
        return `/XMII/Illuminator?service=Query&QueryTemplate=${service}&Content-Type=text/json`;
    };
	return {
        loadReportResult: function(parameters){
            var getLocalData = '../../localServices/quality/ResultsRecording.json';
            var getData = urlBaseXqt('Tronox/Quality/Xacute/RecordResultsXacuteQuery');
            var getDataUrl = env ? getData : getLocalData;
            var oModel = handler.requestData(getDataUrl,parameters);
            console.log("Model result recording: " + oModel)
            return oModel
        }
    };
});

