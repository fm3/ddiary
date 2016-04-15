"use strict";

var files = (function() {

  return {

    overwrite: function(text, filename, onsuccess) {
      if (!(navigator.getDeviceStorage)) {
        print("Can’t write file", filename, ": getDeviceStorage not supported on device");
        return;
      }
      var sdcard = navigator.getDeviceStorage("sdcard");
      var deleteRequest = sdcard.delete(config.workingDir + "/" + filename);
      deleteRequest.onsuccess = function() {files.write(text, filename, onsuccess);};
      deleteRequest.onerror = function() {files.write(text, filename, onsuccess);};
    },

    write: function(text, filename, onsuccess) {
      if (!(navigator.getDeviceStorage)) {
        print("Can’t write file", filename, ": getDeviceStorage not supported on device");
        return;
      }
      var sdcard = navigator.getDeviceStorage("sdcard");
      var file = new Blob([text], {type: "text/plain"});
      var request = sdcard.addNamed(file, config.workingDir + "/" + filename);

      request.onerror = function () {
        print("Unable to write the file", filename, "E:", this.error.name);
      };
      request.onsuccess = function () {
        print("Wrote file", filename);
        if(onsuccess) {
          onsuccess(filename);
        }
      };
    },

    read: function(filename, onsuccess, onerror, onsuccessParameter) {
      if (!(navigator.getDeviceStorage)) {
        console.log("Can’t read file", filename, ": getDeviceStorage not supported on device");
        if (onerror !== undefined)
          onerror();
        return;
      }
      var sdcard = navigator.getDeviceStorage("sdcard");
      var request = sdcard.get(config.workingDir + "/" + filename);
      if (onsuccess !== undefined)
        request.onsuccess = function() {try{readText.apply(this, [onsuccess, onsuccessParameter]);} catch(err){print("E:", err.message);}};
      if (onerror !== undefined)
        request.onerror =  onerror;
    },

    enumerate: function(onsuccess) {
      if (!(navigator.getDeviceStorage)) {
        print("Can’t load files: getDeviceStorage not supported on device");
        return;
      }
      var sdcard = navigator.getDeviceStorage("sdcard");
      var request = sdcard.enumerate(config.workingDir);

      request.onsuccess = function() {
        if (this.result) {
          if (this.result.name.indexOf(".json") > -1) {
            print("enumerate file", this.result.name);
          }
        }
        this.continue();
      };

      request.onerror = function() {print("cannot enumerate", config.workingDir, "E:", this.error.name);};
    },
    
    createDirectory: function(newDirName, onsuccess) {
      if (!(navigator.getDeviceStorage)) {
        print("Can’t create directories: getDeviceStorage not supported on device");
        return;
      }
      var sdcard = navigator.getDeviceStorage("sdcard");
      var file = new Blob([''], {type: "text/plain"});
      var path = config.workingDir + "/" + newDirName + "/.empty";
      var addRequest = sdcard.addNamed(file, path);
      addRequest.onsuccess = function() {sdcard.delete(path)};
    }
  };


  function readText(onsuccess, onsuccessParameter) {
    var file = this.result;

    var reader = new FileReader();
    reader.onload = function (event) {try{onsuccess.apply(this, [event.target.result, onsuccessParameter]);} catch(err){print("E: ", err.message);}};
    reader.readAsText(file);
  }

}());
