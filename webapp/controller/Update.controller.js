/*global location*/
sap.ui.define([
	"xxxxrubby/ZTRAINING_FORM_ODATA/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"xxxxrubby/ZTRAINING_FORM_ODATA/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(
	BaseController,
	JSONModel,
	History,
	formatter,
	Filter,
	FilterOperator
) {
	"use strict";

	return BaseController.extend("xxxxrubby.ZTRAINING_FORM_ODATA.controller.Update", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("update").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			// sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
		},

		onAfterRendering: function() {
			this.disableInputs();
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		disableInputs: function() {
			this.getView().byId("idSearchHelpBlood").setEditable(false);
			this.getView().byId("idGender").setEditable(false);
			this.getView().byId("idHeight").setEditable(false);
			this.getView().byId("idWeight").setEditable(false);
			this.getView().byId("idDateOfBirth").setEditable(false);
			this.getView().byId("idAge").setEditable(false);
			this.getView().byId("idVaccine1").setEditable(false);
			this.getView().byId("idVaccineDate1").setEditable(false);
			this.getView().byId("idVaccineLoc1").setEditable(false);
			this.getView().byId("idOrg1").setEditable(false);
			this.getView().byId("idSideEffect1").setEditable(false);
			this.getView().byId("idVaccine2").setEditable(false);
			this.getView().byId("idVaccineDate2").setEditable(false);
			this.getView().byId("idVaccineLoc2").setEditable(false);
			this.getView().byId("idOrg2").setEditable(false);
			this.getView().byId("idSideEffect2").setEditable(false);
			this.getView().byId("idNote").setEditable(false);
			this.getView().byId("idButtonUpdate").setVisible(false);
		},
		enableInputs: function() {
			this.getView().byId("idSearchHelpBlood").setEditable(true);
			this.getView().byId("idGender").setEditable(true);
			this.getView().byId("idHeight").setEditable(true);
			this.getView().byId("idWeight").setEditable(true);
			this.getView().byId("idDateOfBirth").setEditable(true);
			this.getView().byId("idAge").setEditable(false);
			this.getView().byId("idVaccine1").setEditable(true);
			this.getView().byId("idVaccineDate1").setEditable(true);
			this.getView().byId("idVaccineLoc1").setEditable(true);
			this.getView().byId("idOrg1").setEditable(true);
			this.getView().byId("idSideEffect1").setEditable(true);
			this.getView().byId("idVaccine2").setEditable(true);
			this.getView().byId("idVaccineDate2").setEditable(true);
			this.getView().byId("idVaccineLoc2").setEditable(true);
			this.getView().byId("idOrg2").setEditable(true);
			this.getView().byId("idSideEffect2").setEditable(true);
			this.getView().byId("idNote").setEditable(true);
			this.getView().byId("idButtonUpdate").setVisible(true);
		},
		onRouteMatched: function() {
			this.getView().byId("idPersno").setText();
			this.getView().byId("idSearchHelpBlood").setValue();
			this.getView().byId("idGender").getSelectedButton();
			this.getView().byId("idHeight").setValue();
			this.getView().byId("idWeight").setValue();
			this.getView().byId("idDateOfBirth").setDateValue();
			this.getView().byId("idAge").setValue();
			this.getView().byId("idVaccine1").setSelectedKey();
			this.getView().byId("idVaccineLoc1").setValue();
			this.getView().byId("idOrg1").setValue();
			this.getView().byId("idSideEffect1").setValue();
			this.getView().byId("idVaccine2").setSelectedKey();
			this.getView().byId("idVaccineLoc2").setValue();
			this.getView().byId("idOrg2").setValue();
			this.getView().byId("idSideEffect2").setValue();
			this.getView().byId("idNote").setValue();
		},

		onShareInJamPress: function() {
			var oViewModel = this.getModel("objectView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("EmpVacDataSet", {
					Persno: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Persno,
				sObjectName = oObject.Persno;

			oViewModel.setProperty("/busy", false);
			// Add the object page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#TrainingFormOdata-display&/EmpVacDataSet/" + sObjectId
			});

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		onPressVaccineLoc1: function() {
			var dialogSearchHelpLocation1 = this._getDialogSearchHelpLocation1();

			dialogSearchHelpLocation1.open();
		},
		_getDialogSearchHelpLocation1: function() {
			if (this.dialogSearchHelpLocation1) {
				return this.dialogSearchHelpLocation1;
			}

			this.dialogSearchHelpLocation1 = sap.ui.xmlfragment("xxxxrubby.ZTRAINING_FORM_ODATA.fragment.Location1", this);
			this.getView().addDependent(this.dialogSearchHelpLocation1);

			//debug untuk cari id button cancel
			console.log(sap.ui.getCore().byId("idTableLocation1"));
			sap.ui.getCore().byId("idTableLocation1-cancel").setType("Reject");

			//cara kedua
			// var dialogSearchHelp = this._getDialogSearchHelp();
			// dialogSearchHelp._getCancelButton().setType("Reject");

			return this.dialogSearchHelpLocation1;
		},
		onSelectedSearchHelpLocation1: function(oEvent) {
			var selectedItem = oEvent.getParameter("selectedItem");
			this.getView().byId("idVaccineLoc1").setValue(selectedItem.getTitle() + " - " + selectedItem.getDescription());
			this.getView().byId("idVaccineLoc1").setTooltip(selectedItem.getTitle());
		},
		onSearchLocation1: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("LocationText", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getParameter("itemsBinding");
			oBinding.filter([oFilter]);
		},

		onPressVaccineLoc2: function() {
			var dialogSearchHelpLocation2 = this._getDialogSearchHelpLocation2();

			dialogSearchHelpLocation2.open();
		},
		_getDialogSearchHelpLocation2: function() {
			if (this.dialogSearchHelpLocation2) {
				return this.dialogSearchHelpLocation2;
			}

			this.dialogSearchHelpLocation2 = sap.ui.xmlfragment("xxxxrubby.ZTRAINING_FORM_ODATA.fragment.Location2", this);
			this.getView().addDependent(this.dialogSearchHelpLocation2);

			//debug untuk cari id button cancel
			console.log(sap.ui.getCore().byId("idTableLocation2"));
			sap.ui.getCore().byId("idTableLocation2-cancel").setType("Reject");

			//cara kedua
			// var dialogSearchHelp = this._getDialogSearchHelp();
			// dialogSearchHelp._getCancelButton().setType("Reject");

			return this.dialogSearchHelpLocation2;
		},
		onSelectedSearchHelpLocation2: function(oEvent) {
			var selectedItem = oEvent.getParameter("selectedItem");
			this.getView().byId("idVaccineLoc2").setValue(selectedItem.getTitle() + " - " + selectedItem.getDescription());
			this.getView().byId("idVaccineLoc2").setTooltip(selectedItem.getTitle());
		},
		onSearchLocation2: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("LocationText", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getParameter("itemsBinding");

			console.log(oBinding);
			oBinding.filter([oFilter]);
		},

		// to call fragment blood
		onPressSearchHelpBlood: function() {
			var dialogSearchHelpBlood = this._getDialogSearchHelpBlood();

			dialogSearchHelpBlood.open();
		},
		_getDialogSearchHelpBlood: function() {
			if (this.dialogSearchHelpBlood) {
				return this.dialogSearchHelpBlood;
			}

			this.dialogSearchHelpBlood = sap.ui.xmlfragment("xxxxrubby.ZTRAINING_FORM_ODATA.fragment.Blood", this);
			this.getView().addDependent(this.dialogSearchHelpBlood);

			//debug untuk cari id button cancel
			console.log(sap.ui.getCore().byId("idTableBlood"));
			sap.ui.getCore().byId("idTableBlood-cancel").setType("Reject");

			//cara kedua
			// var dialogSearchHelp = this._getDialogSearchHelp();
			// dialogSearchHelp._getCancelButton().setType("Reject");

			return this.dialogSearchHelpBlood;
		},
		onSelectedSearchHelpBlood: function(oEvent) {
			var selectedItem = oEvent.getParameter("selectedItems");
			console.log(selectedItem[0].getTitle());
			this.getView().byId("idSearchHelpBlood").setValue(selectedItem[0].getTitle());
		},
		onSearchBlood: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("BloodType", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getParameter("itemsBinding");
			oBinding.filter([oFilter]);
		},

		// to call fragment Vaccine
		onPressSearchHelpVaccine: function() {
			var dialogSearchHelpVaccine = this._getDialogSearchHelpVaccine();

			dialogSearchHelpVaccine.open();
		},
		_getDialogSearchHelpVaccine: function() {
			if (this.dialogSearchHelpVAccine) {
				return this.dialogSearchHelpVaccine;
			}

			this.dialogSearchHelpVaccine = sap.ui.xmlfragment("xxxxrubby.ZTRAINING_FORM_ODATA.fragment.Vaccine", this);
			this.getView().addDependent(this.dialogSearchHelpVaccine);

			//debug untuk cari id button cancel
			console.log(sap.ui.getCore().byId("idTableBlood"));
			sap.ui.getCore().byId("idTableBlood-cancel").setType("Reject");

			//cara kedua
			// var dialogSearchHelp = this._getDialogSearchHelp();
			// dialogSearchHelp._getCancelButton().setType("Reject");

			return this.dialogSearchHelpVaccine;
		},
		onSelectedSearchHelpVaccine: function(oEvent) {
			var selectedItem = oEvent.getParameter("selectedItems");
			console.log(selectedItem[0].getTitle());
			this.getView().byId("idSearchHelpVaccine").setValue(selectedItem[0].getTitle());
		},
		onSearchVaccine: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("VacTypeText", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getParameter("itemsBinding");
			oBinding.filter([oFilter]);
		},

		onUpdate: function() {
			var date1 = this.getView().byId("idVaccineDate1").getDateValue(),
				date2 = this.getView().byId("idVaccineDate2").getDateValue();

			var Persno = this.getView().byId("idPersno").getText();

			// if (!this.validateForm()) {
			// 	alert("masih error");
			// } else {
			var parameters = {
				"Gender": this.getView().byId("idGender").getSelectedButton().getText(),
				"BloodType": this.getView().byId("idSearchHelpBlood").getValue(),
				"Height": this.getView().byId("idHeight").getValue(),
				"Weight": this.getView().byId("idWeight").getValue(),
				"Age": this.getView().byId("idAge").getValue(),
				"Vac1Type": this.getView().byId("idVaccine1").getSelectedKey(),
				"Vac1Date": this.formatter.setDatePattern(date1),
				"LocationCode1": this.getView().byId("idVaccineLoc1").getTooltip(),
				"Vac1Org": this.getView().byId("idOrg1").getValue(),
				"Vac1SideEffect": this.getView().byId("idSideEffect1").getValue(),
				"Vac2Type": this.getView().byId("idVaccine2").getSelectedKey(),
				"Vac2Date": this.formatter.setDatePattern(date2),
				"LocationCode2": this.getView().byId("idVaccineLoc2").getTooltip(),
				"Vac2Org": this.getView().byId("idOrg2").getValue(),
				"Vac2SideEffect": this.getView().byId("idSideEffect2").getValue(),
				"Note": this.getView().byId("idNote").getValue()
			};

			console.log(parameters);
			var oModel = this.getView().getModel();
			oModel.update("/EmpVacDataSet('" + Persno + "')", parameters, {
				success: jQuery.proxy(function(mResponse) {
					console.log(mResponse);
					this.getRouter().navTo("worklist", {});

				}, this),
				error: jQuery.proxy(function(mResponse) {
					var obj = mResponse["message"];
					alert(mResponse["message"] + " - " + mResponse["statusCode"] + " " + mResponse["statusText"]);
				}, this)
			});

			// this.onAfterRendering();
			// } // if (!this.validateForm())
		},

		onDelete: function() {
			var Persno = this.getView().byId("idPersno").getText();
			var oModel = this.getView().getModel();
			oModel.remove("/EmpVacDataSet('" + Persno + "')", {
				success: jQuery.proxy(function(mResponse) {
					console.log(mResponse);
					this.getRouter().navTo("worklist", {});

				}, this),
				error: jQuery.proxy(function(mResponse) {
					var obj = mResponse["message"];
					alert(mResponse["message"] + " - " + mResponse["statusCode"] + " " + mResponse["statusText"]);
				}, this)
			});
			// } // if (!this.validateForm())
		},

		onChangeSwitch: function(oEvent) {
			var mode = this.getView().byId("idSwitch").getState();

			if (mode === true) {
				this.enableInputs();
			} else {
				this.disableInputs();
			}
		}

	});

});