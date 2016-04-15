"use strict";

var bgData = (function () {

  var bgs = {};

  var loadRequestsCompleted = 0;
  var loadRequestsStarted = 0;
  var loadRequestsCompletedCallback;

  return {
    initialize: function(onsuccess) {
      loadBgsFromFiles(onsuccess);
    },

    getBgs: function(from, to) {
      var requestedBgs = [];
      var necessaryDays = days.enumerateDays(from, to);
      necessaryDays.forEach(function(day) {
        if (bgs.hasOwnProperty(day)) {
          var bgsOfDay = bgs[day];
          bgsOfDay.forEach(function(bg) {
            if (bg.date >= from && bg.date <= to) {
              requestedBgs.push(bg);
            }
          });
        }
      });
      return requestedBgs;
    },


    createMockData: function() {
      bgs["2016-01-24"] = JSON.parse('[{"bgValue": "3.9", "timezoneOffset": -60, "date": "2016-01-24T00:08:00.000Z"}, {"bgValue": "3.6", "timezoneOffset": -60, "date": "2016-01-24T00:23:00.000Z"}, {"bgValue": "3.5", "timezoneOffset": -60, "date": "2016-01-24T00:38:00.000Z"}, {"bgValue": "3.8", "timezoneOffset": -60, "date": "2016-01-24T00:53:00.000Z"}, {"bgValue": "4.3", "timezoneOffset": -60, "date": "2016-01-24T01:08:00.000Z"}, {"bgValue": "4.7", "timezoneOffset": -60, "date": "2016-01-24T01:23:00.000Z"}, {"bgValue": "4.7", "timezoneOffset": -60, "date": "2016-01-24T01:38:00.000Z"}, {"bgValue": "4.6", "timezoneOffset": -60, "date": "2016-01-24T01:53:00.000Z"}, {"bgValue": "4.5", "timezoneOffset": -60, "date": "2016-01-24T02:08:00.000Z"}, {"bgValue": "4.7", "timezoneOffset": -60, "date": "2016-01-24T02:23:00.000Z"}, {"bgValue": "4.7", "timezoneOffset": -60, "date": "2016-01-24T02:38:00.000Z"}, {"bgValue": "4.7", "timezoneOffset": -60, "date": "2016-01-24T02:53:00.000Z"}, {"bgValue": "4.7", "timezoneOffset": -60, "date": "2016-01-24T03:08:00.000Z"}, {"bgValue": "4.7", "timezoneOffset": -60, "date": "2016-01-24T03:23:00.000Z"}, {"bgValue": "5.0", "timezoneOffset": -60, "date": "2016-01-24T03:38:00.000Z"}, {"bgValue": "5.4", "timezoneOffset": -60, "date": "2016-01-24T03:53:00.000Z"}, {"bgValue": "5.8", "timezoneOffset": -60, "date": "2016-01-24T04:08:00.000Z"}, {"bgValue": "5.9", "timezoneOffset": -60, "date": "2016-01-24T04:23:00.000Z"}, {"bgValue": "5.6", "timezoneOffset": -60, "date": "2016-01-24T04:37:00.000Z"}, {"bgValue": "5.7", "timezoneOffset": -60, "date": "2016-01-24T04:52:00.000Z"}, {"bgValue": "5.9", "timezoneOffset": -60, "date": "2016-01-24T05:07:00.000Z"}, {"bgValue": "6.1", "timezoneOffset": -60, "date": "2016-01-24T05:22:00.000Z"}, {"bgValue": "5.8", "timezoneOffset": -60, "date": "2016-01-24T05:37:00.000Z"}, {"bgValue": "5.5", "timezoneOffset": -60, "date": "2016-01-24T05:52:00.000Z"}, {"bgValue": "5.3", "timezoneOffset": -60, "date": "2016-01-24T06:07:00.000Z"}, {"bgValue": "5.0", "timezoneOffset": -60, "date": "2016-01-24T06:22:00.000Z"}, {"bgValue": "4.9", "timezoneOffset": -60, "date": "2016-01-24T06:37:00.000Z"}, {"bgValue": "5.1", "timezoneOffset": -60, "date": "2016-01-24T06:53:00.000Z"}, {"bgValue": "5.3", "timezoneOffset": -60, "date": "2016-01-24T07:08:00.000Z"}, {"bgValue": "5.2", "timezoneOffset": -60, "date": "2016-01-24T07:23:00.000Z"}, {"bgValue": "5.3", "timezoneOffset": -60, "date": "2016-01-24T07:38:00.000Z"}, {"bgValue": "6.7", "timezoneOffset": -60, "date": "2016-01-24T07:53:00.000Z"}, {"bgValue": "8.3", "timezoneOffset": -60, "date": "2016-01-24T08:08:00.000Z"}, {"bgValue": "8.7", "timezoneOffset": -60, "date": "2016-01-24T08:22:00.000Z"}, {"bgValue": "8.3", "timezoneOffset": -60, "date": "2016-01-24T08:38:00.000Z"}, {"bgValue": "7.8", "timezoneOffset": -60, "date": "2016-01-24T08:52:00.000Z"}, {"bgValue": "8.0", "timezoneOffset": -60, "date": "2016-01-24T09:08:00.000Z"}, {"bgValue": "9.0", "timezoneOffset": -60, "date": "2016-01-24T09:23:00.000Z"}, {"bgValue": "10.8", "timezoneOffset": -60, "date": "2016-01-24T09:37:00.000Z"}, {"bgValue": "12.4", "timezoneOffset": -60, "date": "2016-01-24T09:52:00.000Z"}, {"bgValue": "14.3", "timezoneOffset": -60, "date": "2016-01-24T10:07:00.000Z"}, {"bgValue": "15.4", "timezoneOffset": -60, "date": "2016-01-24T10:22:00.000Z"}, {"bgValue": "15.2", "timezoneOffset": -60, "date": "2016-01-24T10:37:00.000Z"}, {"bgValue": "14.7", "timezoneOffset": -60, "date": "2016-01-24T10:52:00.000Z"}, {"bgValue": "13.8", "timezoneOffset": -60, "date": "2016-01-24T11:07:00.000Z"}, {"bgValue": "13.2", "timezoneOffset": -60, "date": "2016-01-24T11:23:00.000Z"}, {"bgValue": "12.1", "timezoneOffset": -60, "date": "2016-01-24T11:38:00.000Z"}, {"bgValue": "10.8", "timezoneOffset": -60, "date": "2016-01-24T11:53:00.000Z"}, {"bgValue": "9.8", "timezoneOffset": -60, "date": "2016-01-24T12:07:00.000Z"}, {"bgValue": "8.4", "timezoneOffset": -60, "date": "2016-01-24T12:22:00.000Z"}, {"bgValue": "7.3", "timezoneOffset": -60, "date": "2016-01-24T12:37:00.000Z"}, {"bgValue": "8.4", "timezoneOffset": -60, "date": "2016-01-24T12:52:00.000Z"}, {"bgValue": "9.5", "timezoneOffset": -60, "date": "2016-01-24T13:07:00.000Z"}, {"bgValue": "10.0", "timezoneOffset": -60, "date": "2016-01-24T13:22:00.000Z"}, {"bgValue": "9.7", "timezoneOffset": -60, "date": "2016-01-24T13:37:00.000Z"}, {"bgValue": "8.7", "timezoneOffset": -60, "date": "2016-01-24T13:52:00.000Z"}, {"bgValue": "7.1", "timezoneOffset": -60, "date": "2016-01-24T14:07:00.000Z"}, {"bgValue": "6.8", "timezoneOffset": -60, "date": "2016-01-24T14:22:00.000Z"}, {"bgValue": "7.6", "timezoneOffset": -60, "date": "2016-01-24T14:38:00.000Z"}, {"bgValue": "8.2", "timezoneOffset": -60, "date": "2016-01-24T14:52:00.000Z"}, {"bgValue": "7.9", "timezoneOffset": -60, "date": "2016-01-24T15:07:00.000Z"}, {"bgValue": "7.5", "timezoneOffset": -60, "date": "2016-01-24T15:22:00.000Z"}, {"bgValue": "6.9", "timezoneOffset": -60, "date": "2016-01-24T15:37:00.000Z"}, {"bgValue": "6.7", "timezoneOffset": -60, "date": "2016-01-24T15:52:00.000Z"}, {"bgValue": "6.4", "timezoneOffset": -60, "date": "2016-01-24T16:07:00.000Z"}, {"bgValue": "6.3", "timezoneOffset": -60, "date": "2016-01-24T16:22:00.000Z"}, {"bgValue": "6.3", "timezoneOffset": -60, "date": "2016-01-24T16:37:00.000Z"}, {"bgValue": "6.4", "timezoneOffset": -60, "date": "2016-01-24T16:52:00.000Z"}, {"bgValue": "6.6", "timezoneOffset": -60, "date": "2016-01-24T17:07:00.000Z"}, {"bgValue": "6.7", "timezoneOffset": -60, "date": "2016-01-24T17:22:00.000Z"}, {"bgValue": "7.1", "timezoneOffset": -60, "date": "2016-01-24T17:36:00.000Z"}, {"bgValue": "7.6", "timezoneOffset": -60, "date": "2016-01-24T17:51:00.000Z"}, {"bgValue": "7.9", "timezoneOffset": -60, "date": "2016-01-24T18:06:00.000Z"}]',
                                     days.jsonDateReviver);
    }
  };

  function loadBgsFromFiles(onsuccess) {
    loadRequestsCompletedCallback = onsuccess;
    loadRequestsCompleted = 0;
    loadRequestsStarted = 0;
    var loadDays = days.enumerateDays(days.earliestFileDay(), new Date());
    loadDays.forEach(function(loadDay) {
      files.read(fileName(loadDay), loadBgsFileSuccess, loadBgsFileError, loadDay);
      loadRequestsStarted += 1;
    });
  }

  function loadBgsFileSuccess(fileContent, day) {
    bgs[day] = JSON.parse(fileContent, days.jsonDateReviver);
    loadRequestCompleted();
  }

  function loadBgsFileError() {
    loadRequestCompleted();
  }

  function loadRequestCompleted() {
    loadRequestsCompleted += 1;
    if (loadRequestsCompleted == loadRequestsStarted) {
      if (Object.keys(bgs).length === 0) {
        print("Could not load any recent bg files.");
      } else {
        print("Loaded bg files for ", Object.keys(bgs).length, "days.");
      }
      if (loadRequestsCompletedCallback !== undefined) {
        loadRequestsCompletedCallback();
      }
    }
  }

  function fileName(day) {
    return "bg/bg_" + day + ".json";
  }

}());
