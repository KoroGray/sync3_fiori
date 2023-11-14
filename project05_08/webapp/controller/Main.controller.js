sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, FlattenedDataset, FeedItem) {
        "use strict";

        return Controller.extend("project0508.controller.Main", {
            onInit: function() {
                this._setChartInView();
                this._setChartInController();
            },

            _setChartInView: function() {
                var oModel = new JSONModel();
                oModel.loadData("../model/List.json");

                this.getView().setModel(oModel, 'view')
            },

            _setChartInController: function() {
                var oModel = new JSONModel();
                oModel.loadData("../model/Sales.json"); // json 파일 데이터 로드하기

                this.getView().setModel(oModel, "cont");

                // chart
                var oChart = this.byId("idChart");
                // dataset
                var oDataset = new FlattenedDataset({
                    dimensions: [
                        { name: 'Product', value: '{cont>product}'}
                    ],
                    measures: [
                        { name: 'Amount', value: '{cont>amount}'}
                    ],
                    data: { path : 'cont>/sales' }
                });

                oChart.setDataset(oDataset);

                // feed
                var feedValueAxis = new FeedItem({
                    uid : "valueAxis",
                    type : "Measure",
                    values : ["Amount"]
                });

                var feedCategoryAxis = new FeedItem({
                    uid : "categoryAxis",
                    type : "Dimension",
                    values : ["Product"]
                });

                oChart.addFeed(feedValueAxis);
                oChart.addFeed(feedCategoryAxis);

                // (Optional) property setting
                oChart.setVizProperties({
                    title : { text : 'Sales Data' },
                    plotArea : { colorPalette : ['#B7F0B1', '#8041D9'] }
                })

                oChart.setVizType("bar")
            }
        });
    });
