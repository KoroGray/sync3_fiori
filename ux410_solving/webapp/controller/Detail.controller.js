sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History) {
        "use strict";

        return Controller.extend("sap.btp.ux410solving.controller.Detail", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();

                oRouter.getRoute('RouteDetail').attachPatternMatched(this._patternMatched, this);
            },
        
            _patternMatched: function(oEvent) {
                var oArgu = oEvent.getParameters().arguments;

                this.byId("detail").setTitle(oArgu.OrderID);
            
                this.getView().bindElement(`/Order_Details(OrderID=${oArgu.OrderID}, ProductID=${oArgu.ProductID})`)
            },

            onBack: function() {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if(sPreviousHash !== undefined) {
                    window.history.go(-1);
                }else{
                    this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteMain", {});
                }
            }
        });
    });
