/* ============================================================
   SNL ORACLE — pure data and scoring logic.

   Everything here is free of React and of the DOM so it can be
   imported by the UI (src/App.jsx) and by the scoring simulator
   (audit/sim.js) alike. No behavior differs from when this lived
   inside App.jsx; it was moved, not rewritten.
   ============================================================ */

export const FEEDBACK_URL = "https://tally.so/r/Gxqb6O";

export const STORY_WIDTH = 1080;
export const STORY_HEIGHT = 1920;

/* ============================================================
   CAST TENURE — [firstSeason, lastSeason] inclusive, or a list of
   those pairs for the handful of people who left and came back.
   Covers every credited cast & featured player from S1 (1975) to
   S51 (2025–26). Single-season featured players who were in the
   official credits are included. Always read this through
   seasonsFor(); never destructure an entry directly.
   ============================================================ */
export const CAST_TENURE = {
  "Fred Armisen": [28, 38],
  "Aristotle Athari": [47, 47],
  "Dan Aykroyd": [1, 4],
  "Peter Aykroyd": [5, 5],
  "Morwenna Banks": [20, 20],
  "Vanessa Bayer": [36, 42],
  "John Belushi": [1, 4],
  "Jim Belushi": [9, 10],
  "Beck Bennett": [39, 46],
  "Tommy Brennan": [51, 51],
  "Jim Breuer": [21, 23],
  "Paul Brittain": [36, 37],
  "A. Whitney Brown": [11, 16],
  "Aidy Bryant": [38, 47],
  "Beth Cahill": [17, 17],
  "Dana Carvey": [12, 18],
  "Chevy Chase": [1, 2],
  "Michael Che": [40, 51],
  "Ellen Cleghorne": [17, 20],
  "George Coe": [1, 1],
  "Billy Crystal": [10, 10],
  "Jeremy Culhane": [51, 51],
  "Jane Curtin": [1, 5],
  "Joan Cusack": [11, 11],
  "Pete Davidson": [40, 47],
  "Tom Davis": [5, 5],
  "Mikey Day": [42, 51],
  "Denny Dillon": [6, 6],
  "Andrew Dismukes": [46, 51],
  "Jim Downey": [5, 5],
  "Brian Doyle-Murray": [[5, 5], [7, 7]],
  "Rachel Dratch": [25, 31],
  "Robin Duke": [6, 9],
  "Nora Dunn": [11, 15],
  "Christine Ebersole": [7, 7],
  "Dean Edwards": [27, 28],
  "Abby Elliott": [34, 37],
  "Chris Elliott": [20, 20],
  "Siobhan Fallon": [17, 17],
  "Jimmy Fallon": [24, 29],
  "Chris Farley": [16, 20],
  "Will Ferrell": [21, 27],
  "Tina Fey": [26, 31],
  "Chloe Fineman": [45, 51],
  "Will Forte": [28, 35],
  "Al Franken": [[5, 5], [11, 11], [13, 20]],
  "Heidi Gardner": [43, 50],
  "Janeane Garofalo": [20, 20],
  "Ana Gasteyer": [22, 27],
  "Gilbert Gottfried": [6, 6],
  "Mary Gross": [7, 10],
  "Christopher Guest": [10, 10],
  "Bill Hader": [31, 38],
  "Brad Hall": [8, 9],
  "Rich Hall": [10, 10],
  "Anthony Michael Hall": [11, 11],
  "Darrell Hammond": [21, 34],
  "Phil Hartman": [12, 19],
  "Martin Herlihy": [47, 50],
  "Marcello Hernández": [48, 51],
  "John Higgins": [47, 50],
  "Lauren Holt": [46, 46],
  "Jan Hooks": [12, 16],
  "Yvonne Hudson": [6, 6],
  "Melanie Hutsell": [17, 19],
  "Victoria Jackson": [12, 17],
  "Punkie Johnson": [46, 49],
  "James Austin Johnson": [47, 51],
  "Leslie Jones": [40, 44],
  "Colin Jost": [39, 51],
  "Robert Downey Jr.": [11, 11],
  "Chris Kattan": [21, 28],
  "Tim Kazurinsky": [6, 9],
  "Molly Kearney": [48, 49],
  "Laura Kightlinger": [20, 20],
  "Taran Killam": [36, 41],
  "David Koechner": [21, 21],
  "Gary Kroeger": [8, 10],
  "Matthew Laurance": [6, 6],
  "Michael Longfellow": [48, 50],
  "Julia Louis-Dreyfus": [8, 10],
  "Jon Lovitz": [11, 15],
  "Norm Macdonald": [19, 23],
  "Ben Marshall": [47, 51],
  "Gail Matthius": [6, 6],
  "Michael McKean": [19, 20],
  "Mark McKinney": [20, 22],
  "Kate McKinnon": [37, 47],
  "Tim Meadows": [16, 25],
  "Laurie Metcalf": [6, 6],
  "Seth Meyers": [27, 39],
  "John Milhiser": [39, 39],
  "Dennis Miller": [11, 16],
  "Jerry Minor": [26, 26],
  "Finesse Mitchell": [29, 31],
  "Alex Moffat": [42, 47],
  "Jay Mohr": [19, 20],
  "Kyle Mooney": [39, 47],
  "Tracy Morgan": [22, 28],
  "Garrett Morris": [1, 5],
  "Bobby Moynihan": [34, 42],
  "Eddie Murphy": [6, 9],
  "Bill Murray": [2, 5],
  "Mike Myers": [14, 20],
  "Kevin Nealon": [12, 20],
  "Laraine Newman": [1, 5],
  "Don Novello": [[5, 5], [11, 11]],
  "Luke Null": [43, 43],
  "Ego Nwodim": [44, 50],
  "Mike O'Brien": [39, 39],
  "Michael O'Donoghue": [1, 1],
  "Cheri Oteri": [21, 25],
  "Ashley Padilla": [50, 51],
  "Chris Parnell": [24, 31],
  "Kam Patterson": [51, 51],
  "Nasim Pedrad": [35, 39],
  "Jay Pharoah": [36, 41],
  "Joe Piscopo": [6, 9],
  "Amy Poehler": [27, 34],
  "Emily Prager": [6, 6],
  "Randy Quaid": [11, 11],
  "Colin Quinn": [21, 25],
  "Gilda Radner": [1, 5],
  "Chris Redd": [43, 47],
  "Jeff Richards": [27, 29],
  "Rob Riggle": [30, 30],
  "Ann Risley": [6, 6],
  "Tim Robinson": [38, 38],
  "Chris Rock": [16, 18],
  "Charles Rocket": [6, 6],
  "Tony Rosato": [6, 7],
  "Jon Rudnitsky": [41, 41],
  "Maya Rudolph": [25, 33],
  "Andy Samberg": [31, 37],
  "Adam Sandler": [16, 20],
  "Horatio Sanz": [24, 31],
  "Tom Schiller": [5, 5],
  "Rob Schneider": [16, 19],
  "Paul Shaffer": [5, 5],
  "Molly Shannon": [20, 26],
  "Harry Shearer": [[5, 5], [10, 10]],
  "Sarah Sherman": [47, 51],
  "Martin Short": [10, 10],
  "Sarah Silverman": [19, 19],
  "Jenny Slate": [35, 35],
  "Veronika Slowikowska": [51, 51],
  "Robert Smigel": [17, 18],
  "David Spade": [16, 21],
  "Pamela Stephenson": [10, 10],
  "Ben Stiller": [14, 14],
  "Cecily Strong": [38, 48],
  "Jason Sudeikis": [30, 38],
  "Terry Sweeney": [11, 11],
  "Julia Sweeney": [16, 19],
  "Kenan Thompson": [29, 51],
  "Chloe Troast": [49, 49],
  "Danitra Vance": [11, 11],
  "Melissa Villaseñor": [42, 47],
  "Dan Vitale": [11, 11],
  "Emil Wakim": [50, 50],
  "Devon Walker": [48, 50],
  "Nancy Walls": [21, 21],
  "Michaela Watkins": [34, 34],
  "Damon Wayans": [11, 11],
  "Patrick Weathers": [6, 6],
  "Noël Wells": [39, 39],
  "Brooks Wheelan": [39, 39],
  "Jane Wickline": [50, 51],
  "Kristen Wiig": [31, 37],
  "Casey Wilson": [33, 34],
  "Fred Wolf": [21, 22],
  "Bowen Yang": [45, 51],
  "Sasheer Zamata": [39, 42],
  "Alan Zweibel": [5, 5],
};

// Alphabetize by last name (handles diacritics via locale-aware compare)
export const ALL_CAST = Object.keys(CAST_TENURE).sort((a, b) => {
  const lastA = a.split(" ").pop();
  const lastB = b.split(" ").pop();
  return lastA.localeCompare(lastB, "en", { sensitivity: "base" });
});

export const seasonsFor = (name) => {
  const t = CAST_TENURE[name];
  if (!t) return [];
  // Two shapes: [first, last], or [[first, last], [first, last], ...] for
  // people with more than one stint (Franken, Shearer, Novello, Doyle-Murray).
  const spans = Array.isArray(t[0]) ? t : [t];
  const out = [];
  spans.forEach(([a, b]) => {
    for (let s = a; s <= b; s++) out.push(s);
  });
  return out.sort((x, y) => x - y);
};

/* ============================================================
   SEASON METADATA
   ============================================================ */
