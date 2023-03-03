sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, Fragment, Filter, FilterOperator, Sorter, MessageToast) {
        "use strict";

        var Produktgesamtpreis = 0;
		var Bearbeitungsmodus = 0;
        var oModel = null;
        var sortCriteria = null;
		var _oRouter = null;
		var _oBindingItem = null;
        return Controller.extend("ZAF2_Final.controller.Main", {

				oEinzelteilModell: null,
				oLocalModelData: null,
				oModelButton: null,
				onInit: function () {

					var oModelEdit = new JSONModel({
						edit: false,
						text: "Bearbeitungsmodus"
					});
					var oView = this.getView();
					this.getView().setModel(oModelEdit, "settings");
					this.init();
					this.oEinzelteilModell = new JSONModel();
					this.oEinzelteilModell.loadData("/model/einzelteile.json");
					this.oModelButton = new JSONModel({
						btnIcon: "gt"
					});

					this.getView().setModel(this.oModelButton)

				},

				init:function(){
                    this.oModel = this.getView().getModel("mainService");
					_oRouter = this.getOwnerComponent().getRouter();
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

			onToggleIcon: function(oEvent) {
				let iconValue = this.oModelButton.getProperty("/btnIcon");
				if (iconValue == 'gt') {
					this.oModelButton.setProperty("/btnIcon", "lt");
				} else {
					this.oModelButton.setProperty("/btnIcon", "gt");
				}
			},
			
			onClearFilter: function() {
				var oTable = this.getView().byId("productTable");
				oTable.getBinding("items").filter(null);
			},
			
			
			onSelectionChange: function(oEvent) {
				var oItem = oEvent.getParameter("listItem");
				var sPath = oItem.getBindingContext().getPath();
				var modelKey = sPath.split("'")[1];
				this._oBindingItem = modelKey;
				 var oView = this.getView();
				 var that = this;
				 oView.byId('dp1').destroyContent();
				 Fragment.load({
					 name: "zaf2final.view.FragmentModelDetailPage",
					 controller: this
				 }).then(function(oFragment){ 
					 that.getView().byId("dp1").insertContent(oFragment);
					 oFragment.bindElement(sPath);
					var lagerListe = sap.ui.getCore().byId("LagerorteListe");
					lagerListe.getBinding("items").filter([new Filter({
						path: 'Modellid',
						operator: FilterOperator.EQ,
						value1: modelKey
					})]);	 
				 });
			},
			
			onSearch: function (oEvent) {
				var aFilters = [];
                var oItem = oEvent.getSource();
                let boundModelPath = this.getView().byId("modelTable").getBindingInfo("items").path;
                console.log("boundModelPath:",boundModelPath)
                // var sPath = oItem.getBindingContext().getPath();
				var sQuery = oItem.getValue();

				if (sQuery && sQuery.length > 0) {
					let oFilter = new Filter({
                        path: "Modellname",
                        operator: FilterOperator.Contains,
                        value1: sQuery
                    });
					aFilters.push(oFilter);
				}
				// update list binding
				var oTable = this.byId("modelTable");
				var oBinding = oTable.getBinding("items");
				oBinding.filter(aFilters);

                // oModel.read("/FahrradmodellSet", {
				// 	method: "GET",
				// 	filters: aFilters,
				// 	success: function(oData, oResponse) {
				// 		console.log(oResponse, oData);
				// 	},
				// 	error: function(oError) {
                //         console.log(oError);
				// 		sap.m.MessageBox.alert("Error Saving Entries!!");
				// 	}


				// });
			},

			onQuanChange: function(oEvent){

				var index = 0;
				var check = 0;
				var prop1 = null;
				var prop2 = null;
				this.oLocalModelData = this.oEinzelteilModell.getProperty("/einzelteil");
				while (index <= this.oEinzelteilModell.getProperty("/counter")){
						prop1 = this.oEinzelteilModell.getProperty("/einzelteil/"+index+"/id");
						prop2 = oEvent.getSource().getBindingContext().getPath().split("'")[1];
						if(prop1 == prop2){
							this.oEinzelteilModell.setProperty("/einzelteil/"+index+"/anzahl", oEvent.getParameter("value"));
							check = check + 1;
						}
						index = index + 1;
						
				}
				if(check == 0){
					this.oLocalModelData.push.apply(this.oLocalModelData, [
						{id: oEvent.getSource().getBindingContext().getPath().split("'")[1],
						 anzahl:oEvent.getParameter("value")
						}]);
					this.oEinzelteilModell.setProperty("/counter", this.oEinzelteilModell.getProperty("/counter") + 1);
				}

				check = 0;

				
				console.log(this.oEinzelteilModell);
				//this.oEinzelteilModell.setProperty("/einzelteil/id", oEvent.getSource().getBindingContext().getPath().split("'")[1]);
				//this.oEinzelteilModell.setProperty("/einzelteil/anzahl", oEvent.getParameter("value"));
				
				// console.log(this.oEinzelteilModell.getProperty("/einzelteil/1/id"));
				// console.log(this.oLocalModelData);
				// console.log(this.oEinzelteilModell);
				// console.log(oEvent.getParameter("value"));
				// console.log(oEvent.getSource().getBindingContext().getPath().split("'")[1]);
			},

            onCreateModel: function() {
				 var oView = this.getView();
				 var that = this;
				 oView.byId('dp1').destroyContent();
                
                 Fragment.load({
                    name: "zaf2final.view.FragmentModelCreatePage",               
                    controller: this,
					id: 'CreatePage'
                }).then(function(oFragment) { 
                    that.getView().byId("dp1").insertContent(oFragment);
                });
            },

			onPressModelCreate: function(){
	
				this.getView().getModel().createEntry('/FahrradmodellSet', { properties: {
																						Modellname: 	sap.ui.getCore().byId("CreatePage--in_modellname").getValue(),
																						Url:			sap.ui.getCore().byId("CreatePage--in_url").getValue(),
																					    Preis:			sap.ui.getCore().byId("CreatePage--in_preis").getValue(),
																						Farbe:			sap.ui.getCore().byId("CreatePage--in_farbe").getValue(),
																					    Beschreibung: 	sap.ui.getCore().byId("CreatePage--in_beschreibung").getValue() } });
				


				
				var index = 1;
				while(index <= this.oEinzelteilModell.getProperty("/counter")){
					if(this.oEinzelteilModell.getProperty("/einzelteil/"+index+"/id") != ""){
						this.getView().getModel().createEntry('/FahrradmodellEinzelteilSet', { properties: {
							Einzelteilid: 	this.oEinzelteilModell.getProperty("/einzelteil/"+index+"/id"),
							Anzahl: 		this.oEinzelteilModell.getProperty("/einzelteil/"+index+"/anzahl")
						}})
						
					}
					index = index + 1;
				}

				this.getView().getModel().submitChanges();
			},

	
			onBearbeitungsmodus: function(oEvent){
				if(Bearbeitungsmodus == 0){
					this.getView().getModel("settings").setProperty("/edit", true);
					this.getView().getModel("settings").setProperty("/text", "Anzeigemodus");
					Bearbeitungsmodus = 1;
				} else {
					this.getView().getModel("settings").setProperty("/edit", false);
					this.getView().getModel("settings").setProperty("/text", "Bearbeitungsmodus");
					Bearbeitungsmodus = 0;
				}

			},
			onEintragbearbeiten: function(oEvent){
				var oModel = this.getOwnerComponent().getModel();
			oModel.update('FahrradmodellSet',{ properties: {
				Preis: this.getView().byId("input1"),
				Farbe: this.getView().byId("input2")
				
			}

			});
			oModel.submitChanges();
				
				
					
			},

			onEintragbearbeiten: function() {
				debugger;
			},

			onSelectAreaType: function(oEvent) {
				var filters = [];
				// var lagerListe = sap.ui.getCore().byId("LagerorteListe");
				// 	lagerListe.getBinding("items").filter([new Filter({
				// 		path: 'Modellid',
				// 		operator: FilterOperator.EQ,
				// 		value1: this._oBindingItem
				// 	})]);	
				var selectedArea = oEvent.getParameter("selectedItem").getKey();
				var oListOrte = sap.ui.getCore().byId("LagerorteListe");
				var oBinding = oListOrte.getBinding("items");
				// let orteItems = oListOrte.getAggregation("items").filter(item => item.mAggregations.attributes[0].mProperties.text == `Typ: ${selectedArea}`);
				// sap.ui.getCore().byId("LagerorteListe").getModel().set

				if (selectedArea == 'none') {
					let modelFilter = new Filter({
						path: 'Modellid',
						operator: FilterOperator.EQ,
						value1: this._oBindingItem
					});
					filters.push(modelFilter);
				}else {
					let oFilter = new Filter({
                        path: "ToLagerort/Typ",
                        operator: FilterOperator.EQ,
                        value1: selectedArea
                    });
					filters.push(oFilter);
					let modelFilter = new Filter({
						path: 'Modellid',
						operator: FilterOperator.EQ,
						value1: this._oBindingItem
					});
					filters.push(modelFilter);
				}
				oBinding.filter(filters);
			},

			onFilterChange: function() {
				
			},

            onClearFilter: function() {
                this.getView().byId("filterCriteria").setValue(null);
                this.getView().byId("modelTable").getBinding("items").filter(null);
            },

            onFilterItemsChange: function(oEvent) {               
                sortCriteria = oEvent.getParameter("selectedItem").getText();
            },

            onSortAsc: function(oEvent) {
                var otable = this.getView().byId("modelTable");
               
                if (sortCriteria) {
                    var oSorter = new Sorter(sortCriteria, false);    
                    var oBinding = otable.getBinding("items");
                    oBinding.sort([oSorter]);
                }
            },

            onSortDesc: function(oEvent) {
                var otable = this.getView().byId("modelTable");
                if (sortCriteria) {
                    var oSorter = new Sorter(sortCriteria, true);    
                    var oBinding = otable.getBinding("items");
                    oBinding.sort([oSorter]);
                }
            },

			navigateToLagerVerwaltung: function() {				
				_oRouter.navTo("LagerVerwaltung");
			},
			formatLagerTypeOutput: function(oLType) {
				if (oLType == 'L') {
					return "Lagerort";
				} else if (oLType == 'V') {
					return "Verkaufsstelle"
				}
			},
			onStockManagement: function() {
				var oView = this.getView();
				var that = this;
				oView.byId('dp1').destroyContent();
			   
				Fragment.load({
				   name: "zaf2final.view.FragmentModelStock",               
				   controller: this
			   }).then(function(oFragment) { 
				   that.getView().byId("dp1").insertContent(oFragment);
			   });
		   },

		   onOrder: function() {
				var oView = this.getView();
				var that = this;
				oView.byId('dp1').destroyContent();
			
				Fragment.load({
				name: "zaf2final.view.FragmentModelOrder",               
				controller: this
			}).then(function(oFragment) { 
				that.getView().byId("dp1").insertContent(oFragment);
			});
		}
            
			
		});
	});