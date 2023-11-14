sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment) {
        "use strict";

        return Controller.extend("project0506.controller.HelloPanel", {
            onInit: function () {

            },

            onOpenDialog: function () {
                var oDialog = sap.ui.getCore().byId("idDialog")

                if(!oDialog) {
                    Fragment.load({
                        name : 'project0506.view.Fragment.Dialog',
                        type : 'XML',
                        controller : this
                    }).then(function(oDialog) {
                        oDialog.open();
                    });
                }else{
                    oDialog.open();
                }
            },

            onClose: function () {
                var oDialog = sap.ui.getCore().byId("idDialog");
                oDialog.close();
            }
        });
    });