export const SEASONS = {
  1: { year: 1975, end: 1976, tag: "The original. Belushi, Aykroyd, Chase, Curtin, Morris, Newman, Radner. Live from New York for the first time." },
  2: { year: 1976, end: 1977, tag: "Bill Murray joins. Land Shark and Mr. Bill debut. The format settles in." },
  3: { year: 1977, end: 1978, tag: "Original cast at peak. Olympia Cafe. Coneheads. The Killer Bees." },
  4: { year: 1978, end: 1979, tag: "Belushi and Aykroyd's last full season together. Two Wild and Crazy Guys at full power." },
  5: { year: 1979, end: 1980, tag: "Belushi gone. Aykroyd's last year. Murray and Radner anchor the wreckage." },
  6: { year: 1980, end: 1981, tag: "The reset. Almost everyone fired. Eddie Murphy and Joe Piscopo arrive as featured." },
  7: { year: 1981, end: 1982, tag: "Murphy ascendant. Mr. Robinson's Neighborhood. Buckwheat. Dion Dion Dion." },
  8: { year: 1982, end: 1983, tag: "Murphy is the show. James Brown's Hot Tub. Gumby. Velvet Jones." },
  9: { year: 1983, end: 1984, tag: "Murphy's farewell run. Last great Eddie season before the show nearly died." },
  10: { year: 1984, end: 1985, tag: "Billy Crystal, Martin Short, Christopher Guest. One season of total ringers. Synchronized swimmers." },
  11: { year: 1985, end: 1986, tag: "The wilderness year. RDJ, Anthony Michael Hall, Joan Cusack. Lorne returns. Almost canceled." },
  12: { year: 1986, end: 1987, tag: "Lorne's reset works. Hartman, Hooks, Carvey, Lovitz, Miller. The classic core era begins." },
  13: { year: 1987, end: 1988, tag: "Carvey's Church Lady takes over. Hartman is a chameleon. Sweeney Sisters." },
  14: { year: 1988, end: 1989, tag: "Wayne's World debuts. Hans and Franz pump you up. Hartman and Carvey at full stride." },
  15: { year: 1989, end: 1990, tag: "Myers' first full season. Carvey doing Bush 41. Massive cultural footprint." },
  16: { year: 1990, end: 1991, tag: "Sandler, Farley, Rock, Spade, Sweeney as featured. The bench gets stacked." },
  17: { year: 1991, end: 1992, tag: "Wayne's World goes to film. Schwarzenegger pumps up with Hans and Franz. Coffee Talk debuts." },
  18: { year: 1992, end: 1993, tag: "Farley as Matt Foley van down by the river. Sandler's Opera Man. The bad-boys era hits stride." },
  19: { year: 1993, end: 1994, tag: "Hartman's farewell. Farley and Sandler still standing. Major transition coming." },
  20: { year: 1994, end: 1995, tag: "Norm takes Update. The widely-panned year. Critics calling for the show's death. Massive turnover coming." },
  21: { year: 1995, end: 1996, tag: "Total reboot. Ferrell, Oteri, Hammond, Koechner, Quinn arrive. The show is reborn." },
  22: { year: 1996, end: 1997, tag: "Celebrity Jeopardy debuts. Mango. Spartan Cheerleaders. Tracy Morgan and Ana Gasteyer join." },
  23: { year: 1997, end: 1998, tag: "Norm is fired mid-season and Colin Quinn takes Update. Roxbury Guys. Mary Katherine Gallagher peaks." },
  24: { year: 1998, end: 1999, tag: "Fallon, Sanz, Parnell join. Ferrell and Oteri at full power." },
  25: { year: 1999, end: 2000, tag: "More Cowbell drops. 25th anniversary special. Ferrell at his apex. The show is must-see again." },
  26: { year: 2000, end: 2001, tag: "Tina Fey takes Update with Jimmy Fallon. Maya's first full season. Bush vs Gore cold opens." },
  27: { year: 2001, end: 2002, tag: "Post-9/11 season. Mayor Giuliani opens the show. Ferrell's final year. Poehler and Seth join." },
  28: { year: 2002, end: 2003, tag: "Forte and Armisen arrive. Ferrell era done. The show searches for a new identity." },
  29: { year: 2003, end: 2004, tag: "Tina and Jimmy on Update at peak. Debbie Downer. Kenan Thompson joins." },
  30: { year: 2004, end: 2005, tag: "Tina and Amy take the desk together. Sudeikis as featured. Bush re-elected and lampooned." },
  31: { year: 2005, end: 2006, tag: "Lazy Sunday drops and the internet changes the show forever. Hader, Wiig, Samberg as rookies." },
  32: { year: 2006, end: 2007, tag: "Dick in a Box. Seth and Amy launch on Update. Peyton Manning's United Way. Lonely Island ignites." },
  33: { year: 2007, end: 2008, tag: "Writers strike year. Iran So Far. The cast at maximum density." },
  34: { year: 2008, end: 2009, tag: "Palin season. Tina returns weekly. Poehler's farewell run. Election cold opens become event television." },
  35: { year: 2009, end: 2010, tag: "Forte's farewell year. Wiig and Hader cement. Andy Samberg and Lonely Island still cooking." },
  36: { year: 2010, end: 2011, tag: "Bayer, Killam, Pharoah arrive. Stefon emerges. Wiig's last hurrah approaches." },
  37: { year: 2011, end: 2012, tag: "Wiig and Samberg's farewell. Stefon at peak. The Californians debuts." },
  38: { year: 2012, end: 2013, tag: "Strong and Bryant as featured. Hader and Armisen's last year. Timberlake joins the Five-Timers Club." },
  39: { year: 2013, end: 2014, tag: "Bennett and Mooney arrive. Strong on Update. Pharoah's Obama. Fallon hosts the night Seth Meyers leaves the desk." },
  40: { year: 2014, end: 2015, tag: "Jost and Che debut on Update. McKinnon's Hillary. The 40th Anniversary special. Pete Davidson arrives." },
  41: { year: 2015, end: 2016, tag: "Trump hosts during his campaign. Black Jeopardy hits its stride. Strong's Cathy Anne." },
  42: { year: 2016, end: 2017, tag: "Trump cold opens become defining. Baldwin and McKinnon's Hillary. Black Jeopardy with Tom Hanks. David S. Pumpkins." },
  43: { year: 2017, end: 2018, tag: "Gardner arrives. McKinnon's Kellyanne and Jeff Sessions. Diner Lobster with Mulaney." },
  44: { year: 2018, end: 2019, tag: "Mulaney hosts. Bowen Yang as writer. McKinnon doing every guest impression. Pete Davidson era." },
  45: { year: 2019, end: 2020, tag: "Bowen Yang joins. COVID hits in March. The show goes remote for the first time ever." },
  46: { year: 2020, end: 2021, tag: "Pandemic season. Jim Carrey as Biden. Maya Rudolph wins Emmy as Kamala. Election cold opens again." },
  47: { year: 2021, end: 2022, tag: "Please Don't Destroy debut. Sarah Sherman arrives. McKinnon, Bryant, Mooney, Davidson all leave at year's end." },
  48: { year: 2022, end: 2023, tag: "Marcello Hernández. Massive cast turnover. Strong's farewell. Total identity reset." },
  49: { year: 2023, end: 2024, tag: "Post-strike return. Sarah Sherman, Bowen Yang, Marcello in their bag. JAJ's Trump cemented." },
  50: { year: 2024, end: 2025, tag: "50th anniversary season. SNL50 special airs. Maya returns as Kamala. Old guard returns en masse." },
  51: { year: 2025, end: 2026, tag: "1000th episode. Bowen's farewell at Christmas. Five new featured players. Will Ferrell hosts the finale." },
};

/* ============================================================
   HOT TAKES — opinionated one-liner per season for the result.
   ============================================================ */
export const HOT_TAKES = {
  1: "The myth. Every other season gets judged against this one.",
  2: "Less iconic than people remember. Still essential.",
  3: "Original cast at full power. Where Cheeseburger Cheeseburger lives.",
  4: "Belushi and Aykroyd's last full year. The format crystallized.",
  5: "Belushi-less. Murray and Radner do the heavy lifting. Underrated.",
  6: "The famous bad year. NBC nearly pulls the plug. Only for completionists.",
  7: "Eddie arrives and everything changes. Watch this if you've only seen modern SNL.",
  8: "Eddie's solo show. Mister Robinson + Buckwheat in their bag.",
  9: "Eddie's farewell. The last great year before a long slump.",
  10: "Crystal / Short / Guest, one and done. Ringers for a single season.",
  11: "Lorne returns to a wilderness year. Joan Cusack, RDJ, mostly forgotten.",
  12: "The reset works. Carvey + Hartman + Lovitz arrive. Hold-onto-your-hat era begins.",
  13: "Church Lady's coronation. Catchphrase era ignites.",
  14: "Wayne's World debuts. Cultural footprint becomes massive.",
  15: "Carvey's Bush 41 at peak. Wayne's World still hot. Polished-machine era.",
  16: "Sandler + Farley arrive. The bench gets stacked.",
  17: "Wayne's World in theaters. Hans and Franz pump up Schwarzenegger.",
  18: "Matt Foley van down by the river. Opera Man. Farley + Sandler at full power.",
  19: "Hartman exits. Spartans debut. Transition with sparks.",
  20: "Norm takes Update. The widely-panned year. Cult favorite for contrarians.",
  21: "Total reboot. Ferrell + Oteri + Hammond + McKinney. The show is reborn.",
  22: "Mary Katherine peaks. Celebrity Jeopardy debuts. Mango. Catchphrase boom.",
  23: "Norm fired mid-season. Roxbury Guys. Heartbreak energy under the laughs.",
  24: "Ferrell at full Bush. Spartans peak. Strong all-rounder year.",
  25: "More Cowbell drops. 25th anniversary. The era's last big swing.",
  26: "Tina + Jimmy on Update. The new direction begins.",
  27: "Post-9/11 season. Mayor Giuliani opens. Ferrell's farewell. Heavy and tender.",
  28: "Forte + Armisen arrive. Transitional. Forgotten gem.",
  29: "Debbie Downer year. Tina + Jimmy peak. Wah wah waaaah.",
  30: "Tina + Amy on Update. The friend-group era starts here.",
  31: "Lazy Sunday changes the internet. Pre-tape boom begins.",
  32: "Dick in a Box. Peyton Manning's United Way. The polished pre-tape peak.",
  33: "Writers strike. Iran So Far. Most density per minute on this list.",
  34: "Sarah Palin. The entire year. Cultural-moment season.",
  35: "Stefon debuts. Forte's last year. The transition year.",
  36: "Stefon at the desk era. Pretty / pretty / pretty.",
  37: "The Californians. Stefon peak. Wiig farewell. Top-5 for many.",
  38: "Hader and Armisen's last year. Drunk Uncle in full swing. Massive cast transition.",
  39: "Pharoah's Obama. Mooney's pre-tapes. Drunk Uncle on New Year's. Last year before Jost / Che.",
  40: "Jost + Che debut. McKinnon's Hillary. The 40th-anniversary show.",
  41: "Trump hosts during his campaign. McKinnon's Hillary in full swing. Strange and electric.",
  42: "Hallelujah cold open. David S. Pumpkins. Black Jeopardy with Hanks. The Trump-I peak.",
  43: "Diner Lobster with Mulaney. Welcome to Hell. Strong year, often underrated.",
  44: "Mulaney as recurring host. Pete in his bag. Bowen as writer.",
  45: "COVID hits in March. The show goes remote. Singular year, hard to compare.",
  46: "Bowen as Iceberg. Maya as Kamala. Election-year urgency.",
  47: "Sherman + Please Don't Destroy arrive. McKinnon's farewell. The reset before the reset.",
  48: "Marcello arrives. Strong's farewell. The total reset year.",
  49: "Post-strike return. Bargatze's Washington Crosses the Delaware. JAJ's Trump locked in.",
  50: "50th-anniversary season. Maya as Kamala returns. Legacy mode.",
  51: "1000th episode. Bowen's farewell. The future's still unwritten.",
};

/* ============================================================
   ASPECTS — the 8 dimensions of SNL fandom.
   Round 1 asks the user to pick 3. Each aspect's sub-question
   gets asked in rounds 2, 3, 4 (in the order picked).

   Aspect weight: how much picking this aspect boosts seasons
   that are strong in that aspect.
   Sub-question weight: WITHIN that aspect, which seasons match
   the specific flavor.
   ============================================================ */
