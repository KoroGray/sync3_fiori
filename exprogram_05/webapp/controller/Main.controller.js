sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter) {
        "use strict";

        return Controller.extend("exam.exprogram05.controller.Main", {
            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel({
                    CategoryID : '',
                    ProductID : ''
                })

                this.getView().setModel(oModel, "Main");
            },

            onSearch: function() {
                var oData = this.getView().getModel("Main").getData();
                var aFilter = [];

                var iFilter = new Filter('CategoryID', 'GT', oData.CategoryID);
                var nFilter = new Filter('CategoryName', 'Contains', oData.CategoryName);
      
                var oID = this.getView().byId("idInput1").getValue();
                var oName = this.getView().byId("idInput2").getValue();

                    if(oID && oName) {
                        aFilter.push(new Filter({filters : [iFilter, nFilter], and : true}))
                        this.byId("idTable").getBinding("items").filter(aFilter);
                    }else{
                        this.byId("idTable").getBinding("items").filter();
                    };                
            },

            onSelectionChange: function(oEvent) {
                var sPath = oEvent.getParameters().listItem.getBindingContextPath();
                var oSelectItem = this.getView().getModel().getProperty(sPath);

                var iFilter = new Filter('CategoryID', 'EQ', oSelectItem.CategoryID);
                var pFilter = new Filter('CategoryName', 'EQ', oSelectItem.CategoryName);

                this.byId("idTable2").getBinding("rows").filter(iFilter);
                this.byId("idDataSet").getBinding("data").filter(pFilter);
        },

        onSelectData: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteDetail", {
                ProductName : oEvent.getParameters().data[0].data.ProductName
            });
        }
    });
});
