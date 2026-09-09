# SNL Oracle: design and writing audit

Written September 9, 2026. Every screen was rendered at phone width (390px) and desktop width (1440px) and read end to end, including the generated Instagram story image and the shared-result landing page. Findings are ordered by how much they matter to a hardcore SNL fan.

Do this pass after Step 1 of LOGIC_AUDIT.md, so the data lives in `src/logic.js` and the UI lives in `src/App.jsx`. Most of this file edits copy and data, plus a handful of layout changes. Nothing here changes the scoring.

## How to work this file with Claude Code

- Work top to bottom. Sections A and B are the ones that change how the product feels. C through F are polish.
- Every copy change in this file is a proposal in Eddie's voice. Eddie approves or rewrites each one before it ships.
- Writing rules for anything on the site: no em dashes anywhere (use periods, commas, or colons). Complete sentences. Short and casual. No "aspects," "archetype," "DNA," or other research words in user-facing copy. The Oracle is "it." The fan is "you." No "we" or "us."
- Commit after each section. Vercel deploys every push.

## A. Branding: two metaphors, and the oracle isn't one of them yet

**What's there.** The name, the Instagram avatar, and the Ko-fi button say fortune-teller: a crystal ball, "The Oracle's guess," "Tip the Oracle." The site itself says Broadway marquee: bulb strips, Limelight deco lettering, "Live from New York." There is no oracle imagery or oracle voice anywhere on the site. The word appears in the title and two labels.

**Verdict.** The marquee look is right for SNL. Rockefeller Center is deco, the show's identity is New York at night, and the type and palette are strong. Keep it. The fix is to give the Oracle a voice inside that stage at the three moments that matter: the intro line, the reveal, and the age block. No redesign, three copy changes.

**Name drift.** The product is The SNL Oracle. It lives at studio8h.fan. The Instagram avatar says "REWATCH GUIDE." Reddit posts have called it "Studio 8H." Pick one rule: the product is always The SNL Oracle, and studio8h.fan is the address. Put "studio8h.fan" in the footer so the name and the address are both on screen. Never call the product Studio 8H.

**Two positionings.** The header says "rewatch guide" (utility). The story image says "FIND YOUR PEAK SNL SEASON" (identity). People click a Reddit link for the identity and stay for the utility, so the header should lead with the identity and promise the utility second. See B1.

**"A Digital Short."** This label sits in gray above every question and on top of the result card. It is an in-joke on the Lonely Island title card and it reads as a leftover. On the questions it means nothing. On the result card it undercuts the reveal. Remove it everywhere. The result card gets a real kicker (see B5).

## B. Copy, screen by screen

### B1. Header

Current: "A fan-built rewatch guide. Tell us what you love about SNL and we'll point you at the seasons and sketches you've been missing."

Problems: app-store voice, "we" instead of the Oracle, and "you've been missing" tells a hardcore fan they've missed things.

Proposed: "Tell the Oracle what you love. It names your peak season, runs Lorne's math on your age, and hands you a rewatch list."

Alternate, shorter: "Nine questions. One season. The Oracle knows."

Also: the full header (kicker, title, description) repeats at the top of all nine rounds and the result page. On a phone it pushes every question down by a third of the screen. After round 1, collapse it to the title only, at about half size, with no description.

### B2. Round 1

Current prompt: "Pick the 3 aspects of SNL you live for."
Current sub: "These shape the next three questions. Be honest — there's no wrong combination." (em dash)

Proposed prompt: "What do you watch SNL for? Pick three."
Proposed sub: "Your first pick becomes your type. The next three questions come from these."

The second sentence matters because the first tap silently decides the archetype and the share link, and nothing tells the user that today.

The ten options themselves. Three of the ten are political ("Cold opens," which is described as politics, "Political impressions," "Politics of the week"). A fan who isn't political has six real choices, and two canonical SNL forms are missing entirely: commercial parodies (Colon Blow, Schmitt's Gay, Mom Jeans, Taco Town) and celebrity impressions that aren't politics (Ferrell's Trebek, Hammond's Connery, Gasteyer's Martha Stewart, McKinnon's Bieber, Fineman's everyone). Recommendation: merge "Political impressions" and "Politics of the week" into one "Politics" lane, and add "Commercial parodies" and "Celebrity impressions." That keeps ten and covers the show. This is data work (new weight tables and sub-questions), so schedule it with Step 3 of the logic audit.

