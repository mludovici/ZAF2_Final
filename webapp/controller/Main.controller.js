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

				this.getView().setModel(this.oModelButton, 'modelJsonButton')

				this.getView().setModel(new JSONModel({
					Modellname: "",
					Url: "",
					Preis: "",
					Farbe: "",
					Beschreibung: ""
				}), "CreateDataModel")

			},

			init: function () {
				this.oModel = this.getView().getModel("mainService");
				_oRouter = this.getOwnerComponent().getRouter();
			},

			onChange: function (oEvent) {
				var sCategory = oEvent.getParameter("selectedItem").getText();
				var oTable = this.getView().byId("productTable");
				var oFilter = new Filter({
					path: "Category/Name",
					operator: FilterOperator.EQ,
					value1: sCategory
				});
				oTable.getBinding("items").filter([oFilter]);
			},

			onToggleIcon: function (oEvent) {
				let iconValue = this.oModelButton.getProperty("/btnIcon");
				if (iconValue == 'gt') {
					this.oModelButton.setProperty("/btnIcon", "lt");
				} else {
					this.oModelButton.setProperty("/btnIcon", "gt");
				}
				//execute filtering method for selected properties after toggling..
				this.onFilterChange();
			},

			onClearFilter: function () {
				var oTable = this.getView().byId("productTable");
				oTable.getBinding("items").filter(null);
			},


			onSelectionChange: function (oEvent) {
				var oItem = oEvent.getParameter("listItem");
				var sPath = oItem.getBindingContext().getPath();
				var modelKey = sPath.split("'")[1];
				this._oBindingItem = modelKey;
				var oView = this.getView();
				var that = this;

				oView.byId('dp1').removeAllContent();

				if (!this._oFragmentModelDetailPage) {
					Fragment.load({
						name: "zaf2final.view.FragmentModelDetailPage",
						controller: this
					}).then(function (oFragment) {
						that._oFragmentModelDetailPage = oFragment
						that.getView().byId("dp1").insertContent(that._oFragmentModelDetailPage);
						that._oFragmentModelDetailPage.bindElement(sPath);
						var lagerListe = sap.ui.getCore().byId("LagerorteListe");
						lagerListe.getBinding("items").filter([new Filter({
							path: 'Modellid',
							operator: FilterOperator.EQ,
							value1: modelKey
						})]);
					});
				} else {
					that.getView().byId("dp1").insertContent(that._oFragmentModelDetailPage);
					that._oFragmentModelDetailPage.bindElement(sPath);
					var lagerListe = sap.ui.getCore().byId("LagerorteListe");
					lagerListe.getBinding("items").filter([new Filter({
						path: 'Modellid',
						operator: FilterOperator.EQ,
						value1: modelKey
					})]);
				}


			},

			onSearch: function (oEvent) {
				var aFilters = [];
				var oItem = oEvent.getSource();
				let boundModelPath = this.getView().byId("modelTable").getBindingInfo("items").path;
				console.log("boundModelPath:", boundModelPath)
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
			},

			onQuanChange: function (oEvent) {

				var index = 0;
				var check = 0;
				var prop1 = null;
				var prop2 = null;
				this.oLocalModelData = this.oEinzelteilModell.getProperty("/einzelteil");
				while (index <= this.oEinzelteilModell.getProperty("/counter")) {
					prop1 = this.oEinzelteilModell.getProperty("/einzelteil/" + index + "/id");
					prop2 = oEvent.getSource().getBindingContext().getPath().split("'")[1];
					if (prop1 == prop2) {
						this.oEinzelteilModell.setProperty("/einzelteil/" + index + "/anzahl", oEvent.getParameter("value"));
						check = check + 1;
					}
					index = index + 1;

				}
				if (check == 0) {
					this.oLocalModelData.push.apply(this.oLocalModelData, [
						{
							id: oEvent.getSource().getBindingContext().getPath().split("'")[1],
							anzahl: oEvent.getParameter("value")
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

			onCreateModel: function () {
				var oView = this.getView();
				var that = this;
				oView.byId('dp1').removeAllContent();

				if (!this._oFragmentCreate) {
					Fragment.load({
						name: "zaf2final.view.FragmentModelCreatePage",
						controller: this
					}).then( (oFragment) => {
						this._oFragmentCreate = oFragment
						this.getView().byId("dp1").insertContent(that._oFragmentCreate);
					});
				} else {
					this.getView().byId("dp1").insertContent(this._oFragmentCreate);
				}
			},

			onPressModelCreate: function () {

				this.getView().getModel().create('/FahrradmodellSet', this.getView().getModel("CreateDataModel").getData(), {
					success: function (oResultData) {

						var index = 1;
						while (index <= this.oEinzelteilModell.getProperty("/counter")) {
							if (this.oEinzelteilModell.getProperty("/einzelteil/" + index + "/id") != "") {
								this.getView().getModel().createEntry('/FahrradmodellEinzelteilSet', {
									properties: {
										Modellid: oResultData.Modellid,
										Einzelteilid: this.oEinzelteilModell.getProperty("/einzelteil/" + index + "/id"),
										Anzahl: this.oEinzelteilModell.getProperty("/einzelteil/" + index + "/anzahl")
									}
								})

							}
							index = index + 1;
						}

						this.getView().getModel().submitChanges();
					}.bind(this),
					error: function (oResultData) {

					}
				});
				// this.getView().getModel().createEntry('/FahrradmodellSet', { properties: {
				// 																		Modellname: 	sap.ui.getCore().byId("CreatePage--in_modellname").getValue(),
				// 																		Url:			sap.ui.getCore().byId("CreatePage--in_url").getValue(),
				// 																	    Preis:			sap.ui.getCore().byId("CreatePage--in_preis").getValue(),
				// 																		Farbe:			sap.ui.getCore().byId("CreatePage--in_farbe").getValue(),
				// 																	    Beschreibung: 	sap.ui.getCore().byId("CreatePage--in_beschreibung").getValue() } });





			},


			onBearbeitungsmodus: function (oEvent) {
				if (Bearbeitungsmodus == 0) {
					this.getView().getModel("settings").setProperty("/edit", true);
					this.getView().getModel("settings").setProperty("/text", "Anzeigemodus");
					Bearbeitungsmodus = 1;
					MessageToast.show("Sie befinden sich nun im Bearbeitungsmodus");
				} else {
					this.getView().getModel("settings").setProperty("/edit", false);
					this.getView().getModel("settings").setProperty("/text", "Bearbeitungsmodus");
					MessageToast.show("Sie befinden sich nun im Anzeigemodus");
					Bearbeitungsmodus = 0;
				}

			},
			onEintragbearbeiten: function (oEvent) {
				var oModel = this.getOwnerComponent().getModel();
				oModel.update('/FahrradmodellSet', {
					properties: {
						Preis: sap.ui.getCore().byId("input1").getValue(),
						Farbe: sap.ui.getCore().byId("input2").getValue(),
						Beschreibung: sap.ui.getCore().byId("input3").getValue()

					}

				});

				oModel.submitChanges();





			},

			onSelectAreaType: function (oEvent) {
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
				} else {
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

			onFilterChange: function(oEvent) {
				let bp_filter = null;
				//select Table bindings for items
				var oTable = this.byId("modelTable");
				var oBinding = oTable.getBinding("items");				

				// select filter Values gt/lt and Input Value and selected Property
				let gtlt_filter_Value = this.oModelButton.getProperty("/btnIcon");
				let selectFilterInputValue = this.getView().byId("selectFilterInput").getValue();
				var filterSelectKey = this.getView().byId("filterItems").getSelectedItem().getKey()

				//logic to create Filter for table
				if (filterSelectKey == 'Preis' && selectFilterInputValue) {
					bp_filter = new Filter({
						path: filterSelectKey,
						operator: gtlt_filter_Value == 'gt' ? FilterOperator.GT : FilterOperator.LT,
						value1: selectFilterInputValue
					});
					oBinding.filter([bp_filter]);
				} else if (filterSelectKey == 'Bestand' && selectFilterInputValue) {
					bp_filter = new Filter({
						path: filterSelectKey,
						operator: gtlt_filter_Value == 'gt' ? FilterOperator.GT : FilterOperator.LT,
						value1: selectFilterInputValue
					});
					oBinding.filter([bp_filter]);
				} else {
					return;
				}
			},



			onClearFilter: function () {
				this.getView().byId("filterCriteria").setValue(null);
				this.getView().byId("modelTable").getBinding("items").filter(null);
			},

			onFilterItemsChange: function (oEvent) {
				sortCriteria = oEvent.getParameter("selectedItem").getText();
			},

			onSortAsc: function (oEvent) {
				var otable = this.getView().byId("modelTable");

				if (sortCriteria) {
					var oSorter = new Sorter(sortCriteria, false);
					var oBinding = otable.getBinding("items");
					oBinding.sort([oSorter]);
				}
			},

			onSortDesc: function (oEvent) {
				var otable = this.getView().byId("modelTable");
				if (sortCriteria) {
					var oSorter = new Sorter(sortCriteria, true);
					var oBinding = otable.getBinding("items");
					oBinding.sort([oSorter]);
				}
			},

			navigateToLagerVerwaltung: function () {
				_oRouter.navTo("LagerVerwaltung");
			},
			formatLagerTypeOutput: function (oLType) {
				if (oLType == 'L') {
					return "Lagerort";
				} else if (oLType == 'V') {
					return "Verkaufsstelle"
				}
			},
			onStockManagement: function () {
				var oView = this.getView();
				var that = this;
				oView.byId('dp1').removeAllContent();

				if (!this._oFragmentModelStock) {
					Fragment.load({
						name: "zaf2final.view.FragmentModelStock",
						controller: this
					}).then(function (oFragment) {
						that._oFragmentModelStock = oFragment
						that.getView().byId("dp1").insertContent(that._oFragmentModelStock);
					});
				} else {
					that.getView().byId("dp1").insertContent(that._oFragmentModelStock);
				}
			},

			onModelBuild: function () {
				var oView = this.getView();
				var that = this;
				oView.byId('dp1').removeAllContent();

				if (!this._oFragmentModelBuild) {
					Fragment.load({
						name: "zaf2final.view.FragmentModelBuild",
						controller: this
					}).then(function (oFragment) {
						that._oFragmentModelBuild = oFragment
						that.getView().byId("dp1").insertContent(that._oFragmentModelBuild);
					});
				}
				else {
					that.getView().byId("dp1").insertContent(that._oFragmentModelBuild);
				}
			},

			onOrder: function () {
				var oView = this.getView();
				var that = this;
				oView.byId('dp1').removeAllContent();

				if (!this._oFragmentModelOrder) {
					Fragment.load({
						name: "zaf2final.view.FragmentModelOrder",
						controller: this
					}).then(function (oFragment) {
						that._oFragmentModelOrder = oFragment
						that.getView().byId("dp1").insertContent(that._oFragmentModelOrder);
					});
				}
				else {
					that.getView().byId("dp1").insertContent(that._oFragmentModelOrder);
				}
			},

			onSelectLager: function (oEvent) {
				var oSelectZiel = sap.ui.getCore().byId("von");
				var oSelectFahrrad = sap.ui.getCore().byId("fahrrad");
				var iZielID = oSelectZiel.getSelectedKey();
				var iFahrradID = oSelectFahrrad.getSelectedKey();

				var oInput = sap.ui.getCore().byId("vorhanden");
				const path = this.getView().getModel().createKey("/FahrradmodellOrtSet", {
					// Key(s) and value(s) of that entity set
					"Modellid": iFahrradID, // with the value 999 for example
					"Ortid": iZielID

				});
				oInput.bindElement(path);
				var oInput2 = sap.ui.getCore().byId("bestandziel");
				var zielSelect = sap.ui.getCore().byId("ziel");
				var zielKey = zielSelect.getSelectedKey();
				const path2 = this.getView().getModel().createKey("/FahrradmodellOrtSet", {
					// Key(s) and value(s) of that entity set
					"Modellid": iFahrradID, // with the value 999 for example
					"Ortid": zielKey

				});
				oInput2.bindElement(path2);
			},

			onPressModelOrder: function () {
				var vonLager = sap.ui.getCore().byId("von");
				var zuLager = sap.ui.getCore().byId("ziel");
				var keyV = vonLager.getSelectedKey();
				var keyZ = zuLager.getSelectedKey();
				var modell = sap.ui.getCore().byId("fahrrad");
				var modellKey = modell.getSelectedKey();

				if (sap.ui.getCore().byId("vorhanden").getValue() == 0) {
					MessageBox.show(
						"Das ausgewählte Modell ist in dem ausgewählten Lagerort nicht vorrätig", {
						icon: MessageBox.Icon.ERROR,
						title: "Fehler",
						actions: [MessageBox.Action.OK],
						emphasizedAction: MessageBox.Action.YES,
						onClose: function (oAction) { }
					}
					);

				}
				else if (keyV == keyZ) {
					MessageBox.show(
						"Keine bestellung zum selben Lager möglich", {
						icon: MessageBox.Icon.ERROR,
						title: "Fehler",
						actions: [MessageBox.Action.OK],
						emphasizedAction: MessageBox.Action.YES,
						onClose: function (oAction) { }
					}
					);

				} else if (sap.ui.getCore().byId("anzahl").getValue() > sap.ui.getCore().byId("vorhanden").getValue()) {
					MessageBox.show(
						"Sie können nicht mehr bestellen, als verfügbar", {
						icon: MessageBox.Icon.ERROR,
						title: "Fehler",
						actions: [MessageBox.Action.OK],
						emphasizedAction: MessageBox.Action.YES,
						onClose: function (oAction) { }
					}
					);

				} else if (sap.ui.getCore().byId("anzahl").getValue() <= 0) {

					MessageBox.show(
						"Bitte geben sie eine Zahl größer als 0", {
						icon: MessageBox.Icon.ERROR,
						title: "Fehler",
						actions: [MessageBox.Action.OK],
						onClose: function (oAction) { }
					}
					);

				}


				else {
					var oModel = this.getView().getModel();
					var anzahl = sap.ui.getCore().byId("anzahl").getValue();
					var mengeV = Number(sap.ui.getCore().byId("vorhanden").getValue());
					var mengeZ = Number(sap.ui.getCore().byId("bestandziel").getValue());
					const quellPath = oModel.createKey("/FahrradmodellOrtSet", {
						// Key(s) and value(s) of that entity set
						"Modellid": modellKey, // with the value 999 for example
						"Ortid": keyV

					});
					const zielPath = oModel.createKey("/FahrradmodellOrtSet", {
						// Key(s) and value(s) of that entity set
						"Modellid": modellKey, // with the value 999 for example
						"Ortid": keyZ

					});

					MessageBox.show(
						"Wollen Sie die Bestellung in Auftrag geben?", {
						icon: MessageBox.Icon.QUESTION,
						title: "Bestellbestätigung",
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						emphasizedAction: MessageBox.Action.YES,
						onClose: function (oAction) {
							if (oAction === MessageBox.Action.YES) {
								MessageToast.show("Bestellung erfolgreich in Auftrag gegeben");
								MessageBox.show(
									"Bestellung erfolgreich erfasst", {
									icon: MessageBox.Icon.SUCCESS,
									title: "Bestellung erfolgreich",
									actions: [MessageBox.Action.OK],
									emphasizedAction: MessageBox.Action.YES,
									onClose: function (oAction) { }
								}
								);
								oModel.setProperty(quellPath + '/Bestand', mengeV - anzahl);
								oModel.setProperty(zielPath + '/Bestand', mengeZ + anzahl);
								oModel.submitChanges();
							} else {
								MessageToast.show("Bestellung nicht in Auftrag gegeben");
							}
						}
					}
					);



				}


			},

			onSelectZiel: function (oEvent) {
				var oSelectFahrrad = sap.ui.getCore().byId("fahrrad");
				var iFahrradID = oSelectFahrrad.getSelectedKey();


				var oInput2 = sap.ui.getCore().byId("bestandziel");
				var zielSelect = sap.ui.getCore().byId("ziel");
				var zielKey = zielSelect.getSelectedKey();
				const path2 = this.getView().getModel().createKey("/FahrradmodellOrtSet", {
					// Key(s) and value(s) of that entity set
					"Modellid": iFahrradID, // with the value 999 for example
					"Ortid": zielKey

				});
				oInput2.bindElement(path2);

			}




		});
	});