"use strict";

var days = (function() {

  return {
    enumerateDays: function(from, to) {
      util.assert(from <= to);
      var fromDay = this.dayOf(from);
      var toDay = this.dayOf(to);
      var enumeratedDays = [];
      var aDate = new Date(from);
      while (this.dayOf(aDate) <= toDay) {
        enumeratedDays.push(this.dayOf(aDate));
        aDate.setDate(aDate.getDate() + 1);
      }
      return enumeratedDays;
    },

    earliestFileDay: function() {
      var date = new Date();
      date.setDate(date.getDate() - config.loadRecentDayCount + 1);
      return date;
    },

    dayOf: function(date) {
      var dayDate = new Date(date);
      dayDate.setUTCHours(0);
      dayDate.setUTCMinutes(0);
      dayDate.setUTCSeconds(0);
      dayDate.setUTCMilliseconds(0);
      return dayDate.toISOString().slice(0,10);
    },

    localDayOf: function(date) {
      var d = new Date(date);
      d.setHours(0,0,0,0);

      var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fr", "Sa"];
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

      return weekdays[d.getDay()] + " " + d.getDate() + ". " + months[d.getMonth()];
    },

    thisMorningLocal: function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      return date;
    },

    thisEveningLocal: function() {
      var date = new Date();
      date.setHours(23,59,59);
      return date;
    },

    closestFullHourTo: function(date) {
      date.setMinutes(date.getMinutes() + 30);
      return date.getHours();
    },

    jsonDateReviver: function(key, value) {
      if (typeof value === "string" && typeof key === "string") {
        if (key == "date") {
          try {
            return new Date(value);
          } catch(e) {
            print("json date reviver failed to parse date ", value, "E:", e);
            return value;
          }
        }
      }
      return value;
    }
  }

}());