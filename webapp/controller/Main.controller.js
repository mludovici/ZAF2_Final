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
                oModel.loadData("/data/arsdfsdfsdfsts.json", {}, false);

                oModel2.setData({
                    "movie": { "TEST"},
                    "artist": {"Test Artist"}
                });
                this.getView().setModel(oModel2, "asaasdasd");
            },


            onExpandFirstLevel: function () {
                var oTreeTable = this.byId("TreeTableBasic");

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