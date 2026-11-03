/* ==========================================================================
   commands-data.js - the content of the Command Dictionary.

   This file is ONLY data. Nothing here draws anything on the page; that is
   commands.js, which you should not need to touch when adding a command.

   ---------------------------------------------------------------------------
   HOW TO ADD A COMMAND
   ---------------------------------------------------------------------------
   Copy any whole { ... } block below, paste it inside the list, and edit the
   text. Mind the comma between blocks. The fields are:

     name         what you type in Stata, e.g. "summarize"
     category     must match one of STATA_CATEGORIES at the bottom of this
                  file. Invent a new one and it appears as a filter button
                  automatically.
     abbrev       the short form Stata accepts, e.g. "sum". Leave it as ""
                  when there is not one you are sure of.
     description  one or two sentences of plain English. This is the line
                  people see before they expand the card, and it is searched,
                  so write it the way a beginner would describe the problem.
     syntax       the general shape of the command, with the parts you fill
                  in written in CAPITALS.
     example      a worked example that runs on Stata's built-in auto
                  dataset. Always start it with "sysuse auto, clear" so it
                  can be copied and pasted as-is.
     options      a list of { option, note } pairs. Use [] for none.
     mistakes     the thing beginners get wrong with this command.
     keywords     extra words that should find this card, separated by
                  spaces. Words already in the name or description do not
                  need repeating here.

   Everything is plain text; the page escapes it, so < and > are safe to use.
   ========================================================================== */

