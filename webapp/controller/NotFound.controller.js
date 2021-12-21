sap.ui.define([
		"xxxxrubby/ZTRAINING_FORM_ODATA/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("xxxxrubby.ZTRAINING_FORM_ODATA.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);