"use strict";

var graph = (function() {
  var displayedLogEntries = [];
  var bgGraph;
  var nowLine;
  var nowLineTimer;
  var coordinateSystemGroup;
  var selectionCircle, selectionTimeText;
  var deleteLogEntryButton;
  var showsCurrentDay;

  return {
    leftScreenDate: null,
    rightScreenDate: null,
    graphSVG: null,

    initialize: function() {
      this.graphSVG = document.createElementNS(util.svgNS, "svg");
      this.graphSVG.setAttribute("id", "graphSVG");
      document.body.appendChild(this.graphSVG);
      this.setFromTo(days.thisMorningLocal(), days.thisEveningLocal());
      this.resize();
      this.update();
      this.graphSVG.onclick = this.resetSelection;
      updateNowLineOnFocus();
    },

    setFromTo: function(fromDate, toDate) {
      this.resetSelection();
      util.assert(fromDate < toDate);
      this.leftScreenDate = fromDate;
      this.rightScreenDate = toDate;
      if (toDate >= days.thisEveningLocal())
        showsCurrentDay = true;
      else
        showsCurrentDay = false;
    },

    resize: function() {
      this.resetSelection();
      coordinates.setViewBox(graphSVG);
      coordinates.setDimensions();
      redrawCoordinateSystem();
    },

    update: function() {
      this.resetSelection();
      this.updateLogEntries();
      this.updateBgs();
    },

    updateLogEntries: function() {
      clearDisplayedLogEntries();
      var logEntriesToDisplay = logEntryData.getLogEntries(this.leftScreenDate, this.rightScreenDate);
      logEntriesToDisplay.forEach(function(logEntry) {
        displayLogEntry(logEntry);
      });
    },


    updateBgs: function() {
      var bgsToDisplay = bgData.getBgs(this.leftScreenDate, this.rightScreenDate);
      if (bgGraph)
        bgGraph.parentNode.removeChild(bgGraph);
        bgGraph = undefined;

      if (bgsToDisplay.length === 0)
        return;
      bgGraph = document.createElementNS(util.svgNS, "path");
      bgGraph.classList.add("bgGraph");
      graphSVG.appendChild(bgGraph);
      var pathString = "";
      var previousDate = null;
      var first = true;
      bgsToDisplay.forEach(function(bg) {
        var x = coordinates.dateToXPixels(bg.date);
        var y = coordinates.bgValueToYPixels(bg.bgValue);
        if (first || isGap(bg.date, previousDate))
          pathString += " M" + x + " " + y;
        else
          pathString += " L" + x + " " + y;
        previousDate = bg.date;
        first = false;
      });
      bgGraph.setAttribute("d", pathString);
    },

    debugCircle: function(x,y) {
      debugCircle(x,y);
    },

    resetSelection: function() {
      if (selectionCircle) {
        selectionCircle.parentElement.removeChild(selectionCircle);
        selectionCircle = null;
      }
      if (selectionTimeText) {
        selectionTimeText.parentElement.removeChild(selectionTimeText);
        selectionTimeText = null;
      }
      if (deleteLogEntryButton) {
        deleteLogEntryButton.parentElement.removeChild(deleteLogEntryButton);
        deleteLogEntryButton = null;
      }
    }
  };


  function updateNowLineOnFocus() {
    document.addEventListener("visibilitychange", function() {
      if (document.visibilityState == "visible") {
        setTimeout(function() {updateNowLine();}, 1000);
      }
    });
  }

  function isGap(aDate, previousDate) {
    if (previousDate === null)
      return false;
    if (aDate - previousDate > 1000 * 60 * 20) //20 minutes
      return true;
  }

  function redrawCoordinateSystem() {
    if (coordinateSystemGroup && coordinateSystemGroup.parentNode)
      coordinateSystemGroup.parentNode.removeChild(coordinateSystemGroup);
    coordinateSystemGroup = document.createElementNS(util.svgNS, "g");
    graphSVG.appendChild(coordinateSystemGroup);

    drawTargetRangeRect();
    labelBgAxis();
    labelTimeAxis();

    updateNowLine();
  }

  function drawTargetRangeRect() {
    var targetRange = document.createElementNS(util.svgNS, "rect");
    targetRange.classList.add("targetRange");
    targetRange.setAttribute("x", coordinates.graphLeftPadding);
    targetRange.setAttribute("y", coordinates.bgValueToYPixels(config.targetRangeUpper));
    targetRange.setAttribute("width", window.innerWidth - coordinates.graphRightPadding - coordinates.graphLeftPadding);
    targetRange.setAttribute("height", coordinates.bgValueToYPixels(config.targetRangeLower) - coordinates.bgValueToYPixels(config.targetRangeUpper));
    coordinateSystemGroup.appendChild(targetRange);
  }

  function labelBgAxis() {
    var displayedBgLines = [2, 3, 4, 5, 6, 8, 10, 12, 15, 18];
    displayedBgLines.forEach(function(displayedBg) {
      var y = coordinates.bgValueToYPixels(displayedBg);
      var displayedBgLine = document.createElementNS(util.svgNS, "line");
      displayedBgLine.classList.add("coordinateSystemLine");
      displayedBgLine.setAttribute("x1", coordinates.graphLeftPadding * 0.8);
      displayedBgLine.setAttribute("x2", window.innerWidth - coordinates.graphRightPadding);
      displayedBgLine.setAttribute("y1", y);
      displayedBgLine.setAttribute("y2", y);
      coordinateSystemGroup.appendChild(displayedBgLine);
      var displayedBgLineLabel = document.createElementNS(util.svgNS, "text");
      displayedBgLineLabel.classList.add("coordinateSystemLabel");
      displayedBgLineLabel.classList.add("y");
      displayedBgLineLabel.setAttribute("x", coordinates.graphLeftPadding * 0.6);
      displayedBgLineLabel.setAttribute("y", y +4);
      displayedBgLineLabel.textContent = displayedBg;
      coordinateSystemGroup.appendChild(displayedBgLineLabel);
    });
  }

  function labelTimeAxis() {
    var date = new Date(graph.leftScreenDate);
    for (var hour = 0; hour <= 24; hour++) {
      var x = coordinates.dateToXPixels(date);

      if (hour % 2 === 0) {
        var displayedTimeLine = document.createElementNS(util.svgNS, "line");
        displayedTimeLine.classList.add("coordinateSystemLine");
        displayedTimeLine.setAttribute("x1", x);
        displayedTimeLine.setAttribute("x2", x);
        displayedTimeLine.setAttribute("y1", coordinates.graphTopPadding);
        displayedTimeLine.setAttribute("y2", window.innerHeight - coordinates.graphBottomPadding);
        coordinateSystemGroup.appendChild(displayedTimeLine);
      }

      var displayedTimeLineLabel = document.createElementNS(util.svgNS, "text");
      displayedTimeLineLabel.classList.add("coordinateSystemLabel");
      displayedTimeLineLabel.classList.add("x");
      displayedTimeLineLabel.setAttribute("x", x);
      displayedTimeLineLabel.setAttribute("y", coordinates.graphTopPadding * 0.8);
      displayedTimeLineLabel.textContent = hour; //TODO use date.getHour, and check for the 24 case
      coordinateSystemGroup.appendChild(displayedTimeLineLabel);

      date.setHours(date.getHours() + 1);
    }
  }

  function updateNowLine() {
    if (!nowLine) {
      nowLine = document.createElementNS(util.svgNS, "line");
      nowLine.classList.add("nowLine");
      graphSVG.appendChild(nowLine);
    }
    var x = coordinates.dateToXPixels(new Date());
    nowLine.setAttribute("x1", x);
    nowLine.setAttribute("x2", x);
    nowLine.setAttribute("y1", coordinates.graphTopPadding);
    nowLine.setAttribute("y2", window.innerHeight - coordinates.graphBottomPadding * 0.9);
    nowLine.setAttribute("stroke-dasharray", "5,5");
    clearTimeout(nowLineTimer);
    nowLineTimer = setTimeout(updateNowLine, 200000);
  }

  function debugCircle(x,y) {
    var circle = document.createElementNS(util.svgNS, "ellipse");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("rx", "2");
    circle.setAttribute("ry", "2");
    graphSVG.appendChild(circle);
    return circle;
  }

  function clearDisplayedLogEntries() {
    displayedLogEntries.forEach(function(logEntryElement) {
      logEntryElement.parentNode.removeChild(logEntryElement);
    });
    displayedLogEntries = [];
  }

  function displayLogEntry(logEntry) {
    var textNode = document.createElementNS(util.svgNS, "text");
    textNode.classList.add("logEntry");
    textNode.classList.add(logEntry.type);
    textNode.setAttribute("id", logEntry.id);
    var x = coordinates.dateToXPixels(logEntry.date);
    var y = coordinates.yForLogEntry(logEntry);
    textNode.setAttribute("x", x);
    textNode.setAttribute("y", y);
    textForLogEntry(textNode, logEntry);
    graphSVG.appendChild(textNode);
    y = moveOutOfCollisions(textNode, y, logEntry);
    displayedLogEntries.push(textNode);
    textNode.addEventListener("click", function(event){event.stopPropagation(); selectLogEntry(logEntry, x, y)});
  }

  function moveOutOfCollisions(textNode, y, logEntry) {
    var boundingRect = textNode.getBoundingClientRect();
    var step = logEntry.type=="carbs"? 1 : -1;
    while (collidesWithDisplayedLogEntry(boundingRect)) {
      y += step;
      boundingRect.y += step;
    }
    textNode.setAttribute("y", y);
    return y;
  }

  function collidesWithDisplayedLogEntry(rect1) {
    var kerning = 2;
    for (var i in displayedLogEntries) {
      var logEntryElement = displayedLogEntries[i];
      var rect2 = logEntryElement.getBoundingClientRect();
      if (rect1.x + kerning < rect2.x + rect2.width - kerning&&
           rect1.x + rect1.width - kerning > rect2.x + kerning &&
           rect1.y + kerning < rect2.y + rect2.height - kerning &&
           rect1.height + rect1.y - kerning > rect2.y + kerning) {
        return true;
      }
    }
    return false;
  }

  function textForLogEntry(parent, logEntry) {
    switch(logEntry.type) {
      case "carbs":
        if (logEntry.adjustmentCarbs)
          createSpan("+", "adjustment", parent);
        createSpan(logEntry.carbsValue, "", parent);
        if (logEntry.fastActingCarbs)
          createSpan("↑", "fastActing", parent);
        if (logEntry.impreciseCarbs)
          createSpan("≈", "imprecise", parent);
        break;
      case "insulin":
        if(logEntry.adjustmentInsulin)
          createSpan("+", "adjustment", parent);
        createSpan(logEntry.insulinValue, "", parent);
        if(logEntry.longTermInsulin)
          createSpan("L", "long-term", parent);
        break;
      case "note":
        createSpan(logEntry.noteValue, "note", parent);
        break;
      case "fingerStick":
        createSpan(logEntry.fingerStickValue, "fingerStick", parent);
        break;
    }
  }

  function createSpan(text, className, parent) {
    var span = document.createElementNS(util.svgNS, "tspan");
    span.textContent = text;
    if (className.length > 0)
      span.classList.add(className);
    if (className == "imprecise") {
      span.setAttribute("dy", "0.75em");
      span.setAttribute("x", parent.getAttribute("x"));
    }
    if (className == "fastActing") {
      span.setAttribute("dy", "-0.2em");
      span.setAttribute("dx", "-0.1em");
    }
    parent.appendChild(span);
    return span;
  }

  function selectLogEntry(logEntry, x, y) {
    graph.resetSelection();

    selectionCircle = document.createElementNS(util.svgNS, "ellipse");
    selectionCircle.setAttribute("cx", x);
    selectionCircle.setAttribute("cy", y - 3);
    selectionCircle.setAttribute("rx", "10");
    selectionCircle.setAttribute("ry", "10");
    selectionCircle.setAttribute("id", "selectionCircle");
    graphSVG.appendChild(selectionCircle);
    
    selectionTimeText = document.createElementNS(util.svgNS, "text");
    selectionTimeText.setAttribute("x", x);
    selectionTimeText.setAttribute("y", y + 17);
    selectionTimeText.setAttribute("id", "selectionText");
    selectionTimeText.textContent = logEntry.date.getHours() + ":" + util.pad(logEntry.date.getMinutes(),2);
    graphSVG.appendChild(selectionTimeText);

    deleteLogEntryButton = document.createElement("button");
    deleteLogEntryButton.textContent = "del";
    document.body.appendChild(deleteLogEntryButton);
    deleteLogEntryButton.style.position = "absolute";
    deleteLogEntryButton.style.bottom = "5px";
    deleteLogEntryButton.style.left = "5px";
    deleteLogEntryButton.onclick = function() {logEntryData.deleteLogEntry(logEntry); graph.resetSelection();};
  }

}());
