/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"dd_mm_inven/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
