sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter) {
        "use strict";

        return Controller.extend("sap.btp.ux410solving.controller.Main", {
            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel({
                    OrderID : '',
                    combo : [
                        { type : 'bar' },
                        { type : 'column' },
                        { type : 'line' },
                        { type : 'donut' }
                    ]
                })

                this.getView().setModel(oModel, "Main");
                this._setChartInView();
            },

            _setChartInView: function() {
                var oModel = new JSONModel();
                oModel.loadData("../model/List.json");

                this.getView().setModel(oModel, 'view')
            },

            onSearch: function () {
                var oData = this.getView().byId("idComboBox1").getValue();
                var aFilter = [];
                var oType= this.getView().byId("idComboBox2").getValue();
                var oChart= this.getView().byId("idVizChart");

                if(!oType) {
                    this.getView().byId("idComboBox2").setValueState("Error");
                }else{
                     if(oData) {               
                        aFilter.push(new Filter('OrderID', 'EQ', oData));
                    }
                    // 테이블 객체를 가져와서 바인딩 정보를 가져온 후, Filter를 적용함.
                    this.byId("idFlatDSet").getBinding("data").filter(aFilter);
                    oChart.setVizType(oType);
                }               
            },

            onTypeChange: function () {
                var oType= this.getView().byId("idComboBox2").getValue();
               
                if(oType) {
                    this.getView().byId("idComboBox2").setValueState("None");
                }
            },

            onSelectData: function (oEvent) {
                var oRouter = this.getOwnerComponent().getRouter();
                
                oRouter.navTo("RouteDetail", {
                    OrderID : oEvent.getParameters().data[0].data.OrderID,
                    ProductID : oEvent.getParameters().data[0].data.ProductID
                });
            }
        });
    });
