"use strict";

var doubleTaps = (function() {

  var lastTapTime = new Date().getTime();
  var lastTapPos = [0,0];

  return {
    makeDoubleTappable: function(element) {
      element.addEventListener("click", function(event) {possibleDoubleTap(event, element);});
    }
  };

  function possibleDoubleTap(e, element) {
    var now = new Date().getTime();
    if (now - lastTapTime < 250 && tapIsCloseToLast(e.clientX, e.clientY)) {
      triggerDoubleTap(e, element);
      lastTapTime = 0;
      lastTapPos = [0,0];
    } else {
      lastTapTime = now;
      lastTapPos = [e.clientX, e.clientY];
    }
  }

  function tapIsCloseToLast(x, y) {
    return (Math.abs(x - lastTapPos[0]) + Math.abs(y - lastTapPos[1]) < 50);
  }

  function triggerDoubleTap(e, element) {
    var eventDetail = {
      target: e.target,
      clientX: e.clientX,
      clientY: e.clientY
    };
    var event = new CustomEvent("doubletap", {"detail": eventDetail});
    element.dispatchEvent(event);
    console.log(element, "dispatched doubletap");
  }

}());