export const ASPECTS = {
  "cold-open": {
    label: "Cold opens",
    sub: "Politics, impressions, Live From New York",
    weight: { 14: 1, 15: 2, 21: 1, 22: 1, 24: 1, 25: 1, 26: 2, 27: 3, 34: 4, 41: 2, 42: 4, 43: 3, 44: 2, 45: 2, 46: 3, 47: 2, 48: 2, 49: 2, 50: 2, 51: 1 },
    subQuestion: {
      id: "cold-open-style",
      title: "COLD OPEN ENERGY",
      prompt: "What lights you up about a cold open?",
      options: [
        { label: "Live from New York, and nothing more", sub: "Before the cold open meant politics. A sketch that ends in the line.", weight: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 2 } },
        { label: "Pure presidential impression", sub: "Hartman-Reagan. Carvey-Bush. Ferrell-Bush. JAJ-Trump.", weight: { 12: 1, 13: 1, 14: 2, 15: 3, 16: 2, 17: 2, 18: 3, 19: 3, 20: 2, 21: 2, 22: 2, 23: 2, 24: 2, 25: 2, 26: 3, 27: 3, 40: 2, 41: 2, 42: 3, 47: 2, 48: 2, 49: 3, 50: 2 } },
        { label: "The quieter presidential years", sub: "Forte's Bush. Armisen's Obama. Sudeikis's Biden.", weight: { 28: 2, 29: 2, 30: 2, 31: 2, 32: 2, 33: 2, 35: 2, 38: 2, 39: 2 } },
        { label: "Dramatic event response", sub: "Mayor Giuliani after 9/11. McKinnon's Hallelujah. Maya as Kamala.", weight: { 27: 4, 42: 4, 46: 3 } },
        { label: "Political satire takedown", sub: "Palin sketches. Trump-Tower entry. Baldwin-as-Trump.", weight: { 34: 4, 41: 3, 42: 4, 43: 3, 44: 2, 45: 2, 46: 3 } },
        { label: "Absurd or off-political premise", sub: "When SNL opens with something weird instead.", weight: { 36: 2, 37: 2, 43: 1, 44: 1, 47: 2, 48: 2, 49: 1, 50: 1, 51: 2 } },
      ],
    },
  },
  "update": {
    label: "Weekend Update",
    sub: "The desk, the jokes, the correspondents",
    weight: { 1: 3, 2: 2, 3: 1, 4: 1, 5: 2, 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 20: 1, 21: 3, 22: 3, 23: 3, 24: 2, 25: 2, 26: 3, 27: 3, 28: 2, 29: 3, 30: 3, 31: 3, 32: 4, 33: 4, 34: 2, 35: 2, 36: 2, 37: 3, 38: 1, 39: 2, 40: 1, 41: 1, 42: 1, 43: 1, 44: 1, 45: 1, 46: 2, 47: 1, 48: 1, 49: 1, 50: 1, 51: 1 },
    subQuestion: {
      id: "update-style",
      title: "UPDATE STYLE",
      prompt: "What's your Update vibe?",
      options: [
        { label: "The original desk", sub: "Chevy's \"and you're not.\" Curtin and Aykroyd on Point/Counterpoint.", weight: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 2 } },
        { label: "When it wasn't called Update", sub: "Charles Rocket. SNL NewsBreak. Saturday Night News.", weight: { 6: 3, 7: 3, 8: 3, 9: 3, 10: 3 } },
        { label: "Sharp commentary with attitude", sub: "Miller smug. A. Whitney Brown editorials.", weight: { 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 1 } },
        { label: "Anchor as straight man", sub: "Nealon playing it dead straight. Quinn taking the desk.", weight: { 17: 3, 18: 3, 19: 2, 23: 2, 24: 3, 25: 3 } },
        { label: "Deadpan one-liners", sub: "Norm. Note to self. Headlines as standup.", weight: { 19: 2, 20: 2, 21: 3, 22: 3, 23: 3 } },
        { label: "Warm comedic chemistry", sub: "Tina & Jimmy. Tina & Amy. The grinning best-friend energy.", weight: { 26: 3, 27: 3, 28: 3, 29: 3, 30: 3, 31: 3 } },
        { label: "Cool detached observer", sub: "Seth solo. Jost & Che bantering through the apocalypse.", weight: { 32: 2, 33: 2, 34: 3, 35: 3, 36: 3, 37: 3, 38: 2, 39: 2, 40: 2, 41: 2, 42: 2, 43: 2, 44: 2, 45: 2, 46: 2, 47: 2, 48: 2, 49: 2, 50: 2, 51: 2 } },
        { label: "Weird character correspondents", sub: "Stefon. Drunk Uncle. Forte at the desk. Bowen as the Iceberg.", weight: { 28: 1, 29: 1, 30: 1, 31: 1, 32: 1, 33: 2, 34: 2, 35: 3, 36: 3, 37: 4, 38: 3, 39: 3, 46: 3, 47: 2, 48: 2, 49: 2, 50: 1, 51: 1 } },
      ],
    },
  },
  "recurring": {
    label: "Recurring characters",
    sub: "Catchphrases, taglines, the bit you've quoted for 20 years",
    weight: { 5: 1, 6: 1, 7: 3, 8: 3, 9: 2, 10: 3, 12: 3, 13: 3, 14: 3, 15: 2, 17: 2, 18: 3, 22: 3, 23: 3, 24: 3, 25: 2, 29: 2, 32: 2, 36: 2, 37: 3, 38: 2, 39: 2, 42: 2, 43: 2, 47: 1 },
    subQuestion: {
      id: "recurring-type",
      title: "RECURRING TYPE",
      prompt: "Which recurring type owns you?",
      options: [
        { label: "The originals", sub: "Coneheads. Killer Bees. Roseanne Roseannadanna.", weight: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2 } },
        { label: "Big personalities with catchphrases", sub: "Mr. Robinson. Church Lady. Mary Katherine Gallagher. Stefon.", weight: { 7: 3, 8: 3, 9: 2, 10: 2, 11: 2, 12: 3, 13: 3, 14: 2, 17: 1, 22: 3, 23: 3, 24: 3, 25: 2, 36: 2, 37: 3 } },
        { label: "Loser archetypes", sub: "Matt Foley. Hans & Franz. Roxbury Guys. Drunk Uncle.", weight: { 14: 2, 15: 2, 17: 3, 18: 4, 19: 3, 20: 2, 22: 3, 23: 3, 38: 2, 39: 2 } },
        { label: "Mid-2000s regulars", sub: "Debbie Downer. Bronx Beat. Two A-Holes.", weight: { 26: 2, 27: 2, 28: 2, 29: 3, 30: 3, 31: 3, 32: 3, 33: 3, 34: 3 } },
        { label: "Wiig-era weirdos", sub: "Target Lady. Gilly. Penelope. Sue.", weight: { 31: 2, 32: 2, 33: 2, 34: 2, 35: 3, 36: 3, 37: 3 } },
        { label: "Suburban absurdity", sub: "Wayne's World. Spartan Cheerleaders. The Californians.", weight: { 14: 3, 15: 3, 16: 3, 17: 3, 21: 2, 22: 3, 23: 2, 37: 3, 38: 2 } },
        { label: "Surreal weirdos", sub: "Mango. Bailey Gismert. David S. Pumpkins.", weight: { 22: 2, 23: 2, 35: 2, 36: 3, 37: 3, 40: 2, 41: 2, 42: 3, 43: 2, 44: 2 } },
        { label: "Modern character work", sub: "Bowen's many. Sarah Sherman bits. Marcello's Domingo.", weight: { 45: 2, 46: 3, 47: 3, 48: 3, 49: 3, 50: 2, 51: 2 } },
      ],
    },
  },
  "host": {
    label: "Host-driven sketches",
    sub: "The host carries the whole episode",
    weight: { 10: 3, 22: 2, 23: 2, 24: 2, 25: 3, 26: 2, 27: 2, 31: 2, 32: 3, 37: 2, 38: 1, 41: 2, 42: 3, 43: 3, 44: 3, 50: 2, 51: 2 },
    subQuestion: {
      id: "host-type",
      title: "HOST ENERGY",
      prompt: "Which host episode would you queue first?",
      options: [
        { label: "Steve Martin owning the building", sub: "The wild and crazy years. Buck Henry every December.", weight: { 1: 2, 2: 3, 3: 3, 4: 3, 5: 3 } },
        { label: "Musician hosts of the early years", sub: "Paul Simon. Ray Charles. Stevie Wonder.", weight: { 1: 2, 2: 2, 3: 3, 6: 2, 7: 2, 8: 3, 9: 2, 10: 2 } },
        { label: "An 80s or 90s repeat offender", sub: "Tom Hanks. John Goodman. Alec Baldwin.", weight: { 11: 2, 12: 2, 13: 2, 14: 2, 15: 3, 16: 3, 17: 3, 18: 3, 19: 3, 20: 2, 21: 2 } },
        { label: "Dramatic actor cutting loose", sub: "Walken. Hopkins. De Niro. Goodman.", weight: { 22: 2, 23: 2, 24: 2, 25: 3, 26: 2, 27: 2, 31: 2, 32: 2, 41: 2, 42: 2 } },
        { label: "The ringer holding up a thin year", sub: "Walken again. Jon Hamm. Betty White.", weight: { 28: 2, 29: 2, 30: 2, 34: 2, 35: 3, 36: 2, 39: 2 } },
        { label: "A host with no real audience", sub: "Tom Hanks opening SNL at Home. The distanced 2021 shows.", weight: { 45: 4, 46: 3 } },
        { label: "Comedian in their prime", sub: "Mulaney. Galifianakis. Sandler returning.", weight: { 24: 1, 25: 1, 41: 1, 42: 2, 43: 3, 44: 3, 47: 1 } },
        { label: "Pop star going double duty", sub: "Timberlake. Bieber. Carpenter. Bad Bunny.", weight: { 32: 3, 33: 2, 37: 2, 38: 3, 49: 2, 50: 1, 51: 3 } },
        { label: "Returning legend / Five-Timer", sub: "Murray. Ferrell. Hanks. Steve Martin. Fey.", weight: { 25: 2, 31: 2, 37: 2, 40: 2, 50: 4, 51: 3 } },
        { label: "Athlete with surprising chops", sub: "Peyton. LeBron. Travis Kelce.", weight: { 32: 4, 33: 2, 48: 3 } },
      ],
    },
  },
  "pretape": {
    label: "Pre-tapes & digital shorts",
    sub: "The polished pieces that go viral on Sunday",
    weight: { 2: 1, 3: 1, 9: 1, 10: 2, 22: 2, 23: 3, 24: 3, 25: 3, 26: 2, 27: 2, 28: 2, 29: 2, 30: 2, 31: 4, 32: 4, 33: 3, 34: 3, 35: 3, 36: 2, 37: 2, 38: 1, 39: 2, 40: 2, 42: 2, 43: 3, 44: 2, 45: 2, 46: 3, 47: 4, 48: 2, 49: 3, 50: 2, 51: 2 },
    subQuestion: {
      id: "pretape-type",
      title: "PRE-TAPE TYPE",
      prompt: "What pre-tape would you rewatch most?",
      options: [
        { label: "Lonely Island music videos", sub: "Lazy Sunday. Dick in a Box. I'm On a Boat. Jack Sparrow.", weight: { 31: 4, 32: 4, 33: 3, 34: 3, 35: 3, 36: 2, 37: 2 } },
        { label: "Location & mockumentary pre-tapes", sub: "Bad Boys. Wells for Boys. Inside SoCal.", weight: { 37: 1, 38: 1, 43: 4, 44: 3 } },
        { label: "Awkward Mooney / Good Neighbor pre-tapes", sub: "Inside SoCal. Wells for Boys. Beck & Kyle bits.", weight: { 39: 3, 40: 2, 41: 2, 42: 3, 43: 2, 44: 2 } },
        { label: "Please Don't Destroy", sub: "Hard Seltzer. Hot Soup. Three Sad Virgins. The friend trio.", weight: { 47: 4, 48: 2, 49: 2, 50: 2, 51: 2 } },
        { label: "TV Funhouse animated shorts", sub: "The X-Presidents. Smigel cartoons. Ace and Gary.", weight: { 22: 2, 23: 3, 24: 3, 25: 3, 26: 2, 27: 2, 28: 2, 29: 2, 30: 2, 31: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1 } },
      ],
    },
  },
  "music": {
    label: "Musical guests",
    sub: "The band/artist is part of why you tuned in",
    weight: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 1, 11: 1, 18: 2, 19: 2, 20: 2, 25: 2, 29: 2, 32: 2, 33: 2, 34: 2, 37: 2, 41: 2, 45: 1, 49: 2, 50: 2, 51: 2 },
    subQuestion: {
      id: "music-era",
      title: "MUSIC ERA",
      prompt: "When was SNL's music booking at its best?",
      options: [
        { label: "Original punk, new wave, disco", sub: "Talking Heads. Devo. Patti Smith. Costello stopping the show.", weight: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 2 } },
        { label: "Nirvana, Pearl Jam, alt-rock 90s", sub: "Grunge debuting. Smashing Pumpkins. Beastie Boys.", weight: { 17: 2, 18: 3, 19: 3, 20: 3, 21: 2, 22: 2 } },
        { label: "Pop power 2000s", sub: "Beyoncé. Timberlake. Adele. Gaga.", weight: { 26: 2, 27: 2, 32: 3, 33: 3, 34: 3, 35: 2, 36: 2, 37: 2 } },
        { label: "Hip-hop crossover", sub: "Kanye. Drake. Kendrick. Frank Ocean. Megan Thee Stallion.", weight: { 31: 2, 35: 2, 38: 3, 39: 2, 40: 2, 41: 2, 45: 2, 46: 2 } },
        { label: "Now — K-pop, Bad Bunny, Carpenter", sub: "BTS. Bad Bunny in his bag. Sabrina. Olivia.", weight: { 47: 2, 48: 2, 49: 3, 50: 3, 51: 3 } },
      ],
    },
  },
  "ten-to-one": {
    label: "Weird 10-to-1s",
    sub: "The almost-broken bit at 12:55am",
    weight: { 28: 2, 29: 2, 30: 2, 31: 1, 32: 1, 33: 2, 34: 1, 35: 3, 38: 2, 39: 3, 40: 2, 41: 2, 42: 1, 43: 1, 44: 2, 47: 4, 48: 3, 49: 3, 50: 2, 51: 2 },
    subQuestion: {
      id: "ten-to-one-flavor",
      title: "WEIRD FLAVOR",
      prompt: "What kind of weird ends your perfect SNL?",
      options: [
        { label: "Aykroyd and Belushi getting strange", sub: "The last sketch, back when nobody was watching the clock.", weight: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 2 } },
        { label: "Murphy and Piscopo loose bits", sub: "The end of the night in the years Eddie carried it.", weight: { 6: 2, 7: 3, 8: 3, 9: 3, 10: 2 } },
        { label: "Carvey and Lovitz oddballs", sub: "Master Thespian. Toonces. The bit that ran last.", weight: { 11: 2, 12: 3, 13: 3, 14: 3, 15: 2 } },
        { label: "Sandler and Farley closing the show", sub: "Canteen Boy. Gap Girls. Whatever was left at 12:50.", weight: { 16: 3, 17: 3, 18: 3, 19: 3, 20: 2 } },
        { label: "Ferrell-era last-sketch nonsense", sub: "The dumbest possible ending, played completely straight.", weight: { 21: 2, 22: 2, 23: 3, 24: 3, 25: 3, 26: 2, 27: 2 } },
        { label: "Forte goes off the rails alone", sub: "Hamilton lecturer. Closet organizer. The Falconer.", weight: { 28: 2, 29: 2, 30: 2, 31: 1, 33: 2, 34: 1, 35: 4 } },
        { label: "Armisen / Hader quiet weirdness", sub: "Vinny Vedecci. The Manuel Ortiz Show. Fericito.", weight: { 31: 1, 32: 1, 33: 2, 34: 1, 35: 1, 36: 1, 37: 2, 38: 2 } },
        { label: "Mooney's awkward pre-tapes", sub: "Inside SoCal. Bad Boys. The pre-tapes that died on purpose.", weight: { 39: 2, 40: 3, 41: 2, 42: 1, 43: 1, 44: 1, 47: 1 } },
        { label: "Sherman's grotesque body humor", sub: "Sherman's bits where you don't know if it's a sketch.", weight: { 47: 4, 48: 3, 49: 4, 50: 3, 51: 2 } },
        { label: "Bowen at the end of the night", sub: "Sara Lee's social media guy. The Iceberg.", weight: { 45: 3, 46: 3, 47: 2 } },
        { label: "Marcello-era surrealism", sub: "The current cast getting strange after 12:50.", weight: { 48: 3, 49: 3, 50: 2, 51: 3 } },
      ],
    },
  },
  "impressions": {
    label: "Political impressions",
    sub: "Bush. Clinton. Palin. Trump. The defining ones.",
    weight: { 12: 2, 13: 2, 14: 2, 15: 3, 18: 3, 19: 3, 22: 2, 23: 2, 24: 2, 25: 2, 26: 3, 27: 3, 34: 4, 40: 2, 41: 3, 42: 4, 43: 3, 44: 2, 45: 1, 46: 2, 47: 2, 48: 2, 49: 2, 50: 2 },
    subQuestion: {
      id: "impression-era",
      title: "IMPRESSION ERA",
      prompt: "Which impression era defines your SNL?",
      options: [
        { label: "The 70s political bench", sub: "Chase's Ford falling down. Aykroyd's Nixon and Carter.", weight: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 2 } },
        { label: "Piscopo's Reagan, Murphy's everyone", sub: "The years the impressions carried the show.", weight: { 6: 2, 7: 3, 8: 3, 9: 3, 10: 2 } },
        { label: "Hartman doing all of them", sub: "Reagan. Sinatra. The chameleon years.", weight: { 11: 2, 12: 3, 13: 3, 17: 3 } },
        { label: "Carvey's Bush 41", sub: "'Nah gonna do it.' 'Wouldn't be prudent.'", weight: { 14: 2, 15: 3, 16: 2 } },
        { label: "Hartman & Hammond doing Clinton", sub: "The 90s political ringers.", weight: { 18: 3, 19: 3, 20: 2, 21: 2, 22: 2, 23: 2, 24: 3, 25: 3, 26: 2 } },
        { label: "The Obama years", sub: "Armisen's Obama. Poehler's Hillary. Then Pharoah takes it over.", weight: { 28: 2, 29: 2, 30: 2, 31: 2, 32: 3, 33: 3, 35: 3, 36: 3, 37: 3, 38: 3, 39: 3 } },
        { label: "Ferrell's Bush 43", sub: "'Strategery.' The dumbest stares ever broadcast.", weight: { 26: 3, 27: 3 } },
        { label: "Tina Fey's Sarah Palin", sub: "'I can see Russia from my house.' The 2008 moment.", weight: { 34: 4 } },
        { label: "McKinnon's Hillary + Baldwin's Trump", sub: "The 2016 election framework.", weight: { 40: 2, 41: 3, 42: 4, 43: 3, 44: 2, 45: 1, 46: 2 } },
        { label: "JAJ's Trump (the current run)", sub: "James Austin Johnson somehow nailing the impossible.", weight: { 47: 3, 48: 3, 49: 4, 50: 3, 51: 3 } },
      ],
    },
  },
  "topical": {
    label: "Politics of the week",
    sub: "Election years. Cold-open responses. Comedy as commentary.",
    weight: { 12: 2, 13: 2, 14: 2, 15: 3, 18: 3, 19: 3, 22: 2, 23: 2, 24: 2, 25: 1, 26: 3, 27: 4, 30: 2, 34: 4, 40: 2, 41: 3, 42: 4, 43: 3, 44: 2, 45: 2, 46: 3, 49: 3, 50: 3 },
    subQuestion: {
      id: "topical-style",
      title: "POLITICAL FLAVOR",
      prompt: "What kind of political comedy fires you up?",
      options: [
        { label: "Impressions of sitting presidents", sub: "The week's biggest character — POTUS — performed back at us.", weight: { 14: 2, 15: 3, 18: 2, 19: 3, 22: 1, 23: 1, 24: 1, 25: 1, 26: 3, 27: 3, 34: 2, 41: 2, 42: 3, 43: 2, 44: 1, 45: 1, 46: 2, 49: 3, 50: 2 } },
        { label: "Election-season chaos", sub: "Palin sketches. Trump-tower entry. Conventions to results night.", weight: { 14: 1, 18: 1, 22: 1, 26: 2, 30: 2, 34: 4, 38: 1, 42: 4, 46: 3, 50: 2 } },
        { label: "Day-after-the-news cold opens", sub: "Mayor Giuliani after 9/11. Hallelujah after 2016. Real-time response.", weight: { 27: 4, 28: 1, 42: 3, 46: 3, 49: 1, 50: 1 } },
        { label: "Cabinet & Congress — not just the president", sub: "McKinnon's Sessions. Matt Damon's Kavanaugh. The supporting cast.", weight: { 22: 1, 26: 1, 41: 1, 42: 2, 43: 3, 44: 3, 45: 2, 46: 2 } },
        { label: "Pure satire, no impression required", sub: "Absurd-political takedowns where the joke isn't the lookalike.", weight: { 34: 3, 41: 2, 42: 3, 43: 2, 44: 2, 49: 1, 50: 1 } },
      ],
    },
  },
  "loose": {
    label: "Loose, live-wire energy",
    sub: "Raw stage feel. Cast breaking. Sketches that almost fall apart.",
    weight: { 1: 4, 2: 4, 3: 3, 4: 3, 5: 3, 6: 3, 11: 2, 20: 2, 28: 2, 38: 2, 39: 1, 47: 2, 48: 3 },
    subQuestion: {
      id: "loose-flavor",
      title: "LOOSE FLAVOR",
      prompt: "What kind of looseness do you crave?",
      options: [
        { label: "Cast visibly breaking on camera", sub: "Hader as Stefon. Wiig and Bayer trying to hold it together.", weight: { 31: 2, 32: 2, 33: 2, 34: 1, 35: 2, 36: 3, 37: 3, 38: 1, 47: 2 } },
        { label: "Raw downtown-NY theater energy", sub: "The early years when the show felt like an experiment.", weight: { 1: 4, 2: 4, 3: 3, 4: 3, 5: 3 } },
        { label: "Sketches dying on air", sub: "Bombs and recoveries. The risk you only get live.", weight: { 5: 1, 6: 2, 11: 2, 20: 3, 38: 1, 48: 1 } },
        { label: "A brand-new cast finding its feet", sub: "Reset years. The chaos before things click.", weight: { 6: 3, 11: 3, 20: 2, 21: 1, 28: 2, 38: 3, 40: 1, 48: 3 } },
        { label: "Long-running bits getting weirder each appearance", sub: "Stefon's evolution. Domingo every other week.", weight: { 13: 2, 14: 2, 22: 2, 23: 2, 35: 2, 36: 3, 37: 3, 47: 2, 48: 2 } },
      ],
    },
  },
};

