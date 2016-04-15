"use strict";

var bolusCalculator = (function() {
  var bolusFactors;
  var flushTimer;
  var filename;

  return {

    initialize: function() {
      filename = "bolusFactors/bolusFactors.json";
      loadFactorsFromFile();
    },

    setFactorForHour: function(hour, factor) {
      bolusFactors[hour] = factor;
      clearTimeout(flushTimer);
      flushTimer = setTimeout(flush, 5000);
    },

    getKeyHours: function() {
      if (bolusFactors) {
        return Object.keys(bolusFactors);
      }
      return [];
    },

    getCurrentBolusForCarbs: function(carbs) {
      return this.getBolusAtHourForCarbs(days.closestFullHourTo(new Date()), carbs);
    },

    getBolusAtHourForCarbs: function(hour, carbs) {
      var bolus = carbs * 0.1 * this.getFactorForHour(hour);
      return util.roundToHalves(bolus);
    },

    getFactorForHour: function(hour) {
      if (hour in bolusFactors)
        return bolusFactors[hour];
      if (Object.keys(bolusFactors).length < 2)
        return -1;

      var leftHour = getHourLeftOf(hour);
      var rightHour = getHourRightOf(hour);

      var leftValue = bolusFactors[leftHour];
      var rightValue = bolusFactors[rightHour];

      if (leftHour > rightHour)
        rightHour += 24;
      if (hour < leftHour)
        hour += 24;

      var deltaTime = rightHour - leftHour;
      var deltaValue = rightValue - leftValue;
      var slope = deltaValue / deltaTime;
      var deltaTimeLeftToQueried = hour - leftHour;
      var valueForQueriedHour = leftValue + slope * deltaTimeLeftToQueried;
      return util.roundToHundredths(valueForQueriedHour);
    }
  };

  function getHourLeftOf(hour) {
    return getHourNextTo(hour, true);
  }

  function getHourRightOf(hour) {
    return getHourNextTo(hour, false);
  }

  function getHourNextTo(queryHour, shouldBeLeft) {
    var testedHour = queryHour;
    for (var tests = 0; tests < 25; tests++) {
      if (testedHour in bolusFactors) {
        return testedHour;
      }
      testedHour += shouldBeLeft? -1 : 1;
      if (testedHour < 0) {
        testedHour += 24;
      }
      if (testedHour >= 24) {
        testedHour -= 24;
      }
    }
    print("bolusCalculator: found no next hour to ", queryHour);
  }

  function loadFactorsFromFile() {
    files.read(filename, loadFactorsFileSuccess, loadFactorsFileError);
  }

  function loadFactorsFileSuccess(fileContent) {
    bolusFactors = JSON.parse(fileContent);
  }

  function loadFactorsFileError() {
    bolusFactors = {8: 1, 12: 1.0, 18: 1, 22: 1.3};
  }

  function flush() {
    var bolusFactorsJSON = JSON.stringify(bolusFactors);
    files.overwrite(bolusFactorsJSON, filename);
  }

}());
