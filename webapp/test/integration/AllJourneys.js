/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"xxxxrubby/ZTRAINING_FORM_ODATA/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"xxxxrubby/ZTRAINING_FORM_ODATA/test/integration/pages/Worklist",
	"xxxxrubby/ZTRAINING_FORM_ODATA/test/integration/pages/Object",
	"xxxxrubby/ZTRAINING_FORM_ODATA/test/integration/pages/NotFound",
	"xxxxrubby/ZTRAINING_FORM_ODATA/test/integration/pages/Browser",
	"xxxxrubby/ZTRAINING_FORM_ODATA/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "xxxxrubby.ZTRAINING_FORM_ODATA.view."
	});

	sap.ui.require([
		"xxxxrubby/ZTRAINING_FORM_ODATA/test/integration/WorklistJourney",
		"xxxxrubby/ZTRAINING_FORM_ODATA/test/integration/ObjectJourney",
		"xxxxrubby/ZTRAINING_FORM_ODATA/test/integration/NavigationJourney",
		"xxxxrubby/ZTRAINING_FORM_ODATA/test/integration/NotFoundJourney",
		"xxxxrubby/ZTRAINING_FORM_ODATA/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});