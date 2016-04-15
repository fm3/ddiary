"use strict";

window.onload = initialize;

function initialize() {
  console.log("hallo?");
  screenConsole.initialize();
  graph.initialize();
  dayNavigation.initialize();

  doubleTaps.makeDoubleTappable(graph.graphSVG);
  graph.graphSVG.addEventListener("doubletap", logEntryWizard.showNew);

  bolusCalculator.initialize();

  factorSettingsScreen.addStarterButtonTo(document.body);

  connectUsbDisconnectToBgReload();

  if (navigator.getDeviceStorage) {
    var callback = initializeWithBgData;
    bgData.initialize(callback);
  } else {
    bgData.createMockData();
    graph.update();
  }
}

function initializeWithBgData() {
  var callback = function() {graph.update()};
  logEntryData.initialize(callback);
}

function connectUsbDisconnectToBgReload() {
  navigator.getBattery().then(function(battery) {
    battery.addEventListener('chargingchange', function() {
      if (!(battery.charging)) {
        setTimeout(function() {bgData.initialize(function() {graph.update();})}, 1000);
      }
    });
  });
}