Layout: the Next button is only at the top. On a phone, the third pick is near the bottom of the list, so the user scrolls back up to continue. Make the status bar sticky (the cast round already does this) or add a Next button at the bottom too.

### B3. Sub-questions (rounds 2 to 4)

The option copy is the best writing on the site. "Miller smug. A. Whitney Brown editorials." is exactly the register a hardcore fan wants. Keep the voice.

Fixes:
- Titles mix "STYLE," "ENERGY," "FLAVOR," and "vibe." Pick one register. Suggest the plain noun: UPDATE, COLD OPENS, RECURRING, HOSTS, PRE-TAPES, MUSIC, 10-TO-1, IMPRESSIONS, POLITICS, THE LOOSE STUFF.
- "Location & mockumentary pre-tapes" cites "Bodega Bathroom. Diner Lobster." Both are live Broadway-parody sketches, not pre-tapes. A hardcore fan will flag it in the first ten seconds. Swap in real pre-tapes from those seasons (Bad Boys stays; add Wells for Boys, Inside SoCal, or the Kyle and Beck mockumentaries).
- "Marcello-era surrealism" cites Domingo as the "current surreal end-of-show stuff." Domingo is a mid-show musical sketch, not a 10-to-1. Cite actual late-show weirdness from S48 to S51 instead, or rename the option.
- "Deadpan one-liners: Norm. Murderer's Row. Headlines as standup." "Murderer's Row" is an unclear reference. Cut it or replace with "Note to self."
- Em dashes to remove: "Now — K-pop, Bad Bunny, Carpenter," "The week's biggest character — POTUS — performed back at us," "Cabinet & Congress — not just the president."

### B4. Cast round

Copy is fine. Two changes:
- Add era filter chips above the grid (70s, 80s, 90s, 00s, 10s, 20s). Hardcore fans think in eras, and scrolling 156 faces in three columns is 52 rows on a phone. Search stays.
- The Wikipedia photos are present-day headshots, so a 70s pick shows a 70-year-old. Not fixable cheaply and the monogram fallback is fine. Just be aware the era chips do more work than the photos.

### B5. Result page

**The hero card.**
- Remove "A Digital Short." Kicker becomes "YOUR PEAK SEASON" or, if the oracle voice is wanted here, "THE ORACLE HAS SPOKEN." Prefer the first; the second is a cliché.
- Kill the "34% match" figure. It is the winner's share of the top three scores, so it is always about a third, and it reads as the Oracle being one-third sure. Same on the podium, where 34/33/33 makes the result look like a coin flip. Replace the percentage everywhere with the gap-based confidence, worded as a sentence:
  - strong: "Not close. This is your season."
  - good: "Clear winner. S{runner-up} was in the running."
  - tight: "Close call with S{runner-up}. Both are yours."
- Put the archetype line directly under the archetype name on the card, instead of floating unlabeled halfway down the page.

**"Why this season."** Today it repeats the user's inputs back as a mail merge ("You're drawn to weekend update, pre-tapes & digital shorts, and weird 10-to-1s, and you can't live without Will Forte and Fred Armisen. S31 is where that combination lives. All 2 of your picks were on the cast."). Problems: lowercased proper nouns, "All 2 of," and no actual reason.

Rewrite it as a reason built from the data. Claude Code has everything needed: which cast picks were on the season, which answered options gave this season the most points, and who the runner-up was. Shape:

"S31 is where {cast picks on this season} share a cast with {the two answers that scored it highest, as their labels}. S32 came second: {one-line difference, e.g. same cast, but the Lonely Island peak you picked leans a year later}."

Example output for the profile above: "S31 is where Will Forte and Fred Armisen share a cast with Lonely Island's first year and the Tina and Amy desk. S32 came second, and it's a fair fight: same cast, Dick in a Box instead of Lazy Sunday."

