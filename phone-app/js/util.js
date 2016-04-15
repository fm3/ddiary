"use strict";

var util = (function() {

  return {
    countTrailingDigits: function(aFloat) {
      if (aFloat === 0) {
        return 0;
      }
      if (aFloat < 0) {
        aFloat = -aFloat;
      }
      var count = 0;
      while (aFloat < 1) {
        aFloat*=10;
        count++;
      }
      return count;
    },

    roundToHalves: function(number) {
      return (Math.round(number * 2) / 2);
    },

    roundToHundredths: function(number) {
      return (Math.round(number * 100) / 100);
    },

    pad: function(aNumberString, size) {
      if (typeof(aNumberString) === "number")
        aNumberString = aNumberString.toString();
      var aNumberArray = aNumberString.split(".");
      if (size === undefined || aNumberArray[0].length > size || size < 1) {
        return aNumberString;
      }
      var decimalsString = "";
      if(aNumberArray.length > 1) {
        decimalsString = "." + aNumberArray[1];
      }
      return ("000000000" + aNumberArray[0]).substr(-size) + decimalsString;
    },

    assert: function(condition) {
      if (!condition)
        throw "Assertion failed";
    },

    svgNS: "http://www.w3.org/2000/svg",

    replaceAll: function(str, find, replace) {
      return str.replace(new RegExp(find, "g"), replace);
    }
  };

}());