var STATA_COMMANDS = [

  /* ====================================================== Getting started == */
  {
    name: "help",
    category: "Getting started",
    abbrev: "",
    description: "Opens Stata's own documentation for a command. The definitive answer for the exact version of Stata you are sitting in front of.",
    syntax: "help COMMANDNAME",
    example: "help summarize",
    options: [],
    mistakes: "Scrolling past the syntax diagram at the top, which is the part that answers most questions. Square brackets in it mean optional; a comma separates the options.",
    keywords: "documentation manual stuck reference official syntax diagram"
  },
  {
    name: "sysuse",
    category: "Getting started",
    abbrev: "",
    description: "Loads one of the practice datasets that came with Stata. The quickest way to try something without having data of your own.",
    syntax: "sysuse DATASETNAME, clear",
    example: "sysuse auto, clear\ndescribe",
    options: [
      { option: "clear", note: "Throws away whatever was in memory first. Without it Stata refuses if you have unsaved changes." }
    ],
    mistakes: "Confusing sysuse with use. sysuse only opens Stata's own example datasets; your coursework files need use.",
    keywords: "example practice built-in sample dataset auto load open"
  },
  {
    name: "use",
    category: "Getting started",
    abbrev: "",
    description: "Opens a Stata data file (one ending in .dta) that is already saved on your computer.",
    syntax: "use \"FILENAME.dta\", clear",
    example: "sysuse auto, clear\nsave \"auto_copy.dta\", replace\nuse \"auto_copy.dta\", clear",
    options: [
      { option: "clear", note: "Replaces the data currently in memory." },
      { option: "VARLIST", note: "use make price using \"auto_copy.dta\" loads only the variables you name." }
    ],
    mistakes: "\"file not found\" almost always means you are in the wrong folder rather than that the file is missing. Run pwd to check, then cd to the right place.",
    keywords: "open load dta file read data working directory"
  },
  {
    name: "save",
    category: "Getting started",
    abbrev: "",
    description: "Saves whatever is in memory as a Stata .dta file, so your cleaned-up data survives closing Stata.",
    syntax: "save \"FILENAME.dta\", replace",
    example: "sysuse auto, clear\ngenerate price_k = price / 1000\nsave \"auto_clean.dta\", replace",
    options: [
      { option: "replace", note: "Allows Stata to overwrite a file of the same name. Without it you get an error rather than a silent overwrite." }
    ],
    mistakes: "Saving over your raw data. Keep the original file untouched and save your cleaned version under a new name.",
    keywords: "write store dta export keep output"
  },
  {
    name: "clear",
    category: "Getting started",
    abbrev: "",
    description: "Empties the data out of memory. clear all goes further and also drops stored results, saved estimates and settings.",
    syntax: "clear\nclear all",
    example: "sysuse auto, clear\nclear all\ndescribe",
    options: [
      { option: "all", note: "The thorough version. Worth putting at the top of every do-file." }
    ],
    mistakes: "Expecting it to undo something. clear discards your data; it does not restore a previous state. Reload the file instead.",
    keywords: "empty reset wipe memory start fresh drop"
  },
  {
    name: "log using",
    category: "Getting started",
    abbrev: "",
    description: "Starts recording everything in the Results window to a file, so you have a transcript to hand in or look back on. Always close it at the end.",
    syntax: "log using \"FILENAME.log\", replace\n...\nlog close",
    example: "sysuse auto, clear\nlog using \"auto_session.log\", replace\nsummarize price mpg\nlog close",
    options: [
      { option: "replace", note: "Overwrites a previous log of the same name." },
      { option: "text", note: "Writes plain text rather than Stata's own .smcl format, which is easier to open elsewhere." },
      { option: "append", note: "Adds to the end of an existing log instead of replacing it." }
    ],
    mistakes: "Forgetting log close, which leaves the file locked and incomplete. Start do-files with capture log close so a previous crash cannot block you.",
    keywords: "transcript record output session smcl submit evidence"
  },
  {
    name: "doedit",
    category: "Getting started",
    abbrev: "",
    description: "Opens the Do-file Editor. A do-file is a plain text file of commands you can rerun in one click, which is how you make your work reproducible.",
    syntax: "doedit\ndoedit FILENAME.do",
    example: "sysuse auto, clear\ndoedit auto_analysis.do",
    options: [],
    mistakes: "Working only in the Command window. Everything you type there is lost when Stata closes; a do-file is the thing you actually hand in and rerun.",
    keywords: "do-file editor script write run reproducible batch"
  },
  {
    name: "cd",
    category: "Getting started",
    abbrev: "",
    description: "Changes Stata's working folder: the one place it looks for your data and saves your graphs unless you give a full path. The cure for most \"file not found\" errors.",
    syntax: "cd \"FOLDER PATH\"",
    example: "cd \"C:/Users/you/Documents/stata19\"\npwd\nsysuse auto, clear",
    options: [],
    mistakes: "Leaving the quotation marks off a path that contains spaces, and using backslashes on Windows. Forward slashes work on every platform, so prefer them.",
    keywords: "working directory folder path change location file not found"
  },
  {
    name: "pwd",
    category: "Getting started",
    abbrev: "",
    description: "Prints the folder Stata is currently working in. Run it whenever a file will not load or you cannot find a graph you just exported.",
    syntax: "pwd",
    example: "pwd\nsysuse auto, clear\ngraph export \"test.png\", replace\npwd",
    options: [],
    mistakes: "Assuming Stata looks in the folder your do-file is saved in. It does not; it uses the working folder, which pwd shows and cd changes.",
    keywords: "working directory where am i folder path location print"
  },
  {
    name: "display",
    category: "Getting started",
    abbrev: "di",
    description: "Prints a number or a piece of text. Doubles as Stata's calculator and as a way of leaving signposts in a long do-file.",
    syntax: "display EXPRESSION\ndisplay \"SOME TEXT\"",
    example: "sysuse auto, clear\nsummarize price\ndisplay r(mean) / 1000\ndisplay \"Section 1 finished\"",
    options: [],
    mistakes: "Forgetting the quotation marks around text. Without them Stata tries to read your words as variable names and complains.",
    keywords: "print calculator echo message arithmetic text di results"
  },

  /* ======================================================= Exploring data == */
  {
    name: "describe",
    category: "Exploring data",
    abbrev: "d",
    description: "Lists every variable with its storage type, display format and label. The first command to run on any dataset you have not seen before.",
    syntax: "describe [VARLIST]",
    example: "sysuse auto, clear\ndescribe\ndescribe price foreign",
    options: [
      { option: "short", note: "Just the summary line: how many observations and variables." }
    ],
    mistakes: "Skipping it. The storage type column is what tells you a variable is text (str) when you thought it was a number.",
    keywords: "structure variables types overview metadata first look str"
  },
  {
    name: "browse",
    category: "Exploring data",
    abbrev: "br",
    description: "Opens the data in a read-only spreadsheet view. The friendliest way to actually see what you are working with.",
    syntax: "browse [VARLIST] [if CONDITION]",
    example: "sysuse auto, clear\nbrowse make price mpg\nbrowse if foreign == 1",
    options: [],
    mistakes: "Leaving the window open. While the Data Editor has your data, Stata can refuse to run anything else, which looks like Stata has frozen.",
    keywords: "view spreadsheet editor window look see excel data"
  },
  {
    name: "codebook",
    category: "Exploring data",
    abbrev: "",
    description: "A full report on each variable: its range, how many values are missing, how many distinct values it takes, and its value labels.",
    syntax: "codebook [VARLIST]",
    example: "sysuse auto, clear\ncodebook mpg rep78",
    options: [
      { option: "compact", note: "One line per variable instead of a block, which is far easier to scan." },
      { option: "missing", note: "Reports only the variables that have missing values." }
    ],
    mistakes: "Running it on the whole dataset and drowning. Name the handful of variables you care about, or add compact.",
    keywords: "detail missing range unique distinct report check quality"
  },
  {
    name: "list",
    category: "Exploring data",
    abbrev: "l",
    description: "Prints the actual rows of data into the Results window.",
    syntax: "list [VARLIST] [if CONDITION] [in RANGE]",
    example: "sysuse auto, clear\nlist make price mpg in 1/10\nlist make price if price > 12000",
    options: [
      { option: "in 1/10", note: "Restricts to the first ten rows. Not an option exactly, but the part beginners most often leave off." },
      { option: "clean", note: "Drops the dividing lines, giving tidier output to paste elsewhere." }
    ],
    mistakes: "Running bare list on a big dataset and printing thousands of lines. Always restrict with in or if.",
    keywords: "print rows show head first observations view"
  },
  {
    name: "count",
    category: "Exploring data",
    abbrev: "",
    description: "Counts observations, optionally only those meeting a condition. The fastest way to sanity-check a filter before you rely on it.",
    syntax: "count [if CONDITION]",
    example: "sysuse auto, clear\ncount\ncount if foreign == 1\ncount if missing(rep78)",
    options: [],
    mistakes: "Using one equals sign. count if foreign = 1 is an error; comparison needs ==.",
    keywords: "how many rows observations total check condition filter"
  },
  {
    name: "misstable summarize",
    category: "Exploring data",
    abbrev: "",
    description: "Reports which variables have missing values and how many, so you know what you are dealing with before you analyse anything.",
    syntax: "misstable summarize [VARLIST]",
    example: "sysuse auto, clear\nmisstable summarize",
    options: [
      { option: "all", note: "Lists every variable, including the complete ones." }
    ],
    mistakes: "Assuming a variable is complete because summarize gave you a number. Compare the Obs column against your total row count.",
    keywords: "missing na blanks dots incomplete gaps rep78 quality"
  },

  /* ================================================== Cleaning and managing == */
  {
    name: "generate",
    category: "Cleaning and managing",
    abbrev: "gen",
    description: "Creates a brand-new variable from a calculation.",
    syntax: "generate NEWVAR = EXPRESSION [if CONDITION]",
    example: "sysuse auto, clear\ngenerate price_k = price / 1000\ngenerate heavy = weight > 3000\nlist make price_k heavy in 1/5",
    options: [
      { option: "byte / int / str20", note: "generate byte heavy = ... sets the storage type explicitly to save space." }
    ],
    mistakes: "Two things. generate refuses to overwrite an existing variable, so use replace for that. And a condition like weight > 3000 counts missing values as true, because Stata treats missing as larger than any number.",
    keywords: "gen new variable create calculate compute column derive"
  },
  {
    name: "replace",
    category: "Cleaning and managing",
    abbrev: "none (deliberately)",
    description: "Changes the values of a variable that already exists. Stata will not let generate do this, so overwriting data is always a conscious choice.",
    syntax: "replace VARNAME = EXPRESSION [if CONDITION]",
    example: "sysuse auto, clear\ngenerate price_k = price / 1000\nreplace price_k = round(price_k, 0.1)\nreplace price_k = . if price_k > 15",
    options: [],
    mistakes: "Replacing without an if condition and changing the whole column by accident. Stata reports how many values changed; read that number and check it is what you expected.",
    keywords: "change overwrite edit update fix values recode missing"
  },
  {
    name: "egen",
    category: "Cleaning and managing",
    abbrev: "",
    description: "An extended generate, for the things generate cannot do on its own: group means, ranks, row totals and counts.",
    syntax: "egen NEWVAR = FUNCTION(ARGUMENTS) [, by(GROUPVAR)]",
    example: "sysuse auto, clear\negen mean_price = mean(price)\negen group_mean = mean(price), by(foreign)\negen price_rank = rank(price)\nlist make price group_mean in 1/5",
    options: [
      { option: "by(VARLIST)", note: "Calculates the statistic separately within each group and repeats it down every row of that group." }
    ],
    mistakes: "Expecting egen mean(price) to give you one row. It fills the same value down the whole column; that is the point, because you then compare each row against it.",
    keywords: "extended mean rank rowtotal group aggregate summary by"
  },
  {
    name: "rename",
    category: "Cleaning and managing",
    abbrev: "ren",
    description: "Changes a variable's name. The first thing you do after importing data with unhelpful column headings.",
    syntax: "rename OLDNAME NEWNAME",
    example: "sysuse auto, clear\nrename mpg miles_per_gallon\ndescribe miles_per_gallon\nrename miles_per_gallon mpg",
    options: [
      { option: "rename (A B) (C D)", note: "Renames several at once, in pairs." }
    ],
    mistakes: "Confusing it with label variable. rename changes the name you type; label variable changes the description shown in output.",
    keywords: "name change column heading tidy clean rename variables"
  },
  {
    name: "drop",
    category: "Cleaning and managing",
    abbrev: "",
    description: "Throws away variables or rows. With a variable list it removes columns; with an if condition it removes rows.",
    syntax: "drop VARLIST\ndrop if CONDITION",
    example: "sysuse auto, clear\ndrop headroom trunk\ndrop if missing(rep78)\ncount",
    options: [],
    mistakes: "Forgetting there is no undo. It only changes memory, so your saved file is safe, but you will have to reload to get those rows back.",
    keywords: "delete remove rows variables columns missing filter subset"
  },
  {
    name: "keep",
    category: "Cleaning and managing",
    abbrev: "",
    description: "The mirror image of drop: keeps only what you name and discards the rest.",
    syntax: "keep VARLIST\nkeep if CONDITION",
    example: "sysuse auto, clear\nkeep make price mpg foreign\nkeep if price < 10000\ncount",
    options: [],
    mistakes: "Running keep and drop in the wrong order and losing a variable you still needed for a filter. Filter the rows first, then narrow the columns.",
    keywords: "subset select variables columns rows filter reduce"
  },
  {
    name: "sort",
    category: "Cleaning and managing",
    abbrev: "",
    description: "Puts the rows in ascending order of the variables you name. Some commands need the data sorted, and the by: prefix always does.",
    syntax: "sort VARLIST",
    example: "sysuse auto, clear\nsort price\nlist make price in 1/5\ngsort -price\nlist make price in 1/5",
    options: [
      { option: "gsort -VAR", note: "A separate command that sorts descending when you put a minus sign in front of the variable." }
    ],
    mistakes: "Expecting sort to handle descending order. It cannot; that is what gsort with a minus sign is for.",
    keywords: "order arrange ascending descending gsort sequence rank"
  },
  {
    name: "bysort",
    category: "Cleaning and managing",
    abbrev: "bys",
    description: "Not a command but a prefix: runs the command that follows separately for each group. bysort sorts the data first, so you do not have to.",
    syntax: "bysort GROUPVAR: COMMAND",
    example: "sysuse auto, clear\nbysort foreign: summarize price\nbysort rep78: count",
    options: [
      { option: "by GROUPVAR:", note: "The same thing, but it errors unless the data is already sorted. bysort is the safer habit." }
    ],
    mistakes: "Using by: on unsorted data and getting \"not sorted\". Type bysort instead and the problem disappears.",
    keywords: "by group split prefix separately subgroup each category"
  },
  {
    name: "recode",
    category: "Cleaning and managing",
    abbrev: "",
    description: "Collapses a numeric variable into bands or categories in one line, instead of writing several generate and replace commands.",
    syntax: "recode VARNAME (RANGE = NEWVALUE) ..., generate(NEWVAR)",
    example: "sysuse auto, clear\nrecode mpg (0/18 = 1) (19/24 = 2) (25/max = 3), generate(mpg_group)\ntabulate mpg_group",
    options: [
      { option: "generate(NEWVAR)", note: "Writes the result to a new variable and leaves the original alone. Always use this." },
      { option: "(else = .)", note: "Catches anything your ranges missed and makes it missing rather than leaving it as-is." }
    ],
    mistakes: "Leaving off generate(), which silently overwrites your original variable. Also watch for gaps between bands: 0/18 and 19/24 is fine for whole numbers, but 18.5 would fall through.",
    keywords: "bands categories groups bin collapse convert categorise brackets"
  },
  {
    name: "label variable",
    category: "Cleaning and managing",
    abbrev: "lab var",
    description: "Attaches a readable description to a variable, which then appears in your tables and graphs instead of a cryptic name.",
    syntax: "label variable VARNAME \"DESCRIPTION\"",
    example: "sysuse auto, clear\nrecode mpg (0/18 = 1) (19/24 = 2) (25/max = 3), generate(mpg_group)\nlabel variable mpg_group \"Fuel economy band\"\ndescribe mpg_group",
    options: [],
    mistakes: "Expecting it to change the variable's name. It only changes the description; the name you type in commands stays the same.",
    keywords: "label description title readable output tables tidy"
  },
  {
    name: "label define",
    category: "Cleaning and managing",
    abbrev: "lab def",
    description: "Creates a named set of labels for the numbers in a categorical variable. Step one of two: this builds the label set, label values attaches it.",
    syntax: "label define LABELNAME 1 \"First\" 2 \"Second\" ...",
    example: "sysuse auto, clear\nrecode mpg (0/18 = 1) (19/24 = 2) (25/max = 3), generate(mpg_group)\nlabel define mpggrp 1 \"Low\" 2 \"Mid\" 3 \"High\"\nlabel values mpg_group mpggrp\ntabulate mpg_group",
    options: [
      { option: "modify", note: "Adds to or changes a label set that already exists, instead of erroring." },
      { option: "replace", note: "Replaces the whole label set." }
    ],
    mistakes: "Stopping after this step and wondering why nothing changed. Defining a label set does nothing until label values attaches it to a variable.",
    keywords: "value labels categorical define words numbers coding"
  },
  {
    name: "label values",
    category: "Cleaning and managing",
    abbrev: "lab val",
    description: "Attaches a label set created by label define to a variable, so 1 displays as Low rather than 1.",
    syntax: "label values VARNAME LABELNAME",
    example: "sysuse auto, clear\nlabel list origin\ntabulate foreign\nlabel values foreign\ntabulate foreign",
    options: [
      { option: "label values VARNAME", note: "With no label name, it removes the labels and shows the raw numbers again, as in the example above." }
    ],
    mistakes: "Filtering on the label instead of the number. foreign displays as \"Foreign\" but is stored as 1, so write if foreign == 1, not if foreign == \"Foreign\".",
    keywords: "value labels attach categorical numbers words display"
  },
  {
    name: "destring",
    category: "Cleaning and managing",
    abbrev: "",
    description: "Turns a variable Stata read in as text into a proper number. Very common after importing a spreadsheet with currency symbols or commas in it.",
    syntax: "destring VARNAME, replace [ignore(\"CHARACTERS\")]",
    example: "sysuse auto, clear\ntostring price, generate(price_text)\ndestring price_text, generate(price_number)\ndescribe price_text price_number",
    options: [
      { option: "replace", note: "Converts the variable in place rather than making a new one." },
      { option: "generate(NEWVAR)", note: "Keeps the original and writes the numeric version to a new variable." },
      { option: "ignore(\"$,\")", note: "Strips the listed characters before converting." },
      { option: "force", note: "Converts anyway and makes the awkward values missing. Look at what you are losing first." }
    ],
    mistakes: "Reaching for force immediately. If destring refuses, something in the column is not a number, and that is worth knowing before you discard it.",
    keywords: "string text number convert numeric red type ignore tostring"
  },
  {
    name: "encode",
    category: "Cleaning and managing",
    abbrev: "",
    description: "Converts a text variable such as a region or category name into a numbered variable with value labels, which is what statistical commands need.",
    syntax: "encode VARNAME, generate(NEWVAR)",
    example: "sysuse auto, clear\nencode make, generate(make_id)\ndescribe make make_id\nlist make make_id in 1/5",
    options: [
      { option: "label(LABELNAME)", note: "Uses a label set you have already defined, so coding stays consistent across files." }
    ],
    mistakes: "Using encode on numbers stored as text. That is destring's job. encode is for genuine categories, and it numbers them alphabetically, which is rarely a meaningful order.",
    keywords: "string categorical convert numeric labels factor text group"
  },

  /* ================================================ Descriptive statistics == */
  {
    name: "summarize",
    category: "Descriptive statistics",
    abbrev: "sum, su",
    description: "The workhorse. Gives you the number of observations, the mean or average, the standard deviation, the minimum and the maximum.",
    syntax: "summarize [VARLIST] [if CONDITION] [, detail]",
    example: "sysuse auto, clear\nsummarize price mpg\nsummarize price, detail\nsummarize price if foreign == 1",
    options: [
      { option: "detail", note: "Adds percentiles, the median, skewness and kurtosis. This is where you find the median, which plain summarize does not show." },
      { option: "separator(0)", note: "Removes the dividing lines when you summarize many variables at once." }
    ],
    mistakes: "Reading the Obs column as your sample size when it is lower than your row count, which means that variable has missing values.",
    keywords: "average mean sd standard deviation min max median descriptive spread"
  },
  {
    name: "tabulate",
    category: "Descriptive statistics",
    abbrev: "tab",
    description: "A frequency table: how many observations fall into each category. Give it two variables and it cross-tabulates them into a grid.",
    syntax: "tabulate VARNAME\ntabulate ROWVAR COLVAR [, row col]",
    example: "sysuse auto, clear\ntabulate foreign\ntabulate foreign rep78\ntabulate foreign rep78, row",
    options: [
      { option: "row / col", note: "Adds percentages across rows or down columns. Pick the one that matches the comparison you are making." },
      { option: "missing", note: "Includes missing values as a category instead of silently dropping them." },
      { option: "nofreq", note: "Shows only the percentages, not the counts." }
    ],
    mistakes: "Running it on a continuous variable such as price and getting 74 rows of output, one per value. Band it with recode first.",
    keywords: "frequency table counts percent categorical crosstab contingency"
  },
  {
    name: "tabstat",
    category: "Descriptive statistics",
    abbrev: "",
    description: "A tidier, more flexible summarize: you choose exactly which statistics appear, and by() splits them into groups.",
    syntax: "tabstat VARLIST, statistics(LIST) [by(GROUPVAR)]",
    example: "sysuse auto, clear\ntabstat price mpg, statistics(mean sd min max)\ntabstat price, statistics(mean median n) by(foreign)",
    options: [
      { option: "statistics(...)", note: "Choose from mean, median, sd, min, max, n, p25, p75 and more." },
      { option: "by(GROUPVAR)", note: "One block of results per group." },
      { option: "columns(statistics)", note: "Flips the table so statistics run across the top, which usually reads better." }
    ],
    mistakes: "Writing stat() or stats() in full-on guesswork. The option is statistics(), though stat() is accepted as the abbreviation.",
    keywords: "table statistics mean sd custom by group compact summary median"
  },
  {
    name: "tab1",
    category: "Descriptive statistics",
    abbrev: "",
    description: "Runs a one-way frequency table for each variable you name, one after another, instead of you typing tabulate several times.",
    syntax: "tab1 VARLIST",
    example: "sysuse auto, clear\ntab1 foreign rep78",
    options: [
      { option: "missing", note: "Counts missing values as their own category in every table." }
    ],
    mistakes: "Using tab1 when you wanted a cross-tabulation. tab1 gives separate tables; plain tabulate with two variables gives the grid.",
    keywords: "frequency multiple tables one-way several variables batch"
  },

  /* ================================================================ Graphs == */
  {
    name: "histogram",
    category: "Graphs",
    abbrev: "hist",
    description: "Draws the distribution of one continuous variable as bars, so you can see whether it is symmetric, skewed or has odd values at one end.",
    syntax: "histogram VARNAME [, frequency normal bin(N)]",
    example: "sysuse auto, clear\nhistogram mpg, frequency normal title(\"Distribution of mileage\")",
    options: [
      { option: "frequency", note: "Makes the vertical axis a count rather than a density, which is easier to explain." },
      { option: "normal", note: "Overlays a normal curve for comparison." },
      { option: "bin(N) / width(N)", note: "Controls how many bars there are. Worth trying a couple of values." },
      { option: "by(GROUPVAR)", note: "One small histogram per group, side by side." }
    ],
    mistakes: "Giving it two variables. histogram takes exactly one; plot them one at a time.",
    keywords: "distribution bars bins shape skew normal chart plot graph"
  },
  {
    name: "graph box",
    category: "Graphs",
    abbrev: "",
    description: "A box plot showing the median, the quartiles and the outliers. The quickest way to compare a distribution across groups.",
    syntax: "graph box VARLIST [, over(GROUPVAR)]",
    example: "sysuse auto, clear\ngraph box price\ngraph box price, over(foreign)",
    options: [
      { option: "over(GROUPVAR)", note: "One box per group, side by side." },
      { option: "nooutsides", note: "Hides the outlier dots." },
      { option: "horizontal", note: "Turns the boxes on their side, which helps when group names are long." }
    ],
    mistakes: "Using by() when you meant over(). For graph box, over() puts groups side by side on one chart; by() makes separate little charts.",
    keywords: "boxplot median quartile outlier whisker spread compare groups"
  },
  {
    name: "graph bar",
    category: "Graphs",
    abbrev: "",
    description: "A bar chart of a summary statistic, not of raw values. The statistic in brackets is what the height of each bar means.",
    syntax: "graph bar (STATISTIC) VARLIST, over(GROUPVAR)",
    example: "sysuse auto, clear\ngraph bar (mean) price, over(foreign)\ngraph bar (mean) price mpg, over(rep78)",
    options: [
      { option: "(mean) / (median) / (count)", note: "Which statistic the bars show. Leave it out and you get the mean." },
      { option: "over(GROUPVAR)", note: "What the bars are split by." },
      { option: "blabel(bar)", note: "Prints the value on top of each bar." },
      { option: "asyvars", note: "Colours the bars by variable and adds a legend." }
    ],
    mistakes: "Expecting it to count rows like a frequency chart. Bars show a statistic of a variable; for counts of a category, use (count) or graph a tabulate instead.",
    keywords: "bar chart column mean average categories compare blabel"
  },
  {
    name: "scatter",
    category: "Graphs",
    abbrev: "sc",
    description: "A scatterplot of two continuous variables, one dot per observation. The y variable always comes first.",
    syntax: "scatter YVAR XVAR [if CONDITION]",
    example: "sysuse auto, clear\nscatter price mpg\nscatter price mpg, mlabel(make)",
    options: [
      { option: "mlabel(VARNAME)", note: "Labels each point, which makes outliers identifiable." },
      { option: "by(GROUPVAR)", note: "A separate panel per group." },
      { option: "jitter(N)", note: "Nudges overlapping points apart so you can see how many there are." }
    ],
    mistakes: "Getting the order backwards. scatter price mpg puts price on the vertical axis; the outcome goes first, which is the opposite of how most people say it out loud.",
    keywords: "plot points xy relationship twoway chart graph correlation"
  },
  {
    name: "twoway lfit",
    category: "Graphs",
    abbrev: "",
    description: "Layers plots on one set of axes. The classic beginner use is a scatterplot with a straight line of best fit drawn through it.",
    syntax: "twoway (scatter YVAR XVAR) (lfit YVAR XVAR)",
    example: "sysuse auto, clear\ntwoway (scatter price mpg) (lfit price mpg), ///\n       title(\"Price against mileage\") legend(off)",
    options: [
      { option: "lfitci", note: "Use in place of lfit to shade a confidence interval around the line." },
      { option: "legend(off)", note: "Hides the legend, which is usually noise on a two-layer plot." },
      { option: "///", note: "Three slashes let a long graph command continue on the next line." }
    ],
    mistakes: "Forgetting the brackets around each layer, or naming the variables in a different order in the two layers. Both produce confusing errors.",
    keywords: "overlay combine line of best fit regression layers fitted plot"
  },
  {
    name: "graph export",
    category: "Graphs",
    abbrev: "",
    description: "Saves the graph currently on screen as an image file you can put in a report.",
    syntax: "graph export \"FILENAME.png\", [width(N)] replace",
    example: "sysuse auto, clear\nhistogram mpg, frequency normal\ngraph export \"auto_mileage.png\", width(1200) replace",
    options: [
      { option: "width(N)", note: "Pixel width. Without it the image is small and looks blurry in Word." },
      { option: "replace", note: "Overwrites an existing file of the same name." },
      { option: "as(pdf)", note: "Writes a PDF instead, which stays sharp at any size." }
    ],
    mistakes: "Drawing a second graph before exporting the first. Each new graph command replaces what is in the Graph window, so export as you go.",
    keywords: "save image png pdf report word figure picture write screenshot"
  },

  /* ====================================================== Hypothesis tests == */
  {
    name: "ttest",
    category: "Hypothesis tests",
    abbrev: "",
    description: "A t-test, in three forms: one sample against a fixed number, two independent groups, or two paired measurements of the same thing.",
    syntax: "ttest VARNAME == VALUE\nttest VARNAME, by(GROUPVAR)\nttest VAR1 == VAR2",
    example: "sysuse auto, clear\nttest price == 6000\nttest price, by(foreign)\nttest headroom == trunk",
    options: [
      { option: "by(GROUPVAR)", note: "The two-sample form. The grouping variable must have exactly two values." },
      { option: "unequal", note: "Does not assume the two groups have the same variance. Often the safer choice." },
      { option: "level(99)", note: "Changes the confidence level from the default 95." }
    ],
    mistakes: "Mixing up the two-variable form with the two-sample form. ttest a == b is paired and assumes the two columns are measurements of the same units. The third line of the example shows the syntax, but headroom and trunk are not a genuine before-and-after pair, so do not read anything into the result.",
    keywords: "t-test one sample two sample paired compare means difference p-value significance"
  },
  {
    name: "prtest",
    category: "Hypothesis tests",
    abbrev: "",
    description: "The equivalent of a t-test for proportions, used when your outcome is a yes or no variable coded 0 and 1.",
    syntax: "prtest VARNAME == VALUE\nprtest VARNAME, by(GROUPVAR)",
    example: "sysuse auto, clear\nprtest foreign == 0.5",
    options: [
      { option: "by(GROUPVAR)", note: "Compares the proportion between two groups." },
      { option: "level(99)", note: "Changes the confidence level." }
    ],
    mistakes: "Running it on a variable that is not coded 0 and 1. Recode first, and remember you are testing a proportion, so the value you compare against is between 0 and 1.",
    keywords: "proportion test binary z-test percentage yes no compare"
  },
  {
    name: "tabulate ..., chi2",
    category: "Hypothesis tests",
    abbrev: "tab",
    description: "Adds a chi-squared test of independence to a cross-tabulation: is there an association between these two categorical variables?",
    syntax: "tabulate ROWVAR COLVAR, chi2 [expected]",
    example: "sysuse auto, clear\ntabulate foreign rep78, chi2\ntabulate foreign rep78, chi2 expected row",
    options: [
      { option: "chi2", note: "Adds the Pearson chi-squared statistic and its p-value under the table." },
      { option: "expected", note: "Shows the counts you would expect if there were no association, which is what the test compares against." },
      { option: "exact", note: "Fisher's exact test, for when the expected counts are small." }
    ],
    mistakes: "Trusting the result when cells are nearly empty. The usual rule of thumb wants most expected counts above 5; add expected to check, and use exact if they are small.",
    keywords: "chi-squared association independence categorical crosstab contingency fisher"
  },
  {
    name: "ranksum",
    category: "Hypothesis tests",
    abbrev: "",
    description: "The Wilcoxon rank-sum, also called the Mann-Whitney U test: compares two groups without assuming the data is normally distributed.",
    syntax: "ranksum VARNAME, by(GROUPVAR)",
    example: "sysuse auto, clear\nranksum price, by(foreign)",
    options: [
      { option: "by(GROUPVAR)", note: "Required. The grouping variable must have exactly two values." },
      { option: "porder", note: "Reports the probability that a value from one group exceeds one from the other." }
    ],
    mistakes: "Describing it as comparing medians. Strictly it compares the whole distributions, and it only becomes a statement about medians under extra assumptions.",
    keywords: "wilcoxon mann-whitney nonparametric rank two groups distribution skewed"
  },
  {
    name: "oneway",
    category: "Hypothesis tests",
    abbrev: "",
    description: "One-way analysis of variance: compares the means of three or more groups in a single test.",
    syntax: "oneway OUTCOMEVAR GROUPVAR [, tabulate]",
    example: "sysuse auto, clear\noneway price rep78, tabulate",
    options: [
      { option: "tabulate", note: "Prints the mean and standard deviation of each group above the test, which is what you actually interpret." },
      { option: "bonferroni / scheffe", note: "Adds pairwise comparisons between groups, adjusted for multiple testing." }
    ],
    mistakes: "Stopping at a significant F statistic. It tells you the groups are not all the same; it does not tell you which pair differs. Add bonferroni or scheffe for that.",
    keywords: "anova f-test three groups variance compare means bartlett"
  },
  {
    name: "anova",
    category: "Hypothesis tests",
    abbrev: "",
    description: "Analysis of variance with one or more factors, including the interactions between them. The more general version of oneway.",
    syntax: "anova OUTCOMEVAR FACTOR1 [FACTOR2] [FACTOR1#FACTOR2]",
    example: "sysuse auto, clear\nanova price foreign\nanova price foreign rep78\nanova price foreign##rep78",
    options: [
      { option: "A##B", note: "Fits both main effects and their interaction. A#B on its own is the interaction only." },
      { option: "c.VARNAME", note: "Marks a variable as continuous rather than categorical." }
    ],
    mistakes: "Feeding it a continuous predictor without warning. anova treats every variable as categorical unless you prefix it with c., so a continuous one silently becomes dozens of groups.",
    keywords: "variance factorial f-test interaction model groups two-way"
  },

  /* ========================================== Relationships and regression == */
  {
    name: "correlate",
    category: "Relationships and regression",
    abbrev: "corr",
    description: "A correlation matrix for the variables you list, showing how strongly each pair moves together on a scale from -1 to 1.",
    syntax: "correlate VARLIST [if CONDITION]",
    example: "sysuse auto, clear\ncorrelate price mpg weight\ncorrelate price mpg weight if foreign == 1",
    options: [
      { option: "covariance", note: "Reports covariances instead of correlations." },
      { option: "means", note: "Adds the mean, standard deviation, minimum and maximum of each variable." }
    ],
    mistakes: "Not noticing that it uses only the rows where every listed variable is present. Add one variable with many missing values and your sample quietly shrinks for all of them. pwcorr avoids this.",
    keywords: "correlation matrix pearson relationship association r strength"
  },
  {
    name: "pwcorr",
    category: "Relationships and regression",
    abbrev: "",
    description: "Pairwise correlations, which use every row available for each pair rather than dropping any row with a gap anywhere.",
    syntax: "pwcorr VARLIST [, sig star(LEVEL) obs]",
    example: "sysuse auto, clear\npwcorr price mpg weight rep78, sig star(0.05)\npwcorr price mpg rep78, obs",
    options: [
      { option: "sig", note: "Prints the p-value underneath each correlation." },
      { option: "star(0.05)", note: "Puts a star on the correlations significant at that level." },
      { option: "obs", note: "Shows how many observations each pair actually used, which is the point of using pwcorr." }
    ],
    mistakes: "Reporting pairwise correlations without saying so. Each coefficient can rest on a different sample size, so include obs when you present them.",
    keywords: "correlation pairwise significance p-value stars missing sig"
  },
  {
    name: "regress",
    category: "Relationships and regression",
    abbrev: "reg",
    description: "Ordinary least squares regression. The first variable is the outcome you are explaining; everything after it is a predictor.",
    syntax: "regress OUTCOMEVAR PREDICTORS [if CONDITION]",
    example: "sysuse auto, clear\nregress price mpg\nregress price mpg weight\nregress price mpg weight i.rep78",
    options: [
      { option: "i.VARNAME", note: "Treats a categorical predictor properly, creating the dummy variables for you and leaving one category out as the baseline." },
      { option: "robust", note: "Standard errors that do not assume constant variance." },
      { option: "beta", note: "Adds standardised coefficients." },
      { option: "noconstant", note: "Forces the line through the origin. Rarely what you want." }
    ],
    mistakes: "Putting a categorical variable in without i., so Stata treats codes like 1 to 5 as a quantity and assumes the step from 1 to 2 means the same as 4 to 5.",
    keywords: "ols linear model coefficients r-squared predictors fit estimate dummy"
  },
  {
    name: "predict",
    category: "Relationships and regression",
    abbrev: "",
    description: "Run straight after a model, it saves that model's predictions or residuals as a new variable you can then plot or inspect.",
    syntax: "predict NEWVAR [, residuals]",
    example: "sysuse auto, clear\nregress price mpg weight\npredict price_hat\npredict price_resid, residuals\nscatter price_resid price_hat, yline(0)",
    options: [
      { option: "residuals", note: "Saves the residuals instead of the fitted values." },
      { option: "stdp", note: "The standard error of the prediction." },
      { option: "pr", note: "After logit, gives predicted probabilities rather than log-odds." }
    ],
    mistakes: "Running another model in between. predict always refers to the most recent estimation command, so fit, predict, then move on.",
    keywords: "fitted values residuals yhat prediction diagnostics postestimation after"
  },
  {
    name: "logit",
    category: "Relationships and regression",
    abbrev: "",
    description: "Logistic regression, for when the outcome is a yes or no variable rather than a number.",
    syntax: "logit OUTCOMEVAR PREDICTORS",
    example: "sysuse auto, clear\nlogit foreign mpg weight\nlogit foreign mpg weight, or\nmargins, dydx(*)",
    options: [
      { option: "or", note: "Reports odds ratios instead of log-odds coefficients, which are far easier to describe." },
      { option: "margins, dydx(*)", note: "A separate command to run afterwards; gives average marginal effects, which read like percentage point changes." }
    ],
    mistakes: "Interpreting the raw coefficients as if they came from regress. They are log-odds, not units of the outcome. Add or, or follow with margins.",
    keywords: "logistic binary odds ratio probability margins classification model"
  }
];

/* The order the filter buttons and the grouped view appear in. A category
   used above but missing from this list still works; it is just added at
   the end. */
var STATA_CATEGORIES = [
  "Getting started",
  "Exploring data",
  "Cleaning and managing",
  "Descriptive statistics",
  "Graphs",
  "Hypothesis tests",
  "Relationships and regression"
];
