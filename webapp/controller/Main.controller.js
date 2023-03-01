sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, Fragment, Filter, FilterOperator, MessageToast) {
        "use strict";

        var Produktgesamtpreis = 0;

        return Controller.extend("ZAF2_Final.controller.Main", {
				onInit: function () {
					this.init();
					
				},

				init:function(){

				},

			onChange: function(oEvent) {
				var sCategory = oEvent.getParameter("selectedItem").getText();
				var oTable = this.getView().byId("productTable");
				var oFilter = new Filter({
					path: "Category/Name",
					operator: FilterOperator.EQ,
					value1: sCategory
					});
				oTable.getBinding("items").filter([oFilter]);
			},
			
			onClearFilter: function() {
				var oTable = this.getView().byId("productTable");
				oTable.getBinding("items").filter(null);
			},
			
			
			onSelectionChange: function(oEvent) {
				var oItem = oEvent.getParameter("listItem");
				var sPath = oItem.getBindingContext().getPath();
				 
				 var oView = this.getView();
				 var that = this;
				 oView.byId('dp1').destroyContent();
				 Fragment.load({
					 name: "zaf2final.view.FragmentModelDetailPage",
					 controller: this
				 }).then(function(oFragment){ oFragment.bindElement(sPath);
					 that.getView().byId("dp1").insertContent(oFragment);
					 oFragment.bindElement(sPath);
					 
				 });
			},
			
			onSearch: function (oEvent) {
				// add filter for search
				var aFilters = [];
				var sQuery = oEvent.getSource().getValue();
                debugger;
				if (sQuery && sQuery.length > 0) {
					var filter = new Filter("Modellname", FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}
				// update list binding
				var oTable = this.byId("modelTable");
				var oBinding = oTable.getBinding("items");
				oBinding.filter(aFilters, "Application");
			},

			onQuanChange: function(){
				var anzahl = 0;
				var preis = 0;
				anzahl = this.getView().byId("anzahl").getValue();
				preis = this.getView().byId("id1").getValue();
				 //var gesamt = anzahl * preis;
				var Produktgesamtpreis = anzahl * preis;
				this.getView().byId("gesamt1").setValue(Produktgesamtpreis);
			},

            onCreateModel: function() {
				 var oView = this.getView();
				 var that = this;
				 oView.byId('dp1').destroyContent();
                
                 Fragment.load({
                    name: "zaf2final.view.FragmentModelCreatePage",               
                    controller: this
                }).then(function(oFragment) { 
                    that.getView().byId("dp1").insertContent(oFragment);
                });
            },

			onPressModelCreate: function(){
				this.getView().getModel().createEntry('/FahrradmodellSet', { properties: {
																						Modellname: 'Modellnametest' } });

				this.getView().getModel().submitChanges();																		
			}
			
		});
	});