sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("project0504.controller.Main", {
            onInit: function () {
                var oData = { name : { 
                    firstName : 'hong',  // oData(변수).name.firstName
                    lastName : 'gildong' // oData(변수).name.lastName
                    },
                    inpValue : "Park Gildong",
                    txtValue : "", 
                    list : [
                        {name: 'KIM', age: 20, tel: '010-4445-1312'}, 
                        {name: 'MOON', age: 30, tel: '010-2341-1111'}, 
                        {name: 'PARK', age: 33, tel: '010-6666-2222'}
                    ]
                }; // json data
                var oModel = new JSONModel(oData); // json model
                
                // .setModel(모델객체, "모델이름");
                this.getView().setModel(oModel, 'main');
                this.getView().setModel(oModel, 'test')
            },

            onClick : function(oEvent) {
                // debugger; // 개발자도구(F12)가 켜져 있어야 실행됨
                var oModel = this.getView().getModel("main");
                // 모델에서 데이터 가져오기
                // oModel.getData()         : 전체 데이터 가져오기.
                // oModel.getProperty(경로) : 특정 데이터 가져오기.

                // var oData = oModel.getData().inpValue; // "Park Gildong"
                var oData = oModel.getProperty("/inpValue"); // "Park Gildong"
                console.log(oData);

                oModel.setProperty("/txtValue", oData);
            },

            onAdd : function(oEvent) {
                // 이벤트 함수에는 항상 
                // import parameter로 들어오는 event 객체가 존재함.
                // debugger;

                // oEvent.getSource => 이벤트를 일으킨 객체를 반환
                // oEvent.getParameters => 이벤트 관련 정보를 반환

                var oModel = this.getView().getModel("main");
                var aData = oModel.getProperty("/list");

                aData.push({
                    /* name : 'KIM', age : 20, tel : "010-XXXX-XXXX" */
                });
                oModel.setProperty("/list", aData);
            },

            onRowActionItem: function(oEvent) {
                // 내가 선택한 Row에 바인딩된 모델 경로 등을 알 수 있다.
                // oEvent.getParameter('row').getBindingContext('main')

                // 내가 선택한 Row의 Index 정보를 알 수 있다.
                var iIndex = oEvent.getParameter('row').getIndex();

                // Index 정보로 삭제 구현.
                var oModel = this.getView().getModel('main'),
                    aList = oModel.getData().list;

                // aList 배열 요소 중 iIndex 위치부터 1개 삭제.    
                aList.splice(iIndex, 1);

                oModel.setProperty("/list", aList);

            },

            onDelete : function() {
                var oTable = this.byId("idTable"),
                    aIndices = oTable.getSelectedIndices(),
                    aList = this.getView().getModel("main").getProperty("/list");
                // 예외처리. 사용자가 선택한 Row가 없는 경우 에러 메시지를 출력한다.
                if(!aIndices.length) { // !0은 true를 리턴함.
                    return sap.m.MessageBox.error("데이터를 선택하세요.");
                }
                // 선택된 index 중, 맨 마지막 index 부터 순차적으로 삭제한다.
                for(var i=aIndices.length-1; i>=0; i--) {
                    aList.splice(aIndices[i], 1);
                }
                // 삭제가 적용된 배열 데이터를 모델에 세팅한다.
                this.getView().getModel("main").setProperty("/list, aList");
            }
        });
    });
