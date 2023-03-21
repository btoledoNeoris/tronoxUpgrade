sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(
	JSONModel
) {
	"use strict";

	return {
		getData: function (serverMII, request) {
			// sap.ui.core.BusyIndicator.show();
			return new Promise(function (resolve, reject) {
				var url = serverMII;

				$.ajax({
					type: "POST",
					url: url,
					data: request,
                    contentType: "application/x-www-form-urlencoded",
					success: function (response) {
						// sap.ui.core.BusyIndicator.hide();
						resolve(response);
					},
					error: function (XHR, textStatus, errorThrown) {
						try {
							throw new Error("Error al cargar datos: " + XHR);
						} catch (oException) {
							resolve(oException);
						}
					}
				});
			});
		},
	}
});