export const ASPECT_IDS = Object.keys(ASPECTS);

export const ASPECT_ROUND = {
  type: "aspects",
  title: "ROUND 01 / WHAT YOU LIVE FOR",
  prompt: "Pick the 3 aspects of SNL you live for.",
  sub: "These shape the next three questions. Be honest — there's no wrong combination.",
  max: 3,
  min: 3,
};

export const CAST_ROUND = {
  type: "multi-cast",
  title: "ROUND 05 / NON-NEGOTIABLES",
  prompt: "Pick up to 3 cast members you cannot live without.",
  sub: "These weigh heavier than anything else. Tap a face to lock it in.",
  max: 3,
};

/* ============================================================
   ADAPTIVE POOL — refinement questions chosen dynamically
   for rounds 6-9 based on which one best discriminates between
   the user's current top season candidates.

   Questions with `negate: true` apply NEGATIVE weight at scoring
   time — "which of these would you skip?" deducts weight from
   the picked option's associated seasons.
   ============================================================ */
export const MOMENT_OPTIONS = [
  { label: "Land Shark", weight: { 1: 3, 2: 3 } },
  { label: "Two Wild and Crazy Guys", weight: { 3: 3, 4: 3 } },
  { label: "Mr. Robinson's Neighborhood", weight: { 7: 3, 8: 3, 9: 2 } },
  { label: "Buckwheat", weight: { 7: 3, 8: 2, 9: 2 } },
  { label: "Nick the Lounge Singer", weight: { 4: 1, 5: 3 } },
  { label: "Synchronized Swimming (Guest / Short)", weight: { 10: 4 } },
  { label: "Ed Grimley", weight: { 10: 3 } },
  { label: "Master Thespian (Acting!)", weight: { 11: 2, 12: 3, 13: 2 } },
  { label: "White Like Me", weight: { 10: 4 } },
  { label: "Church Lady", weight: { 12: 2, 13: 3, 14: 3, 15: 2 } },
  { label: "Hans and Franz", weight: { 13: 2, 14: 3, 15: 3, 17: 2 } },
  { label: "Wayne's World", weight: { 14: 3, 15: 3, 16: 3, 17: 3 } },
  { label: "Stuart Smalley", weight: { 16: 3, 17: 2 } },
  { label: "Coffee Talk", weight: { 17: 3, 18: 2 } },
  { label: "Matt Foley van down by the river", weight: { 18: 4 } },
  { label: "Spartan Cheerleaders", weight: { 21: 3, 22: 3, 23: 2, 24: 2, 25: 2 } },
  { label: "Roxbury Guys", weight: { 21: 2, 22: 3, 23: 3 } },
  { label: "Mary Katherine Gallagher", weight: { 21: 2, 22: 3, 23: 3, 24: 2 } },
  { label: "Celebrity Jeopardy", weight: { 22: 2, 23: 2, 24: 2, 25: 2, 26: 2 } },
  { label: "More Cowbell", weight: { 25: 4 } },
  { label: "Debbie Downer", weight: { 29: 4 } },
  { label: "Lazy Sunday", weight: { 31: 4 } },
  { label: "Dick in a Box", weight: { 32: 4 } },
  { label: "Iran So Far", weight: { 33: 4 } },
  { label: "Sarah Palin cold opens", weight: { 34: 4 } },
  { label: "I'm On a Boat", weight: { 34: 4 } },
  { label: "Stefon at the desk", weight: { 35: 2, 36: 3, 37: 4 } },
  { label: "The Californians", weight: { 37: 3, 38: 2 } },
  { label: "Drunk Uncle", weight: { 37: 2, 38: 3, 39: 3 } },
  { label: "McKinnon's Hillary cold opens", weight: { 40: 2, 41: 3, 42: 3 } },
  { label: "Black Jeopardy with Tom Hanks", weight: { 42: 4 } },
  { label: "Hallelujah cold open", weight: { 42: 4 } },
  { label: "David S. Pumpkins", weight: { 42: 4 } },
  { label: "Diner Lobster with Mulaney", weight: { 43: 4 } },
  { label: "Bowen Yang as the Iceberg", weight: { 46: 4 } },
  { label: "Please Don't Destroy: Hard Seltzer", weight: { 47: 4 } },
  { label: "Bad Bunny premiere parent-teacher", weight: { 51: 4 } },
];

