# Stata-19 Toolkit

A static website that helps beginners get through the Stata half of an introductory statistics
course: a searchable command dictionary, a seven-lesson beginner course, and a help centre for
error messages.

Plain HTML, CSS and JavaScript. No frameworks, no build step and no dependencies; the only thing
loaded from another server is the Inter webfont from Google Fonts.

**Live at <https://csbanger.github.io/Stata19ToolKit/>**, served by GitHub Pages from the
[csbanger/Stata19ToolKit](https://github.com/csbanger/Stata19ToolKit) repository.

## Viewing it on your own machine

Double-click `index.html`. That is all — it opens in your browser and everything works, including
the search box and the copy buttons.

If you would rather serve it over `http://` (closer to how the live site behaves), run one of
these in this folder and then open the address it prints:

```bash
python -m http.server 8000
```

## Updating the live site

GitHub Pages serves the `main` branch of `csbanger/Stata19ToolKit` from its root. Anything that
reaches that branch is live about a minute later.

Worth knowing: **this folder is not that repository.** It sits inside a larger one with unrelated
files in it, and the two are kept in step by hand. So a change made here is not live until you
move it across by one of the routes below, and a change made on GitHub is not here until you copy
it back.

### A typo or a one-line fix

Open the file in the repository, click the pencil icon, edit, then **Commit changes** at the
bottom. Quick, but make the same edit in this folder too, or the next upload from here will quietly
undo it.

### Anything larger

Edit here, check it locally, then push from a clone of the published repository. If you have not
cloned it yet, do that once, somewhere outside this folder:

```bash
git clone https://github.com/csbanger/Stata19ToolKit.git
```

Then, each time you have changes: copy the five `.html` files, `README.md`, and the `css`, `js` and
`assets` folders over the clone's copies, and from inside the clone run

```bash
git add -A
git commit -m "Say what changed"
git push
```

### Or upload through the browser

**Add file → Upload files** in the repository, drag the changed files in, commit.

One trap, because it has already happened once: dragging a selection that contains folders can
flatten it, so `css/style.css` arrives as `style.css` at the root. The pages only ever ask for
`css/` and `js/`, so the site then loads as unstyled text with no working search. Drag the `css`,
`js` and `assets` folders themselves, and afterwards check the repository lists folders rather than
loose `.css` and `.js` files.

### Checking a change landed

Reload the live page with **Ctrl+F5** — Pages updates within a minute but browsers cache hard. If
it comes back unstyled, the `css` folder is missing or was flattened.

### Showing someone a draft

[Netlify Drop](https://app.netlify.com/drop) takes the whole folder dragged onto it and returns a
live address in seconds, with no account needed to start. Useful for sharing a work-in-progress
without touching the published site.

## What each file is

| File | What it is |
| --- | --- |
| `index.html` | Home page: hero, the three main sections, a runnable first example |
| `commands.html` | Command Dictionary: the search box, the category chips, the results list |
| `guide.html` | Beginner Guide: seven lessons, the progress bar, the quiz reveals |
| `help.html` | Help Centre: the search box, FAQs, error codes, the test chooser, the glossary |
| `about.html` | Why I'm Doing This: the personal story page |
| `css/style.css` | Every style on the site, starting with the design tokens |
| `js/commands-data.js` | The dictionary content: one block per command, and nothing else |
| `js/commands.js` | The search, filter, sort and card-drawing code for that content |
| `js/guide.js` | The guide's progress bar, mark-as-complete ticks and answer reveals |
| `js/help.js` | The Help Centre search and the "which test?" decision tree |
| `js/main.js` | Copy buttons, mobile nav, the FAQ accordion, the active nav link |
| `assets/favicon.svg` | The logo mark, used as the browser tab icon |

## Making changes

**Add a command.** Open `js/commands-data.js`, copy one whole `{ ... }` block, paste it where you
want it and edit the text. Keep the comma between blocks. The fields are `name`, `category`,
`abbrev`, `description`, `syntax`, `example`, `options`, `mistakes` and `keywords`, all documented
in the comment at the top of that file. Two rules of thumb: start every `example` with
`sysuse auto, clear` so it can be pasted straight into Stata, and write the `description` the way
a beginner would describe the problem, because that is what the search matches.

**Add a category.** Just use a new `category` string on a command, then add it to
`STATA_CATEGORIES` at the bottom of `commands-data.js` to control where it sits in the order. The
filter button builds itself either way.

**Add an FAQ.** Copy an `.acc-item` block in `help.html` and change the question, the answer, and
the `id`/`aria-controls` pair — give it a new number so the two match each other and nothing else
on the page. New FAQs, error rows and glossary entries are picked up by the search box
automatically; it reads the text that is already on the page.

**Add a branch to the test chooser.** The decision tree is `QUESTIONS` at the bottom of
`js/help.js`, and the recommendations are `RESULTS` under it. An option either points at another
question (`next`) or at a recommendation (`result`), so a new branch is one option plus the thing
it points at. Keep the static list in the `.chooser-static` block of `help.html` saying the same
things — that is what a reader with JavaScript off sees.

**Add or edit a lesson.** Each lesson in `guide.html` is one `<article class="lesson">` block.
Copy a whole block, then change four numbers so they match: `id="lesson-8"`, `data-lesson="8"`,
`data-complete="8"` on the mark-complete button, and the `aria-controls`/`id` pair on the reveal
button and its answer (`answer-8`). Add a line to the contents list with `data-toc="8"`, and change
`TOTAL_LESSONS` at the top of `js/guide.js` so the progress bar counts out of the right number.
Code examples go in `<pre class="code">` (these get a copy button); Stata's own output goes in
`<pre class="out">` (these deliberately do not).

**Progress ticks.** They live in the reader's own browser under the key `s19-progress`, as a list of
lesson numbers. Nothing is sent anywhere, and clearing site data resets it — which is also what the
"Start again" link does.

**Change the colours.** Everything comes from the `:root` block at the top of `css/style.css`:
section 1 is the light theme, section 2 is the dark one. Edit those values and the whole site
follows. The accent gold is `--accent` (plus `--accent-strong`, which is the same hue dark enough
for text on white).

**Dark mode.** Readers get their system preference by default and can override it with the toggle
in the header; the choice is saved in their browser. Two things make it work on a page: the small
script in the `<head>` (which applies the saved choice before the first paint, avoiding a flash)
and the toggle button in the header. Copy both from `index.html`.

**The font.** Inter is loaded from Google Fonts in each page's `<head>`. If the reader is offline
or Google is blocked, the page falls back to the system sans-serif and still looks fine. Remove
the two `<link>` tags if you would rather the site made no external requests at all.

**Change the navigation.** The header and footer are copied into all five pages, which is the
trade-off for having no build step. Edit one page, then find-and-replace the same block in the
other four.

**Finish the story page.** The story in `about.html` is a draft written from your own outline,
so read it through and change anything that does not sound like you. The sentences highlighted in
yellow are `<span class="editme">` placeholders for the details only you know — your name, the
term you took the course, one specific moment. Fill each one in and delete the surrounding
`<span>`, or delete the whole sentence; the paragraphs read correctly either way. Delete the
`<div class="callout">` editing note at the top of the story section before you share the site.

## Notes

Not affiliated with StataCorp or any university. Stata is a registered trademark of StataCorp LLC.
Command syntax varies a little between Stata versions — `help <command>` inside Stata is always
the authority for the copy you are using.
