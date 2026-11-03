/* ==========================================================================
   guide.js — behaviour for the Beginner Guide page only
   --------------------------------------------------------------------------
   Three small jobs:

     1. Reveal-answer buttons on the "check your understanding" questions.
     2. A "mark as complete" button on each lesson.
     3. A progress bar that adds up those ticks and remembers them in
        localStorage, so closing the tab does not lose your place.

   Progress is stored under the key "s19-progress" as a JSON array of lesson
   numbers, e.g. [1,2,5]. If storage is unavailable (private browsing, or a
   browser with cookies blocked) everything still works for this visit — it
   just will not be remembered.

   This file is only loaded by guide.html. Shared behaviour — the mobile nav,
   the theme toggle, the copy buttons on code blocks — lives in main.js.
   ========================================================================== */

(function () {
  "use strict";

  var PROGRESS_KEY = "s19-progress";
  var TOTAL_LESSONS = 7;

  /* ----------------------------------------------------------------------
     Storage helpers. Every call is wrapped, because reading localStorage
     can throw outright in some privacy modes.
     ---------------------------------------------------------------------- */

  function readProgress() {
    try {
      var raw = window.localStorage.getItem(PROGRESS_KEY);
      if (!raw) {
        return [];
      }

      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.length !== "number") {
        return [];
      }

      /* Keep only sensible lesson numbers, in case the stored value is old
         or has been edited by hand. */
      var clean = [];
      for (var i = 0; i < parsed.length; i += 1) {
        var n = parseInt(parsed[i], 10);
        if (n >= 1 && n <= TOTAL_LESSONS && clean.indexOf(n) === -1) {
          clean.push(n);
        }
      }
      return clean;
    } catch (error) {
      return [];
    }
  }

  function writeProgress(list) {
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(list));
    } catch (error) {
      /* Nothing to do: the page keeps working, it just will not remember. */
    }
  }

  /* ----------------------------------------------------------------------
     Reveal-answer buttons

     The answer is in the HTML from the start and is hidden here, by script.
     That way someone with JavaScript switched off sees the answers rather
     than a dead button.
     ---------------------------------------------------------------------- */

  function setUpReveals() {
    var buttons = document.querySelectorAll(".reveal");

    for (var i = 0; i < buttons.length; i += 1) {
      (function (button) {
        var answer = document.getElementById(button.getAttribute("aria-controls"));
        if (!answer) {
          return;
        }

        answer.hidden = true;

        button.addEventListener("click", function () {
          var open = button.getAttribute("aria-expanded") === "true";
          button.setAttribute("aria-expanded", open ? "false" : "true");
          answer.hidden = open;
          button.textContent = open ? "Show the answer" : "Hide the answer";
        });
      }(buttons[i]));
    }
  }

  /* ----------------------------------------------------------------------
     Progress: the bar, the count, the ticks and the buttons
     ---------------------------------------------------------------------- */

  function setUpProgress() {
    var buttons = document.querySelectorAll(".mark-complete");
    if (!buttons.length) {
      return;
    }

    var fill = document.getElementById("progress-fill");
    var track = document.getElementById("progress-track");
    var count = document.getElementById("progress-count");
    var note = document.getElementById("progress-note");
    var reset = document.getElementById("progress-reset");
    var done = readProgress();

    function isDone(n) {
      return done.indexOf(n) !== -1;
    }

    /* Puts one lesson's button, card and contents entry into the right
       state. Called for every lesson whenever anything changes, which is
       cheap at seven lessons and keeps the three places in step. */
    function paintLesson(button) {
      var n = parseInt(button.getAttribute("data-complete"), 10);
      var complete = isDone(n);
      var lesson = document.getElementById("lesson-" + n);
      var tocItem = document.querySelector('[data-toc="' + n + '"]');

      button.setAttribute("aria-pressed", complete ? "true" : "false");
      button.textContent = complete ? "Completed" : "Mark as complete";
      button.classList.toggle("is-complete", complete);

      /* The filled primary button is for the action still to take; once the
         lesson is done the button steps back visually. */
      button.classList.toggle("btn-primary", !complete);
      button.classList.toggle("btn-quiet", complete);

      if (lesson) {
        lesson.classList.toggle("lesson--done", complete);
      }
      if (tocItem) {
        tocItem.classList.toggle("is-done", complete);
      }
    }

    function paintBar() {
      var n = done.length;
      var percent = Math.round((n / TOTAL_LESSONS) * 100);

      if (fill) {
        fill.style.width = percent + "%";
      }
      if (track) {
        track.setAttribute("aria-valuenow", String(n));
        track.setAttribute("aria-valuetext", n + " of " + TOTAL_LESSONS + " lessons complete");
      }
      if (count) {
        count.textContent = n === 0
          ? "Lesson progress"
          : n + " of " + TOTAL_LESSONS + " lessons complete";
      }
      if (note) {
        if (n === 0) {
          note.textContent = "Tick lessons off as you go — this browser remembers.";
        } else if (n === TOTAL_LESSONS) {
          note.textContent = "All seven done. You can run a full analysis from a do-file.";
        } else {
          note.textContent = "Picking up where you left off.";
        }
      }
      if (reset) {
        reset.hidden = n === 0;
      }

      document.body.classList.toggle("course-complete", n === TOTAL_LESSONS);
    }

    function paintAll() {
      for (var i = 0; i < buttons.length; i += 1) {
        paintLesson(buttons[i]);
      }
      paintBar();
    }

    for (var i = 0; i < buttons.length; i += 1) {
      (function (button) {
        button.addEventListener("click", function () {
          var n = parseInt(button.getAttribute("data-complete"), 10);
          var at = done.indexOf(n);

          if (at === -1) {
            done.push(n);
          } else {
            done.splice(at, 1);
          }

          writeProgress(done);
          paintAll();
        });
      }(buttons[i]));
    }

    if (reset) {
      reset.addEventListener("click", function () {
        done = [];
        writeProgress(done);
        paintAll();
      });
    }

    paintAll();
  }

  function init() {
    setUpReveals();
    setUpProgress();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
