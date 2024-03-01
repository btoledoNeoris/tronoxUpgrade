sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function (JSONModel) {
	"use strict";
	return {
		requestData: function (path, parameters = {}) {
			const oModelCalls = new JSONModel();
			return new Promise((resolve, reject) => {
				oModelCalls.loadData(path, parameters, true, "POST");
				oModelCalls.attachRequestCompleted(() => {
					const { Rowset } = oModelCalls.getData().Rowsets;
					if (!Rowset) {
						reject(new Error('No existen datos.'));
						return;
					}
					resolve(Rowset);
				});
			});
		}
	};
});
