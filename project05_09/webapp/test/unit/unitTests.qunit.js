/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"project05_09/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
