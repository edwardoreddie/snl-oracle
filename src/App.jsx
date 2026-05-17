import { useState, useMemo, useEffect } from "react";

/* ============================================================
   CAST TENURE — [firstSeason, lastSeason] inclusive
   Covers every credited cast & featured player from S1 (1975) to
   S51 (2025–26). Single-season featured players who were in the
   official credits are included.
   ============================================================ */
const CAST_TENURE = {
  // S1–S5 — Original cast
  "John Belushi": [1, 4],
  "Dan Aykroyd": [1, 4],
  "Chevy Chase": [1, 2],
  "Jane Curtin": [1, 5],
  "Garrett Morris": [1, 5],
  "Laraine Newman": [1, 5],
  "Gilda Radner": [1, 5],
  "Bill Murray": [2, 5],
  "Don Novello": [5, 11],
  "Brian Doyle-Murray": [5, 8],
  "Harry Shearer": [5, 10],
  // S6 — The total reset under Jean Doumanian
  "Denny Dillon": [6, 6],
  "Gilbert Gottfried": [6, 6],
  "Gail Matthius": [6, 6],
  "Joe Piscopo": [6, 9],
  "Ann Risley": [6, 6],
  "Charles Rocket": [6, 6],
  "Eddie Murphy": [6, 9],
  "Yvonne Hudson": [6, 6],
  "Patrick Weathers": [6, 6],
  // S7–S10 — Ebersol years
  "Tim Kazurinsky": [7, 9],
  "Tony Rosato": [6, 7],
  "Robin Duke": [6, 9],
  "Mary Gross": [7, 10],
  "Brad Hall": [8, 10],
  "Julia Louis-Dreyfus": [8, 10],
  "Gary Kroeger": [8, 10],
  "Jim Belushi": [9, 10],
  "Billy Crystal": [10, 10],
  "Christopher Guest": [10, 10],
  "Rich Hall": [10, 10],
  "Martin Short": [10, 10],
  "Pamela Stephenson": [10, 10],
  // S11 — Lorne returns; the wilderness year
  "Joan Cusack": [11, 11],
  "Robert Downey Jr.": [11, 11],
  "Nora Dunn": [11, 15],
  "Anthony Michael Hall": [11, 11],
  "Jon Lovitz": [11, 15],
  "Dennis Miller": [11, 16],
  "Randy Quaid": [11, 11],
  "Terry Sweeney": [11, 11],
  "Danitra Vance": [11, 11],
  "Damon Wayans": [11, 11],
  "Al Franken": [11, 20],
  // S12–S19 — Hartman/Carvey era
  "A. Whitney Brown": [12, 16],
  "Dana Carvey": [12, 18],
  "Phil Hartman": [12, 19],
  "Jan Hooks": [12, 16],
  "Victoria Jackson": [12, 17],
  "Kevin Nealon": [12, 20],
  "Mike Myers": [15, 20],
  "Chris Farley": [16, 20],
  "Chris Rock": [16, 18],
  "Adam Sandler": [16, 20],
  "Rob Schneider": [16, 19],
  "David Spade": [16, 21],
  "Julia Sweeney": [16, 19],
  "Beth Cahill": [17, 17],
  "Ellen Cleghorne": [17, 20],
  "Siobhan Fallon": [17, 17],
  "Melanie Hutsell": [17, 19],
  "Tim Meadows": [17, 25],
  "Jay Mohr": [17, 19],
  "Sarah Silverman": [19, 19],
  "Norm Macdonald": [19, 23],
  // S20 — The widely-panned year
  "Janeane Garofalo": [20, 20],
  "Laura Kightlinger": [20, 20],
  "Michael McKean": [20, 20],
  "Morwenna Banks": [20, 20],
  // S21–S27 — Ferrell era
  "Will Ferrell": [21, 27],
  "Darrell Hammond": [21, 34],
  "Cheri Oteri": [21, 25],
  "Jim Breuer": [21, 23],
  "David Koechner": [21, 21],
  "Mark McKinney": [21, 22],
  "Colin Quinn": [21, 25],
  "Molly Shannon": [21, 26],
  "Nancy Walls": [21, 21],
  "Chris Kattan": [21, 27],
  "Ana Gasteyer": [22, 27],
  "Tracy Morgan": [22, 28],
  "Jimmy Fallon": [24, 29],
  "Chris Parnell": [24, 31],
  "Horatio Sanz": [24, 31],
  "Rachel Dratch": [25, 31],
  "Tina Fey": [26, 31],
  "Jerry Minor": [26, 26],
  "Maya Rudolph": [26, 33],
  "Amy Poehler": [27, 33],
  "Dean Edwards": [27, 28],
  "Jeff Richards": [27, 29],
  "Seth Meyers": [27, 39],
  // S28–S37 — Lonely Island era
  "Fred Armisen": [28, 39],
  "Will Forte": [28, 35],
  "Finesse Mitchell": [29, 31],
  "Kenan Thompson": [29, 51],
  "Rob Riggle": [30, 30],
  "Jason Sudeikis": [30, 38],
  "Andy Samberg": [31, 37],
  "Bill Hader": [31, 38],
  "Kristen Wiig": [31, 37],
  "Casey Wilson": [34, 34],
  "Michaela Watkins": [34, 34],
  "Abby Elliott": [34, 37],
  "Bobby Moynihan": [34, 43],
  "Jenny Slate": [35, 35],
  "Nasim Pedrad": [35, 39],
  "Vanessa Bayer": [36, 42],
  "Paul Brittain": [36, 37],
  "Taran Killam": [36, 41],
  "Jay Pharoah": [36, 41],
  // S38–S47 — McKinnon era
  "Tim Robinson": [38, 38],
  "Kate McKinnon": [38, 47],
  "Aidy Bryant": [38, 47],
  "Cecily Strong": [38, 48],
  "Mike O'Brien": [38, 39],
  "Brooks Wheelan": [39, 39],
  "John Milhiser": [39, 39],
  "Noël Wells": [39, 39],
  "Sasheer Zamata": [39, 42],
  "Beck Bennett": [39, 46],
  "Kyle Mooney": [39, 47],
  "Colin Jost": [39, 51],
  "Michael Che": [40, 51],
  "Pete Davidson": [40, 47],
  "Leslie Jones": [40, 45],
  "Jon Rudnitsky": [41, 41],
  "Melissa Villaseñor": [42, 47],
  "Mikey Day": [42, 51],
  "Alex Moffat": [42, 47],
  "Heidi Gardner": [43, 51],
  "Chris Redd": [43, 47],
  "Luke Null": [43, 43],
  "Ego Nwodim": [44, 51],
  // S45–S51 — Now era
  "Bowen Yang": [45, 51],
  "Chloe Fineman": [45, 51],
  "Andrew Dismukes": [46, 51],
  "Punkie Johnson": [46, 49],
  "Lauren Holt": [46, 46],
  "Sarah Sherman": [47, 51],
  "James Austin Johnson": [47, 51],
  "Aristotle Athari": [47, 47],
  "Ben Marshall": [47, 51],
  "John Higgins": [47, 51],
  "Martin Herlihy": [47, 51],
  "Marcello Hernández": [48, 51],
  "Devon Walker": [48, 49],
  "Molly Kearney": [48, 48],
  "Michael Longfellow": [48, 51],
  "Emil Wakim": [50, 51],
  "Jane Wickline": [50, 51],
  "Ashley Padilla": [50, 51],
  "Tommy Brennan": [51, 51],
  "Kam Patterson": [51, 51],
  "Veronika Slowikowska": [51, 51],
};

// Alphabetize by last name (handles diacritics via locale-aware compare)
const ALL_CAST = Object.keys(CAST_TENURE).sort((a, b) => {
  const lastA = a.split(" ").pop();
  const lastB = b.split(" ").pop();
  return lastA.localeCompare(lastB, "en", { sensitivity: "base" });
});

const seasonsFor = (name) => {
  const t = CAST_TENURE[name];
  if (!t) return [];
  const [a, b] = t;
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
};

/* ============================================================
   SEASON METADATA
   ============================================================ */