export const ADAPTIVE_POOL = [
  {
    id: "update",
    title: "WEEKEND UPDATE",
    prompt: "Best Update desk.",
    options: [
      { label: "Chevy Chase", weight: { 1: 3, 2: 1 } },
      { label: "Jane Curtin & Dan Aykroyd", weight: { 3: 3, 4: 3, 5: 2 } },
      { label: "The Ebersol-era news desks", weight: { 6: 3, 7: 3, 8: 3, 9: 3, 10: 3 } },
      { label: "Dennis Miller", weight: { 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 1 } },
      { label: "Kevin Nealon", weight: { 17: 3, 18: 3, 19: 2 } },
      { label: "Norm Macdonald", weight: { 20: 2, 21: 3, 22: 3, 23: 3 } },
      { label: "Colin Quinn", weight: { 23: 2, 24: 3, 25: 3 } },
      { label: "Tina Fey & Jimmy Fallon", weight: { 26: 3, 27: 3, 28: 3, 29: 3 } },
      { label: "Tina Fey & Amy Poehler", weight: { 30: 3, 31: 3 } },
      { label: "Seth Meyers & Amy Poehler", weight: { 32: 3, 33: 3, 34: 1 } },
      { label: "Seth Meyers solo", weight: { 34: 3, 35: 2, 36: 2, 37: 2, 38: 2, 39: 2 } },
      { label: "Cecily Strong & Seth Meyers", weight: { 39: 3 } },
      { label: "Colin Jost & Michael Che", weight: { 40: 2, 41: 2, 42: 2, 43: 2, 44: 2, 45: 2, 46: 2, 47: 2, 48: 2, 49: 2, 50: 2, 51: 2 } },
    ],
  },
  {
    id: "moment",
    title: "THE MOMENT",
    prompt: "Pick the moment that lives in your head.",
    options: MOMENT_OPTIONS,
  },
  {
    id: "moment-skip",
    negate: true,
    title: "THE SKIP",
    prompt: "Now pick the one you'd rather skip.",
    sub: "Which of these would you not miss?",
    options: MOMENT_OPTIONS,
  },
  {
    id: "sketch-type",
    title: "SKETCH TYPE",
    prompt: "Pick the sketch type you can't live without.",
    options: [
      { label: "The original repertory sketches", sub: "Coneheads. Olympia Cafe. Mr. Robinson's Neighborhood.", weight: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2 } },
      { label: "Recurring characters with catchphrases", sub: "Wayne's World. Spartan Cheerleaders. Stefon.", weight: { 11: 2, 12: 3, 13: 3, 14: 2, 15: 2, 16: 2, 17: 2, 18: 2, 19: 2, 20: 2, 22: 2, 23: 2, 24: 2, 25: 2, 36: 2, 37: 2, 38: 1 } },
      { label: "Game show parodies", sub: "Celebrity Jeopardy. Black Jeopardy. $25,000 Pyramid.", weight: { 22: 2, 23: 2, 24: 2, 25: 2, 26: 2, 27: 2, 41: 2, 42: 3, 43: 1, 44: 1 } },
      { label: "Political cold opens", sub: "Bush. Palin. Trump. The icy gravitas of Live From New York.", weight: { 14: 1, 15: 2, 21: 1, 22: 1, 24: 1, 25: 1, 26: 1, 27: 1, 34: 3, 41: 2, 42: 3, 43: 2, 44: 1, 45: 1, 46: 2, 47: 1, 48: 1, 49: 1 } },
      { label: "Digital shorts and pre-tapes", sub: "Lazy Sunday. Dick in a Box. Please Don't Destroy.", weight: { 31: 3, 32: 3, 33: 2, 34: 1, 35: 1, 36: 1, 37: 1, 47: 2, 48: 1, 49: 1, 50: 1, 51: 1 } },
      { label: "Almost-broken weird pre-tapes", sub: "Forte solo bits. Mooney's Inside SoCal. Sherman pieces.", weight: { 28: 1, 29: 1, 30: 1, 31: 1, 32: 1, 33: 2, 34: 1, 35: 2, 38: 1, 39: 2, 40: 1, 41: 1, 47: 3, 48: 2, 49: 2 } },
      { label: "Host-elevating sketches", sub: "Walken. Timberlake. Tom Hanks. Mulaney as host.", weight: { 22: 1, 23: 1, 24: 1, 25: 2, 26: 1, 27: 1, 31: 1, 32: 2, 37: 2, 38: 1, 41: 1, 42: 2, 43: 2, 44: 2 } },
    ],
  },
  {
    id: "feel",
    title: "THE FEEL",
    prompt: "When SNL is at its best for you, it feels like…",
    options: [
      { label: "A New York theater company taking risks", sub: "Loose, raw, you can feel the audience", weight: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 1, 11: 1, 20: 1, 38: 1, 39: 1, 47: 1, 48: 1 } },
      { label: "A perfectly oiled comedy machine", sub: "Every sketch lands, no fat", weight: { 14: 2, 15: 2, 22: 2, 23: 2, 24: 2, 25: 2, 32: 3, 33: 3, 34: 2, 42: 2 } },
      { label: "A friend group throwing parties", sub: "You can feel the cast actually liking each other", weight: { 31: 3, 32: 3, 33: 2, 36: 2, 37: 2, 39: 1, 40: 1, 47: 1 } },
      { label: "A weekly state-of-the-union", sub: "The show metabolizing the week's news", weight: { 27: 2, 34: 3, 41: 2, 42: 3, 43: 2, 44: 2, 46: 3, 49: 1, 50: 1 } },
    ],
  },
  {
    id: "host-era",
    title: "THE HOST",
    prompt: "Which kind of host episode do you live for?",
    options: [
      { label: "One of the early-years regulars", sub: "Steve Martin. Buck Henry. Paul Simon.", weight: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1 } },
      { label: "A musician who could actually host", sub: "Ray Charles. Stevie Wonder.", weight: { 7: 2, 8: 3, 9: 2, 10: 2 } },
      { label: "An 80s or 90s repeat offender", sub: "Hanks. Goodman. Baldwin.", weight: { 11: 2, 12: 2, 13: 2, 14: 2, 15: 3, 16: 3, 17: 3, 18: 3, 19: 3, 20: 2, 21: 2 } },
      { label: "An old-school dramatic actor having fun", sub: "Walken. Hanks. Hopkins. Goodman.", weight: { 22: 2, 23: 2, 24: 2, 25: 2, 26: 1, 31: 1, 32: 2, 41: 1, 42: 2 } },
      { label: "A ringer holding up a thin year", sub: "Jon Hamm. Betty White. Walken again.", weight: { 27: 2, 28: 2, 29: 2, 30: 2, 34: 2, 35: 3, 36: 2, 38: 2, 39: 2, 48: 2 } },
      { label: "A host with no real audience", sub: "SNL at Home. The distanced 2021 shows.", weight: { 45: 4, 46: 3 } },
      { label: "A comedian in their prime", sub: "Mulaney. Carrey. Sandler. Galifianakis.", weight: { 24: 1, 25: 1, 41: 1, 42: 1, 43: 2, 44: 3, 47: 1 } },
      { label: "A pop star doing double duty", sub: "Bieber. Timberlake. Carpenter. Bad Bunny.", weight: { 32: 2, 33: 2, 37: 2, 49: 1, 50: 1, 51: 2 } },
      { label: "A returning legend", sub: "Five-Timers. Hosts who used to be cast.", weight: { 25: 2, 31: 1, 37: 2, 40: 2, 50: 3, 51: 2 } },
    ],
  },
  {
    id: "impression",
    title: "THE IMPRESSION",
    prompt: "Pick an impression you'd watch on loop.",
    options: [
      { label: "Chase's Ford and Aykroyd's Carter", weight: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 2 } },
      { label: "Piscopo's Reagan", weight: { 6: 2, 7: 3, 8: 3, 9: 3, 10: 2 } },
      { label: "Hartman's Reagan and Sinatra", weight: { 11: 2, 12: 3, 13: 3, 17: 3 } },
      { label: "Carvey's Bush 41", weight: { 14: 2, 15: 3, 16: 2 } },
      { label: "Hartman's Clinton", weight: { 18: 3, 19: 3, 20: 3, 21: 2 } },
      { label: "Armisen's Obama", weight: { 28: 1, 29: 1, 30: 2, 31: 2, 32: 2, 33: 2, 35: 3, 36: 3, 37: 3 } },
      { label: "Ferrell's Bush 43", weight: { 26: 3, 27: 3 } },
      { label: "Hammond's Clinton & Trump", weight: { 22: 1, 23: 1, 24: 2, 25: 2, 26: 2 } },
      { label: "Tina Fey's Sarah Palin", weight: { 34: 4 } },
      { label: "Pharoah's Obama", weight: { 38: 2, 39: 2, 40: 2, 41: 1 } },
      { label: "McKinnon's Hillary", weight: { 40: 2, 41: 3, 42: 3 } },
      { label: "Baldwin's Trump", weight: { 42: 3, 43: 2, 44: 2, 45: 1, 46: 2 } },
      { label: "Maya's Kamala", weight: { 46: 3, 50: 3 } },
      { label: "JAJ's Trump (current)", weight: { 47: 2, 48: 2, 49: 3, 50: 2, 51: 2 } },
    ],
  },
  {
    id: "ten-to-one",
    title: "10-TO-1 SPIRIT",
    prompt: "What's the ideal almost-broken bit at 12:55am?",
    options: [
      { label: "Belushi and Aykroyd get strange", weight: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 2 } },
      { label: "Murphy and Piscopo mess around", weight: { 6: 2, 7: 3, 8: 3, 9: 3, 10: 2 } },
      { label: "Carvey and Lovitz go odd", weight: { 11: 2, 12: 3, 13: 3, 14: 3, 15: 2 } },
      { label: "Sandler and Farley close the show", weight: { 16: 3, 17: 3, 18: 3, 19: 3, 20: 2 } },
      { label: "Ferrell does something dumb last", weight: { 21: 2, 22: 2, 23: 3, 24: 3, 25: 3, 26: 2, 27: 2 } },
      { label: "Forte goes off the rails alone", weight: { 28: 2, 29: 2, 30: 2, 31: 1, 33: 2, 34: 1, 35: 3 } },
      { label: "Armisen and Hader do something quiet", weight: { 31: 1, 32: 1, 33: 2, 34: 1, 35: 1, 36: 1, 37: 2, 38: 2 } },
      { label: "Mooney's awkward pre-tape", weight: { 39: 2, 40: 2, 41: 2, 42: 1, 43: 1, 44: 1, 47: 1 } },
      { label: "Sarah Sherman cooks something gross", weight: { 47: 3, 48: 2, 49: 3, 50: 2, 51: 1 } },
      { label: "Bowen Yang plays an inanimate object", weight: { 45: 1, 46: 3, 47: 2, 48: 1, 49: 1, 50: 1 } },
    ],
  },
  {
    id: "bores",
    negate: true,
    title: "THE DEALBREAKER",
    prompt: "Pick the kind of SNL that puts you off.",
    sub: "What bores you, sours an episode, or makes you change the channel?",
    options: [
      { label: "Heavy political cold opens", sub: "When the show feels like the news.", weight: { 14: 1, 15: 2, 22: 1, 23: 1, 26: 2, 27: 3, 34: 4, 41: 2, 42: 4, 43: 3, 44: 2, 45: 2, 46: 3, 47: 1, 48: 1, 49: 2, 50: 3 } },
      { label: "Catchphrase characters & broad bits", sub: "Roxbury Guys. Mary Katherine. Coffee Talk.", weight: { 13: 2, 14: 2, 15: 2, 17: 2, 18: 2, 22: 3, 23: 3, 24: 2, 25: 2, 37: 2, 38: 1 } },
      { label: "Lonely Island-era digital shorts", sub: "Lazy Sunday. Dick in a Box. The pre-tape boom.", weight: { 31: 3, 32: 4, 33: 4, 34: 2, 35: 2, 36: 2, 37: 2 } },
      { label: "Weird 10-to-1 absurdity", sub: "The bits at 12:55 that feel like dares.", weight: { 28: 1, 29: 1, 35: 2, 39: 2, 40: 1, 41: 1, 47: 3, 48: 3, 49: 3, 50: 2, 51: 2 } },
      { label: "Game-show parodies on repeat", sub: "Celebrity Jeopardy. $25,000 Pyramid. Black Jeopardy.", weight: { 22: 2, 23: 2, 24: 2, 25: 2, 26: 2, 41: 1, 42: 3, 43: 1, 44: 1 } },
      { label: "Sandler/Farley bro-comedy energy", sub: "Opera Man. Matt Foley. Roxbury. The mid-90s bench.", weight: { 16: 3, 17: 3, 18: 4, 19: 3, 20: 2 } },
      { label: "Anything from the original-cast era", sub: "If it looks like the 70s, you skip it.", weight: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 2, 6: 2 } },
    ],
  },
];

