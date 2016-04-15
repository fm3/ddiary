"use strict";

var logEntryWizard = (function() {
  var wizard;
  var leftPage, rightPage;
  var carbsInput, fastActingCarbsCheckbox, adjustmentCarbsCheckbox, impreciseCarbsCheckbox;
  var suggestionLabel;
  var insulinInput, longTermInsulinCheckbox, adjustmentInsulinCheckbox;
  var fingerStickInput, noteInput;
  var timeWidget, yesterdayCheckbox, hourInput, minuteInput, timeDiffLabel;
  var leftButton, rightButton;

  return {
    showNew: function() {
      wizard = document.createElement("div");
      wizard.className = "wizard fullScreen";
      document.body.appendChild(wizard);

      var title = document.createElement("h2");
      title.appendChild(document.createTextNode("Add new log entries"));
      wizard.appendChild(title);

      leftPage = document.createElement("div");
      leftPage.className = "page";
      wizard.appendChild(leftPage);

      createFoodInputWidget(leftPage);
      createInsulinInputWidget(leftPage);
      createSuggestionLabel(leftPage);
      createRightPageButton(leftPage);

      rightPage = document.createElement("div");
      rightPage.className = "page";
      rightPage.style.display = "none";
      wizard.appendChild(rightPage);

      createFingerStickInputWidget(rightPage);
      createNoteInputWidget(rightPage);
      createLeftPageButton(rightPage);

      createTimeWidget();

      createOkButton();
    }
  };

  function createOkButton() {
    var okButton = document.createElement("button");
    okButton.className = "okButton";
    okButton.appendChild(document.createTextNode("OK"));
    okButton.onclick = okClicked;
    wizard.appendChild(okButton);
  }

  function createFoodInputWidget(parent) {
      var foodInputWidget = document.createElement("div");
      foodInputWidget.className = "foodInputWidget";
      createIcon("img/carbs.svg", foodInputWidget);
      carbsInput = numberInputs.createNumberInput(foodInputWidget);
      carbsInput.addEventListener("valueChanged", suggestBolus);

      var checkboxes = document.createElement("div");
      checkboxes.className = "checkboxesWidget";
      fastActingCarbsCheckbox = createCheckbox("fastActingCarbsCheckbox", "↑", checkboxes);
      adjustmentCarbsCheckbox = createCheckbox("adjustmentCarbsCheckbox", "+", checkboxes);
      impreciseCarbsCheckbox = createCheckbox("impreciseCarbsCheckbox", "≈", checkboxes);
      adjustmentCarbsCheckbox.onchange = function() {if (adjustmentCarbsCheckbox.checked) {fastActingCarbsCheckbox.checked = true;}};
      foodInputWidget.appendChild(checkboxes);

      parent.appendChild(foodInputWidget);
  }

  function createInsulinInputWidget(parent) {
    var insulinInputWidget = document.createElement("div");
    insulinInputWidget.className = "insulinInputWidget";
    createIcon("img/insulin.svg", insulinInputWidget);
    insulinInput = numberInputs.createNumberInput(insulinInputWidget, 0, 0, 100, 0.5, 15);

    var checkboxes = document.createElement("div");
    checkboxes.className = "checkboxesWidget";
    longTermInsulinCheckbox = createCheckbox("longTermInsulinCheckbox", "L", checkboxes);
    adjustmentInsulinCheckbox = createCheckbox("adjustmentInsulinCheckbox", "+", checkboxes);
    insulinInputWidget.appendChild(checkboxes);

    parent.appendChild(insulinInputWidget);
  }

  function createCheckbox(id, label, parent) {
    var checkboxGroup = document.createElement("div");
    checkboxGroup.className = "checkboxGroup";
    var checkboxLabel = document.createElement("label");
    if (label == "↑" || label == "L")
      checkboxLabel.className = "smaller";
    checkboxLabel.setAttribute("for", id);
    checkboxLabel.appendChild(document.createTextNode(label));
    var checkbox = document.createElement("input");
    checkbox.id = id;
    checkbox.type = "checkbox";
    checkboxGroup.appendChild(checkboxLabel);
    checkboxGroup.appendChild(checkbox);
    parent.appendChild(checkboxGroup);
    return checkbox;
  }

  function createIcon(path, parent) {
    var img = document.createElement("img");
    img.className = "icon";
    img.src = path;
    parent.appendChild(img);
  }

  function createRightPageButton(parent) {
    rightButton = document.createElement("a");
    rightButton.classList.add("pageButton");
    rightButton.classList.add("right");
    rightButton.onclick = showRightPage;
    parent.appendChild(rightButton);
  }

  function showRightPage() {
    leftPage.style.display = "none";
    rightPage.style.display = "block";
  }

  function createLeftPageButton(parent) {
    leftButton = document.createElement("a");
    leftButton.classList.add("pageButton");
    leftButton.classList.add("left");
    leftButton.onclick = showLeftPage;
    parent.appendChild(leftButton);
  }

  function showLeftPage() {
    rightPage.style.display = "none";
    leftPage.style.display = "block";
  }

  function createFingerStickInputWidget(parent) {
    var fingerStickInputWidget = document.createElement("div");
    fingerStickInputWidget.className = "fingerStickInputWidget";
    createIcon("img/fingerStick.svg", fingerStickInputWidget);
    fingerStickInput = numberInputs.createNumberInput(fingerStickInputWidget, 0, 0, 30, 0.1);
    parent.appendChild(fingerStickInputWidget);
  }

  function createNoteInputWidget(parent) {
    var noteInputWidget = document.createElement("div");
    noteInputWidget.className = "noteInputWidget";
    createIcon("img/note.svg", noteInputWidget);
    noteInput = document.createElement("input");
    noteInput.type = "text";
    noteInput.onfocus = hideWidgetsExceptNote;
    noteInput.onblur = unhideWidgets;
    noteInputWidget.appendChild(noteInput);
    parent.appendChild(noteInputWidget);
  }

  function hideWidgetsExceptNote() {
    leftButton.style.display = "none";
    timeWidget.style.display = "none";
  }

  function unhideWidgets() {
    leftButton.style.display = "block";
    timeWidget.style.display = "block";
  }

  function createTimeWidget() {
    timeWidget = document.createElement("div");
    createIcon("img/clock.svg", timeWidget);
    timeWidget.className = "timeWidget";
    yesterdayCheckbox = createCheckbox("yesterdayCheckbox", "−1d", timeWidget);
    yesterdayCheckbox.onclick = updateTimeDiffLabel;
    var now = new Date();
    hourInput = numberInputs.createNumberInput(timeWidget, now.getHours(), 0, 23, 1, 20);
    hourInput.addEventListener("valueChanged", updateTimeDiffLabel);
    hourInput.addEventListener("valueChanged", suggestBolus);
    var timeSeparator = document.createElement("span");
    timeSeparator.className = "timeSeparator";
    timeSeparator.appendChild(document.createTextNode(":"));
    timeWidget.appendChild(timeSeparator);
    minuteInput = numberInputs.createNumberInput(timeWidget, now.getMinutes(), 0, 59, 1, 20, 2);
    minuteInput.addEventListener("valueChanged", updateTimeDiffLabel);
    minuteInput.addEventListener("valueChanged", suggestBolus);
    timeDiffLabel = document.createElement("span");
    timeDiffLabel.className = "timeDiffLabel";
    timeDiffLabel.textContent = " ";
    timeWidget.appendChild(timeDiffLabel);
    wizard.appendChild(timeWidget);
  }

  function updateTimeDiffLabel() {
    var directionText = " from now";
    var diffMilliseconds = readTime() - new Date();
    if (diffMilliseconds < 0) {
      diffMilliseconds = new Date() - readTime();
      directionText = " ago";
    }
    var diffHours = Math.floor(diffMilliseconds / 3600000);
    var diffMinutes = Math.floor(((diffMilliseconds % 3600000) / 60000));
    var hourText = diffHours > 0 ? diffHours + "h " : "";
    var minutesText = diffMinutes > 0 ? diffMinutes + " min" : "";
    if (diffMinutes > 0 || diffHours > 0) {
      timeDiffLabel.textContent = hourText + minutesText + directionText;
    } else {
      timeDiffLabel.textContent = " ";
    }
  }

  function readTime() {
    var hours = parseFloat(hourInput.textContent);
    var minutes = parseFloat(minuteInput.textContent);
    var date = new Date();
    date.setHours(hours, minutes, 0, 0); //setHours uses local time
    if (yesterdayCheckbox.checked)
      date.setDate(date.getDate() - 1);
    return date;
  }

  function createSuggestionLabel(parent) {
    suggestionLabel = document.createElement("div");
    suggestionLabel.className = "suggestionLabel";
    parent.appendChild(suggestionLabel);
  }

  function okClicked() {
    var carbsValue = parseFloat(carbsInput.textContent);
    var insulinValue = parseFloat(insulinInput.textContent);
    var fingerStickValue = parseFloat(fingerStickInput.textContent);
    var noteValue = noteInput.value;
    if (carbsValue !== 0)
      saveCarbsLogEntry(carbsValue);
    if (insulinValue !== 0)
      saveInsulinLogEntry(insulinValue);
    if (fingerStickValue !== 0)
      saveFingerStickLogEntry(fingerStickValue);
    if (noteValue !== "")
      saveNoteLogEntry(noteValue);
    wizard.parentNode.removeChild(wizard);
  }

  function suggestBolus() {
    var usedFactor = bolusCalculator.getFactorForHour(days.closestFullHourTo(readTime()));
    var suggestedBolus = bolusCalculator.getBolusAtHourForCarbs(days.closestFullHourTo(readTime()), parseFloat(carbsInput.textContent));
    if (suggestedBolus > 0) {
      suggestionLabel.textContent = "(" + usedFactor + " → " + suggestedBolus + ")";
    }
    else {
      suggestionLabel.textContent = "";
    }
  }

  function saveCarbsLogEntry(carbsValue) {
    var logEntry = initLogEntry("carbs");
    logEntry.carbsValue = carbsValue;
    if(fastActingCarbsCheckbox.checked)
      logEntry.fastActingCarbs = true;
    if(adjustmentCarbsCheckbox.checked)
      logEntry.adjustmentCarbs = true;
    if(impreciseCarbsCheckbox.checked)
      logEntry.impreciseCarbs = true;
    saveLogEntry(logEntry);
  }

  function saveInsulinLogEntry(insulinValue) {
    var logEntry = initLogEntry("insulin");
    logEntry.insulinValue = insulinValue;
    if(longTermInsulinCheckbox.checked)
      logEntry.longTermInsulin = true;
    if(adjustmentInsulinCheckbox.checked)
      logEntry.adjustmentInsulin = true;
    saveLogEntry(logEntry);
  }

  function saveFingerStickLogEntry(fingerStickValue) {
    var logEntry = initLogEntry("fingerStick");
    logEntry.fingerStickValue = fingerStickValue;
    saveLogEntry(logEntry);
  }

  function saveNoteLogEntry(noteValue) {
    var logEntry = initLogEntry("note");
    logEntry.noteValue = noteValue;
    saveLogEntry(logEntry);
  }

  function initLogEntry(type) {
    return {
      id: generateId(),
      date: readTime(),
      timezoneOffset: new Date().getTimezoneOffset(),
      type: type
    };
  }

  function generateId() {
    var now = new Date();
    return util.pad(now.getHours(), 2)
          + util.pad(now.getMinutes(), 2)
          + util.pad(now.getSeconds(), 2)
          + util.pad(Math.floor(Math.random() * 1000), 4);
  }

  function saveLogEntry(logEntry) {
    setTimeout(function() {logEntryData.writeLogEntry(logEntry);}, 1);
  }

}());
