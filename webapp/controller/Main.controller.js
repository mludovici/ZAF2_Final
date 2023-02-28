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
                this.o_bikesModel = this.getView().getModel("bikesModel");
                this.getView().setModel(this.o_bikesModel, "bikesModel");
            },
            onItemPressed: function () {
                alert("bike item pressed!");
            }
        });
    });