const SEASONS = {
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
  15: { year: 1989, end: 1990, tag: "Mike Myers joins. Carvey doing Bush 41. Massive cultural footprint." },
  16: { year: 1990, end: 1991, tag: "Sandler, Farley, Rock, Spade, Sweeney as featured. The bench gets stacked." },
  17: { year: 1991, end: 1992, tag: "Wayne's World goes to film. Schwarzenegger pumps up with Hans and Franz. Pat debuts." },
  18: { year: 1992, end: 1993, tag: "Farley as Matt Foley van down by the river. Sandler's Opera Man. The bad-boys era hits stride." },
  19: { year: 1993, end: 1994, tag: "Hartman's farewell. Norm takes Update. Spartan Cheerleaders debut. Major transition." },
  20: { year: 1994, end: 1995, tag: "The widely-panned year. Critics calling for the show's death. Massive turnover coming." },
  21: { year: 1995, end: 1996, tag: "Total reboot. Ferrell, Oteri, Hammond, McKinney, Koechner, Quinn arrive. The show is reborn." },
  22: { year: 1996, end: 1997, tag: "Celebrity Jeopardy debuts. Mango. Spartan Cheerleaders. Tracy Morgan and Ana Gasteyer join." },
  23: { year: 1997, end: 1998, tag: "Norm's last year on Update before he's fired. Roxbury Guys. Mary Katherine Gallagher peaks." },
  24: { year: 1998, end: 1999, tag: "Fallon, Sanz, Parnell join. Colin Quinn takes Update. Ferrell and Oteri at full power." },
  25: { year: 1999, end: 2000, tag: "More Cowbell drops. 25th anniversary special. Ferrell at his apex. The show is must-see again." },
  26: { year: 2000, end: 2001, tag: "Tina Fey takes Update with Jimmy Fallon. Maya Rudolph joins. Bush vs Gore cold opens." },
  27: { year: 2001, end: 2002, tag: "Post-9/11 season. Mayor Giuliani opens the show. Ferrell's final year. Poehler and Seth join." },
  28: { year: 2002, end: 2003, tag: "Forte and Armisen arrive. Ferrell era done. The show searches for a new identity." },
  29: { year: 2003, end: 2004, tag: "Tina and Jimmy on Update at peak. Debbie Downer. Kenan Thompson joins." },
  30: { year: 2004, end: 2005, tag: "Tina and Amy take the desk together. Sudeikis as featured. Bush re-elected and lampooned." },
  31: { year: 2005, end: 2006, tag: "Lazy Sunday drops and the internet changes the show forever. Hader, Wiig, Samberg as rookies." },
  32: { year: 2006, end: 2007, tag: "Dick in a Box. Seth and Amy launch on Update. Peyton Manning's United Way. Lonely Island ignites." },
  33: { year: 2007, end: 2008, tag: "Writers strike year. Iran So Far. Poehler's farewell run. The cast at maximum density." },
  34: { year: 2008, end: 2009, tag: "Palin season. Tina returns weekly. Election cold opens become event television." },
  35: { year: 2009, end: 2010, tag: "Forte's farewell year. Wiig and Hader cement. Andy Samberg and Lonely Island still cooking." },
  36: { year: 2010, end: 2011, tag: "Bayer, Killam, Pharoah arrive. Stefon emerges. Wiig's last hurrah approaches." },
  37: { year: 2011, end: 2012, tag: "Wiig and Samberg's farewell. Stefon at peak. The Californians. Timberlake joins Five-Timers." },
  38: { year: 2012, end: 2013, tag: "McKinnon, Strong, Bryant, Bennett, Mooney as featured. Hader and Armisen's last year. Massive transition." },
  39: { year: 2013, end: 2014, tag: "Strong on Update. Drunk Uncle. Pharoah's Obama. Mooney's awkward pre-tapes. Fallon hosts to send off Fey." },
  40: { year: 2014, end: 2015, tag: "Jost and Che debut on Update. McKinnon's Hillary. The 40th Anniversary special. Pete Davidson arrives." },
  41: { year: 2015, end: 2016, tag: "Trump hosts during his campaign. Black Jeopardy hits its stride. Strong's Cathy Anne." },
  42: { year: 2016, end: 2017, tag: "Trump cold opens become defining. Baldwin and McKinnon's Hillary. Black Jeopardy with Tom Hanks. David S. Pumpkins." },
  43: { year: 2017, end: 2018, tag: "Mikey Day, Heidi Gardner. McKinnon's Kellyanne and Jeff Sessions. Diner Lobster with Mulaney." },
  44: { year: 2018, end: 2019, tag: "Mulaney hosts twice. Bowen Yang as writer. McKinnon doing every guest impression. Pete Davidson era." },
  45: { year: 2019, end: 2020, tag: "Bowen Yang joins. COVID hits in March. The show goes remote for the first time ever." },
  46: { year: 2020, end: 2021, tag: "Pandemic season. Jim Carrey as Biden. Maya Rudolph wins Emmy as Kamala. Election cold opens again." },
  47: { year: 2021, end: 2022, tag: "Please Don't Destroy debut. Sarah Sherman arrives. McKinnon, Bryant, Mooney, Davidson all leave at year's end." },
  48: { year: 2022, end: 2023, tag: "Marcello Hernández. Massive cast turnover. Strong's farewell. Total identity reset." },
  49: { year: 2023, end: 2024, tag: "Post-strike return. Sarah Sherman, Bowen Yang, Marcello in their bag. JAJ's Trump cemented." },
  50: { year: 2024, end: 2025, tag: "50th anniversary season. SNL50 special airs. Maya returns as Kamala. Old guard returns en masse." },
  51: { year: 2025, end: 2026, tag: "1000th episode. Bowen's farewell after Christmas. Five new featured players. Will Ferrell hosts the finale." },
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
const ASPECTS = {
  "cold-open": {
    label: "Cold opens",
    sub: "Politics, impressions, Live From New York",
    weight: { 14: 1, 15: 2, 21: 1, 22: 1, 24: 1, 25: 1, 26: 2, 27: 3, 34: 4, 41: 2, 42: 4, 43: 3, 44: 2, 45: 2, 46: 3, 47: 2, 48: 2, 49: 2, 50: 2, 51: 1 },
    subQuestion: {
      id: "cold-open-style",
      title: "COLD OPEN ENERGY",
      prompt: "What lights you up about a cold open?",
      options: [
        { label: "Pure presidential impression", sub: "Carvey-Bush. Ferrell-Bush. McKinnon-Hillary. JAJ-Trump.", weight: { 14: 2, 15: 3, 22: 2, 24: 2, 25: 2, 26: 3, 27: 3, 40: 2, 41: 2, 42: 3, 47: 2, 48: 2, 49: 3, 50: 2 } },
        { label: "Dramatic event response", sub: "Mayor Giuliani after 9/11. McKinnon's Hallelujah. Maya as Kamala.", weight: { 27: 4, 42: 4, 46: 3 } },
        { label: "Political satire takedown", sub: "Palin sketches. Trump-Tower entry. Baldwin-as-Trump.", weight: { 34: 4, 41: 3, 42: 4, 43: 3, 44: 2, 45: 2, 46: 3 } },
        { label: "Absurd or off-political premise", sub: "When SNL opens with something weird instead.", weight: { 36: 2, 37: 2, 43: 1, 44: 1, 47: 2, 48: 2, 49: 1, 50: 1 } },
      ],
    },
  },
  "update": {
    label: "Weekend Update",
    sub: "The desk, the jokes, the correspondents",
    weight: { 1: 2, 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 20: 1, 21: 3, 22: 3, 23: 3, 24: 2, 25: 2, 26: 3, 27: 3, 28: 2, 29: 3, 30: 3, 31: 3, 32: 4, 33: 4, 34: 2, 35: 2, 36: 2, 37: 3, 38: 1, 39: 2, 40: 1, 41: 1, 42: 1, 43: 1, 44: 1, 45: 1, 46: 2, 47: 1, 48: 1, 49: 1, 50: 1, 51: 1 },
    subQuestion: {
      id: "update-style",
      title: "UPDATE STYLE",
      prompt: "What's your Update vibe?",
      options: [
        { label: "Sharp commentary with attitude", sub: "Miller smug. A. Whitney Brown editorials.", weight: { 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 1 } },
        { label: "Deadpan one-liners", sub: "Norm. Murderer's Row. Headlines as standup.", weight: { 19: 2, 20: 2, 21: 3, 22: 3, 23: 3 } },
        { label: "Warm comedic chemistry", sub: "Tina & Jimmy. Tina & Amy. The grinning best-friend energy.", weight: { 26: 3, 27: 3, 28: 3, 29: 3, 30: 3, 31: 3 } },
        { label: "Cool detached observer", sub: "Seth solo. Jost & Che bantering through the apocalypse.", weight: { 32: 2, 33: 2, 34: 3, 35: 3, 36: 3, 37: 3, 38: 2, 39: 2, 40: 2, 41: 2, 42: 2, 43: 2, 44: 2, 45: 2, 46: 2, 47: 2, 48: 2, 49: 2, 50: 2, 51: 2 } },
        { label: "Weird character correspondents", sub: "Stefon. Drunk Uncle. Forte at the desk. Bowen as the Iceberg.", weight: { 28: 1, 29: 1, 30: 1, 31: 1, 32: 1, 33: 2, 34: 2, 35: 3, 36: 3, 37: 4, 38: 3, 39: 3, 46: 3, 47: 2, 48: 2, 49: 2, 50: 1, 51: 1 } },
      ],
    },
  },
  "recurring": {
    label: "Recurring characters",
    sub: "Catchphrases, taglines, the bit you've quoted for 20 years",
    weight: { 7: 2, 8: 2, 13: 2, 14: 3, 15: 2, 17: 2, 18: 3, 22: 3, 23: 3, 24: 3, 25: 2, 29: 2, 32: 2, 36: 2, 37: 3, 38: 2, 39: 2, 42: 2, 43: 2, 47: 1 },
    subQuestion: {
      id: "recurring-type",
      title: "RECURRING TYPE",
      prompt: "Which recurring type owns you?",
      options: [
        { label: "Big personalities with catchphrases", sub: "Church Lady. Mary Katherine Gallagher. Stefon. Goat Boy.", weight: { 13: 3, 14: 2, 17: 1, 22: 3, 23: 3, 24: 3, 25: 2, 36: 2, 37: 3 } },
        { label: "Loser archetypes", sub: "Matt Foley. Hans & Franz. Roxbury Guys. Drunk Uncle.", weight: { 14: 2, 15: 2, 17: 3, 18: 4, 22: 3, 23: 3, 38: 2, 39: 2 } },
        { label: "Suburban absurdity", sub: "Wayne's World. Spartan Cheerleaders. The Californians.", weight: { 14: 3, 15: 3, 16: 3, 17: 3, 20: 1, 21: 2, 22: 3, 23: 2, 37: 3, 38: 2 } },
        { label: "Surreal weirdos", sub: "Mango. Gilly. David S. Pumpkins. The Whisperer.", weight: { 22: 2, 23: 2, 35: 2, 36: 3, 37: 3, 42: 3, 43: 2 } },
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
        { label: "Dramatic actor cutting loose", sub: "Walken. Hopkins. De Niro. Goodman.", weight: { 22: 2, 23: 2, 24: 2, 25: 3, 26: 2, 27: 2, 31: 2, 32: 2, 41: 2, 42: 2 } },
        { label: "Comedian in their prime", sub: "Mulaney. Galifianakis. Sandler returning.", weight: { 24: 1, 25: 1, 41: 1, 42: 2, 43: 3, 44: 3, 47: 1 } },
        { label: "Pop star going double duty", sub: "Timberlake. Bieber. Carpenter. Bad Bunny.", weight: { 32: 3, 33: 2, 37: 2, 49: 2, 50: 1, 51: 3 } },
        { label: "Returning legend / Five-Timer", sub: "Murray. Ferrell. Hanks. Steve Martin. Fey.", weight: { 25: 2, 31: 2, 37: 2, 40: 2, 50: 4, 51: 3 } },
        { label: "Athlete with surprising chops", sub: "Peyton. LeBron. Travis Kelce.", weight: { 32: 4, 33: 2, 49: 3 } },
      ],
    },
  },
  "pretape": {
    label: "Pre-tapes & digital shorts",
    sub: "The polished pieces that go viral on Sunday",
    weight: { 2: 1, 3: 1, 31: 4, 32: 4, 33: 3, 34: 3, 35: 3, 36: 2, 37: 2, 38: 1, 39: 2, 40: 2, 42: 2, 43: 3, 44: 2, 45: 2, 46: 3, 47: 4, 48: 2, 49: 3, 50: 2, 51: 2 },
    subQuestion: {
      id: "pretape-type",
      title: "PRE-TAPE TYPE",
      prompt: "What pre-tape would you rewatch most?",
      options: [
        { label: "Lonely Island music videos", sub: "Lazy Sunday. Dick in a Box. I'm On a Boat. Jack Sparrow.", weight: { 31: 4, 32: 4, 33: 3, 34: 3, 35: 3, 36: 2, 37: 2 } },
        { label: "Location & mockumentary bits", sub: "The Californians. Bodega Bathroom. Diner Lobster.", weight: { 37: 2, 38: 2, 43: 4, 44: 3 } },
        { label: "Awkward character pieces", sub: "Mooney's Inside SoCal. Forte solo bits. Good Neighbor.", weight: { 33: 1, 34: 1, 35: 2, 39: 3, 40: 2, 41: 2, 42: 2, 43: 2, 44: 2, 47: 2 } },
        { label: "Please Don't Destroy energy", sub: "Hard Seltzer. Hot Soup. Three Sad Virgins. The friend trio.", weight: { 47: 4, 48: 2, 49: 2, 50: 2, 51: 2 } },
        { label: "Bowen as inanimate objects", sub: "Iceberg. Brunch Aunt. Pluto. Sara Lee.", weight: { 46: 4, 47: 3, 48: 2, 49: 2, 50: 1 } },
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
        { label: "Now — K-pop, Bad Bunny, Carpenter", sub: "BTS. NewJeans. Bad Bunny in his bag. Sabrina. Olivia.", weight: { 47: 2, 48: 2, 49: 3, 50: 3, 51: 3 } },
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
        { label: "Forte goes off the rails alone", sub: "Hamilton lecturer. Closet organizer. The Falconer.", weight: { 28: 2, 29: 2, 30: 2, 31: 1, 33: 2, 34: 1, 35: 4 } },
        { label: "Armisen / Hader quiet weirdness", sub: "The Two A-holes. Vinny Vedecci.", weight: { 31: 1, 32: 1, 33: 2, 34: 1, 35: 1, 36: 1, 37: 2, 38: 2 } },
        { label: "Mooney's awkward pre-tapes", sub: "Inside SoCal. Bad Boys. The pre-tapes that died on purpose.", weight: { 39: 2, 40: 3, 41: 2, 42: 1, 43: 1, 44: 1, 47: 1 } },
        { label: "Sherman's grotesque body humor", sub: "Sherman's bits where you don't know if it's a sketch.", weight: { 47: 4, 48: 3, 49: 4, 50: 3, 51: 2 } },
        { label: "Marcello-era surrealism", sub: "Domingo. The current surreal end-of-show stuff.", weight: { 48: 3, 49: 3, 50: 2, 51: 3 } },
      ],
    },
  },
  "impressions": {
    label: "Political impressions",
    sub: "Bush. Clinton. Palin. Trump. The defining ones.",
    weight: { 14: 2, 15: 3, 18: 3, 19: 3, 22: 2, 23: 2, 24: 2, 25: 2, 26: 3, 27: 3, 34: 4, 40: 2, 41: 3, 42: 4, 43: 3, 44: 2, 45: 1, 46: 2, 47: 2, 48: 2, 49: 2, 50: 2 },
    subQuestion: {
      id: "impression-era",
      title: "IMPRESSION ERA",
      prompt: "Which impression era defines your SNL?",
      options: [
        { label: "Carvey's Bush 41", sub: "'Nah gonna do it.' 'Wouldn't be prudent.'", weight: { 14: 2, 15: 3, 16: 2 } },
        { label: "Hartman & Hammond doing Clinton", sub: "The 90s political ringers.", weight: { 18: 3, 19: 3, 22: 1, 23: 1 } },
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
    weight: { 14: 2, 15: 3, 18: 3, 19: 3, 22: 2, 23: 2, 24: 2, 25: 1, 26: 3, 27: 4, 30: 2, 34: 4, 40: 2, 41: 3, 42: 4, 43: 3, 44: 2, 45: 2, 46: 3, 49: 3, 50: 3 },
    subQuestion: {
      id: "topical-style",
      title: "POLITICAL FLAVOR",
      prompt: "What kind of political comedy fires you up?",
      options: [
        { label: "Impressions of sitting presidents", sub: "The week's biggest character — POTUS — performed back at us.", weight: { 14: 2, 15: 3, 18: 2, 19: 3, 22: 1, 23: 1, 24: 1, 25: 1, 26: 3, 27: 3, 34: 2, 41: 2, 42: 3, 43: 2, 44: 1, 45: 1, 46: 2, 49: 3, 50: 2 } },
        { label: "Election-season chaos", sub: "Palin sketches. Trump-tower entry. Conventions to results night.", weight: { 14: 1, 18: 1, 22: 1, 26: 2, 30: 2, 34: 4, 38: 1, 42: 4, 46: 3, 50: 2 } },
        { label: "Day-after-the-news cold opens", sub: "Mayor Giuliani after 9/11. Hallelujah after 2016. Real-time response.", weight: { 27: 4, 28: 1, 42: 3, 46: 3, 49: 1, 50: 1 } },
        { label: "Cabinet & Congress — not just the president", sub: "McKinnon's Sessions & Kavanaugh's Matt Damon. The supporting cast.", weight: { 22: 1, 26: 1, 41: 1, 42: 2, 43: 3, 44: 3, 45: 2, 46: 2 } },
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

const ASPECT_IDS = Object.keys(ASPECTS);

const ASPECT_ROUND = {
  type: "aspects",
  title: "ROUND 01 / WHAT YOU LIVE FOR",
  prompt: "Pick the 3 aspects of SNL you live for.",
  sub: "These shape the next three questions. Be honest — there's no wrong combination.",
  max: 3,
  min: 3,
};

const CAST_ROUND = {
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
   ============================================================ */
const ADAPTIVE_POOL = [
  {
    id: "update",
    title: "WEEKEND UPDATE",
    prompt: "Best Update desk.",
    options: [
      { label: "Chevy Chase", weight: { 1: 3, 2: 1 } },
      { label: "Dennis Miller", weight: { 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 1 } },
      { label: "Norm Macdonald", weight: { 20: 2, 21: 3, 22: 3, 23: 3 } },
      { label: "Colin Quinn", weight: { 24: 2, 25: 3, 26: 1 } },
      { label: "Tina Fey & Jimmy Fallon", weight: { 26: 3, 27: 3, 28: 3, 29: 3 } },
      { label: "Tina Fey & Amy Poehler", weight: { 30: 3, 31: 3 } },
      { label: "Seth Meyers & Amy Poehler", weight: { 32: 3, 33: 3 } },
      { label: "Seth Meyers solo", weight: { 34: 3, 35: 2, 36: 2, 37: 2, 38: 2, 39: 2 } },
      { label: "Cecily Strong & Seth Meyers", weight: { 39: 3 } },
      { label: "Colin Jost & Michael Che", weight: { 40: 2, 41: 2, 42: 2, 43: 2, 44: 2, 45: 2, 46: 2, 47: 2, 48: 2, 49: 2, 50: 2, 51: 2 } },
    ],
  },
  {
    id: "moment",
    title: "THE MOMENT",
    prompt: "Pick the moment that lives in your head.",
    options: [
      { label: "Land Shark", weight: { 1: 3, 2: 3 } },
      { label: "Two Wild and Crazy Guys", weight: { 3: 3, 4: 3 } },
      { label: "Mr. Robinson's Neighborhood", weight: { 7: 3, 8: 3, 9: 2 } },
      { label: "White Like Me", weight: { 9: 4 } },
      { label: "Church Lady", weight: { 13: 3, 14: 2, 15: 1 } },
      { label: "Hans and Franz", weight: { 14: 2, 15: 3, 17: 2 } },
      { label: "Wayne's World", weight: { 14: 3, 15: 3, 16: 3, 17: 3 } },
      { label: "Stuart Smalley", weight: { 15: 3, 16: 2 } },
      { label: "Coffee Talk", weight: { 17: 3, 18: 2 } },
      { label: "Matt Foley van down by the river", weight: { 18: 4 } },
      { label: "Spartan Cheerleaders", weight: { 20: 1, 21: 2, 22: 3, 23: 2 } },
      { label: "Roxbury Guys", weight: { 22: 3, 23: 3 } },
      { label: "Mary Katherine Gallagher", weight: { 22: 2, 23: 3, 24: 2 } },
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
      { label: "Drunk Uncle", weight: { 38: 3, 39: 3 } },
      { label: "McKinnon's Hillary cold opens", weight: { 40: 2, 41: 3, 42: 3 } },
      { label: "Black Jeopardy with Tom Hanks", weight: { 42: 4 } },
      { label: "Hallelujah cold open", weight: { 42: 4 } },
      { label: "David S. Pumpkins", weight: { 42: 4 } },
      { label: "Diner Lobster with Mulaney", weight: { 43: 4 } },
      { label: "Bowen Yang as the Iceberg", weight: { 46: 4 } },
      { label: "Please Don't Destroy: Hard Seltzer", weight: { 47: 4 } },
      { label: "Bad Bunny premiere parent-teacher", weight: { 51: 4 } },
    ],
  },
  {
    id: "sketch-type",
    title: "SKETCH TYPE",
    prompt: "Pick the sketch type you can't live without.",
    options: [
      { label: "Recurring characters with catchphrases", sub: "Wayne's World. Spartan Cheerleaders. Stefon.", weight: { 14: 2, 15: 2, 17: 2, 18: 2, 22: 2, 23: 2, 24: 2, 25: 2, 36: 2, 37: 2, 38: 1 } },
      { label: "Game show parodies", sub: "Celebrity Jeopardy. Black Jeopardy. $25,000 Pyramid.", weight: { 22: 2, 23: 2, 24: 2, 25: 2, 26: 2, 27: 2, 41: 2, 42: 3, 43: 1, 44: 1 } },
      { label: "Political cold opens", sub: "Bush. Palin. Trump. The icy gravitas of Live From New York.", weight: { 14: 1, 15: 2, 21: 1, 22: 1, 24: 1, 25: 1, 26: 1, 27: 1, 34: 3, 41: 2, 42: 3, 43: 2, 44: 1, 45: 1, 46: 2, 47: 1, 48: 1, 49: 1 } },
      { label: "Digital shorts and pre-tapes", sub: "Lazy Sunday. Dick in a Box. Please Don't Destroy.", weight: { 31: 3, 32: 3, 33: 2, 34: 1, 35: 1, 36: 1, 37: 1, 47: 2, 48: 1, 49: 1, 50: 1, 51: 1 } },
      { label: "Almost-broken weird pre-tapes", sub: "Forte solo bits. Mooney's Inside SoCal. Sherman pieces.", weight: { 30: 1, 31: 1, 32: 1, 33: 2, 34: 1, 35: 2, 38: 1, 39: 2, 40: 1, 41: 1, 47: 3, 48: 2, 49: 2 } },
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
      { label: "An old-school dramatic actor having fun", sub: "Walken. Hanks. Hopkins. Goodman.", weight: { 22: 2, 23: 2, 24: 2, 25: 2, 26: 1, 31: 1, 32: 2, 41: 1, 42: 2 } },
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
      { label: "Carvey's Bush 41", weight: { 14: 2, 15: 3, 16: 2 } },
      { label: "Hartman's Clinton", weight: { 18: 3, 19: 3 } },
      { label: "Ferrell's Bush 43", weight: { 26: 3, 27: 3 } },
      { label: "Hammond's Clinton & Trump", weight: { 22: 1, 23: 1, 24: 2, 25: 2, 26: 2 } },
      { label: "Tina Fey's Sarah Palin", weight: { 34: 4 } },
      { label: "Pharoah's Obama", weight: { 37: 2, 38: 2, 39: 2, 40: 1 } },
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
      { label: "Forte goes off the rails alone", weight: { 28: 2, 29: 2, 30: 2, 31: 1, 33: 2, 34: 1, 35: 3 } },
      { label: "Armisen and Hader do something quiet", weight: { 31: 1, 32: 1, 33: 2, 34: 1, 35: 1, 36: 1, 37: 2, 38: 2 } },
      { label: "Mooney's awkward pre-tape", weight: { 39: 2, 40: 2, 41: 2, 42: 1, 43: 1, 44: 1, 47: 1 } },
      { label: "Sarah Sherman cooks something gross", weight: { 47: 3, 48: 2, 49: 3, 50: 2, 51: 1 } },
      { label: "Bowen Yang plays an inanimate object", weight: { 45: 1, 46: 3, 47: 2, 48: 1, 49: 1, 50: 1 } },
    ],
  },
];

/* ============================================================
   QUOTES
   ============================================================ */
const QUOTES = [
  {
    text: "Generally when people talk about the best cast I think, 'Well, that's when they were in high school.' Because in high school you have the least amount of power you're ever gonna have. Staying up with friends later on a Saturday is great, and people attach to a cast.",
    attrib: "Lorne Michaels, on why everyone insists their cast was the best.",
  },
  {
    text: "People always give me a hard time about, 'Oh, the original show was so great and it's lousy now.' And I say, 'No, it's not.' The show that's on now, they do stuff that's just as good as anybody ever did, all the time.",
    attrib: "Bill Murray, defending the current cast on the New Heights podcast (2024).",
  },
];

/* ============================================================
   ARCHETYPES
   ============================================================ */
const ARCHETYPES = {
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

function archetypeFromPicks(picks) {
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
const CAST_BOOST = 40;

function scoreFromPicks(picks) {
  const scores = {};
  for (let s = 1; s <= 51; s++) scores[s] = 0;
  picks.forEach((p) => {
    if (p.type === "multi-cast") {
      p.value.forEach((name) => {
        const ss = seasonsFor(name);
        if (ss.length === 0) return;
        const per = CAST_BOOST / ss.length;
        ss.forEach((s) => { scores[s] += per; });
      });
    } else if (p.type === "aspects") {
      // p.value is array of aspect IDs
      p.value.forEach((aspectId) => {
        const a = ASPECTS[aspectId];
        if (!a) return;
        Object.entries(a.weight || {}).forEach(([s, v]) => {
          scores[parseInt(s)] += v * 4; // aspect baseline weight
        });
      });
    } else {
      const w = p.value.weight || {};
      Object.entries(w).forEach(([s, v]) => { scores[parseInt(s)] += v * 5; });
    }
  });
  return scores;
}

function topSeasons(scores, n = 3) {
  return Object.entries(scores)
    .map(([s, v]) => ({ season: parseInt(s), score: v }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

function tradeOffsFor(season, picks) {
  const castPick = picks.find((p) => p.type === "multi-cast");
  if (!castPick) return [];
  return castPick.value.filter((name) => {
    const t = CAST_TENURE[name];
    if (!t) return false;
    return season < t[0] || season > t[1];
  });
}

function predictAge(season) {
  const meta = SEASONS[season];
  if (!meta) return null;
  const low = 2026 - (meta.end - 18);
  const high = 2026 - (meta.year - 14);
  return { ageMin: Math.min(low, high), ageMax: Math.max(low, high) };
}

const youtubeLink = (s) => `https://www.youtube.com/results?search_query=SNL+season+${s}+best+sketches`;
const peacockLink = (s) => `https://www.peacocktv.com/watch-online/tv/saturday-night-live/8885992813767211112/seasons/${s}`;

/* ============================================================
   ADAPTIVE QUESTION SELECTION
   Picks the question whose options most differently affect
   the user's current top season candidates. Higher
   "preferred-option diversity" = more discriminating.
   ============================================================ */
function pickNextAdaptive(picks, usedIds) {
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

const ASPECT_ROUND_INDEX = 0;
const SUB_QUESTION_START = 1; // rounds 1, 2, 3 are aspect sub-questions
const CAST_ROUND_INDEX = 4;
const ADAPTIVE_START = 5;
const ADAPTIVE_ROUND_COUNT = 4;
const TOTAL_ROUNDS = 9; // aspect + 3 subs + cast + 4 adaptive

/* ============================================================
   WIKIPEDIA PHOTO HOOKS — uses action API with origin=*
   for guaranteed CORS. Two-phase: pageimage filename + thumb,
   then imageinfo to verify a permissive license (CC / PD).
   Filter ensures we only display freely-licensed images.
   ============================================================ */
function isPermissiveLicense(rawLicense) {
  if (!rawLicense) return false;
  const norm = String(rawLicense).toLowerCase().replace(/[-_]/g, " ");
  return (
    norm.includes("cc by") ||
    norm.includes("cc0") ||
    norm.includes("public domain") ||
    norm.includes("pdm") ||
    norm.includes("free art") ||
    norm.includes("no restrictions") ||
    norm === "pd" ||
    norm.startsWith("pd ")
  );
}

function useWikipediaPhotos(names, enabled) {
  const [photos, setPhotos] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | done | failed

  useEffect(() => {
    if (!enabled || names.length === 0) return;
    let cancelled = false;
    setStatus("loading");

    const fetchBatch = async (batch) => {
      // Phase 1: get pageimage (file name) + thumbnail per cast article.
      const titles = batch.map((n) => n.replace(/ /g, "_")).join("|");
      const phase1Url =
        `https://en.wikipedia.org/w/api.php?action=query&format=json` +
        `&titles=${encodeURIComponent(titles)}&prop=pageimages&piprop=name%7Cthumbnail&pithumbsize=240&redirects=1&origin=*`;
      let phase1;
      try {
        const res = await fetch(phase1Url);
        if (!res.ok) return false;
        phase1 = await res.json();
      } catch (e) { return false; }

      const q1 = phase1?.query || {};
      const requestedByResolved = {};
      batch.forEach((n) => { requestedByResolved[n] = n; });
      (q1.normalized || []).forEach((r) => {
        if (requestedByResolved[r.from]) requestedByResolved[r.to] = requestedByResolved[r.from];
      });
      (q1.redirects || []).forEach((r) => {
        if (requestedByResolved[r.from]) requestedByResolved[r.to] = requestedByResolved[r.from];
      });

      const candidates = [];
      Object.values(q1.pages || {}).forEach((p) => {
        if (!p?.thumbnail?.source || !p?.pageimage) return;
        const requestedName = requestedByResolved[p.title];
        if (!requestedName) return;
        candidates.push({ requestedName, file: p.pageimage, thumb: p.thumbnail.source });
      });

      if (candidates.length === 0) return true;

      // Phase 2: fetch license metadata for each pageimage File: page.
      const fileTitles = candidates.map((c) => `File:${c.file}`).join("|");
      const phase2Url =
        `https://en.wikipedia.org/w/api.php?action=query&format=json` +
        `&titles=${encodeURIComponent(fileTitles)}&prop=imageinfo&iiprop=extmetadata&origin=*`;
      let phase2;
      try {
        const res = await fetch(phase2Url);
        if (!res.ok) return true;
        phase2 = await res.json();
      } catch (e) { return true; }

      const licenseByFile = {};
      Object.values(phase2?.query?.pages || {}).forEach((p) => {
        const info = p?.imageinfo?.[0];
        const meta = info?.extmetadata || {};
        const license = meta.License?.value || meta.LicenseShortName?.value || "";
        const fileName = (p.title || "").replace(/^File:/, "").replace(/ /g, "_");
        licenseByFile[fileName] = license;
      });

      const map = {};
      candidates.forEach(({ requestedName, file, thumb }) => {
        const license = licenseByFile[file.replace(/ /g, "_")] || licenseByFile[file] || "";
        if (isPermissiveLicense(license)) map[requestedName] = thumb;
      });

      if (!cancelled && Object.keys(map).length > 0) {
        setPhotos((prev) => ({ ...prev, ...map }));
      }
      return true;
    };

    const batches = [];
    for (let i = 0; i < names.length; i += 40) batches.push(names.slice(i, i + 40));

    Promise.all(batches.map(fetchBatch)).then((results) => {
      if (cancelled) return;
      setStatus(results.some(Boolean) ? "done" : "failed");
    });

    // Two-phase needs a bit more headroom than one-phase.
    const timeoutId = setTimeout(() => {
      if (cancelled) return;
      setStatus((s) => (s === "loading" ? "failed" : s));
    }, 8000);

    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, [enabled]);

  return { photos, status };
}

function useSeasonPhoto(season) {
  const [data, setData] = useState({ url: null });
  useEffect(() => {
    if (!season) return;
    let cancelled = false;
    const slug = `Saturday_Night_Live_(season_${season})`;
    const phase1Url =
      `https://en.wikipedia.org/w/api.php?action=query&format=json` +
      `&titles=${encodeURIComponent(slug)}&prop=pageimages&piprop=name%7Cthumbnail&pithumbsize=800&redirects=1&origin=*`;
    (async () => {
      try {
        const r1 = await fetch(phase1Url);
        if (!r1.ok) return;
        const d1 = await r1.json();
        if (cancelled) return;
        const p = Object.values(d1?.query?.pages || {})[0];
        if (!p?.thumbnail?.source || !p?.pageimage) return;

        const r2 = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json` +
          `&titles=${encodeURIComponent(`File:${p.pageimage}`)}&prop=imageinfo&iiprop=extmetadata&origin=*`
        );
        if (!r2.ok || cancelled) return;
        const d2 = await r2.json();
        const info = Object.values(d2?.query?.pages || {})[0]?.imageinfo?.[0];
        const meta = info?.extmetadata || {};
        const license = meta.License?.value || meta.LicenseShortName?.value || "";
        if (isPermissiveLicense(license)) setData({ url: p.thumbnail.source });
      } catch (e) { /* swallow */ }
    })();
    return () => { cancelled = true; };
  }, [season]);
  return data;
}

function castForSeason(season) {
  return Object.entries(CAST_TENURE)
    .filter(([_, [first, last]]) => season >= first && season <= last)
    .map(([name]) => name);
}

const initials = (name) => name.split(" ").map((p) => p[0]).slice(0, 2).join("");

// Deterministic hue 0-360 from a name; used to color-code monogram fallbacks.
function nameHue(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [round, setRound] = useState(0);
  const [picks, setPicks] = useState([]);

  // Scroll back to top whenever we change rounds — UX polish for long question screens
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [round]);

  const advance = (value, type, adaptiveId) => {
    setPicks([...picks, { round, type, value, adaptiveId }]);
    setRound(round + 1);
  };

  const reset = () => {
    setRound(0);
    setPicks([]);
  };

  // Determine the current question based on round number and prior picks
  const currentQ = useMemo(() => {
    if (round === ASPECT_ROUND_INDEX) return ASPECT_ROUND;
    if (round >= SUB_QUESTION_START && round < CAST_ROUND_INDEX) {
      // Pull aspect[round - 1]'s sub-question
      const aspectsPick = picks[ASPECT_ROUND_INDEX];
      if (!aspectsPick) return null;
      const aspectIdx = round - SUB_QUESTION_START;
      const aspectId = aspectsPick.value[aspectIdx];
      const aspect = ASPECTS[aspectId];
      return aspect ? { ...aspect.subQuestion, type: "single" } : null;
    }
    if (round === CAST_ROUND_INDEX) return CAST_ROUND;
    if (round >= ADAPTIVE_START && round < TOTAL_ROUNDS) {
      const usedIds = picks.filter((p) => p.adaptiveId).map((p) => p.adaptiveId);
      // Also exclude adaptive questions covered by already-chosen aspects
      const aspectsPick = picks[ASPECT_ROUND_INDEX];
      const coveredByAspects = aspectsPick
        ? aspectsPick.value.flatMap((id) => {
            // Map aspect IDs to overlapping adaptive question IDs
            if (id === "update") return ["update"];
            if (id === "host") return ["host-era"];
            if (id === "impressions") return ["impression"];
            if (id === "ten-to-one") return ["ten-to-one"];
            return [];
          })
        : [];
      const allUsed = [...usedIds, ...coveredByAspects];
      const next = pickNextAdaptive(picks, allUsed);
      return next ? { ...next, type: "single" } : null;
    }
    return null;
  }, [round, picks]);

  const isDone = round >= TOTAL_ROUNDS;

  // Pre-fetch photos as soon as user reaches the cast round
  const photosEnabled = round >= CAST_ROUND_INDEX - 1;
  const { photos, status: photosStatus } = useWikipediaPhotos(ALL_CAST, photosEnabled);

  return (
    <>
      <Style />
      <div className="min-h-screen w-full relative overflow-hidden" style={{ background: "radial-gradient(ellipse at top, #1a1424 0%, #0a0710 60%, #050306 100%)" }}>
        <Grain />
        <BulbStrip top />
        <BulbStrip />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-6 pt-14 pb-20" style={{ zIndex: 20 }}>
          <Header />
          {!isDone && currentQ ? (
            <Round q={currentQ} onAnswer={advance} index={round} total={TOTAL_ROUNDS} photos={photos} photosStatus={photosStatus} />
          ) : (
            <Results picks={picks} onReset={reset} />
          )}
          <Footer />
        </div>
      </div>
    </>
  );
}

function Header() {
  return (
    <div className="text-center mb-10 rise">
      <div className="font-mono mb-3 flicker" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.4em" }}>★ LIVE FROM NEW YORK ★</div>
      <h1 className="font-marquee mb-2" style={{ color: "#f4f1de", fontSize: "clamp(2.5rem, 8vw, 4.5rem)", textShadow: "0 0 20px rgba(255, 200, 71, 0.4), 0 0 40px rgba(230, 57, 70, 0.2)", lineHeight: 1 }}>
        The SNL Oracle
      </h1>
      <div className="font-body italic" style={{ color: "#c9b8a0", fontSize: "0.95rem" }}>
        Tell us what you love. We'll tell you when you watched.
      </div>
    </div>
  );
}

function Round({ q, onAnswer, index, total, photos, photosStatus }) {
  const onPick = (value, type) => onAnswer(value, type, q.id || null);
  if (q.type === "binary") return <BinaryRound q={q} onAnswer={onPick} index={index} total={total} />;
  if (q.type === "single") return <SingleRound q={q} onAnswer={onPick} index={index} total={total} />;
  if (q.type === "aspects") return <AspectsRound q={q} onAnswer={onPick} index={index} total={total} />;
  if (q.type === "multi-cast") return <MultiCastRound q={q} onAnswer={onPick} index={index} total={total} photos={photos} photosStatus={photosStatus} />;
  return null;
}

function RoundHeader({ q, index, total }) {
  return (
    <>
      <div className="flex items-center justify-between mb-5 font-mono" style={{ color: "#a89684", fontSize: "10px", letterSpacing: "0.3em" }}>
        <span>{q.title}</span>
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
      <h2 className="font-display uppercase mb-2" style={{ color: "#f4f1de", fontSize: "clamp(1.75rem, 5vw, 2.5rem)", lineHeight: 1.05 }}>{q.prompt}</h2>
      {q.sub && <p className="font-body italic mb-7" style={{ color: "#c9b8a0", fontSize: "1rem", lineHeight: 1.4 }}>{q.sub}</p>}
    </>
  );
}

function AspectsRound({ q, onAnswer, index, total }) {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    if (selected.includes(id)) setSelected(selected.filter((x) => x !== id));
    else if (selected.length < q.max) setSelected([...selected, id]);
  };

  const submit = () => {
    if (selected.length === q.min) onAnswer(selected, "aspects");
  };

  const ready = selected.length === q.min;
  const remaining = q.min - selected.length;

  return (
    <div className="rise" key={index}>
      <RoundHeader q={q} index={index} total={total} />

      <div className="flex items-center justify-between mb-5 font-mono" style={{ color: "#a89684", fontSize: "11px", letterSpacing: "0.2em" }}>
        <span style={{ color: ready ? "#ffc847" : "#e63946" }}>
          {ready ? `LOCKED IN 3 / 3` : `PICK ${remaining} MORE`}
        </span>
        <button onClick={submit} disabled={!ready} className="font-display uppercase px-5 py-2 border transition" style={{ borderColor: ready ? "#ffc847" : "#3a2f44", color: ready ? "#0a0710" : "#5a4a3a", background: ready ? "#ffc847" : "transparent", fontSize: "12px", letterSpacing: "0.2em", cursor: ready ? "pointer" : "not-allowed" }}>
          ★ Next ★
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ASPECT_IDS.map((id, i) => {
          const a = ASPECTS[id];
          const isSel = selected.includes(id);
          const order = isSel ? selected.indexOf(id) + 1 : null;
          const disabled = !isSel && selected.length >= q.max;
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              disabled={disabled}
              className="text-left p-4 border transition"
              style={{
                borderColor: isSel ? "#e63946" : "#3a2f44",
                background: isSel ? "rgba(230, 57, 70, 0.12)" : "rgba(255,255,255,0.02)",
                opacity: disabled ? 0.35 : 1,
                animation: `rise 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.04}s both`,
                cursor: disabled ? "not-allowed" : "pointer",
                position: "relative",
              }}
            >
              {order && (
                <div className="font-display" style={{ position: "absolute", top: 10, right: 14, color: "#e63946", fontSize: "1.5rem", lineHeight: 1 }}>
                  {order}
                </div>
              )}
              <div className="font-display uppercase" style={{ color: "#f4f1de", fontSize: "1.15rem", lineHeight: 1.15 }}>
                {a.label}
              </div>
              <div className="font-body italic mt-1" style={{ color: "#8a7a6a", fontSize: "0.9rem" }}>
                {a.sub}
              </div>
            </button>
          );
        })}
      </div>

      <Progress index={index} total={total} />
    </div>
  );
}

function BinaryRound({ q, onAnswer, index, total }) {
  return (
    <div className="rise" key={index}>
      <RoundHeader q={q} index={index} total={total} />
      <div className="grid grid-cols-1 gap-4">
        {q.options.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => onAnswer(opt, "binary")}
            className="text-left p-5 border transition"
            style={{
              borderColor: "#3a2f44",
              background: "rgba(255,255,255,0.02)",
              animation: `rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s both`,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ffc847"; e.currentTarget.style.background = "rgba(230, 57, 70, 0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a2f44"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
          >
            <div className="font-mono mb-1" style={{ color: "#ffc847", fontSize: "10px", letterSpacing: "0.3em" }}>
              {i === 0 ? "↞ THIS" : "THAT ↠"}
            </div>
            <div className="font-display uppercase" style={{ color: "#f4f1de", fontSize: "1.5rem" }}>{opt.label}</div>
            <div className="font-body italic mt-1" style={{ color: "#8a7a6a", fontSize: "0.95rem" }}>{opt.sub}</div>
          </button>
        ))}
      </div>
      <Progress index={index} total={total} />
    </div>
  );
}

function SingleRound({ q, onAnswer, index, total }) {
  return (
    <div className="rise" key={index}>
      <RoundHeader q={q} index={index} total={total} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => onAnswer(opt, "single")}
            className="text-left p-4 border transition"
            style={{
              borderColor: "#3a2f44",
              background: "rgba(255,255,255,0.02)",
              animation: `rise 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${(i % 8) * 0.04}s both`,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ffc847"; e.currentTarget.style.background = "rgba(230, 57, 70, 0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a2f44"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
          >
            <div className="font-display uppercase" style={{ color: "#f4f1de", fontSize: "1.05rem", lineHeight: 1.15 }}>{opt.label}</div>
            {opt.sub && <div className="font-mono mt-1" style={{ color: "#8a7a6a", fontSize: "11px" }}>{opt.sub}</div>}
          </button>
        ))}
      </div>
      <Progress index={index} total={total} />
    </div>
  );
}

function MultiCastRound({ q, onAnswer, index, total, photos, photosStatus }) {
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const photoCount = Object.keys(photos).length;
  const photosLoaded = photoCount > 30;

  const toggle = (name) => {
    if (selected.includes(name)) setSelected(selected.filter((n) => n !== name));
    else if (selected.length < q.max) setSelected([...selected, name]);
  };
  const submit = () => { if (selected.length > 0) onAnswer(selected, "multi-cast"); };

  const empty = selected.length === 0;
  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed
    ? ALL_CAST.filter((name) => name.toLowerCase().includes(trimmed))
    : ALL_CAST;

  return (
    <div className="rise" key={index}>
      <RoundHeader q={q} index={index} total={total} />

      {/* Sticky status bar */}
      <div style={{ position: "sticky", top: 0, background: "rgba(10, 7, 16, 0.92)", padding: "12px 0", zIndex: 5, backdropFilter: "blur(8px)" }}>
        <div className="flex items-center justify-between mb-3 font-mono" style={{ color: "#a89684", fontSize: "11px", letterSpacing: "0.2em" }}>
          <span style={{ color: empty ? "#e63946" : "#ffc847" }}>
            {empty ? "TAP A FACE BELOW ↓" : `SELECTED ${selected.length} / ${q.max}`}
          </span>
          <button onClick={submit} disabled={empty} className="font-display uppercase px-5 py-2 border transition" style={{ borderColor: empty ? "#3a2f44" : "#ffc847", color: empty ? "#5a4a3a" : "#0a0710", background: empty ? "transparent" : "#ffc847", fontSize: "12px", letterSpacing: "0.2em", cursor: empty ? "not-allowed" : "pointer" }}>
            ★ Lock In ★
          </button>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name… or just scroll"
          className="font-body w-full"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid #3a2f44",
            color: "#f4f1de",
            padding: "10px 14px",
            fontSize: "0.95rem",
            outline: "none",
            borderRadius: "2px",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#ffc847"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#3a2f44"; }}
        />
      </div>

      {/* Photo status hint */}
      {photosStatus === "loading" && (
        <div className="font-mono mb-4 mt-3 text-center" style={{ color: "#8a7a6a", fontSize: "10px", letterSpacing: "0.2em" }}>
          ◌ FETCHING PHOTOS FROM WIKIPEDIA…
        </div>
      )}
      {photosStatus === "failed" && !photosLoaded && (
        <div className="font-mono mb-4 mt-3 text-center" style={{ color: "#8a7a6a", fontSize: "10px", letterSpacing: "0.2em" }}>
          ✕ PHOTOS UNAVAILABLE · USING MONOGRAMS
        </div>
      )}

      <div className="font-mono mt-4 mb-3" style={{ color: "#8a7a6a", fontSize: "10px", letterSpacing: "0.2em" }}>
        SHOWING {filtered.length} OF {ALL_CAST.length} CAST MEMBERS
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {filtered.map((name) => {
          const isSel = selected.includes(name);
          const disabled = !isSel && selected.length >= q.max;
          const photo = photos[name];
          const hue = nameHue(name);
          return (
            <button
              key={name}
              onClick={() => toggle(name)}
              disabled={disabled}
              className="flex flex-col items-center text-center transition"
              style={{
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.35 : 1,
                padding: "6px 4px",
                background: "transparent",
                border: "none",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  maxWidth: "120px",
                  border: isSel ? "3px solid #e63946" : "2px solid #3a2f44",
                  background: photo
                    ? "#1a1424"
                    : `linear-gradient(135deg, hsl(${hue}, 55%, 22%) 0%, hsl(${(hue + 40) % 360}, 60%, 12%) 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: "2px",
                  transition: "all 0.2s",
                  transform: isSel ? "scale(1.04)" : "scale(1)",
                  boxShadow: isSel ? "0 0 20px rgba(230, 57, 70, 0.4)" : "none",
                  position: "relative",
                }}
              >
                {photo ? (
                  <img src={photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: isSel ? "none" : "grayscale(60%) contrast(1.1)" }} />
                ) : (
                  <>
                    <div
                      className="font-display"
                      style={{
                        fontSize: "2rem",
                        color: isSel ? "#f4f1de" : `hsl(${hue}, 60%, 75%)`,
                        letterSpacing: "0.05em",
                        textShadow: "0 2px 12px rgba(0, 0, 0, 0.4)",
                        zIndex: 1,
                      }}
                    >
                      {initials(name)}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(ellipse at top left, rgba(255,255,255,0.06), transparent 60%)",
                        pointerEvents: "none",
                      }}
                    />
                  </>
                )}
              </div>
              <div className="font-display uppercase mt-2" style={{ fontSize: "10px", color: isSel ? "#e63946" : "#f4f1de", letterSpacing: "0.04em", lineHeight: 1.15 }}>
                {name}
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center mt-12 font-body italic" style={{ color: "#8a7a6a" }}>
          No cast member matches "{query}". Try a partial last name?
        </div>
      )}

      <Progress index={index} total={total} />
    </div>
  );
}

function Progress({ index, total }) {
  return (
    <div className="flex gap-1 justify-center mt-10">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: i === index ? "32px" : "14px", height: "2px", background: i < index ? "#ffc847" : i === index ? "#e63946" : "#3a2f44", transition: "all 0.4s ease" }} />
      ))}
    </div>
  );
}

function Results({ picks, onReset }) {
  const scores = useMemo(() => scoreFromPicks(picks), [picks]);
  const top = topSeasons(scores, 3);
  const winner = top[0];
  const winnerMeta = SEASONS[winner.season];
  const age = predictAge(winner.season);
  const totalScore = top.reduce((acc, t) => acc + t.score, 0) || 1;
  const winnerPct = Math.round((winner.score / totalScore) * 100);
  const archetype = archetypeFromPicks(picks);
  const seasonPhoto = useSeasonPhoto(winner.season);

  // Confidence: how clearly does the winner lead? Wide gap = strong match
  const gap = top[1] ? (winner.score - top[1].score) / Math.max(winner.score, 1) : 1;
  const confidence = gap > 0.35 ? "STRONG MATCH" : gap > 0.15 ? "GOOD MATCH" : "TIGHT RACE";
  const confidenceColor = gap > 0.35 ? "#ffc847" : gap > 0.15 ? "#c9b8a0" : "#e63946";

  const shareText = `My ultimate SNL season is S${winner.season} (${winnerMeta.year}–${winnerMeta.end}). I'm a ${archetype.name}. Find yours.`;
  const handleCopy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(shareText);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="font-mono mb-3" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.4em" }}>★ YOUR RESULT ★</div>
        <div className="font-body italic mb-4" style={{ color: "#c9b8a0", fontSize: "1.05rem" }}>Your ultimate season is</div>
        <div className="font-display reveal" style={{ fontSize: "clamp(7rem, 22vw, 14rem)", color: "#e63946", textShadow: "0 0 30px rgba(230, 57, 70, 0.5), 0 0 60px rgba(230, 57, 70, 0.25), 4px 4px 0 #ffc847", letterSpacing: "-0.02em", lineHeight: 1 }}>
          S{winner.season}
        </div>
        <div className="font-marquee mt-3" style={{ color: "#f4f1de", fontSize: "clamp(1.4rem, 4vw, 2rem)" }}>
          {winnerMeta.year}–{String(winnerMeta.end).slice(2)}
        </div>
        <div className="font-mono mt-2" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.3em" }}>
          {winnerPct}% MATCH AGAINST YOUR TOP 3
        </div>
        <div className="font-mono mt-1" style={{ color: confidenceColor, fontSize: "10px", letterSpacing: "0.4em" }}>
          ◆ {confidence} ◆
        </div>
      </div>

      {seasonPhoto.url ? (
        <div className="mb-8 rise" style={{ animationDelay: "0.5s" }}>
          <div className="relative" style={{ border: "2px solid #3a2f44", background: "#0a0710" }}>
            <img src={seasonPhoto.url} alt={`Season ${winner.season} cast`} style={{ width: "100%", height: "auto", display: "block", filter: "contrast(1.05) saturate(0.95)" }} />
            <div className="font-mono uppercase" style={{ position: "absolute", bottom: "8px", left: "8px", background: "#0a0710", padding: "4px 8px", color: "#ffc847", fontSize: "9px", letterSpacing: "0.3em" }}>
              CAST / S{winner.season}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 rise" style={{ animationDelay: "0.5s", padding: "24px", border: "2px solid #3a2f44", background: "#0a0710" }}>
          <div className="font-mono uppercase mb-4 text-center" style={{ color: "#ffc847", fontSize: "10px", letterSpacing: "0.3em" }}>
            THE S{winner.season} CAST
          </div>
          <div className="flex flex-wrap justify-center" style={{ gap: "6px 14px" }}>
            {castForSeason(winner.season).map((name) => (
              <span key={name} className="font-display uppercase" style={{ color: "#f4f1de", fontSize: "0.95rem", letterSpacing: "0.02em" }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="font-body mx-auto mb-8 text-center" style={{ color: "#c9b8a0", fontSize: "1.05rem", maxWidth: "560px", lineHeight: 1.5 }}>
        {winnerMeta.tag}
      </p>

      <div className="mb-8 p-6 border" style={{ borderColor: "#ffc847", background: "rgba(255, 200, 71, 0.05)" }}>
        <div className="font-mono mb-2" style={{ color: "#ffc847", fontSize: "10px", letterSpacing: "0.3em" }}>YOUR ARCHETYPE</div>
        <div className="font-display uppercase mb-2" style={{ color: "#f4f1de", fontSize: "1.5rem", lineHeight: 1.1 }}>{archetype.name}</div>
        <p className="font-body italic" style={{ color: "#c9b8a0", fontSize: "0.98rem", lineHeight: 1.4 }}>{archetype.line}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-10 justify-center">
        <a href={peacockLink(winner.season)} target="_blank" rel="noreferrer" className="font-display uppercase text-center px-6 py-3 border transition" style={{ borderColor: "#00a4a6", color: "#00a4a6", fontSize: "13px", letterSpacing: "0.2em", textDecoration: "none" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#00a4a6"; e.currentTarget.style.color = "#0a0710"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00a4a6"; }}>▶ Watch on Peacock</a>
        <a href={youtubeLink(winner.season)} target="_blank" rel="noreferrer" className="font-display uppercase text-center px-6 py-3 border transition" style={{ borderColor: "#e63946", color: "#e63946", fontSize: "13px", letterSpacing: "0.2em", textDecoration: "none" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#e63946"; e.currentTarget.style.color = "#f4f1de"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#e63946"; }}>▶ Best Sketches on YouTube</a>
      </div>

      <div className="border-t border-b py-7 mb-10" style={{ borderColor: "#3a2f44" }}>
        <div className="font-mono mb-5 text-center" style={{ color: "#a89684", fontSize: "10px", letterSpacing: "0.3em" }}>★ TWO PEOPLE WHO WOULD KNOW ★</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUOTES.map((q, i) => (
            <div key={i}>
              <p className="font-body italic leading-relaxed" style={{ color: "#f4f1de", fontSize: "0.98rem" }}>“{q.text}”</p>
              <div className="font-mono uppercase mt-3" style={{ color: "#8a7a6a", fontSize: "10px", letterSpacing: "0.2em" }}>— {q.attrib}</div>
            </div>
          ))}
        </div>
        {age && (
          <div className="mt-7 text-center">
            <div className="font-mono mb-2" style={{ color: "#ffc847", fontSize: "10px", letterSpacing: "0.3em" }}>★ THE LORNE EQUATION SAYS ★</div>
            <p className="font-body" style={{ color: "#c9b8a0", fontSize: "1rem", maxWidth: "520px", margin: "0 auto", lineHeight: 1.5 }}>
              If S{winner.season} is your peak, you were probably in high school during {winnerMeta.year}–{winnerMeta.end}. That puts you somewhere around <span style={{ color: "#f4f1de", fontWeight: "bold" }}>{age.ageMin}–{age.ageMax}</span> today. (Or, per Bill, you just like good comedy.)
            </p>
          </div>
        )}
      </div>

      <div className="mb-10">
        <div className="font-mono mb-4" style={{ color: "#a89684", fontSize: "10px", letterSpacing: "0.3em" }}>THE PODIUM / WHAT YOU'D TRADE AWAY</div>
        <div className="space-y-5">
          {top.map((t, i) => {
            const m = SEASONS[t.season];
            const tradeoffs = i === 0 ? [] : tradeOffsFor(t.season, picks);
            const pct = Math.round((t.score / totalScore) * 100);
            return (
              <div key={t.season} className="flex items-start gap-4 pb-4 border-b" style={{ borderColor: "#3a2f44" }}>
                <div className="font-display" style={{ color: i === 0 ? "#e63946" : "#ffc847", fontSize: "2rem", lineHeight: 1, minWidth: "36px" }}>{i + 1}</div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <div className="font-display uppercase" style={{ color: "#f4f1de", fontSize: "1.25rem" }}>Season {t.season}</div>
                    <div className="font-mono" style={{ color: "#8a7a6a", fontSize: "11px" }}>{m.year}–{String(m.end).slice(2)}</div>
                    <div className="font-mono" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.15em", marginLeft: "auto" }}>{pct}%</div>
                  </div>
                  <p className="font-body mt-1" style={{ color: "#c9b8a0", fontSize: "0.95rem", lineHeight: 1.4 }}>{m.tag}</p>
                  {tradeoffs.length > 0 && <div className="mt-2 font-mono" style={{ color: "#e63946", fontSize: "11px" }}>✗ TRADE-OFF: no {tradeoffs.join(" • no ")}</div>}
                  {i > 0 && (
                    <div className="flex gap-3 mt-3">
                      <a href={peacockLink(t.season)} target="_blank" rel="noreferrer" className="font-mono uppercase" style={{ color: "#00a4a6", fontSize: "10px", letterSpacing: "0.2em", textDecoration: "underline" }}>Peacock ▶</a>
                      <a href={youtubeLink(t.season)} target="_blank" rel="noreferrer" className="font-mono uppercase" style={{ color: "#e63946", fontSize: "10px", letterSpacing: "0.2em", textDecoration: "underline" }}>YouTube ▶</a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-10">
        <div className="font-mono mb-4" style={{ color: "#a89684", fontSize: "10px", letterSpacing: "0.3em" }}>YOUR PICKS</div>
        <div className="space-y-2">
          {picks.map((p, i) => {
            let prompt = "";
            let displayValue = "";

            if (i === ASPECT_ROUND_INDEX) {
              prompt = ASPECT_ROUND.prompt;
              displayValue = p.value.map((id) => ASPECTS[id]?.label).filter(Boolean).join(" + ");
            } else if (i >= SUB_QUESTION_START && i < CAST_ROUND_INDEX) {
              const aspectsPick = picks[ASPECT_ROUND_INDEX];
              const aspectId = aspectsPick?.value?.[i - SUB_QUESTION_START];
              const aspect = ASPECTS[aspectId];
              prompt = aspect?.subQuestion?.prompt || "";
              displayValue = p.value.label;
            } else if (i === CAST_ROUND_INDEX) {
              prompt = CAST_ROUND.prompt;
              displayValue = p.value.join(" + ");
            } else if (p.adaptiveId) {
              const q = ADAPTIVE_POOL.find((q) => q.id === p.adaptiveId);
              prompt = q?.prompt || "";
              displayValue = p.value.label;
            }

            return (
              <div key={i} className="flex items-baseline gap-3 font-body" style={{ color: "#c9b8a0", fontSize: "0.95rem" }}>
                <span className="font-mono" style={{ color: "#ffc847", fontSize: "10px" }}>0{i + 1}</span>
                <span style={{ color: "#8a7a6a" }} className="italic">{prompt}</span>
                <span className="font-display uppercase" style={{ color: "#f4f1de", fontSize: "0.85rem", marginLeft: "auto", textAlign: "right" }}>
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={handleCopy} className="font-display uppercase px-6 py-3 border transition" style={{ borderColor: "#c9b8a0", color: "#c9b8a0", fontSize: "12px", letterSpacing: "0.3em", background: "transparent", cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#c9b8a0"; e.currentTarget.style.color = "#0a0710"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c9b8a0"; }}>
          ⎘ Copy My Result
        </button>
        <button onClick={onReset} className="font-display uppercase px-8 py-3 border transition" style={{ borderColor: "#ffc847", color: "#ffc847", fontSize: "12px", letterSpacing: "0.3em", background: "transparent", cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#ffc847"; e.currentTarget.style.color = "#0a0710"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ffc847"; }}>
          ★ Run It Back ★
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   DECORATION
   ============================================================ */
function BulbStrip({ top }) {
  const style = top ? { top: 0 } : { bottom: 0 };
  return (
    <div className="absolute left-0 right-0 flex justify-around py-3" style={{ ...style, zIndex: 10 }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="bulb" style={{ width: "6px", height: "6px", borderRadius: "9999px", background: "#ffc847", animationDelay: `${(i % 4) * 0.18}s` }} />
      ))}
    </div>
  );
}

function Grain() {
  return <div className="absolute inset-0 grain pointer-events-none" style={{ opacity: 0.3, mixBlendMode: "overlay" }} />;
}

function Footer() {
  return (
    <div className="mt-14 pt-6 border-t text-center font-mono" style={{ borderColor: "#3a2f44", color: "#6a5a4a", fontSize: "10px", letterSpacing: "0.15em", lineHeight: 1.6 }}>
      An unaffiliated fan project. Not associated with, endorsed by, or sponsored by
      <br />
      NBC, Broadway Video, or Saturday Night Live. SNL and all sketch / character
      <br />
      names are property of their respective owners. Photos via Wikimedia.
    </div>
  );
}

function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=Limelight&family=DM+Mono:wght@300;400;500&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap');
      .font-display { font-family: 'Anton', 'Impact', sans-serif; letter-spacing: 0.02em; }
      .font-marquee { font-family: 'Limelight', 'Georgia', serif; }
      .font-mono { font-family: 'DM Mono', 'Courier New', monospace; }
      .font-body { font-family: 'Newsreader', 'Georgia', serif; }

      @keyframes bulb {
        0%, 100% { opacity: 0.4; box-shadow: 0 0 4px #ffc847, 0 0 8px #ffc847; }
        50% { opacity: 1; box-shadow: 0 0 8px #ffc847, 0 0 20px #ffc847, 0 0 32px #ffaf2b; }
      }
      .bulb { animation: bulb 1.4s ease-in-out infinite; }

      @keyframes flicker {
        0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.7; }
        94% { opacity: 1; } 96% { opacity: 0.85; } 97% { opacity: 1; }
      }
      .flicker { animation: flicker 4s linear infinite; }

      @keyframes rise {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .rise { animation: rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }

      @keyframes reveal {
        0% { opacity: 0; transform: scale(0.85); letter-spacing: 0.2em; }
        60% { opacity: 1; transform: scale(1.05); letter-spacing: 0.04em; }
        100% { opacity: 1; transform: scale(1); letter-spacing: -0.02em; }
      }
      .reveal { animation: reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }

      .grain {
        background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
      }
    `}</style>
  );
}
