/* ==========================================================================
   help.js — behaviour for the Help Centre page only
   --------------------------------------------------------------------------
   Two jobs:

     1. One search box that filters everything on the page at once: the FAQ
        accordion, the rows of the error table and the glossary entries.
     2. The "Which test should I use?" helper, a few questions that end in a
        recommended Stata command.

   Both are progressive enhancements. With JavaScript switched off, every FAQ
   answer, every error and every glossary entry is still on the page (the
   accordion simply starts open), and the helper shows a static list that says
   the same things.

   Shared behaviour — the mobile nav, the theme toggle, the copy buttons on
   code blocks, the accordion itself — lives in main.js.
   ========================================================================== */

(function () {
  "use strict";

  /* ======================================================================
     Part 1: search
     ====================================================================== */

  /* Each searchable thing on the page, and the section it belongs to. The
     section heading is hidden when none of its items match. */
  var GROUPS = [
    { section: "#faq", items: ".acc-item", one: "question", many: "questions" },
    { section: "#errors", items: "tbody tr", one: "error", many: "errors" },
    { section: "#glossary", items: ".gloss-item", one: "term", many: "terms" }
  ];

  function textOf(el) {
    return (el.textContent || "").toLowerCase().replace(/\s+/g, " ");
  }

  /* Splits the query into words so "111 variable" finds the r(111) row
     whichever order you type it in. */
  function wordsOf(query) {
    var parts = query.toLowerCase().split(/\s+/);
    var words = [];
    for (var i = 0; i < parts.length; i += 1) {
      if (parts[i]) {
        words.push(parts[i]);
      }
    }
    return words;
  }

  function matches(haystack, words) {
    for (var i = 0; i < words.length; i += 1) {
      if (haystack.indexOf(words[i]) === -1) {
        return false;
      }
    }
    return true;
  }

  function setUpSearch() {
    var input = document.getElementById("help-search");
    if (!input) {
      return;
    }

    var countEl = document.getElementById("help-count");
    var emptyEl = document.getElementById("help-empty");
    var skipSections = document.querySelectorAll("[data-search-skip]");
    var groups = [];

    /* Read all the text once, on load, rather than on every keystroke. */
    for (var g = 0; g < GROUPS.length; g += 1) {
      var section = document.querySelector(GROUPS[g].section);
      if (!section) {
        continue;
      }

      var nodes = section.querySelectorAll(GROUPS[g].items);
      var items = [];
      for (var i = 0; i < nodes.length; i += 1) {
        items.push({ el: nodes[i], text: textOf(nodes[i]) });
      }

      groups.push({
        section: section,
        items: items,
        one: GROUPS[g].one,
        many: GROUPS[g].many
      });
    }

    /* FAQ answers the search opened, so clearing the box can close them
       again and leave the page as the reader found it. */
    var openedBySearch = [];

    function closeWhatSearchOpened() {
      for (var i = 0; i < openedBySearch.length; i += 1) {
        var trigger = openedBySearch[i];
        var panel = document.getElementById(trigger.getAttribute("aria-controls"));
        trigger.setAttribute("aria-expanded", "false");
        if (panel) {
          panel.hidden = true;
        }
      }
      openedBySearch = [];
    }

    function openAnswer(item) {
      var trigger = item.el.querySelector(".acc-trigger");
      if (!trigger || trigger.getAttribute("aria-expanded") === "true") {
        return;
      }

      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      trigger.setAttribute("aria-expanded", "true");
      if (panel) {
        panel.hidden = false;
      }
      openedBySearch.push(trigger);
    }

    function describe(found) {
      var parts = [];
      for (var i = 0; i < found.length; i += 1) {
        if (found[i].n > 0) {
          parts.push(found[i].n + " " + (found[i].n === 1 ? found[i].one : found[i].many));
        }
      }

      if (parts.length === 0) {
        return "";
      }
      if (parts.length === 1) {
        return parts[0];
      }
      return parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
    }

    function clearSearch() {
      for (var g = 0; g < groups.length; g += 1) {
        groups[g].section.hidden = false;
        for (var i = 0; i < groups[g].items.length; i += 1) {
          groups[g].items[i].el.hidden = false;
          groups[g].items[i].el.classList.remove("is-match");
        }
      }

      for (var s = 0; s < skipSections.length; s += 1) {
        skipSections[s].hidden = false;
      }

      closeWhatSearchOpened();

      if (countEl) {
        countEl.hidden = true;
        countEl.textContent = "";
      }
      if (emptyEl) {
        emptyEl.hidden = true;
      }
    }

    function runSearch(query) {
      var words = wordsOf(query);

      if (words.length === 0) {
        clearSearch();
        return;
      }

      closeWhatSearchOpened();

      var found = [];
      var total = 0;

      for (var g = 0; g < groups.length; g += 1) {
        var group = groups[g];
        var hits = 0;

        for (var i = 0; i < group.items.length; i += 1) {
          var item = group.items[i];
          var hit = matches(item.text, words);

          item.el.hidden = !hit;
          item.el.classList.toggle("is-match", hit);

          if (hit) {
            hits += 1;
            openAnswer(item);
          }
        }

        group.section.hidden = hits === 0;
        found.push({ n: hits, one: group.one, many: group.many });
        total += hits;
      }

      /* The decision helper and the checklist are not lists of text, so they
         step aside while you are searching rather than pretending to match. */
      for (var s = 0; s < skipSections.length; s += 1) {
        skipSections[s].hidden = true;
      }

      if (countEl) {
        countEl.hidden = false;
        countEl.textContent = total === 0
          ? "Nothing matches “" + query + "”."
          : "Showing " + describe(found) + " matching “" + query + "”.";
      }
      if (emptyEl) {
        emptyEl.hidden = total !== 0;
      }
    }

    input.addEventListener("input", function () {
      runSearch(input.value.trim());
    });

    /* Escape clears the box, which is what every other search box does. */
    input.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && input.value) {
        input.value = "";
        runSearch("");
      }
    });

    /* help.html?q=r(111) lands with the search already run, so other pages
       can link straight to an answer. */
    var fromUrl = window.location.search.match(/[?&]q=([^&]*)/);
    if (fromUrl) {
      input.value = decodeURIComponent(fromUrl[1].replace(/\+/g, " "));
      runSearch(input.value.trim());
    }
  }

  /* ======================================================================
     Part 2: "Which test should I use?"

     QUESTIONS is the decision tree. Each option either points at another
     question (next) or at a recommendation (result). To add a branch, add an
     option and the question or result it points to; nothing else needs
     editing.
     ====================================================================== */

  var QUESTIONS = {
    start: {
      q: "What are you measuring — the thing you want to draw a conclusion about?",
      options: [
        {
          label: "A number",
          note: "price, age, test score, hours slept",
          next: "numeric"
        },
        {
          label: "A category",
          note: "pass or fail, yes or no, which brand",
          next: "category"
        }
      ]
    },

    numeric: {
      q: "What are you comparing it against?",
      options: [
        {
          label: "A fixed number",
          note: "is the average score different from 50?",
          result: "oneSample"
        },
        {
          label: "Two groups",
          note: "do men and women differ?",
          next: "twoGroups"
        },
        {
          label: "Three or more groups",
          note: "do five repair grades differ?",
          result: "oneway"
        },
        {
          label: "Another number",
          note: "does price move with mileage?",
          next: "twoNumbers"
        }
      ]
    },

    twoGroups: {
      q: "Are those two groups different people, or the same people measured twice?",
      options: [
        {
          label: "Different people or things",
          note: "treated and untreated, foreign and domestic",
          result: "ttestBy"
        },
        {
          label: "The same ones, twice",
          note: "before and after, left hand and right hand",
          result: "ttestPaired"
        }
      ]
    },

    twoNumbers: {
      q: "Do you want to describe the link, or predict one from the other?",
      options: [
        {
          label: "Describe how closely they move together",
          result: "correlate"
        },
        {
          label: "Predict one from the other",
          note: "and say by how much it changes",
          result: "regress"
        }
      ]
    },

    category: {
      q: "What are you comparing?",
      options: [
        {
          label: "One category against another",
          note: "does the pass rate depend on which class you were in?",
          result: "chi2"
        },
        {
          label: "A proportion against a number, or between two groups",
          note: "is the pass rate different from 70%?",
          result: "prtest"
        },
        {
          label: "A yes/no outcome, from several other variables",
          note: "who passes, given hours studied and attendance?",
          result: "logit"
        }
      ]
    }
  };

  var RESULTS = {
    oneSample: {
      title: "One-sample t-test",
      what: "Asks whether the average of your one group is different from a number you name.",
      code: "sysuse auto, clear\nttest price == 6000",
      q: "ttest",
      link: "ttest",
      read: "Look at the two-sided p-value on the Ha: mean != 6000 line, and at the confidence interval for the mean.",
      watch: "Fine for roughly bell-shaped data. With a small and badly skewed sample, ask your course whether they want a non-parametric test instead."
    },

    ttestBy: {
      title: "Two-sample t-test",
      what: "Asks whether the averages of two separate groups differ by more than chance would explain.",
      code: "sysuse auto, clear\nttest price, by(foreign)",
      q: "ttest",
      link: "ttest",
      read: "The two group means, the difference between them, and the p-value on the Ha: diff != 0 line.",
      watch: "The grouping variable must have exactly two values. If the data is heavily skewed or the groups are tiny, ranksum is the usual alternative."
    },

    ttestPaired: {
      title: "Paired t-test",
      what: "Asks whether the same people changed: it compares two measurements taken from each row.",
      code: "use \"scores.dta\", clear\nttest before == after",
      q: "ttest",
      link: "ttest",
      read: "The mean difference and its p-value. A confidence interval that straddles zero means no clear change.",
      watch: "Both measurements have to sit in two columns on the same row. If your data has one row per measurement instead, it needs reshaping first. The non-parametric version is signrank — type help signrank in Stata for its syntax."
    },

    oneway: {
      title: "One-way ANOVA",
      what: "Asks whether three or more groups have the same average.",
      code: "sysuse auto, clear\noneway price rep78, tabulate",
      q: "oneway",
      link: "oneway",
      read: "The F statistic and its p-value. A small p-value says at least one group differs — it does not say which.",
      watch: "Use anova instead when you have more than one grouping variable. To find out which pairs differ, your course will tell you which follow-up comparison it wants."
    },

    correlate: {
      title: "Correlation",
      what: "Puts a number between −1 and 1 on how closely two variables move together.",
      code: "sysuse auto, clear\ncorrelate price mpg\npwcorr price mpg, sig",
      q: "correlate",
      link: "correlate",
      read: "The coefficient itself. pwcorr with the sig option adds a p-value underneath it.",
      watch: "It only sees straight-line relationships, and it says nothing about cause. Draw a scatter first — a curved pattern can give a correlation near zero."
    },

    regress: {
      title: "Linear regression",
      what: "Estimates how much the outcome changes when the other variable goes up by one.",
      code: "sysuse auto, clear\nregress price mpg",
      q: "regress",
      link: "regress",
      read: "The coefficient on your variable, its p-value in the P>|t| column, and the R-squared at the top right.",
      watch: "A coefficient is an association, not proof of cause. Add more variables to the line to hold them constant: regress price mpg weight."
    },

    chi2: {
      title: "Chi-squared test",
      what: "Asks whether two categorical variables are related, using a cross-tabulation.",
      code: "sysuse auto, clear\ntabulate foreign rep78, chi2 row",
      q: "chi2",
      link: "tabulate ..., chi2",
      read: "The Pearson chi2 line under the table, and its p-value.",
      watch: "It gets unreliable when the expected count in a cell is very small, which happens easily with a sparse table. Add the expected option to see those counts."
    },

    prtest: {
      title: "Test of proportions",
      what: "Asks whether a proportion differs from a value you name, or between two groups.",
      code: "sysuse auto, clear\nprtest foreign == 0.3\nprtest foreign, by(rep78)",
      q: "prtest",
      link: "prtest",
      read: "The proportion itself, the difference, and the two-sided p-value.",
      watch: "The variable has to be coded 0 and 1. If yours is text, encode it first. For a small sample, your course may prefer an exact test."
    },

    logit: {
      title: "Logistic regression",
      what: "Models a yes/no outcome from one or more other variables.",
      code: "sysuse auto, clear\nlogit foreign mpg weight",
      q: "logit",
      link: "logit",
      read: "Each coefficient and its p-value. Add the or option to get odds ratios, which are easier to put into words.",
      watch: "The coefficients are on a log-odds scale, so they do not read like regression coefficients. This is usually a second-term topic — check it is on your syllabus before using it."
    }
  };

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function setUpChooser() {
    var root = document.getElementById("chooser-app");
    if (!root) {
      return;
    }

    /* The trail of answers so far: each entry is the question key and the
       option that was chosen, which is all Back needs. */
    var trail = [];
    var current = "start";
    var result = null;

    function trailHtml() {
      if (trail.length === 0) {
        return "";
      }

      var html = '<ol class="chooser-trail">';
      for (var i = 0; i < trail.length; i += 1) {
        html += "<li>" + escapeHtml(trail[i].label) + "</li>";
      }
      return html + "</ol>";
    }

    function actionsHtml() {
      var html = '<div class="chooser-actions">';
      if (trail.length > 0) {
        html += '<button class="btn btn-quiet" type="button" data-chooser-back>Back</button>';
        html += '<button class="btn btn-quiet" type="button" data-chooser-reset>Start again</button>';
      }
      return html + "</div>";
    }

    function questionHtml(key) {
      var question = QUESTIONS[key];
      var html = trailHtml();

      html += '<div class="chooser-step">';
      html += '<p class="chooser-step-count">Question ' + (trail.length + 1) + "</p>";
      html += '<h3 class="chooser-q">' + escapeHtml(question.q) + "</h3>";
      html += '<div class="chooser-options">';

      for (var i = 0; i < question.options.length; i += 1) {
        var option = question.options[i];
        html += '<button class="chooser-opt" type="button" data-option="' + i + '">';
        html += '<span class="chooser-opt-label">' + escapeHtml(option.label) + "</span>";
        if (option.note) {
          html += '<span class="chooser-opt-note">' + escapeHtml(option.note) + "</span>";
        }
        html += "</button>";
      }

      html += "</div>" + actionsHtml() + "</div>";
      return html;
    }

    function resultHtml(key) {
      var r = RESULTS[key];
      var html = trailHtml();

      html += '<div class="chooser-result">';
      html += '<p class="chooser-step-count">Start here</p>';
      html += "<h3>" + escapeHtml(r.title) + "</h3>";
      html += "<p>" + escapeHtml(r.what) + "</p>";
      html += '<pre class="code"><code>' + escapeHtml(r.code) + "</code></pre>";
      html += '<dl class="chooser-notes">';
      html += "<dt>What to read in the output</dt><dd>" + escapeHtml(r.read) + "</dd>";
      html += "<dt>Before you trust it</dt><dd>" + escapeHtml(r.watch) + "</dd>";
      html += "</dl>";
      html += '<p class="chooser-cta"><a class="btn btn-primary" href="commands.html?q=' +
        encodeURIComponent(r.q) + '">Open <code>' + escapeHtml(r.link) +
        "</code> in the dictionary</a></p>";
      html += actionsHtml() + "</div>";
      return html;
    }

    function render(moveFocus) {
      root.innerHTML = result ? resultHtml(result) : questionHtml(current);

      /* The code block in a result wants the same copy button as everywhere
         else on the site. */
      if (window.StataToolkit && window.StataToolkit.addCopyButtons) {
        window.StataToolkit.addCopyButtons(root);
      }

      var step = root.querySelector(".chooser-step, .chooser-result");
      if (moveFocus && step) {
        step.setAttribute("tabindex", "-1");
        step.focus();
      }
    }

    function closest(node, selector) {
      return node && node.closest ? node.closest(selector) : null;
    }

    root.addEventListener("click", function (event) {
      var option = closest(event.target, "[data-option]");

      if (option) {
        var chosen = QUESTIONS[current].options[parseInt(option.getAttribute("data-option"), 10)];
        trail.push({ key: current, label: chosen.label });

        if (chosen.result) {
          result = chosen.result;
        } else {
          current = chosen.next;
        }

        render(true);
        return;
      }

      if (closest(event.target, "[data-chooser-back]")) {
        var last = trail.pop();
        if (last) {
          current = last.key;
          result = null;
        }
        render(true);
        return;
      }

      if (closest(event.target, "[data-chooser-reset]")) {
        trail = [];
        current = "start";
        result = null;
        render(true);
      }
    });

    render(false);
  }

  function init() {
    setUpSearch();
    setUpChooser();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
