"use strict";

var factorSettingsScreen = (function() {
  var settingsScreen;

  return {
    addStarterButtonTo: function(parent) {
      var button = document.createElement("button");
      button.appendChild(document.createTextNode("…"));
      button.className = "factorSettingsButton";
      button.onclick = this.showNew;
      parent.appendChild(button);
    },

    showNew: function() {
      settingsScreen = document.createElement("div");
      settingsScreen.className = "fullScreen";
      document.body.appendChild(settingsScreen);


      var title = document.createElement("h2");
      title.appendChild(document.createTextNode("Adjust bolus factors"));
      settingsScreen.appendChild(title);

      var keyHours = bolusCalculator.getKeyHours();
      keyHours.forEach(function(keyHour) {
        var value = bolusCalculator.getFactorForHour(keyHour);
        createFactorWidgetForHour(keyHour, value);
      });

      createOkButton();
    }
  };

  function createFactorWidgetForHour(hour, value) {
    var factorWidget = document.createElement("div");
    factorWidget.className = "factorWidget";
    var factorInput = numberInputs.createNumberInput(factorWidget, value, 1, 2.5, 0.1, 40);
    var label = document.createElement("span");
    label.textContent = hour;
    label.className = "factorLabel";
    factorWidget.appendChild(label);
    settingsScreen.appendChild(factorWidget);
    factorInput.addEventListener("valueChanged", function(event) {valueChanged(hour, event);});
  }

  function valueChanged(hour, event) {
    bolusCalculator.setFactorForHour(hour, parseFloat(event.detail));
  }

  function createOkButton() {
    var okButton = document.createElement("button");
    okButton.className = "okButton";
    okButton.appendChild(document.createTextNode("OK"));
    okButton.onclick = okClicked;
    settingsScreen.appendChild(okButton);
  }


  function okClicked() {
    settingsScreen.parentNode.removeChild(settingsScreen);
  }

}());
