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

        return Controller.extend("exam.exprogram05.controller.Detail", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();

                oRouter.getRoute('RouteDetail').attachPatternMatched(this._patternMatched, this);

                var oModel = new sap.ui.model.json.JSONModel({
                    ProductName : ''
                })

                this.getView().setModel(oModel, "Detail");
            },
        
            // 라우터 패턴이 "일치할 때마다" 실행
            _patternMatched: function(oEvent) {
                // 이벤트 객체의 파라미터 정보에 arguments에서 넘겨받은 데이터 확인
                var oArgu = oEvent.getParameters().arguments;
                var oTitle = oArgu.ProductName;
                var rTitle = oTitle + " 상품의 주문 조회";

                this.getView().bindElement(`/Order_Details_Extendeds(${oArgu.ProductName})`)

                this.byId("detail").setTitle(rTitle);

                var oFilter = new Filter('ProductName', 'EQ', oArgu.ProductName);

                this.byId("idDetailTable").getBinding("items").filter(oFilter);
            },

            onBack: function() {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if(sPreviousHash !== undefined) {
                    window.history.go(-1);
                }else{
                    this.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteMain", {});
                }
            }
        });
    });
