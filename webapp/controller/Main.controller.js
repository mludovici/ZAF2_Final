sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zaf2final.controller.Main", {
            onInit: function () {
                var oModel = new JSONModel();
                oModel.loadData("/data/artists.json", {}, false);
                this.getView().setModel(oModel, "ajsdlajsldjasd");

                var oModel2 = new OdataModel();
                oModel2.setData({
                    "movie": {},
                    "artist": {}
                });
                this.getView().setModel(oModel2, "asaasdasd");
            },

            onCollapseAll: function () {
                var oTreeTable = this.byId("TreeTableBasic");
                oTreeTable.collapseAll();
            },


            onExpandFirstLevel: function () {
                var oTreeTable = this.byId("TreeTableBasic");
                oTreeTable.expandToLevel(1);
            },

            onExpandSelection: function () {
                var oTreeTable = this.byId("TreeTableBasic");
                oTreeTable.expand(oTreeTable.getSelectedIndices());
            },

            onRowSelectionChange: function () {
                debugger;
                //TEST
                //Iasdasdasd("splitapp01");
                var oTable = this.getView().byId("TreeTableBasic");

                var oModelDet = this.getView().getModel("detailMod");
                //Get the selected row
                var iSelRowId = oTable.getSelectedIndex();
                //Find the movie Object and set the "Single Movie" Object
                var sMovModPath = oTable.getContextByIndex(iSelRowId).getPath(); //"/artRoot/0/artMovies/1"
                var oMovie = oModel.getObject(sMovModPath);
                oModelDet.setProperty("/movie", oMovie);
                //Determine the artist path and set the "Single Movie" Object
                var iIdx = sMovModPath.indexOf("/artMovies");
                var sMovArtPath = "";

                var oArtist = oModel.getObject(sMovArtPath);
                oModelDet.setProperty("/artist", oArtist);
                //Call the detail page
                oSplitApp.toDetail(this.createId("DetailPage"));
            }
        });
    });