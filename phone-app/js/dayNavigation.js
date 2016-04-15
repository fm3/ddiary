"use strict";

var dayNavigation = (function() {

  var prevDayButton, nextDayButton;
  var displayedDaySpan;
  var daysAgo;

  return {
    initialize: function() {
      daysAgo = 0;

      var dayNavigationDiv = document.createElement("div");
      dayNavigationDiv.setAttribute("id", "dayNavigation");

      prevDayButton = document.createElement("a");
      prevDayButton.textContent = "";
      prevDayButton.className = "prevDayButton";
      prevDayButton.onclick = prevDayClicked;
      dayNavigationDiv.appendChild(prevDayButton);

      displayedDaySpan = document.createElement("span");
      displayedDaySpan.textContent = days.dayOf(new Date());
      dayNavigationDiv.appendChild(displayedDaySpan);

      nextDayButton = document.createElement("a");
      nextDayButton.textContent = "";
      nextDayButton.className = "nextDayButton";
      nextDayButton.onclick = nextDayClicked;
      dayNavigationDiv.appendChild(nextDayButton);
      updateNextDayButtonEnabled();

      document.body.appendChild(dayNavigationDiv);
      updateWithDaysAgo();

      switchToNewDayAfterMidnight();
    }
  };

  function prevDayClicked() {
    daysAgo += 1;
    updateWithDaysAgo();
  }

  function nextDayClicked() {
    daysAgo -= 1;
    if (daysAgo < 0) {
      daysAgo = 0;
    }
    updateWithDaysAgo();
  }

  function updateWithDaysAgo() {
    var fromDate = days.thisMorningLocal();
    fromDate.setDate(fromDate.getDate() - daysAgo);

    var toDate = days.thisEveningLocal();
    toDate.setDate(toDate.getDate() - daysAgo);

    var daysAgoString = "";
    if (daysAgo == 1)
      daysAgoString = "     " + "yesterday";
    if (daysAgo > 1)
      daysAgoString = "     " + daysAgo + " days ago";
    displayedDaySpan.textContent = days.localDayOf(fromDate) + daysAgoString;

    graph.setFromTo(fromDate, toDate);
    graph.update();
    updateNextDayButtonEnabled();
  }

  function updateNextDayButtonEnabled() {
    if (daysAgo < 1)
      nextDayButton.setAttribute("disabled", "true");
    else
      nextDayButton.removeAttribute("disabled");
  }

  function switchToNewDayAfterMidnight() {
    document.addEventListener("visibilitychange", function() {
      if (document.visibilityState == "visible") {
        setTimeout(function() {
          if (daysAgo == 0 && graph.rightScreenDate != days.thisEveningLocal()) {
            updateWithDaysAgo();
          }
        }, 1000);
      }
    });
  }

}());
