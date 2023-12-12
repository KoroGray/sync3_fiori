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

        return Controller.extend("ddmminven.controller.Main", {
            onInit: function () {
                var oModel = new JSONModel();

                this.getView().setModel(oModel, "value");
            },

            onValueHelpRequest: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView(),
                    oModel = oView.getModel(),
                    oDialog = this.byId("selectDialog").mForwardedAggregations;
                    
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        name : 'ddmminven.view.Fragment.ValueHelpDialog',
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
    
                this.byId("idInput2").setValue(oSelectedItem.getTitle());
            },

            onPress: function() {
                var oIcon = this.byId("idIconTabBar").mProperties.selectedKey,
                    aFilters = [],
                    oBinding = this.byId("idTable").getBinding("items"),
                    oInput = this.getView().byId("idInput")._lastValue,
                    oInput2 = this.getView().byId("idInput2")._lastValue,
                    oModel = this.getView().getModel();

                    if (oIcon === "Available") {
                        aFilters.push(
                            new Filter('Status', 'EQ', 'A', ''))
                        }else if (oIcon === "Reserved") {
                        aFilters.push(
                            new Filter('Status', 'EQ', 'R', ''))
                        }else if (oIcon === "Disposed") {
                            aFilters.push(
                                new Filter('Status', 'EQ', 'D', ''))
                        }else if (oIcon === 'Products') {
                            aFilters.push(
                                new Filter('Status', 'BT', 'A', 'R'))
                        }else{
                            aFilters.push(
                                new Filter('Status', 'EQ', '', ''))
                            sap.m.MessageToast.show("재고 상태를 선택하십시오.");
                        };

                    if (oInput) {
                        aFilters.push(
                            new Filter('Plcode', 'EQ', oInput, ''))}; 

                    if (oInput2) {
                        aFilters.push(
                            new Filter('Gdname', 'Contains', oInput2, ''))};

                    oBinding.filter(aFilters);

                    this.getView().getModel().read("/INVENTORYSet", {
                        filters : aFilters,
                        success : function(oReturn) {oModel.setProperty("/", oReturn.results)}         
                    }) 

            },

            onSelectionChange: function (oEvent) {
                var oDialog = sap.ui.getCore().byId("idDialog")
                var oModel = this.getView().getModel();
                var sPath = oEvent.getParameters().listItem.getBindingContextPath(),
                    oSelectItem = this.getView().getModel().getProperty(sPath),
                    aFilter = [],
                    gFilter = new Filter('Gdcode', 'EQ', oSelectItem.Gdcode),
                    dFilter = new Filter('Quan', 'GT', '0');

                if(oSelectItem.Exptype == 'O') {
                    if(!oDialog) {
                        Fragment.load({
                            name : 'ddmminven.view.Fragment.Expiration',
                            type : 'XML',
                            controller : this
                        }).then(function(oDialog) {
                            oDialog.setTitle('보관중인 ' + oSelectItem.Gdname + '의 재고 목록'); //  {Gdname}
                            oDialog.setModel(oModel);
                            aFilter.push(gFilter);
                            aFilter.push(dFilter);                        
                            sap.ui.getCore().byId("idExpTable").getBinding("rows").filter(aFilter);
                            oDialog.open();
                        });
                    }else{
                        oDialog.setTitle('보관중인 ' + oSelectItem.Gdname + '의 재고 목록'); //  {Gdname}
                        oDialog.setModel(oModel);                        
                        aFilter.push(gFilter);
                        aFilter.push(dFilter); 
                        sap.ui.getCore().byId("idExpTable").getBinding("rows").filter(aFilter);
                        oDialog.open();
                    }
                }else{
                    sap.m.MessageToast.show("선택한 제품은 유통 기한이 없습니다."); 
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
                        name : 'ddmminven.view.Fragment.ValueHelpDialog2',
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
                
                this.byId("idInput").setValue(obj.Plcode);

                sap.ui.getCore().byId("idClose").fireEvent('press');
                
            },

            formatter: {            
                fnDateToString: function(value) {
                    if(value) {
                        var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                            pattern : 'yyyy-MM-dd'
                        });

                        return oFormat.format(value);
                    }
                },

                fnSetIcon: function(Expfin) {
                    var date = new Date()

                    if(date < Expfin) {
                        var sec = parseInt(Expfin - date) / 1000,
                    	    days = parseInt(sec / 60 / 60 / 24);
                        if(days >= 60) {
                            return "sap-icon://circle-task-2";
                        } else {
                            return "sap-icon://alert";
                        }
                    } else {
                        return "sap-icon://decline";
                    }

                },

                fnSetColor: function(Expfin) {
                    var date = new Date()

                    if(date < Expfin) {
                        var sec = parseInt(Expfin - date) / 1000,
                    	    days = parseInt(sec / 60 / 60 / 24);
                        if(days >= 60) {
                            return "rgb(29, 219, 22)";
                        } else {
                            return "rgb(255, 228, 0)";
                        }
                    } else {
                        return "rgb(255, 0, 0)";
                    }

                },

                fnDateCalc: function(Expfin) {
                    var date = new Date()

                    if(date < Expfin) {
                        var sec = parseInt(Expfin - date) / 1000,
                    	    days = parseInt(sec / 60 / 60 / 24);

                            return days + "일";
                    } else {
                        return "기간 만료";
                    }

                },

                fnIconChange: function(Status) {
                    switch (Status) {
                        case "A": return '가용 재고';
                        break;
    
                        case "R": return '예약 재고';
                        break;
    
                        case "D": return '폐기 재고';
                        break;                   
                    }
                },

                fnInfoLabel: function(Status) {            
                    switch (Status) {
                        case "A": return 8;
                        break;
    
                        case "D": return 3;
                        break;
    
                        case "R": return 1;
                        break;
                    } 
                }
            }
        });
    });
