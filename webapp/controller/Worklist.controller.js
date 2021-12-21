/*global location history */
sap.ui.define([
	"xxxxrubby/ZTRAINING_FORM_ODATA/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"xxxxrubby/ZTRAINING_FORM_ODATA/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("xxxxrubby.ZTRAINING_FORM_ODATA.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			// iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			// oTable.attachEventOnce("updateFinished", function(){
			// 	// Restore original busy indicator delay for worklist's table
			// 	oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			// });
			// Add the worklist page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#TrainingFormOdata-display"
			}, true);
		},

		onAfterRendering: function() {
			var vDate1 = this.getView().byId("idDateOfBirth"),
				vDate2 = this.getView().byId("idVaccineDate1"),
				vDate3 = this.getView().byId("idVaccineDate2"),
				today = new Date();

			//set max date
			vDate2.setMaxDate(today);
			vDate3.setMaxDate(today);

			//disable manual input datepicker
			vDate1.addDelegate({
				onAfterRendering: function() {
					vDate1.$().find("input").attr("Disabled", true).css("color", "red");
				}
			}, vDate1);
			vDate2.addDelegate({
				onAfterRendering: function() {
					vDate2.$().find("input").attr("Disabled", true).css("color", "red");
				}
			}, vDate2);
			vDate3.addDelegate({
				onAfterRendering: function() {
					vDate3.$().find("input").attr("Disabled", true).css("color", "red");
				}
			}, vDate3);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("worklistView"),
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

		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("Persno", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function(oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Persno")
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},

		// To call Fragment Location
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

		onDateChanged: function(oEvent) {
			var today = new Date();
			var selectedDate = this.getView().byId("idDateOfBirth").getDateValue();
			var ynew = today.getFullYear();
			var mnew = today.getMonth();
			var dnew = today.getDate();
			var yold = selectedDate.getFullYear();
			var mold = selectedDate.getMonth();
			var dold = selectedDate.getDate();
			var diff = ynew - yold;
			if (mold > mnew) diff--;
			else {
				if (mold === mnew) {
					if (dold > dnew) diff--;
				}
			}

			this.getView().byId("idAge").setValue(diff);
		},

		onSubmit: function() {
			var date1 = this.getView().byId("idVaccineDate1").getDateValue(),
				date2 = this.getView().byId("idVaccineDate2").getDateValue();

			var parameters = {
				"Persno": this.getView().byId("idPersno").getValue(),
				"Gender": this.getView().byId("idGender").getSelectedButton().getText(),
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
		}

	});
});