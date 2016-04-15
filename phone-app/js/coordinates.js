"use strict";

var coordinates = (function() {

  return {

    graphTopPadding: 0,
    graphRightPadding: 0,
    graphBottomPadding: 0,
    graphLeftPadding: 0,

    setDimensions: function() {
      this.graphTopPadding = 0.05 * window.innerHeight;
      this.graphRightPadding = 0.015 * window.innerWidth;
      this.graphBottomPadding = 0.25 * window.innerHeight;
      this.graphLeftPadding = 0.04 * window.innerWidth;
    },

    dateToXPixels: function(date) {
      var timeSinceLeft = Math.abs(date.getTime() - graph.leftScreenDate.getTime());
      var totalScreenTime = Math.abs(graph.rightScreenDate - graph.leftScreenDate.getTime());

      return this.graphLeftPadding + (timeSinceLeft / totalScreenTime * (window.innerWidth - this.graphLeftPadding - this.graphRightPadding));
    },

    setViewBox: function(graphSVG) {
      var boundingRect = graphSVG.getBoundingClientRect();
      var viewBoxString = "0 0 " + boundingRect.width + " " + boundingRect.height;

      graphSVG.setAttribute("viewBox", viewBoxString);
    },

    bgValueToYPixels: function(bgValue) {
      if (typeof bgValue != "number")
        bgValue = parseFloat(bgValue);
      var totalHeight = window.innerHeight - this.graphBottomPadding - this.graphTopPadding;

      var logLowest = Math.log(config.displayedRangeLower);
      var logHighest = Math.log(config.displayedRangeUpper);
      var logValue = Math.log(bgValue);

      return window.innerHeight - this.graphBottomPadding - (logValue - logLowest) / (logHighest - logLowest) * totalHeight;
    },

    yForLogEntry: function(logEntry) {
      var nearbyBgs = findNearbyBgs(logEntry);
      if (logEntry.type == "carbs") {
        if (nearbyBgs.length > 0) {
          var lowestBg = lowestValueIn(nearbyBgs);
          return this.bgValueToYPixels(lowestBg) + 13;
        }
        return this.bgValueToYPixels(3.5);
      }
      if (logEntry.type == "insulin") {
        if (nearbyBgs.length > 0) {
          var highestBg = highestValueIn(nearbyBgs);
          return this.bgValueToYPixels(highestBg) - 7;
        }
        return this.bgValueToYPixels(9.0);
      }
      return this.bgValueToYPixels(14.5);
    }
  };

  function findNearbyBgs(logEntry) {
    var from = new Date(logEntry.date);
    from.setMinutes(from.getMinutes() - 35);
    var to = new Date(logEntry.date);
    to.setMinutes(to.getMinutes() + 35);
    return bgData.getBgs(from, to);
  }

  function lowestValueIn(bgs) {
    var lowestValue = 50;
    for (var bgIndex in bgs) {
      if (parseFloat(bgs[bgIndex].bgValue) < lowestValue) {
        lowestValue = parseFloat(bgs[bgIndex].bgValue);
      }
    }
    return lowestValue;
  }


  function highestValueIn(bgs) {
    var highestValue = 0;
    for (var bgIndex in bgs) {
      if (parseFloat(bgs[bgIndex].bgValue) > highestValue) {
        highestValue = parseFloat(bgs[bgIndex].bgValue);
      }
    }
    return highestValue;
  }

}());
