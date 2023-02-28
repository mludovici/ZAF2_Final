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
                alert("HELLO Moon!");
            }
        });
    });
