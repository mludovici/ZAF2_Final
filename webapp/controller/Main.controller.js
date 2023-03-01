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
    function (Controller, MessageBox, Filter, FilterOperator, MessageToast) {
        "use strict";

        var Produktgesamtpreis = 0;
        let _oRouter = null;
        return Controller.extend("zaf2final.controller.Main", {
				onInit: function () {
                    _oRouter = this.getOwnerComponent().getRouter();
                    _oRouter.navTo("createModel");
				},

			handleMessageToastPress: function(oEvent) {
				var msg = 'Bestellung abgeschlossen.';
				MessageToast.show(msg);
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
				var	oGesamt = this.getView().byId("id1");
				oGesamt.bindElement(sPath);				
				var	oBes = this.getView().byId("tex1");
				oBes.bindElement(sPath);
				var	oRat = this.getView().byId("rat1");
				oRat.bindElement(sPath);				
				var	oNam = this.getView().byId("name");
				oNam.bindElement(sPath);
				var oCat = this.getView().byId("cat");
				oCat.bindElement({
					path: sPath,
					parameters: {
						expand: "Category"
					}					
				});
				var opriceGesamt = this.getView().byId("gesamt1");
				var currPrice = this.getView().byId("id1").getValue();
				opriceGesamt.setValue(currPrice);
				var oAnzahl = this.getView().byId("anzahl");
				oAnzahl.setValue("1");			
				var oLif = this.getView().byId("lif");
				oLif.bindElement({
					path: sPath,
					parameters: {
						expand: "Supplier"
					}			
				});
				if(this.getView().byId("lif").getText() == "Exotic Liquids"){
					var oLif1 = this.getView().byId("lif1");
					let oItemTemplate =  new sap.m.DisplayListItem({label: "{Name}"});
					oLif1.bindAggregation("items",{
						path: "/Suppliers(1)/Products" ,
							template: oItemTemplate
					});
				}else{
					var oLif1 = this.getView().byId("lif1");
					let oItemTemplate =  new sap.m.DisplayListItem({label: "{Name}"});
					oLif1.bindAggregation("items",{
						path: "/Suppliers(0)/Products" ,
						template: oItemTemplate
					});			
				}
			},

			onNavBack: function() {
				this.getView().byId("productTable").clearSelection();
			},

			onPress: function(){		
				var anzahl = 0;
				var preis = 0;
				anzahl = this.getView().byId("anzahl").getValue();
				preis = this.getView().byId("id1").getValue();	
				var gesamt = anzahl * preis;
					Produktgesamtpreis = Produktgesamtpreis + gesamt;
				MessageBox.show("Sie haben " + this.getView().byId("anzahl").getValue() + " " + this.getView().byId("name").getTitle() + " erfolgreich hinzugefügt", {
					title: "Bestellbestätigung",
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					inputs: [MessageBox.Action.INPUT],
					onClose: function(){
					}		
				}); 
				this.getView().byId("gesamt").setValue(Produktgesamtpreis);
			},
			
			onSearch: function (oEvent) {
				// add filter for search
				var aFilters = [];
				var sQuery = oEvent.getSource().getValue();
				if (sQuery && sQuery.length > 0) {
					var filter = new Filter("Name", FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}
				// update list binding
				var oTable = this.byId("productTable");
				var oBinding = oTable.getBinding("items");
				oBinding.filter(aFilters, "Application");
			},
			
			
			onPress2: function(){
				var oSplitApp = this.getView().byId("split");
				oSplitApp.toDetail("__xmlview0--det2", "slide");
			},			
		
			onCategory: function(oEvent){
				var oItem = oEvent.getParameter("listItem");
				var sPath = oItem.getBindingContext().getPath();
				var	oProduct = this.getView().byId("lif12");
				oProduct.bindElement({
					path: sPath,
					parameters: {
						expand: "Supplier"
					}
				});	
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

            onPressDropDown: function() {
               
            }
				
			
		
		});
	});