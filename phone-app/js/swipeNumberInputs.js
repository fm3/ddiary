"use strict";

var numberInputs = (function() {

  return {
    createNumberInput: function(parent, value=0, min=0, max=99999, step=1, pixelsPerStep=10, leadingZeroes=0) {
      var element = document.createElement("div");
      parent.appendChild(element);
      element.className="numberInput";
      var valueElement = document.createTextNode(util.pad(value.toFixed(util.countTrailingDigits(step)), leadingZeroes));
      element.appendChild(valueElement);
      element.addEventListener("touchmove", function(event) {handleTouchMove(event, min, max, step, pixelsPerStep, leadingZeroes);});
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("DOMMouseScroll", function(event) {handleMouseWheel(event, min, max, step, leadingZeroes);});
      return element;
    }
  };

  var startX, startY, startValue;

  function handleTouchStart(evt) {
    var touch = evt.changedTouches[0];
    startX = touch.pageX;
    startY = touch.pageY;
    startValue = parseFloat(evt.target.innerText);
  }

  function handleTouchMove(evt, min, max, step, pixelsPerStep, leadingZeroes) {
    var touch = evt.changedTouches[0];
    var deltaY = touch.pageY - startY;
    var deltaX = touch.pageX - startX;
    var deltaTotal = deltaX + deltaY;
    var newValue = startValue + step * Math.round(deltaTotal/pixelsPerStep);
    updateValue(touch.target, newValue, min, max, step, leadingZeroes);
  }

  function handleMouseWheel(evt, min, max, step, leadingZeroes) {
    var isUpwards = false;
    if (evt.wheelDelta > 0 || evt.detail < 0) {
      isUpwards = true;
    }
    var oldValue = parseFloat(evt.target.textContent);
    var newValue = oldValue + (isUpwards ? step : -step);
    updateValue(evt.target, newValue, min, max, step, leadingZeroes);
  }

  function updateValue(element, newValue, min, max, step, leadingZeroes) {
    var newValueCropped = Math.max(min, Math.min(max, newValue));
    var newValueFormatted = util.pad(newValueCropped.toFixed(util.countTrailingDigits(step)), leadingZeroes);
    if (element.textContent !== newValueFormatted) {
      element.textContent = newValueFormatted;
      var event = new CustomEvent("valueChanged", { "detail": newValueFormatted });
      element.dispatchEvent(event);
    }
  }

}());
