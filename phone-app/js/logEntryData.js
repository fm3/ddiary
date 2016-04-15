"use strict";

var logEntryData = (function() {

  var logEntries = {};
  var flushTimer;
  var updatedDays = [];
  var loadRequestsCompleted = 0;
  var loadRequestsStarted = 0;
  var loadRequestsCompletedCallback;

  return {
    initialize: function(onsuccess) {
      loadLogEntriesFromFiles(onsuccess);
    },

    getLogEntries: function(from, to) {
      var requestedLogEntries = [];
      var necessaryDays = days.enumerateDays(from, to);
      necessaryDays.forEach(function(day) {
        var logEntriesOfDay = logEntries[day];
        for (var logEntryIndex in logEntriesOfDay) {
          var logEntry = logEntriesOfDay[logEntryIndex];
          if (logEntry.date >= from && logEntry.date <= to) {
            requestedLogEntries.push(logEntry);
          }
        }
      });
      return requestedLogEntries;
    },

    writeLogEntry: function(logEntry) {
      var day = days.dayOf(logEntry.date);
      if (!(day in logEntries))
        logEntries[day] = {};
      logEntries[day][logEntry.id] = logEntry;
      graph.updateLogEntries();
      dayUpdated(day);
    },

    deleteLogEntry: function(logEntry) {
      var day = days.dayOf(logEntry.date)
      delete logEntries[day][logEntry.id];
      graph.updateLogEntries();
      dayUpdated(day);
    }
  };

  function dayUpdated(day) {
    if (updatedDays.indexOf(day) === -1)
      updatedDays.push(day);
    clearTimeout(flushTimer);
    flushTimer = setTimeout(flush, 1000);
  }

  function flush() {
    updatedDays.forEach(function(day) {
      saveLogEntriesToFile(day);
    });
  }

  function saveLogEntriesToFile(day) {
    if (!(day in logEntries))
      return;
    var logEntriesJson = util.replaceAll(JSON.stringify(logEntries[day]), "\},", "\},\n");
    files.overwrite(logEntriesJson, fileName(day), clearItemFromUpdatedDays);
  }

  function clearItemFromUpdatedDays(filename) {
    var i = updatedDays.length;
    while (i--) {
      if (fileName(updatedDays[i]) == filename) {
        updatedDays.splice(i,1);
      }
    }
  }

  function loadLogEntriesFromFiles(onsuccess) {
    loadRequestsCompletedCallback = onsuccess;
    loadRequestsCompleted = 0;
    loadRequestsStarted = 0;
    var loadDays = days.enumerateDays(days.earliestFileDay(), new Date());
    loadDays.forEach(function(day) {
      files.read(fileName(day), loadLogEntriesFileSuccess, loadLogEntriesFileError, day);
      loadRequestsStarted += 1;
    });
  }

  function loadLogEntriesFileSuccess(fileContent, day) {
    logEntries[day] = JSON.parse(fileContent, days.jsonDateReviver);
    loadRequestCompleted();
  }

  function loadLogEntriesFileError() {
    loadRequestCompleted();
  }

  function loadRequestCompleted() {
    loadRequestsCompleted += 1;
    if (loadRequestsCompleted == loadRequestsStarted) {
      if (Object.keys(logEntries).length === 0) {
        print("Could not load any recent log entry files.");
        createMockLogEntries();
      } else {
        print("Loaded log entry files for ", Object.keys(logEntries).length, "days.");
      }
      if (loadRequestsCompletedCallback !== undefined) {
        loadRequestsCompletedCallback();
      }
    }
  }

  function fileName(day) {
    return "logEntries/logEntries_" + day + ".json";
  }

  function createMockLogEntries() {
    var day = days.dayOf(new Date());
    logEntries[day] = JSON.parse('{"0919200813":{"id":"0919200813","date":"2016-03-15T07:31:00.000Z","timezoneOffset":-60,"type":"carbs","carbsValue":36},"0919250704":{"id":"0919250704","date":"2016-03-15T07:19:00.000Z","timezoneOffset":-60,"type":"insulin","insulinValue":10}}',
                                days.jsonDateReviver);
  }

}());
