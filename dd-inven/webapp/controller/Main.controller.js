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

        return Controller.extend("ddinven.controller.Main", {
            onInit: function () {
                var oModel = new JSONModel() 

                oModel.loadData("../model/List.json");

                this.getView().setModel(oModel, 'value')

                this.getView().setModel(new JSONModel({
                    value : []
                }), 'value2');
            },

            onFilterSelect: function (oEvent) {
                var oBinding = this.byId("idTable").getBinding("items"),
                    sKey = oEvent.getParameter("key"),
                    aFilters = [],
                    oData = this.getView().getModel("value").getData()

                if (sKey === "Products") {
                    aFilters.push(
                        new Filter({
                            path : 'status',
                            operator : 'BT',
                            value1 : 'A',
                            value2 : 'R'
                        })
                    );
                } else if (sKey === "Available") {
                    aFilters.push(
                        new Filter({
                            path : 'status',
                            operator : 'EQ',
                            value1 : 'A',
                            value2 : ''
                        })
                    );
                } else if (sKey === "Reserved") {
                    aFilters.push(
                        new Filter({
                            path : 'status',
                            operator : 'EQ',
                            value1 : 'R',
                            value2 : ''
                        })
                    );
                } else if (sKey === "Disposed") {
                    aFilters.push(
                        new Filter({
                            path : 'status',
                            operator : 'EQ',
                            value1 : 'D',
                            value2 : ''
                        })
                    );
                } else {
                    sap.m.MessageToast.show("재고 상태를 선택하십시오.");
                };

                if (!oData.gdname) {
                    sap.m.MessageToast.show("품목을 선택하십시오.");                                                       
                } else {
                    aFilters.push(
                        new Filter({
                            path : 'gdname',
                            operator : 'Contains',
                            value1 : oData.gdname,
                            value2 : ''
                        })
                    );
                    oBinding.filter(aFilters);                                           
                };

            },

            onValueHelpRequest: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView(),
                    oModel = oView.getModel(),
                    oDialog = this.byId("selectDialog").mForwardedAggregations
                    
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        name : 'ddinven.view.Fragment.ValueHelpDialog',
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
                    oFilter = new Filter('gdname', 'Contains', sValue)

                oEvent.getSource().getBinding("items").filter([oFilter]); 
            },
    
            onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
    
                if (!oSelectedItem) {
                    return;
                }
    
                this.byId("idInput2").setValue(oSelectedItem.getTitle());
            },

            onPress: function() {
                var oData = this.getView().getModel("value").getData(),
                    oIcon = this.byId("idIconTabBar").mProperties.selectedKey,
                    aFilters = [],
                    oBinding = this.byId("idTable").getBinding("items")

                    if (oIcon === "Products") {
                        aFilters.push(
                            new Filter({
                                path : 'status',
                                operator : 'BT',
                                value1 : 'A',
                                value2 : 'R'
                            })
                        );

                        if (!oData.plcode) {
                            sap.m.MessageToast.show("공장을 선택하십시오."); 
                        } else {
                            aFilters.push(
                                new Filter({
                                    path : 'plcode',
                                    operator : 'EQ',
                                    value1 : oData.plcode,
                                    value2 : ''
                                })
                            );
                            
                            if (!oData.gdname) {
                                sap.m.MessageToast.show("품목을 선택하십시오.");                                                       
                            } else {
                                aFilters.push(
                                    new Filter({
                                        path : 'gdname',
                                        operator : 'Contains',
                                        value1 : oData.gdname,
                                        value2 : ''
                                    })
                                );
                                oBinding.filter(aFilters);                                           
                            };
                        }
                                       
                    } else if (oIcon === "Available") {
                        aFilters.push(
                            new Filter({
                                path : 'status',
                                operator : 'EQ',
                                value1 : 'A',
                                value2 : ''
                            })
                        );

                        if (!oData.plcode) {
                            sap.m.MessageToast.show("공장을 선택하십시오."); 
                        } else {
                            aFilters.push(
                                new Filter({
                                    path : 'plcode',
                                    operator : 'EQ',
                                    value1 : oData.plcode,
                                    value2 : ''
                                })
                            );
                            
                            if (!oData.gdname) {
                                sap.m.MessageToast.show("품목을 선택하십시오.");                                                       
                            } else {
                                aFilters.push(
                                    new Filter({
                                        path : 'gdname',
                                        operator : 'Contains',
                                        value1 : oData.gdname,
                                        value2 : ''
                                    })
                                );
                                oBinding.filter(aFilters);                                           
                            };
                        }

                    } else if (oIcon === "Reserved") {
                        aFilters.push(
                            new Filter({
                                path : 'status',
                                operator : 'EQ',
                                value1 : 'R',
                                value2 : ''
                            })
                        );

                        if (!oData.plcode) {
                            sap.m.MessageToast.show("공장을 선택하십시오."); 
                        } else {
                            aFilters.push(
                                new Filter({
                                    path : 'plcode',
                                    operator : 'EQ',
                                    value1 : oData.plcode,
                                    value2 : ''
                                })
                            );
                            
                            if (!oData.gdname) {
                                sap.m.MessageToast.show("품목을 선택하십시오.");                                                       
                            } else {
                                aFilters.push(
                                    new Filter({
                                        path : 'gdname',
                                        operator : 'Contains',
                                        value1 : oData.gdname,
                                        value2 : ''
                                    })
                                );
                                oBinding.filter(aFilters);                                           
                            };
                        }

                    } else if (oIcon === "Disposed") {
                        aFilters.push(
                            new Filter({
                                path : 'status',
                                operator : 'EQ',
                                value1 : 'D',
                                value2 : ''
                            })
                        );

                        if (!oData.plcode) {
                            sap.m.MessageToast.show("공장을 선택하십시오."); 
                        } else {
                            aFilters.push(
                                new Filter({
                                    path : 'plcode',
                                    operator : 'EQ',
                                    value1 : oData.plcode,
                                    value2 : ''
                                })
                            );
                            
                            if (!oData.gdname) {
                                sap.m.MessageToast.show("품목을 선택하십시오.");                                                       
                            } else {
                                aFilters.push(
                                    new Filter({
                                        path : 'gdname',
                                        operator : 'Contains',
                                        value1 : oData.gdname,
                                        value2 : ''
                                    })
                                );
                                oBinding.filter(aFilters);                                           
                            };
                        }

                    } else {
                        sap.m.MessageToast.show("재고 상태를 선택하십시오.");
                    };

                    // var A = this.getView().getModel('value').getData();

                    // delete A.gdname;

                    // this.getView().setModel(A,'value2')

                    // this.byId('idTable').getBinding("items").filter(aFilters);

                    // this.getView().getModel().read() //read(EntitySET)
                    
            },

            onSelectionChange: function () {
                var oDialog = sap.ui.getCore().byId("idDialog")
                var oModel = this.getView().getModel();

                if(!oDialog) {
                    Fragment.load({
                        name : 'ddinven.view.Fragment.Expiration',
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
            
            onValueHelpRequest2: function() {
                var oDialog = sap.ui.getCore().byId("idDialog2");
                var oModel = this.getView().getModel();
                
                if(!oDialog) {
                    Fragment.load({
                        name : 'ddinven.view.Fragment.ValueHelpDialog2',
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

            onClose2: function () {
                var oDialog = sap.ui.getCore().byId("idDialog2");
                oDialog.close();
            },

            onRowSelectionChange : function(oEvent) {
                var obj = oEvent.getParameters().rowContext.getObject();
                obj.Plcode;

                sap.ui.getCore().byId("idClose").fireEvent('press');
                
                this.getView().getModel('value').setProperty("/Plcode", obj.Plcode)
                
            }
        });
    });
