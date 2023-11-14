sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment) {
        "use strict";

        var goModel;

        return Controller.extend("sap.btp.ux400solving.controller.Main", {
            onInit: function () {
                var oData = {
                    list: []
                }

                goModel = new JSONModel(oData);
                this.getView().setModel(goModel, 'Main');

                var oModel = new JSONModel(oData);
                goModel = oModel;
                this.getView().setModel(oModel, 'Main');

            },

            onRandomPress: function () {            
                var oRand = Math.floor(Math.random()*100) + 1;
                this.byId("idInput").setValue(oRand);
                var oModel = this.getView().getModel("Main")
                var aData = goModel.getProperty("/list");
                var nRand = Number(this.byId("idInput").getValue())
                
                aData.push({Rand : nRand});
                goModel.setProperty('/list', aData);     

            },

            onOpenDialog: function () {
                var oDialog = sap.ui.getCore().byId("idDialog")
                var oModel = this.getView().getModel();

                if(!oDialog) {
                    Fragment.load({
                        name : 'sap.btp.ux400solving.view.Fragment.Products',
                        type : 'XML',
                        controller : this
                    }).then(function(oDialog) {
                        oDialog.setModel(oModel);
                        oDialog.open();
                    });
                }else{
                    oDialog.open();
                }
            },

            onClose: function () {
                var oDialog = sap.ui.getCore().byId("idDialog");
                oDialog.close();
            },
            
            formatter : {
                transformDiscontinued: function (value) {
                    if(value) {
                        return 'Yes';
                    }else{
                        return 'No';
                    }
                }
            },

            onValueChange: function () {
                if(1 <= value <= 100) {

                }else{
                    
                };
            }
        });
    });
