sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

    var goModel;

        return Controller.extend("project0503.controller.Main", {
            onInit: function () {
                // 초기값 세팅 - 화면이 뜨자마자 각 Input에 10, 20을 세팅
                
                this.byId("idInt1").setValue("10")
                this.byId("idInt2").setValue("20")

                var oData = {
                    list: []
                }

                goModel = new JSONModel(oData);
                this.getView().setModel(goModel, 'main');

                var oModel = new sap.ui.model.json.JSONModel({
                    combo : [
                        { key : 'PLUS', text : '+' },
                        { key : 'MINUS', text : '-' },
                        { key : 'MULTIPLE', text : '*' },
                        { key : 'DIVISION', text : '/' }
                    ],
                    history : []
                });

                this.getView().setModel(oModel)

                this._oModel = oModel;
            },
        
            onCalc: function(oEvent) {
                var oSelect = this.getView().byId("idSelect");
                // 가져온 객체는 sap.m.Select 객체임.
                var sSelectedKey = oSelect.getSelectedKey();

                var oModel = this.getView().getModel("main");
                var aData = oModel.getProperty("/list");

                var sInt1 = this.getView().byId("idInt1");
                var sInt2 = this.getView().byId("idInt2");
                var sItem = oSelect.getSelectedItem().getText();

                switch (sSelectedKey) {
                    case "PLUS": var oText = Number(sInt1.getValue()) + Number(sInt2.getValue());
                    break;

                    case "MINUS": var oText = Number(sInt1.getValue()) - Number(sInt2.getValue());
                    break;

                    case "MULTIPLE": var oText = Number(sInt1.getValue()) * Number(sInt2.getValue());
                    break;

                    case "DIVISION": var oText = Number(sInt1.getValue()) / Number(sInt2.getValue());
                    break;                    
                }
                sap.m.MessageToast.show(oText);

                // aData.push({ 1 : sInt1.getValue(), 2 : sItem, 3: sInt2.getValue() , 4 : oText });
                // aData.unshift({ 1 : sInt1.getValue(), 2 : sItem, 3: sInt2.getValue() , 4 : oText });
                // goModel.setProperty('/list', aData);
                
                this._addHistory({
                    FNUM : sInt1.getValue(), OPER : sItem, LNUM : sInt2.getValue(), RESULT : oText
                });
            },

            _addHistory: function(result) {
                var oModel = this.getView().getModel();
                var aHistory = oModel.getData().history;

                aHistory.push(result);
                oModel.setProperty('/history', aHistory)
            }
        });
    });