/* ============================================================
   SKETCH CATALOG — for "Watch This Next" on the result page.
   Hand-curated. Tier = "iconic" (everyone knows it) or "deep_cut"
   (lesser-known but season-defining). aspects[] tags overlap with
   ASPECT_IDS so we can match the user's top aspects.
   ============================================================ */
export const SKETCHES = [
  // Original cast
  { season: 1, title: "Land Shark", tier: "iconic", aspects: ["recurring", "loose"] },
  { season: 1, title: "The Killer Bees", tier: "iconic", aspects: ["recurring"] },
  { season: 3, title: "Mr. Mike's Least-Loved Bedtime Stories", tier: "deep_cut", aspects: ["pretape", "loose"] },
  { season: 2, title: "The Coneheads", tier: "iconic", aspects: ["recurring", "loose"] },
  { season: 1, title: "Bass-O-Matic '76", tier: "deep_cut", aspects: ["pretape", "recurring"] },
  { season: 3, title: "Olympia Cafe — Cheeseburger Cheeseburger", tier: "iconic", aspects: ["recurring", "host"] },
  { season: 3, title: "Mr. Bill", tier: "iconic", aspects: ["pretape", "loose"] },
  { season: 4, title: "Two Wild and Crazy Guys", tier: "iconic", aspects: ["recurring", "host"] },
  { season: 5, title: "Nick the Lounge Singer", tier: "iconic", aspects: ["recurring", "host"] },
  // Eddie era
  { season: 7, title: "Mister Robinson's Neighborhood", tier: "iconic", aspects: ["recurring", "topical"] },
  { season: 7, title: "Buckwheat", tier: "iconic", aspects: ["recurring"] },
  { season: 8, title: "James Brown's Celebrity Hot Tub Party", tier: "iconic", aspects: ["recurring", "music", "host"] },
  { season: 8, title: "Velvet Jones", tier: "deep_cut", aspects: ["recurring"] },
  { season: 10, title: "White Like Me", tier: "iconic", aspects: ["pretape", "topical"] },
  // S10 — Crystal/Short/Guest
  { season: 10, title: "Synchronized Swimming", tier: "iconic", aspects: ["pretape", "host"] },
  { season: 10, title: "Ed Grimley", tier: "iconic", aspects: ["recurring"] },
  // S12-15 — Hartman/Carvey
  { season: 12, title: "Church Lady debut", tier: "iconic", aspects: ["recurring", "topical"] },
  { season: 12, title: "Sweeney Sisters", tier: "deep_cut", aspects: ["recurring", "music"] },
  { season: 13, title: "Church Lady at peak", tier: "iconic", aspects: ["recurring"] },
  { season: 13, title: "Hans and Franz debut", tier: "iconic", aspects: ["recurring"] },
  { season: 14, title: "Wayne's World", tier: "iconic", aspects: ["recurring", "host"] },
  { season: 14, title: "Hans and Franz", tier: "iconic", aspects: ["recurring"] },
  { season: 14, title: "Toonces the Driving Cat", tier: "deep_cut", aspects: ["recurring"] },
  { season: 15, title: "Wayne's World — Garth's Wedding", tier: "iconic", aspects: ["recurring"] },
  { season: 15, title: "Carvey's Bush 41", tier: "iconic", aspects: ["impressions", "topical"] },
  // S16-20 — Sandler/Farley
  { season: 16, title: "Wayne's World", tier: "iconic", aspects: ["recurring"] },
  { season: 16, title: "Stuart Smalley debut", tier: "iconic", aspects: ["recurring"] },
  { season: 16, title: "Pat debut", tier: "deep_cut", aspects: ["recurring"] },
  { season: 17, title: "Coffee Talk debut", tier: "iconic", aspects: ["recurring"] },
  { season: 17, title: "Hans and Franz pump up Schwarzenegger", tier: "iconic", aspects: ["recurring", "host"] },
  { season: 18, title: "Matt Foley — van down by the river", tier: "iconic", aspects: ["recurring"] },
  { season: 18, title: "Opera Man", tier: "iconic", aspects: ["update", "recurring"] },
  { season: 21, title: "Spartan Cheerleaders debut", tier: "iconic", aspects: ["recurring"] },
  { season: 19, title: "Hartman's farewell shows", tier: "deep_cut", aspects: ["host"] },
  { season: 20, title: "Norm takes Update", tier: "iconic", aspects: ["update"] },
  { season: 20, title: "Sandler's Hanukkah Song", tier: "deep_cut", aspects: ["update", "music"] },
  // S21-25 — Reborn era
  { season: 21, title: "Spartan Cheerleaders", tier: "iconic", aspects: ["recurring"] },
  { season: 21, title: "Mary Katherine Gallagher debut", tier: "iconic", aspects: ["recurring"] },
  { season: 22, title: "Celebrity Jeopardy debut", tier: "iconic", aspects: ["recurring", "host"] },
  { season: 22, title: "Mango", tier: "deep_cut", aspects: ["recurring"] },
  { season: 22, title: "Goat Boy", tier: "deep_cut", aspects: ["recurring"] },
  { season: 23, title: "Roxbury Guys", tier: "iconic", aspects: ["recurring"] },
  { season: 23, title: "Mary Katherine Gallagher peak", tier: "iconic", aspects: ["recurring"] },
  { season: 23, title: "Norm's last Update", tier: "deep_cut", aspects: ["update", "loose"] },
  { season: 24, title: "Spartan Cheerleaders", tier: "iconic", aspects: ["recurring"] },
  { season: 25, title: "Celebrity Jeopardy: Turd Ferguson", tier: "iconic", aspects: ["recurring", "host"] },
  { season: 25, title: "More Cowbell", tier: "iconic", aspects: ["recurring", "host"] },
  { season: 25, title: "Celebrity Jeopardy peak", tier: "iconic", aspects: ["recurring", "host"] },
  { season: 26, title: "Janet Reno's Dance Party finale", tier: "deep_cut", aspects: ["recurring", "topical"] },
  // S26-30
  { season: 26, title: "Tina Fey & Jimmy Fallon Update", tier: "iconic", aspects: ["update"] },
  { season: 26, title: "Ferrell's Bush 43", tier: "iconic", aspects: ["impressions", "topical"] },
  { season: 27, title: "Mayor Giuliani opens the show", tier: "iconic", aspects: ["cold-open", "topical"] },
  { season: 27, title: "Ferrell's farewell", tier: "iconic", aspects: ["host"] },
  { season: 29, title: "Debbie Downer", tier: "iconic", aspects: ["recurring", "loose"] },
  { season: 29, title: "Cork Soakers with Janet Jackson", tier: "iconic", aspects: ["recurring", "host"] },
  { season: 30, title: "Tina & Amy Update debut", tier: "iconic", aspects: ["update"] },
  // S31-35 — Lonely Island
  { season: 31, title: "Lazy Sunday", tier: "iconic", aspects: ["pretape"] },
  { season: 31, title: "Natalie Portman's rap", tier: "iconic", aspects: ["pretape", "host"] },
  { season: 31, title: "Two A-Holes", tier: "deep_cut", aspects: ["recurring", "ten-to-one"] },
  { season: 32, title: "Dick in a Box", tier: "iconic", aspects: ["pretape", "host", "music"] },
  { season: 32, title: "Peyton Manning's United Way", tier: "iconic", aspects: ["pretape", "host"] },
  { season: 32, title: "Bronx Beat", tier: "deep_cut", aspects: ["recurring"] },
  { season: 33, title: "Iran So Far", tier: "iconic", aspects: ["pretape", "topical"] },
  { season: 34, title: "Jizz In My Pants", tier: "iconic", aspects: ["pretape", "music"] },
  { season: 34, title: "Sarah Palin opens the show", tier: "iconic", aspects: ["cold-open", "impressions", "topical"] },
  { season: 34, title: "I'm On a Boat", tier: "iconic", aspects: ["pretape", "music"] },
  { season: 34, title: "Motherlover", tier: "deep_cut", aspects: ["pretape", "music"] },
  { season: 35, title: "Stefon debut", tier: "iconic", aspects: ["update", "recurring"] },
  { season: 32, title: "MacGruber debut", tier: "deep_cut", aspects: ["recurring"] },
  { season: 35, title: "MacGruber movie tie-in sketches", tier: "deep_cut", aspects: ["recurring"] },
  { season: 35, title: "Gilly", tier: "deep_cut", aspects: ["recurring"] },
  // S36-40
  { season: 36, title: "Stefon at the desk", tier: "iconic", aspects: ["update", "recurring"] },
  { season: 36, title: "What's Up With That?", tier: "iconic", aspects: ["recurring", "music"] },
  { season: 37, title: "The Californians debut", tier: "iconic", aspects: ["recurring", "loose"] },
  { season: 37, title: "Stefon peak", tier: "iconic", aspects: ["update", "recurring"] },
  { season: 37, title: "Wiig's Sue (the surprise lady)", tier: "deep_cut", aspects: ["recurring"] },
  { season: 37, title: "Drunk Uncle debut", tier: "iconic", aspects: ["update", "recurring"] },
  { season: 38, title: "Stefon farewell at the desk", tier: "iconic", aspects: ["update", "recurring", "loose"] },
  { season: 39, title: "Drunk Uncle at the desk", tier: "iconic", aspects: ["update", "recurring"] },
  { season: 39, title: "Pharoah's Obama", tier: "iconic", aspects: ["impressions", "topical"] },
  { season: 39, title: "Mooney's Inside SoCal", tier: "deep_cut", aspects: ["pretape", "ten-to-one"] },
  { season: 40, title: "McKinnon's Hillary debut", tier: "iconic", aspects: ["impressions", "topical"] },
  { season: 40, title: "Jost & Che take Update", tier: "iconic", aspects: ["update"] },
  // S41-46 — Trump I era
  { season: 41, title: "Trump hosts", tier: "iconic", aspects: ["host", "topical"] },
  { season: 39, title: "Black Jeopardy debut", tier: "iconic", aspects: ["recurring", "topical"] },
  { season: 41, title: "Strong's Cathy Anne", tier: "deep_cut", aspects: ["update", "recurring"] },
  { season: 42, title: "David S. Pumpkins", tier: "iconic", aspects: ["recurring", "ten-to-one", "host"] },
  { season: 42, title: "Black Jeopardy with Tom Hanks", tier: "iconic", aspects: ["recurring", "host", "topical"] },
  { season: 42, title: "Hallelujah cold open", tier: "iconic", aspects: ["cold-open", "topical"] },
  { season: 42, title: "Baldwin's Trump", tier: "deep_cut", aspects: ["cold-open", "impressions", "topical"] },
  { season: 43, title: "Diner Lobster with Mulaney", tier: "iconic", aspects: ["host", "pretape"] },
  { season: 43, title: "Welcome to Hell", tier: "iconic", aspects: ["pretape", "music"] },
  { season: 42, title: "Wells for Boys (Emma Stone)", tier: "iconic", aspects: ["pretape", "ten-to-one"] },
  { season: 44, title: "McKinnon doing every impression", tier: "deep_cut", aspects: ["impressions"] },
  { season: 45, title: "Sara Lee Instagram", tier: "iconic", aspects: ["pretape"] },
  { season: 45, title: "COVID remote monologues", tier: "deep_cut", aspects: ["loose", "topical"] },
  { season: 46, title: "Bowen Yang as the Iceberg", tier: "iconic", aspects: ["update", "recurring"] },
  { season: 46, title: "Maya as Kamala", tier: "iconic", aspects: ["impressions", "topical"] },
  // S47-51
  { season: 47, title: "Please Don't Destroy: Hard Seltzer", tier: "iconic", aspects: ["pretape"] },
  { season: 47, title: "Sarah Sherman pieces", tier: "iconic", aspects: ["ten-to-one", "loose"] },
  { season: 47, title: "Three Sad Virgins", tier: "deep_cut", aspects: ["pretape", "host", "music"] },
  { season: 48, title: "Marcello arrives", tier: "iconic", aspects: ["recurring"] },
  { season: 48, title: "Strong's farewell", tier: "iconic", aspects: ["recurring", "loose"] },
  { season: 48, title: "Lisa from Temecula", tier: "deep_cut", aspects: ["recurring"] },
  { season: 50, title: "Domingo (Beyond Bachelorette)", tier: "iconic", aspects: ["recurring"] },
  { season: 49, title: "JAJ's Trump cemented", tier: "iconic", aspects: ["impressions", "cold-open", "topical"] },
  { season: 49, title: "Sarah Sherman cooks", tier: "deep_cut", aspects: ["ten-to-one", "loose"] },
  { season: 50, title: "SNL50 anniversary specials", tier: "iconic", aspects: ["host"] },
  { season: 50, title: "Maya returns as Kamala", tier: "iconic", aspects: ["impressions", "topical"] },
  { season: 51, title: "1000th episode", tier: "iconic", aspects: ["host"] },
  { season: 51, title: "Bad Bunny parent-teacher conference", tier: "iconic", aspects: ["host", "topical"] },
  { season: 51, title: "Bowen's farewell", tier: "deep_cut", aspects: ["host", "loose"] },
];