Keep the labels' capitalization. Handle one, two, and three cast picks ("Both," "All three").

**"Watch this next."** Good. Keep.

**"Also in your lane."** Sub reads "Sketches from other seasons that share your taste DNA." Cut "DNA." Proposed: "Sketches from other seasons you'd probably rewatch." The list itself is wrong until Step 6 of the logic audit is done.

**"Your cast overlap."** Good feature. Grammar breaks with one pick ("All 1 of your cast picks share these seasons"). Write three cases: one pick ("Will Forte was on all of these:"), two ("Both your picks share these seasons:"), three ("All three share these seasons:"). Remove the em dash in the no-overlap case.

**"The podium · what you'd trade away."** The "trade away" line only appears when a cast pick is missing from a runner-up. When nothing is missing, the section promises a trade-off and shows none. Rename to "Runners-up" and always give one line per runner-up: the missing cast members if any, otherwise the one-line difference from the Why paragraph. Drop the percentages.

**The age block.** This is the one Eddie flagged, and he's right. The number comes first, the theory comes second, so it reads as the Oracle guessing and getting it wrong. Reverse it.

Current order: kicker "And one more thing" → "The Oracle's guess at your age:" → the number → the Lorne quote → "If S31 is your peak, you were in high school during 2005–2006. That's the math."

Proposed order and copy:
- Kicker: "THE LORNE THEORY"
- The quote first, with its source added, because a hardcore fan will want to know it's real: "Lorne Michaels, TODAY, February 2015." (The quote is verified. It is from the 40th anniversary interview with Matt Lauer. The site's version drops an ellipsis from the original; that's fine.)
- Then: "By Lorne's math, S31 fans were in high school in 2005 and 2006. That puts you around 35 to 38."
- Then the number, big.
- Then a release valve: "Off by a decade? Then you found your era on your own, which counts for more."

That makes the Oracle the messenger and Lorne the one doing the guessing, which is the joke.

**"Your picks."** Useful. Keep. Consider collapsing behind a "Show your picks" toggle to shorten the page.

**Share block.** Cut "The story image is sized for IG / TikTok (1080×1920)." It's a spec sheet, not copy. Kicker "Share it." Buttons stay.

**Feedback link.** "Found something off? Help us make it better →" uses "us." Proposed: "Built by one fan. Found something off? Tell me →" That is the only place the maker speaks, and it's honest.

**Footer.** Fine as legal text. Add "studio8h.fan" and make the whole footer 11px instead of 10px.

### B6. Season tags: factual errors

All twelve season-tag fixes, the sketch catalog fixes, and the option copy fixes are listed in `audit/DATA_CORRECTIONS.md`, sections 2, 4, and 5. Do that file before this one. Nothing in this section is separate from it.

### B7. Hot takes: rewrite all 51

The hot take prints inside quotation marks on the story image and in the share caption, so it functions as the verdict people post about themselves. Today they are season summaries, and several undercut the person sharing them: "The transition year" (S35), "Transitional. Forgotten gem." (S28), "Only for completionists" (S6), "mostly forgotten" (S11), "Singular year, hard to compare" (S45), "The future's still unwritten" (S51). Nobody posts "my season was transitional."

Replace all 51 with second-person lines that say something about the fan. Teasing is fine, since that's how SNL fans talk to each other. All lines below are under 112 characters so they fit three lines on the story image, and none use em dashes. Eddie should edit freely.

