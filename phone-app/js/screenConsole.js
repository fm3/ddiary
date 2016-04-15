"use strict";

var screenConsole = (function() {

  var screenConsoleElement;
  var clearTimer;

  return {
    initialize: function() {
      screenConsoleElement = document.createElement("p");
      screenConsoleElement.setAttribute("id", "screenConsole");
      screenConsoleElement.onclick = clear;
      screenConsoleElement.classList.add("empty");
      document.body.appendChild(screenConsoleElement);
    },

    print: function(args) {
      var text = "";
      args.forEach(function(arg) {
        text += arg + " ";
      });
      var textNode = document.createTextNode(text);
      var lineBreak = document.createElement("br");
      screenConsoleElement.appendChild(textNode);
      screenConsoleElement.appendChild(lineBreak);
      screenConsoleElement.classList.remove("empty");
      clearTimeout(clearTimer);
      clearTimer = setTimeout(clear, 10000);
    }
  };

  function clear() {
    while (screenConsoleElement.firstChild) {
      screenConsoleElement.removeChild(screenConsoleElement.firstChild);
    }
    screenConsoleElement.classList.add("empty");
  }

}());

function print() {
  var args = Array.prototype.slice.call(arguments);
  if (config.printOnScreen)
    screenConsole.print(args);
  console.log.apply(console, args);
}
