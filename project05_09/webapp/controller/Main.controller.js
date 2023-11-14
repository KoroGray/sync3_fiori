sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("project0509.controller.Main", {
            onInit: function () {
                this._setChartInView();
            },

            _setChartInView: function() {
                var oModel = new JSONModel();
                oModel.loadData("../model/Products.json");

                this.getView().setModel(oModel, "view")
            }
        });
    });
