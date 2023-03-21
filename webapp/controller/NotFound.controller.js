sap.ui.define([
	"tronox/controller/LayerController",
], function (LayerController) {
	"use strict";
	return LayerController.extend("tronox.controller.NotFound", {
		onInit: function () {
			var oRouter, oTarget;

			oRouter = this.getRouter();
			oTarget = oRouter.getTarget("notFound");
			oTarget.attachDisplay(function (oEvent) {
				this._oData = oEvent.getParameter("data");	// store the data
			}, this);
		},

		// override the parent's onNavBack (inherited from LayerController)
		onNavBack : function () {
			// in some cases we could display a certain target when the back button is pressed
			if (this._oData && this._oData.fromTarget) {
				this.getRouter().getTargets().display(this._oData.fromTarget);
				delete this._oData.fromTarget;
				return;
			}

			// call the parent's onNavBack
			LayerController.prototype.onNavBack.apply(this, arguments);
		}
	});
});