```
1: You picked the one every other season gets measured against. Bold, or you were there.
2: Murray's first year and the show finding its shape. You like the part before the myth hardened.
3: The original cast at full power. You don't need anything after Cheeseburger Cheeseburger.
4: Belushi and Aykroyd's last full year together. You got in before the exits.
5: No Belushi, and Murray and Radner carried it anyway. You root for whoever's left standing.
6: The year NBC almost pulled the plug. Nobody can accuse you of bandwagoning.
7: Eddie arrives and the show gets a pulse. You know exactly who saved it.
8: Gumby. Buckwheat. Velvet Jones. Eddie's show, full stop, and you came for him.
9: Eddie's last run before the movies took him. You like a farewell tour more than a debut.
10: Crystal, Short, Guest, one season only. You like your ringers rented, not raised.
11: The wilderness year with RDJ and Joan Cusack. You're a completist or you were 15.
12: Hartman, Carvey, Hooks, Lovitz. The reset that worked. You like watching a machine get built.
13: Church Lady's coronation. Well, isn't that special. You quote things.
14: Wayne's World is born and Hans and Franz pump you up. You like your catchphrases at peak volume.
15: Carvey's Bush 41 at its best and Myers just getting started. You like a cast at cruising altitude.
16: Sandler, Farley, Rock, and Spade arrive as featured. You spotted the bench before it was famous.
17: Wayne's World hits theaters and Coffee Talk debuts. You like it big and you like it verklempt.
18: Matt Foley. Opera Man. Farley at full throttle. You like it loud and you're not sorry.
19: Hartman's last year. Farley and Sandler still standing. You like the end of an era better than the start.
20: The year the critics buried the show. You were there for Norm anyway.
21: Ferrell, Oteri, Hammond, and Quinn walk in. You like a fresh start with a chip on its shoulder.
22: Celebrity Jeopardy, Mango, the Spartans. Catchphrases everywhere. You quote things at parties.
23: Norm gets fired mid-season and the Roxbury Guys keep bobbing. You like your comedy with a grudge.
24: Fallon, Sanz, and Parnell arrive with Ferrell and Oteri at full power. You like a deep bench.
25: More Cowbell and the 25th anniversary. You picked the year the show felt invincible.
26: Tina takes the desk with Jimmy. Bush v. Gore all fall. You like it smart and a little smug.
27: Giuliani opens the show after 9/11. Ferrell's last year. You picked the season that had to mean something.
28: Forte and Armisen arrive and almost nobody notices. You notice.
29: Debbie Downer, Tina and Jimmy at their peak, Kenan's rookie year. Wah wah waaah. You're fine with it.
30: Tina and Amy share the desk. The friend-group era starts here. You like a cast that likes each other.
31: Lazy Sunday breaks the internet. Hader, Wiig, and Samberg as rookies. You were early, and you know it.
32: Dick in a Box. Peyton Manning's United Way. Seth and Amy launch. The pre-tape peak, and you were there.
33: The writers' strike year with Iran So Far. You take density over polish.
34: Palin. All fall. Tina every week. You picked a cultural moment more than a season.
35: Stefon's first year at the desk, Forte's last. You like an era with a handoff in it.
36: Stefon settles in. Bayer and Killam arrive. You like the show right before it gets famous again.
37: The Californians. Stefon at peak. Wiig's farewell. A top-five season, and you're not shy about it.
38: Hader and Armisen's last year, Strong and Bryant's first. You like standing at the crossover.
39: Pharoah's Obama, Drunk Uncle at the desk, Mooney's pre-tapes. The last year before Jost and Che.
40: Jost and Che debut, McKinnon's Hillary, the 40th special. You like a big year.
41: Trump hosts mid-campaign and Black Jeopardy hits its stride. Strange and electric. So are you.
42: Hallelujah. David S. Pumpkins. Hanks on Black Jeopardy. Peak Trump-era SNL, and you were watching.
43: Diner Lobster. Welcome to Hell. Kellyanne and Sessions. Underrated, like most of your picks.
44: Mulaney hosting, Pete in his bag, Bowen in the writers' room. You like the year before the year.
45: The COVID season. Shows from living rooms. You picked the one nobody can compare to anything.
46: Bowen as the Iceberg. Maya as Kamala. Election-year urgency. You like the show at its most awake.
47: Sherman and Please Don't Destroy arrive, McKinnon says goodbye. You like a changing of the guard.
48: Marcello arrives, Cecily leaves, the cast resets. You like a new cast finding its feet.
49: The post-strike return. Bargatze's Washington. JAJ's Trump locked in. You caught the current era rising.
50: The 50th. SNL50. Maya returns as Kamala. You like a victory lap.
51: The 1000th episode and Bowen's goodbye. The newest season on the list. You're 19 or you're paying attention.
```

