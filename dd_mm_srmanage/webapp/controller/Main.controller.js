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

        return Controller.extend("ddmmsrmanage.controller.Main", {
            onInit: function () {
                var oModel = new JSONModel({
                    Gdname : '',
                    Erdat : '',
                    Year : '',
                    Srtype : ''});

                this.getView().setModel(oModel, "Main");

                var Today = new Date().getFullYear();                
                this.byId("idDate2").setValue(Today);

                this.getView().setModel(new JSONModel({
                    SRMANAGESet : []
                }), '');
            },

            onValueHelp: function (oEvent) {
                var sInputValue = oEvent.getSource().getValue(),
                    oView = this.getView(),
                    oModel = oView.getModel(),
                    oDialog = this.byId("selectDialog") //.mForwardedAggregations;
                    
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        name : 'ddmmsrmanage.view.Fragment.ValueHelp',
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
                    date = new Date(oData.Erdat),
                    aFilter = [],
                    oInput = this.getView().byId("idInput")._lastValue,
                    idDate = this.getView().byId("idDate")._lastValue,
                    idInput = this.getView().byId("idInput")._lastValue,
                    mFrom = oData.Erdat,
                    mMid = date.setMonth(date.getMonth() + 1),
                    mEnd = new Date(mMid),
                    cFilter = new Filter('Gdname', 'Contains', oInput),
                    dFilter = new Filter('Erdat', 'BT', mFrom, mEnd);
                
                    mEnd = mEnd.setDate(mEnd.getDate() - 1);

                if (idDate) {
                    if (idInput) {
                        aFilter.push(new Filter({filters : [cFilter, dFilter], and : true}));
                        this.byId("idTable").getBinding("items").filter(aFilter);                        
                    } else {
                        this.byId("idTable").getBinding("items").filter(dFilter);
                    };
                } else {
                    if (idInput) {
                        this.byId("idTable").getBinding("items").filter(cFilter);
                    } else {
                        aFilter.push(new Filter({filters : [ ], and : true}));
                        this.byId("idTable").getBinding("items").filter(aFilter);
                    };
                };
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

                fnQuanChange1: function(Quantity, Srtype) {

                    switch (Srtype) {
                        case "GR": return Quantity;
                        break;
    
                        case "PR": return Quantity;
                        break;
    
                        case "GI": return '';
                        break;
    
                        case "MD": return '';
                        break;
    
                        case "DI": return '';
                        break;
                    }

                },

                fnQuanChange2: function(Quantity, Srtype) {
                    switch (Srtype) {
                        case "GR": return '';
                        break;
    
                        case "PR": return '';
                        break;
    
                        case "GI": return Quantity;
                        break;
    
                        case "MD": return Quantity;
                        break;
    
                        case "DI": return Quantity;
                        break;
                    }

                },

                fnTypeChange: function(Srtype) {
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
                   
                },

                fnInfoLabel1: function(Gdcode) {  
                    var gCode = Gdcode.substr(0, 1);
                    switch (gCode) {
                        case "P": return 3;
                        break;
    
                        case "R": return 1;
                        break;
    
                        case "A": return 6;
                        break;
                    } 
                },

                fnInfoLabel2: function(Srtype) {               
                    switch (Srtype) {
                        case "GR": return 3;
                        break;
    
                        case "PR": return 1;
                        break;
    
                        case "GI": return 6;
                        break;
    
                        case "MD": return 8;
                        break;
    
                        case "DI": return 5;
                        break; 
                    } 
                }
            },

            onSelectData: function (oEvent) {
                debugger;
                var oDialog = sap.ui.getCore().byId("PieChart"),
                    oModel = this.getView().getModel(),
                    sPath = oEvent.getParameters(),
                    sYear = this.getView().byId("idDate2"), 
                    oYear = sYear.mProperties.dateValue.getYear() + 1900,
                    oMonth = sPath.data[0].data.월별.substr(0, 2),
                    aFilter = [],
                    dFrom = new Date(oYear + '-' + oMonth + '-01'),
                    dEnd = new Date(oYear + '-' + oMonth + '-30');

                if(!oDialog) {
                    Fragment.load({
                        name : 'ddmmsrmanage.view.Fragment.PieChart',
                        type : 'XML',
                        controller : this
                    }).then(function(oDialog) {
                        var oChartDataset = sap.ui.getCore().byId("idChart");
                        oDialog.setTitle(oYear + '년 ' + sPath.data[0].data.월별 + ' ' +sPath.data[0].data.measureNames + ' 차트');
                        oDialog.setModel(oModel);
                        aFilter.push(new Filter('Erdat', 'BT', dFrom, dEnd));
                        if(sPath.data[0].data.measureNames == '입고량') {
                            aFilter.push(new Filter('Srtype', 'EQ', 'GR', ''));
                            aFilter.push(new Filter('Gdcode', 'Contains', 'R', ''));

                        }else if(sPath.data[0].data.measureNames = '출고량') {
                            aFilter.push(new Filter('Srtype', 'EQ', 'GI', ''));
                            aFilter.push(new Filter('Gdcode', 'Contains', 'P', '')); 
                            sap.ui.getCore().byId("idCombo").setVisible(false);
                        };  
                        oDialog.open(); 
                        oChartDataset.getAggregation('dataset').getBinding("data").filter(new Filter({filters:aFilter, and:true}));
                        if(sPath.data[0].data.measureNames == '입고량') {
                            sap.ui.getCore().byId("idCombo").setValue("원자재");
                        }else if(sPath.data[0].data.measureNames = '출고량') {   
                        };
                        
                    });
                }else{
                    var oChartDataset = sap.ui.getCore().byId("idChart");
                    oDialog.setTitle(oYear + '년 ' + sPath.data[0].data.월별 + ' ' +sPath.data[0].data.measureNames + ' 차트');
                    oDialog.setModel(oModel);
                    aFilter.push(new Filter('Erdat', 'BT', dFrom, dEnd));
                    if(sPath.data[0].data.measureNames == '입고량') {
                        aFilter.push(new Filter('Srtype', 'EQ', 'GR', ''));
                        aFilter.push(new Filter('Gdcode', 'Contains', 'R', ''));
                    }else if(sPath.data[0].data.measureNames = '출고량') {
                        aFilter.push(new Filter('Srtype', 'EQ', 'GI', ''));
                        aFilter.push(new Filter('Gdcode', 'Contains', 'P', ''));
                        sap.ui.getCore().byId("idCombo").setVisible(false);    
                    };
                    oChartDataset.getAggregation('dataset').getBinding("data").filter(new Filter({filters:aFilter, and:true}));
                    oDialog.open();                  
                    if(sPath.data[0].data.measureNames == '입고량') {
                        sap.ui.getCore().byId("idCombo").setValue("원자재");
                    }else if(sPath.data[0].data.measureNames = '출고량') { 
                    };                   
                }
              
            },

            onClose: function () {
                var oDialog = sap.ui.getCore().byId("PieChart");
                oDialog.close();
            },

            changeYear: function () {
                var idDate = this.getView().byId("idDate2")._lastValue,                    
                    oFilter = new Filter('Sryear', 'EQ', idDate, '');
                
                    this.byId("idDataSet").getBinding("data").filter(oFilter);                  
            },

            onSelectionChange: function (oEvent) {
                debugger;
                var sValue = oEvent.getParameters().selectedItem.getText(), //sap.ui.getCore().byId("idCombo").mProperties.value,
                    oModel = this.getView().getModel(),
                    aFilter = [],
                    oDialog = sap.ui.getCore().byId("PieChart"),
                    oTitle = oDialog.getTitle(),
                    oYear = oTitle.substr(0, 4),
                    oMonth = oTitle.substr(6, 2),
                    oType = oTitle.substr(10, 2),                    
                    oFrom = oYear + '-' + oMonth + '-01',
                    oEnd = oYear + '-' + oMonth + '-30',
                    dFrom = new Date(oFrom),
                    dEnd = new Date(oEnd),
                    oChartDataset = sap.ui.getCore().byId("idChart").getAggregation('dataset');

                    aFilter.push(new Filter('Erdat', 'BT', dFrom, dEnd));

                    if (oType == '입고') {
                        aFilter.push(new Filter('Srtype', 'EQ', 'GR', ''));
                    } else if (oType == '출고') {
                        aFilter.push(new Filter('Srtype', 'EQ', 'GI', ''));
                    };

                switch(sValue) {
                    case "완제품":
                        aFilter.push(new Filter('Gdcode', 'Contains', 'P', ''));
                        oDialog.setModel(oModel);
                        oChartDataset.getBinding("data").filter(new Filter({filters:aFilter, and:true}));
                        break;

                    case "원자재" :
                        aFilter.push(new Filter('Gdcode', 'Contains', 'R', ''));
                        oDialog.setModel(oModel);
                        oChartDataset.getBinding("data").filter(new Filter({filters:aFilter, and:true}));                   
                        break;

                    case "부자재" :
                        aFilter.push(new Filter('Gdcode', 'Contains', 'A', ''));
                        oDialog.setModel(oModel);
                        oChartDataset.getBinding("data").filter(new Filter({filters:aFilter, and:true}));                 
                        break;
                }
            }

        });
    });