export function pickSketches(season, picks, n = 3) {
  const seasonSketches = SKETCHES.filter((s) => s.season === season);
  if (seasonSketches.length === 0) return [];

  const aspectsPick = picks[ASPECT_ROUND_INDEX];
  const userAspects = aspectsPick?.value || [];

  const scored = seasonSketches.map((s) => ({
    ...s,
    overlap: s.aspects.filter((a) => userAspects.includes(a)).length,
  }));
  // Sort: most aspect overlap first; iconic before deep_cut as a tiebreaker
  // (iconic = more findable on YouTube); finally stable order.
  scored.sort((a, b) => {
    if (b.overlap !== a.overlap) return b.overlap - a.overlap;
    if (a.tier !== b.tier) return a.tier === "iconic" ? -1 : 1;
    return 0;
  });
  return scored.slice(0, n);
}

export function sketchYouTubeUrl(sketch) {
  // Quoted phrase + year forces YouTube to surface specific sketches rather than
  // random uploads. "Saturday Night Live" reads more reliably in the YouTube
  // index than "SNL," especially for older content.
  const meta = SEASONS[sketch.season];
  const year = meta ? meta.year : "";
  const q = `Saturday Night Live "${sketch.title}" ${year}`.trim();
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

export function pickCrossSeasonSketches(winningSeason, picks, n = 4) {
  const aspectsPick = picks[ASPECT_ROUND_INDEX];
  const userAspects = aspectsPick?.value || [];
  if (userAspects.length === 0) return [];

  const scored = SKETCHES
    .filter((s) => s.season !== winningSeason)
    .map((s) => ({
      ...s,
      overlap: s.aspects.filter((a) => userAspects.includes(a)).length,
    }))
    .filter((s) => s.overlap > 0)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      if (a.tier !== b.tier) return a.tier === "iconic" ? -1 : 1;
      return a.season - b.season;
    });

  // Diversify: at most one sketch per season so the list spans eras.
  const seen = new Set();
  const result = [];
  for (const s of scored) {
    if (seen.has(s.season)) continue;
    result.push(s);
    seen.add(s.season);
    if (result.length >= n) break;
  }
  return result;
}

