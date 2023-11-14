sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("mentor.mentorhs.controller.Main", {
            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel({
                    CustomerID : ''
                })

                this.getView().setModel(oModel, "Main");
            },

            // formatter 함수
            formatter : {
                fnDateToString: function (value) {
                    if(value) {
                        var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                            pattern : 'yyyy-MM-dd'
                        });

                        return oFormat.format(value);  
                    }
                },

                fnFreightSum: function (via, freight) {
                    if(via && freight) {
                        return via * Number(freight);
                    }
                }
            },

            onValueHelp: function() {
                var oDialog = sap.ui.getCore().byId("idDialog");
                var oModel = this.getView().getModel();
                
                if(!oDialog) {
                    Fragment.load({
                        name : 'mentor.mentorhs.view.Fragment.Customer',
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

            onClose: function(oEvent) {
                // 이벤트를 일으킨 객체(Button)로부터 접근하여 Dialog 닫기
                oEvent.getSource().getParent().close();

                // sap.ui.getCore().byID("idDialog");
                // this.getView().byID("idDialog").close();
            },

            onSearch: function() {
                var oData = this.getView().getModel("Main").getData(); // {CustomerID : ''}
                var aFilter = [];

                if(oData.CustomerID) {
                    // var oFilter = new Filter({
                    //     path : 'CustomerID', // 필터 대상 필드 이름
                    //     operator : 'EQ', // 조건 (EQ, NE, GT, GE, BT, ...)
                    //     value1 : oData.CustomerID, // From 값
                    //     value2 : '' // To 값
                    // });
                    // var oFilter = new Filter('CustomerID', 'EQ', oData.CustomerID);                
                    aFilter.push(new Filter('CustomerID', 'EQ', oData.CustomerID));

                    // 필터 조건이 여러개인 경우.
                    // new Filter({filters : [필터객체1,2,3 ...], and :true/false});
                }
                
                // 테이블 객체를 가져와서 바인딩 정보를 가져온 후, Filter를 적용함.
                this.byId("idTable").getBinding("items").filter(aFilter);
            },

            onRowSelectionChange : function(oEvent) {
                /*
                선택한 Row의 모델 데이터를 얻는 방법
                1-1. Context 객체에서 경로 얻기
                    var sPath = oEvent.getParameters().rowContext.getPath();
                1-2. 해당 경로를 사용하여 Model에서 데이터 얻기
                    var obj = this.getView().getModel().getProperty(sPath);

                2. Context 객체에서 모델 데이터 얻기
                    var obj = oEvent.getParameters().rowContext.getObject();

                ==> obj 변수에 내가 선택한 Row의 모델 정보가 들어간다.
                */
                var obj = oEvent.getParameters().rowContext.getObject();
                obj.CustomerID;

                // 내가 화면에서 버튼을 클릭하지 않더라도
                // Controller의 특정 구간에서 버튼의 press 이벤트를 실행시킬 수 있다.
                sap.ui.getCore().byId("idCustClose").fireEvent('press');
                
                this.getView().getModel('Main').setProperty("/CustomerID", obj.CustomerID)
                
            },

            // Detail.view.xml 로 이동
            onNavDetail : function() {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteDetail", {
                    OrderID : "hihi", // 필수 파라미터
                    option : 123      // 옵션 파라미터
                })
            },

            onSelectionChange : function(oEvent) {
                var oRouter = this.getOwnerComponent().getRouter();
                var sPath = oEvent.getParameters().listItem.getBindingContextPath();
                var oSelectItem = this.getView().getModel().getProperty(sPath);
                
                oRouter.navTo("RouteDetail", {
                    OrderID : oSelectItem.OrderID
                })
            },

            onSuggest : function(oEvent) {
                var sTerm = oEvent.getParameter("suggestValue");
                var aFilters = [];
                if (sTerm) {
                    aFilters.push(new Filter("CustomerID", FilterOperator.StartsWith, sTerm));
                }
                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            }
        });
    });
