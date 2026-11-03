/* ==========================================================================
   main.js - the small amount of JavaScript every page shares.

   It does five things:
     1.  Copy buttons on every code block
     1b. The light/dark mode toggle
     2.  The mobile navigation toggle
     3.  The open/close behaviour of the Help Centre questions
     4.  Marking the current page in the navigation, and the year in the footer

   Nothing here is required for the content to be readable: with JavaScript
   switched off every page still works, apart from the dictionary's search box.
   Dark mode also still follows the reader's device without this file.
   ========================================================================== */

/* A single shared object so commands.js can reuse the copy-button helper
   after it rebuilds the command list. */
window.StataToolkit = window.StataToolkit || {};

/* -------------------------------------------------------------------------
   1. Copy buttons
   ------------------------------------------------------------------------- */

/* Copies text to the clipboard. The modern API only works on secure pages,
   and this site is often opened straight from a folder, so there is an
   older fallback for that case. */
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise(function (resolve, reject) {
    var holder = document.createElement("textarea");
    holder.value = text;
    holder.setAttribute("readonly", "");
    holder.style.position = "fixed";
    holder.style.top = "-1000px";
    document.body.appendChild(holder);
    holder.select();

    try {
      var worked = document.execCommand("copy");
      document.body.removeChild(holder);
      if (worked) {
        resolve();
      } else {
        reject(new Error("copy refused"));
      }
    } catch (error) {
      document.body.removeChild(holder);
      reject(error);
    }
  });
}

/* Adds a Copy button to every <pre class="code"> inside the given element
   (or the whole page if nothing is given). Safe to call more than once. */
window.StataToolkit.addCopyButtons = function (root) {
  var scope = root || document;
  var blocks = scope.querySelectorAll("pre.code");

  Array.prototype.forEach.call(blocks, function (block) {
    // Already has a button, so leave it alone.
    if (block.querySelector(".code-copy")) {
      return;
    }

    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy this command");

    button.addEventListener("click", function () {
      var code = block.querySelector("code");
      var text = (code ? code.textContent : block.textContent).trim();

      copyText(text).then(function () {
        button.textContent = "Copied";
        button.classList.add("is-done");
      }).catch(function () {
        button.textContent = "Press Ctrl+C";
      });

      window.setTimeout(function () {
        button.textContent = "Copy";
        button.classList.remove("is-done");
      }, 2000);
    });

    block.appendChild(button);
  });
};

/* -------------------------------------------------------------------------
   1b. Light and dark mode

   Three states, in order of priority:
     - the reader pressed the toggle on this site  -> data-theme on <html>
     - their device prefers dark                   -> the CSS media query
     - neither                                     -> light

   The choice is remembered in localStorage, and a tiny script in the <head>
   of each page re-applies it before the first paint so the page never
   flashes the wrong colours.
   ------------------------------------------------------------------------- */
var THEME_KEY = "s19-theme";

function systemPrefersDark() {
  return Boolean(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

/* What the reader is looking at right now. */
function currentTheme() {
  var chosen = document.documentElement.getAttribute("data-theme");

  if (chosen === "dark" || chosen === "light") {
    return chosen;
  }

  return systemPrefersDark() ? "dark" : "light";
}

/* The button always describes what pressing it will do. */
function describeToggle(theme) {
  var label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  var buttons = document.querySelectorAll("[data-theme-toggle]");

  Array.prototype.forEach.call(buttons, function (button) {
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
  });
}

function setUpThemeToggle() {
  // Safety net for any page that does not yet have the inline <head> script:
  // apply the remembered choice here instead. The <head> script is still
  // preferable, because this runs late enough to flash the other theme.
  if (!document.documentElement.getAttribute("data-theme")) {
    try {
      var saved = window.localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") {
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch (error) {
      // Storage blocked; the system preference applies.
    }
  }

  describeToggle(currentTheme());

  var buttons = document.querySelectorAll("[data-theme-toggle]");

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", next);
      describeToggle(next);

      try {
        window.localStorage.setItem(THEME_KEY, next);
      } catch (error) {
        // Private browsing can block storage. The toggle still works for
        // this page view, it just will not be remembered.
      }
    });
  });

  // If the reader has never pressed the toggle, follow their device when it
  // switches between light and dark during the day.
  if (window.matchMedia) {
    var query = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function () {
      if (!document.documentElement.getAttribute("data-theme")) {
        describeToggle(systemPrefersDark() ? "dark" : "light");
      }
    };

    if (query.addEventListener) {
      query.addEventListener("change", onChange);
    } else if (query.addListener) {
      query.addListener(onChange);
    }
  }
}

/* -------------------------------------------------------------------------
   2. Mobile navigation
   ------------------------------------------------------------------------- */
function setUpNavToggle() {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Escape closes the menu and puts focus back on the button.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });

  // If the window is widened to desktop size, forget that it was open.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 820 && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* -------------------------------------------------------------------------
   3. Help Centre questions (the accordion)
   ------------------------------------------------------------------------- */
function setUpAccordion() {
  var triggers = document.querySelectorAll(".acc-trigger");

  Array.prototype.forEach.call(triggers, function (trigger) {
    var panelId = trigger.getAttribute("aria-controls");
    var panel = document.getElementById(panelId);

    if (!panel) {
      return;
    }

    trigger.addEventListener("click", function () {
      var isOpen = trigger.getAttribute("aria-expanded") === "true";

      // Each question opens and closes on its own, so reading two answers
      // side by side is possible.
      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;
    });
  });

  // If the page was opened with a link to one question, open that question.
  if (window.location.hash) {
    var target = document.querySelector('[aria-controls="' + window.location.hash.slice(1) + '"]');
    if (target) {
      target.click();
      target.scrollIntoView();
    }
  }
}

/* -------------------------------------------------------------------------
   4. Current page in the nav, and the year in the footer
   ------------------------------------------------------------------------- */
function markCurrentPage() {
  // "…/guide.html" becomes "guide.html"; a bare folder URL becomes "index.html".
  var path = window.location.pathname.split("/").pop() || "index.html";

  var links = document.querySelectorAll(".site-nav .nav-link");

  Array.prototype.forEach.call(links, function (link) {
    var href = link.getAttribute("href");

    if (href === path) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function fillInYear() {
  var slots = document.querySelectorAll("[data-year]");
  var year = String(new Date().getFullYear());

  Array.prototype.forEach.call(slots, function (slot) {
    slot.textContent = year;
  });
}

/* -------------------------------------------------------------------------
   Start everything once the page is ready.
   ------------------------------------------------------------------------- */
function init() {
  window.StataToolkit.addCopyButtons();
  setUpThemeToggle();
  setUpNavToggle();
  setUpAccordion();
  markCurrentPage();
  fillInYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
