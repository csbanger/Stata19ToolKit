/* ==========================================================================
   commands.js - draws the Command Dictionary and runs its search.

   The content lives in commands-data.js, which loads first. You should not
   need to edit this file to add a command.

   What it does:
     1. Builds the category filter buttons from the data
     2. Filters on what you type, matching name, short form, category,
        description, syntax, option names and keywords
     3. Sorts either grouped by category or straight A to Z
     4. Draws each command as an expandable card with copy buttons
   ========================================================================== */

(function () {
  "use strict";

  var listEl = document.getElementById("cmd-list");

  // Every other page loads this file too, so stop unless we are on the
  // dictionary page.
  if (!listEl) {
    return;
  }

  var searchEl = document.getElementById("cmd-search");
  var countEl = document.getElementById("cmd-count");
  var chipsEl = document.getElementById("cmd-chips");
  var sortEl = document.getElementById("cmd-sort");

  var activeCategory = "All";
  var activeSort = "category";

  /* ---------------------------------------------------------------- utils */

  // Turns characters that mean something in HTML into safe text, so a
  // command containing < or > cannot break the page.
  function escapeHtml(text) {
    return String(text === undefined || text === null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // The categories that are actually used, in the order given by
  // STATA_CATEGORIES, with any unlisted ones added at the end.
  function categoriesInUse() {
    var used = [];

    STATA_CATEGORIES.forEach(function (category) {
      var isUsed = STATA_COMMANDS.some(function (command) {
        return command.category === category;
      });

      if (isUsed) {
        used.push(category);
      }
    });

    STATA_COMMANDS.forEach(function (command) {
      if (used.indexOf(command.category) === -1) {
        used.push(command.category);
      }
    });

    return used;
  }

  /* --------------------------------------------------------------- search */

  // Everything a search term is allowed to match. The worked example is
  // left out on purpose: every example starts with "sysuse auto", so
  // including it would make those words match all 49 cards.
  function haystackFor(command) {
    var optionText = (command.options || []).map(function (item) {
      return item.option + " " + item.note;
    }).join(" ");

    return [
      command.name,
      command.abbrev,
      command.category,
      command.description,
      command.syntax,
      optionText,
      command.keywords
    ].join(" ").toLowerCase();
  }

  function matchesQuery(command, words) {
    if (words.length === 0) {
      return true;
    }

    var haystack = haystackFor(command);

    // Every word typed has to appear somewhere, in any order.
    return words.every(function (word) {
      return haystack.indexOf(word) !== -1;
    });
  }

  /* ----------------------------------------------------------- the cards */

  function optionsHtml(command) {
    if (!command.options || command.options.length === 0) {
      return "";
    }

    var items = command.options.map(function (item) {
      return (
        "<li>" +
          "<code>" + escapeHtml(item.option) + "</code> " +
          "<span>" + escapeHtml(item.note) + "</span>" +
        "</li>"
      );
    }).join("");

    return (
      '<h4 class="cmd-label">Useful options</h4>' +
      '<ul class="opt-list">' + items + "</ul>"
    );
  }

  function cardHtml(command, isOpen) {
    var abbrev = command.abbrev
      ? '<span class="cmd-abbrev">short form <code>' + escapeHtml(command.abbrev) + "</code></span>"
      : "";

    var mistakes = command.mistakes
      ? '<h4 class="cmd-label">Common mistakes</h4>' +
        '<p class="cmd-mistake">' + escapeHtml(command.mistakes) + "</p>"
      : "";

    return (
      "<details class=\"cmd\"" + (isOpen ? " open" : "") + ">" +
        '<summary class="cmd-summary">' +
          '<span class="cmd-top">' +
            '<span class="cmd-name">' + escapeHtml(command.name) + "</span>" +
            '<span class="badge">' + escapeHtml(command.category) + "</span>" +
            abbrev +
          "</span>" +
          '<span class="cmd-desc">' + escapeHtml(command.description) + "</span>" +
        "</summary>" +
        '<div class="cmd-body">' +
          '<h4 class="cmd-label">Syntax</h4>' +
          '<pre class="code"><code>' + escapeHtml(command.syntax) + "</code></pre>" +
          '<h4 class="cmd-label">Try it on the auto dataset</h4>' +
          '<pre class="code"><code>' + escapeHtml(command.example) + "</code></pre>" +
          optionsHtml(command) +
          mistakes +
        "</div>" +
      "</details>"
    );
  }

  function groupHtml(title, commands, openAll) {
    var cards = commands.map(function (command) {
      return cardHtml(command, openAll);
    }).join("");

    var heading = title
      ? '<h2 class="cat-heading">' + escapeHtml(title) +
        ' <span class="cat-count">' + commands.length + "</span></h2>"
      : "";

    return '<section class="cmd-group">' + heading + cards + "</section>";
  }

  /* --------------------------------------------------------------- render */

  function render() {
    var query = (searchEl.value || "").trim().toLowerCase();
    var words = query ? query.split(/\s+/) : [];

    var matches = STATA_COMMANDS.filter(function (command) {
      var categoryOk = activeCategory === "All" || command.category === activeCategory;
      return categoryOk && matchesQuery(command, words);
    });

    // A single result is almost always the one you wanted, so save a click.
    var openAll = matches.length === 1;

    if (matches.length === 0) {
      listEl.innerHTML =
        '<div class="empty-state">' +
          "<h3>No commands match that</h3>" +
          "<p>Try a shorter word, or search for what you want to do rather than the command name &mdash; " +
          'for example &ldquo;average&rdquo;, &ldquo;chart&rdquo; or &ldquo;missing&rdquo;.</p>' +
          '<p>Still nothing? The <a href="help.html">Help Centre</a> covers errors and workflow, ' +
          "and Stata&rsquo;s own <code>search</code> command looks through the full documentation.</p>" +
        "</div>";
    } else if (activeSort === "az") {
      var sorted = matches.slice().sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });

      listEl.innerHTML = groupHtml("", sorted, openAll);
    } else {
      // Grouped by category, in the order set in commands-data.js.
      listEl.innerHTML = categoriesInUse().map(function (category) {
        var inCategory = matches.filter(function (command) {
          return command.category === category;
        });

        return inCategory.length === 0 ? "" : groupHtml(category, inCategory, openAll);
      }).join("");
    }

    // Update the line above the list.
    var label = matches.length === 1 ? "1 command" : matches.length + " commands";

    countEl.textContent =
      "Showing " + label +
      (activeCategory === "All" ? "" : " in " + activeCategory) +
      (query ? " matching “" + query + "”" : "") +
      ".";

    // The code blocks have just been created, so give them copy buttons.
    if (window.StataToolkit && window.StataToolkit.addCopyButtons) {
      window.StataToolkit.addCopyButtons(listEl);
    }
  }

  /* -------------------------------------------------------------- controls */

  function buildChips() {
    var names = ["All"].concat(categoriesInUse());

    chipsEl.innerHTML =
      '<span class="chips-label">Category</span>' +
      names.map(function (name) {
        return (
          '<button class="chip" type="button" data-category="' + escapeHtml(name) + '"' +
          ' aria-pressed="' + (name === activeCategory ? "true" : "false") + '">' +
          escapeHtml(name) +
          "</button>"
        );
      }).join("");

    chipsEl.addEventListener("click", function (event) {
      var chip = event.target.closest(".chip");

      if (!chip) {
        return;
      }

      activeCategory = chip.getAttribute("data-category");

      Array.prototype.forEach.call(chipsEl.querySelectorAll(".chip"), function (other) {
        other.setAttribute("aria-pressed", String(other === chip));
      });

      render();
    });
  }

  function setUpSort() {
    sortEl.addEventListener("click", function (event) {
      var button = event.target.closest("[data-sort]");

      if (!button) {
        return;
      }

      activeSort = button.getAttribute("data-sort");

      Array.prototype.forEach.call(sortEl.querySelectorAll("[data-sort]"), function (other) {
        other.setAttribute("aria-pressed", String(other === button));
      });

      render();
    });
  }

  /* ----------------------------------------------------------------- start */

  searchEl.addEventListener("input", render);

  // Escape clears the search box.
  searchEl.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      searchEl.value = "";
      render();
    }
  });

  buildChips();
  setUpSort();

  // Another page can link straight to a search, e.g. commands.html?q=ttest
  var fromUrl = /[?&]q=([^&]*)/.exec(window.location.search);

  if (fromUrl) {
    searchEl.value = decodeURIComponent(fromUrl[1].replace(/\+/g, " "));
  }

  render();
}());