### B8. Archetype names

These go on the share image, so they need to be short and worth posting. Several are flat or awkward: "The C-Span Diehard" for a cold-open fan, "The Sunday-Morning Clip-Watcher," "The Host Watcher," and two "Loyalists."

Proposed (id: name):
- cold-open: The Cold Open Lifer
- update: The Update Loyalist (keep)
- recurring: The Catchphrase Connoisseur (keep)
- host: The Host Whisperer
- pretape: The Sunday Morning Rewatcher
- music: The Saturday Night DJ (keep)
- ten-to-one: The 12:55 Citizen (drop "AM")
- impressions: The Impression Scholar (keep)
- topical: The Newsroom Regular
- loose: The Live-Wire

On the story image, replace "My archetype is" with "I'm" so it reads "I'm The Update Loyalist." Never use the word "archetype" on screen.

## C. The story image

This is the one asset that leaves the site, and it doesn't look like the site. Plain black, Arial Black, Georgia. No plum, no gold hairline, no bulbs, no Limelight title. It also doesn't match the Instagram avatar. Fix in `generateStoryImage`:

- Background: the site's plum-black gradient, not flat #000.
- Title in Limelight. The font is already loaded by the page; wait for `document.fonts.load('56px Limelight')` before drawing.
- A row of bulb dots top and bottom, and a gold hairline, to match the site.
- "F I N D   Y O U R   P E A K   S N L   S E A S O N" is fine as a kicker. Under it the giant S## stays; it's the best thing in the image.
- Hot take, then "I'm The Update Loyalist," then "Find yours at studio8h.fan." Hard-code the domain instead of reading `window.location.host`, which will print a preview URL on Vercel preview builds.
- Tighten the vertical spacing. There is a dead zone between the hot take and the archetype.

## D. Link previews (the cheapest big win)

There is no `og:image` in `index.html`. A link to studio8h.fan on iMessage, Slack, Reddit, or Facebook unfurls as text only. Add a static 1200×630 image with the marquee title and the one-line hook, and reference it with `og:image` and `twitter:image` (switch the card type to `summary_large_image`). Put the file in `public/`. Per-result images would need a server function; do the static one now and revisit later.

## E. Legibility

- Mono labels are 10px with 0.3 to 0.45em letterspacing. On a phone they are hard to read. Set labels to 11px and cap tracking at 0.2em. The footer is the worst case; make it 11px.
- The header description is italic serif at 0.95rem on a dark background. Fine on desktop, tight on a phone. The header collapse in B1 mostly solves it.

## F. Small things

- "The Skip" question lets the user pick the same moment they just chose as the one that lives in their head. Exclude it. (Fully fixed once the logic audit trims the moment list to the user's candidates.)
- "The Skip" copy repeats itself: "Now pick the one you'd rather skip. Which of these would you not miss?" Keep one.
- Sketch titles with em dashes and parentheticals ("Matt Foley — van down by the river," "Wells for Boys (Emma Stone)," "Domingo (Beyond Bachelorette)") get wrapped in quotes for the YouTube search link. Exact-phrase search with an em dash inside is a bad bet. Add a separate `query` field for the handful that need one, or drop the quotes from the search.
- The season photo caption says "CAST / S31," but the Wikipedia page image for most seasons is the title card, not the cast. Change the caption to "S31" or check the image name before labeling it a cast photo.
- The result page rewrites the URL to `?s=31&a=update`. Good. The Facebook share sends that URL, which lands on the friend view. Good. The friend view says "THEY ARE" above the archetype; "Their type" reads more naturally.

## Verification

- Play through on a phone: header collapses after round 1, Next is reachable without scrolling up, no "A Digital Short" anywhere, age block leads with Lorne, no percentages on the result, Why paragraph gives a reason.
- Download the story image and put it next to the Instagram avatar. They should look like the same brand.
- Paste the site link into iMessage. It should unfurl with an image.
- Search the built site for "—" and "aspect" and "archetype." All three should return nothing user-facing.
