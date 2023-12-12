sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
	"sap/ui/model/Filter",
	"sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, Fragment) {
        "use strict";

        return Controller.extend("ddsrmanage.controller.Main", {
            onInit: function () {
                var oModel = new JSONModel({
                    Gdcode : '',
                    Stock : [],
                    Release : []
                })

                this.getView().setModel(oModel, "Main");
                
                var oFilter = this.getView().byId("objectFilter"),
				that = this;
				
                oFilter.addEventDelegate({
                    "onAfterRendering": function(oEvent) {
                        var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();

                        var oButton = oEvent.srcControl._oSearchButton;
                        oButton.setText(oResourceBundle.getText("조회"));
                    }
                });
                
            },

            onValueHelp: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView(),
                    oModel = oView.getModel(),
                    oDialog = this.byId("selectDialog") //.mForwardedAggregations;
                    
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        name : 'ddsrmanage.view.Fragment.ValueHelp',
                        type : 'XML',
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.setModel(oModel, "view");
                        return oDialog;
                    });
                }
                this._pValueHelpDialog.then(function(oDialog) {
                    oDialog.open(sInputValue);
                });
            },
    
            onValueHelpSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value"),
                    oFilter = new Filter('Gdname', 'Contains', sValue)

                oEvent.getSource().getBinding("items").filter([oFilter]); 
            },
    
            onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
    
                if (!oSelectedItem) {
                    return;
                }
    
                this.byId("idInput").setValue(oSelectedItem.getTitle());
            },

            onSearch: function() {
                var oData = this.getView().getModel("Main").getData(),
                    aFilter = [],
                    mFrom = oData.Erdat + '-01',
                    mEnd = oData.Erdat + '-31';

                var cFilter = new Filter('Gdcode', 'EQ', oData.Gdcode);
                
                var dFilter = new Filter('Erdat', 'BT', mFrom, mEnd)
debugger;
                aFilter.push(new Filter({filters : [cFilter, dFilter], and : true}));

                this.byId("idTable").getBinding("items").filter(aFilter);
            },

            formatter: {            
                fnDateChange: function(Erdat) {
                    if(Erdat) {
                        var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                            pattern : 'yyyy-MM-dd'
                        });

                        return oFormat.format(Erdat);
                    }
                },

                fnQuanChange1: function(Srtype, Quantity) {
                    switch (Srtype) {
                        case "GR": return Quantity;
                        break;
    
                        case "PR": return Quantity;
                        break;
    
                        case "GI": return '0';
                        break;
    
                        case "MD": return '0';
                        break;
    
                        case "DI": return '0';
                        break;   
                    }

                },

                fnQuanChange2: function(Srtype, Quantity) {
                    switch (Srtype) {
                        case "GR": return '0';
                        break;
    
                        case "PR": return '0';
                        break;
    
                        case "GI": return Quantity;
                        break;
    
                        case "MD": return Quantity;
                        break;
    
                        case "DI": return Quantity;
                        break;   
                    }

                },

                fnTypeChange: function(Status) {
                    switch (Srtype) {
                        case "GR": return '구매 입고';
                        break;
    
                        case "PR": return '생산 입고';
                        break;
    
                        case "GI": return '판매 출고';
                        break;
    
                        case "MD": return '생산 출고';
                        break;
    
                        case "DI": return '폐기 처리';
                        break;                       
                    }
                }
            }
        });
    });
