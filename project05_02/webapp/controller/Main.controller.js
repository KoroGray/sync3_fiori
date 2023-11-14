sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Button"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Button) {
        "use strict";

        return Controller.extend("project0502.controller.Main", {
            TEXT : {
                'firstName' : 'A',
                'lastName' : 'hihi'
            },
            // Initialization 함수이며 Controller 로드 시 자동 실행
            onInit: function () {
                var sText = this.TEXT.firstName; // 'A'
                // 여기서 this는 Controller를 가리킨다.
                console.log(sText);
            },

            onClick: function() {
                alert('Click!');
            },

            onChange: function() {
                // Input 객체 가져오기
                var oInput = this.getView().byId("idInput");

                console.log(oInput.getValue());

                var oText = this.getView().byId("idText");

                oText.setText(oInput.getValue());
            }
        });
    });
