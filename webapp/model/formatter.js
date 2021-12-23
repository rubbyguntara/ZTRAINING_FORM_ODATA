sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		setDatePattern: function(sDate) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyyMMdd"
			});

			sDate = dateFormat.format(sDate);
			return sDate;
		},
		changeGender: function(sGender){
			if (!sGender) {
				return 0;
			}
			
			sGender = sGender.toUpperCase();
			if(sGender === "MALE"){
				return 0;
			}else{
				return 1;
			}
		}

	};

});