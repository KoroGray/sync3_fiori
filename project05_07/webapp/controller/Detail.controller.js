sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, Filter) {
        "use strict";

        return Controller.extend("odata.project0507.controller.Detail", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();

                // Detail 라우터에 패턴 매치드 이벤트 붙이기
                oRouter.getRoute('RouteDetail').attachPatternMatched(this._patternMatched, this);
            },
        
            // 라우터 패턴이 "일치할 때마다" 실행
            _patternMatched: function(oEvent) {
                // 이벤트 객체의 파라미터 정보에 arguments에서 넘겨받은 데이터 확인
                var oArgu = oEvent.getParameters().arguments;
                // oArgu => { OrderID : 'hihi', option : 123 }

                this.byId("detail").setTitle(oArgu.OrderID);
            
                // '/Orders() 데이터 바인딩
                this.getView().bindElement(`/Orders(${oArgu.OrderID})`)}, //, {
            //         success: function(oReturn) {
                        
            //         }
            // }},

            // 뒤로 가기
            onBack: function() {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if(sPreviousHash !== undefined) {
                    // sap router 히스토리가 없는 경우에는
                    // window 히스토리에서 뒤로 가기
                    window.history.go(-1);
                }else{
                    // sap router 히스토리가 있으면 메인 화면으로 이동
                    this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteMain", {});
                }
            },

            onRead: function() {
                var oDataModel= this.getView().getModel();
                var oFilter = new Filter('CustomerID', 'EQ', 'VINET');

                // SEGW URI : OdataService_SRV/CarrierSet?$filter=CustomerID eq 'VINET'
                oDataModel.read("/Orders", {
                    filters : [oFilter],
                    success : function(oReturn) {
                        debugger;
                        oReturn.results // [ {}, {}, {}, {}, ... ]
                    }
                });
            }
        });
    });
