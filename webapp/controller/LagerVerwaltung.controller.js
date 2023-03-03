sap.ui.define([
    "sap/ui/core/mvc/Controller",    
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History) {
        var _oRouter = null;

        return Controller.extend("ZAF2_Final.controller.Main", {
            
            onInit: function () {
                this._oRouter = this.getOwnerComponent().getRouter();

            },

            onNavBack: function() {
                var oHistory = History.getInstance();
                var oPrevHash = oHistory.getPreviousHash();
                if (oPrevHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.toMain();
                }
            },
            toMain: function () {
                this._oRouter.navTo("RouteMain");
            },




    });
});