/* ============================================================
   QUOTES
   ============================================================ */
export const LORNE_QUOTE = {
  text: "Generally when people talk about the best cast I think, 'Well, that's when they were in high school.' Because in high school you have the least amount of power you're ever gonna have. Staying up with friends later on a Saturday is great, and people attach to a cast.",
  attrib: "Lorne Michaels, on why everyone insists their cast was the best.",
};

/* ============================================================
   ARCHETYPES
   ============================================================ */
export const ARCHETYPES = {
  "cold-open": { name: "The C-Span Diehard", line: "You're here for the cold open. The show is at its best when it's making sense of the week." },
  "update": { name: "The Update Loyalist", line: "The desk is the heart of the show. Everything else is appetizer." },
  "recurring": { name: "The Catchphrase Connoisseur", line: "You quote sketches verbatim. The recurring bit is the religion." },
  "host": { name: "The Host Watcher", line: "A great host episode is event TV for you. The right guest unlocks something nothing else can." },
  "pretape": { name: "The Sunday-Morning Clip-Watcher", line: "You want it polished, viral, and rewatchable. The pre-tape is the future." },
  "music": { name: "The Saturday Night DJ", line: "The musical guest is half the reason you're up. The band matters as much as the cast." },
  "ten-to-one": { name: "The 12:55 AM Citizen", line: "You're up for the weird stuff. The 10-to-1 is where the show takes its real risks." },
  "impressions": { name: "The Impression Scholar", line: "Decades of presidents and pop stars. You can rank every Trump and Clinton in order." },
  "topical": { name: "The Newsroom Loyalist", line: "You watch SNL like the news. The political moment is the show's reason to exist." },
  "loose": { name: "The Live-Wire Patron", line: "You're here for the danger. The unrehearsed glance, the breaking laugh, the sketch that almost fell apart." },
};

export function archetypeFromPicks(picks) {
  const aspectsPick = picks[ASPECT_ROUND_INDEX];
  if (!aspectsPick || !aspectsPick.value || aspectsPick.value.length === 0) {
    return { name: "The Devotee", line: "You love what you love. SNL is in your bones." };
  }
  // Use the first aspect they picked — their top priority
  const primaryAspect = aspectsPick.value[0];
  return ARCHETYPES[primaryAspect] || ARCHETYPES["recurring"];
}

/* ============================================================
   SCORING
   ============================================================ */
export const CAST_BOOST = 40;

/* ------------------------------------------------------------
   SEASON GRAVITY

   The weight tables were written by hand over months, and famous
   seasons picked up far more mentions than obscure ones: S42 can
   collect roughly twelve times what S6 can. Left alone, that means a
   user with taste spread across eras drifts to S42 no matter what
   they actually like, because S42 is in everything.

   So: add up every positive point each season could collect if the
   user picked every answer on the quiz, compare each season to the
   median, and divide that season's question points by the square
   root of the ratio. A point aimed at a heavy season is worth less;
   a point aimed at a starved season is worth more; seasons near the
   median are untouched.

   The square root is deliberate. A season with a deep catalog of
   famous moments should still win a little more often than a season
   nobody remembers, so this corrects the head start rather than
   erasing it. Raise GRAVITY_EXPONENT toward 1 to flatten harder,
   lower it toward 0 to turn this off.

   Cast picks are excluded. Picking Farley should mean the same thing
   regardless of how well-documented his seasons happen to be
   elsewhere in the quiz.
   ------------------------------------------------------------ */
const GRAVITY_EXPONENT = 0.6;
const ASPECT_MULTIPLIER = 4;
const OPTION_MULTIPLIER = 5;

// Total positive weight each season can collect across the whole quiz.
function totalAvailableWeight() {
  const total = {};
  for (let s = 1; s <= 51; s++) total[s] = 0;
  const add = (weights, multiplier) => {
    Object.entries(weights || {}).forEach(([s, v]) => {
      if (total[s] !== undefined) total[s] += v * multiplier;
    });
  };
  ASPECT_IDS.forEach((id) => {
    const a = ASPECTS[id];
    add(a.weight, ASPECT_MULTIPLIER);
    a.subQuestion.options.forEach((o) => add(o.weight, OPTION_MULTIPLIER));
  });
  ADAPTIVE_POOL.filter((q) => !q.negate).forEach((q) => {
    q.options.forEach((o) => add(o.weight, OPTION_MULTIPLIER));
  });
  return total;
}

// Per-season divisor, computed once at module load.
export const GRAVITY_DIVISOR = (() => {
  const total = totalAvailableWeight();
  const values = Object.values(total).filter((v) => v > 0).sort((a, b) => a - b);
  const median = values.length
    ? values.length % 2
      ? values[(values.length - 1) / 2]
      : (values[values.length / 2 - 1] + values[values.length / 2]) / 2
    : 1;
  const divisor = {};
  for (let s = 1; s <= 51; s++) {
    // A season no answer points to gets a divisor of 1 rather than 0.
    // Step 3 of the audit gives those seasons real options to collect.
    const raw = total[s] > 0 ? Math.pow(total[s] / median, GRAVITY_EXPONENT) : 1;
    // Clamped at 1: heavy seasons shrink, light seasons are left alone rather
    // than amplified. Prevents the correction from overshooting into seasons
    // that are thinly covered because little happened, not because of an
    // oversight in the tables.
    divisor[s] = Math.max(1, raw);
  }
  return divisor;
})();

export function scoreFromPicks(picks) {
  const scores = {};
  for (let s = 1; s <= 51; s++) scores[s] = 0;
  picks.forEach((p) => {
    if (p.type === "multi-cast") {
      p.value.forEach((name) => {
        const ss = seasonsFor(name);
        if (ss.length === 0) return;
        const per = CAST_BOOST / ss.length;
        // Not divided: a cast pick means what it means.
        ss.forEach((s) => { scores[s] += per; });
      });
    } else if (p.type === "aspects") {
      // p.value is array of aspect IDs
      p.value.forEach((aspectId) => {
        const a = ASPECTS[aspectId];
        if (!a) return;
        Object.entries(a.weight || {}).forEach(([s, v]) => {
          scores[parseInt(s)] += (v * ASPECT_MULTIPLIER) / GRAVITY_DIVISOR[s];
        });
      });
    } else {
      // Single-option pick: sub-question or adaptive. Adaptive questions
      // flagged `negate: true` apply weight as a deduction instead of a boost.
      const adaptiveQ = p.adaptiveId ? ADAPTIVE_POOL.find((q) => q.id === p.adaptiveId) : null;
      const sign = adaptiveQ?.negate ? -1 : 1;
      const w = p.value.weight || {};
      Object.entries(w).forEach(([s, v]) => {
        scores[parseInt(s)] += (v * OPTION_MULTIPLIER * sign) / GRAVITY_DIVISOR[s];
      });
    }
  });
  return scores;
}

export function topSeasons(scores, n = 3) {
  return Object.entries(scores)
    .map(([s, v]) => ({ season: parseInt(s), score: v }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

export function tradeOffsFor(season, picks) {
  const castPick = picks.find((p) => p.type === "multi-cast");
  if (!castPick) return [];
  return castPick.value.filter((name) => {
    const ss = seasonsFor(name);
    if (ss.length === 0) return false;
    return !ss.includes(season);
  });
}

export function predictAge(season) {
  const meta = SEASONS[season];
  if (!meta) return null;
  const low = 2026 - (meta.end - 18);
  const high = 2026 - (meta.year - 14);
  return { ageMin: Math.min(low, high), ageMax: Math.max(low, high) };
}

export const youtubeLink = (s) => {
  const meta = SEASONS[s];
  const yearStr = meta ? `${meta.year}-${meta.end}` : `season ${s}`;
  const q = `Saturday Night Live ${yearStr} best sketches`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
};
export const peacockLink = (s) => `https://www.peacocktv.com/watch-online/tv/saturday-night-live/8885992813767211112/seasons/${s}`;

/* ============================================================
   ADAPTIVE QUESTION SELECTION
   Picks the question whose options most differently affect
   the user's current top season candidates. Higher
   "preferred-option diversity" = more discriminating.
   ============================================================ */
export function pickNextAdaptive(picks, usedIds) {
  const scores = scoreFromPicks(picks);
  const top = topSeasons(scores, 5).filter((t) => t.score > 0);
  if (top.length === 0) {
    // No info yet — fall back to first unused question
    return ADAPTIVE_POOL.find((q) => !usedIds.includes(q.id));
  }

  const pool = ADAPTIVE_POOL.filter((q) => !usedIds.includes(q.id));
  if (pool.length === 0) return null;

  let best = null;
  let bestDiscrim = -1;
  let bestSpread = -1;
  for (const q of pool) {
    // For each top candidate, find which option boosts it most
    const preferred = top.map((t) => {
      let bestIdx = -1;
      let bestVal = -1;
      q.options.forEach((opt, idx) => {
        const v = (opt.weight || {})[t.season] || 0;
        if (v > bestVal) {
          bestVal = v;
          bestIdx = idx;
        }
      });
      return bestIdx;
    });
    const distinct = new Set(preferred).size;
    // Tiebreak: spread = total option-weight variance across top seasons
    const spread = q.options.reduce((acc, opt) => {
      const total = top.reduce((s, t) => s + ((opt.weight || {})[t.season] || 0), 0);
      return acc + total;
    }, 0);
    if (distinct > bestDiscrim || (distinct === bestDiscrim && spread > bestSpread)) {
      bestDiscrim = distinct;
      bestSpread = spread;
      best = q;
    }
  }
  return best || pool[0];
}

export const ASPECT_ROUND_INDEX = 0;
export const SUB_QUESTION_START = 1; // rounds 1, 2, 3 are aspect sub-questions
export const CAST_ROUND_INDEX = 4;
export const ADAPTIVE_START = 5;
export const ADAPTIVE_ROUND_COUNT = 4;
export const TOTAL_ROUNDS = 9; // aspect + 3 subs + cast + 4 adaptive


/* ============================================================
   ASPECT -> ADAPTIVE SKIP MAP
   If a user already answered an aspect's sub-question, the
   adaptive round should not ask them the same thing again.
   Exported so the simulator uses the same map the app does.
   ============================================================ */
export function coveredByAspects(aspectIds) {
  return (aspectIds || []).flatMap((id) => {
    if (id === "update") return ["update"];
    if (id === "host") return ["host-era"];
    if (id === "impressions") return ["impression"];
    if (id === "ten-to-one") return ["ten-to-one"];
    return [];
  });
}
