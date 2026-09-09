# SNL Oracle: data corrections

Every factual fix, in one place. Do this file first, before the logic audit and the design audit, so both of those start from correct data. Everything here was checked on September 9, 2026 against Wikipedia's cast list and season pages, plus NBC, Variety, The Hollywood Reporter, LateNighter, and the SNL wiki. Where a fix rests on a date rather than a source I fetched, the date is given so it can be checked in ten seconds.

Rule for this file: do not change any weights, copy, or layout beyond what is listed. Commit it as one change titled "Data corrections: cast, seasons, sketches, options."

## 1. Cast tenure table (30 corrections, 19 additions)

The app's table was checked name by name against Wikipedia's list of all 172 official cast members. It had 26 people with the wrong start or end season, 4 people whose two separate stints were collapsed into one range that included seasons they were never on, and 18 official cast members missing entirely.

The complete corrected table is in `audit/CAST_TENURE_corrected.js`. Replace the whole `CAST_TENURE` block with it. It keeps the same `[first, last]` format for 170 names and uses a list of ranges for the four people with gaps:

```
"Brian Doyle-Murray": [[5, 5], [7, 7]],
"Al Franken": [[5, 5], [11, 11], [13, 20]],
"Don Novello": [[5, 5], [11, 11]],
"Harry Shearer": [[5, 5], [10, 10]],
```

**Code change required for the list-of-ranges format.** Four places read the table as a single `[first, last]` pair. Change them to go through one helper.

- `seasonsFor(name)`: if the value's first element is an array, flatten every range; otherwise expand the single range. Return the sorted list of seasons.
- `tradeOffsFor`, `WhyThisSeason` (`castOnSeason`), `castSweetSpots`: replace `season >= t[0] && season <= t[1]` with `seasonsFor(name).includes(season)`.
- `castForSeason`: replace the destructured `[first, last]` filter with `seasonsFor(name).includes(season)`.

**The 30 corrections, so the diff can be read:**

| Name | Was | Now | Why |
|---|---|---|---|
| Heidi Gardner | 43 to 51 | 43 to 50 | Let go before S51 |
| Ego Nwodim | 44 to 51 | 44 to 50 | Left before S51 |
| Michael Longfellow | 48 to 51 | 48 to 50 | Let go before S51 |
| Emil Wakim | 50 to 51 | 50 | One season |
| Devon Walker | 48 to 49 | 48 to 50 | Was on S50, let go before S51 |
| John Higgins | 47 to 51 | 47 to 50 | Left the show before S51 |
| Martin Herlihy | 47 to 51 | 47 to 50 | Writer only in S51 |
| Fred Armisen | 28 to 39 | 28 to 38 | Left May 2013. The S38 tag already says so |
| A. Whitney Brown | 12 to 16 | 11 to 16 | Joined during S11 |
| Brad Hall | 8 to 10 | 8 to 9 | Left after S9 |
| Leslie Jones | 40 to 45 | 40 to 44 | Left after S44 |
| Chris Kattan | 21 to 27 | 21 to 28 | Left May 2003 |
| Tim Kazurinsky | 7 to 9 | 6 to 9 | Joined spring 1981 |
| Molly Kearney | 48 | 48 to 49 | Two seasons |
| Michael McKean | 20 | 19 to 20 | Joined January 1994 |
| Mark McKinney | 21 to 22 | 20 to 22 | Joined January 1995 |
| Kate McKinnon | 38 to 47 | 37 to 47 | Joined April 2012 |
| Tim Meadows | 17 to 25 | 16 to 25 | Joined February 1991 |
| Jay Mohr | 17 to 19 | 19 to 20 | 1993 to 1995 |
| Bobby Moynihan | 34 to 43 | 34 to 42 | Left May 2017 |
| Mike Myers | 15 to 20 | 14 to 20 | Joined January 1989 |
| Mike O'Brien | 38 to 39 | 39 | Featured player for S39 only |
| Amy Poehler | 27 to 33 | 27 to 34 | Left November 2008 |
| Maya Rudolph | 26 to 33 | 25 to 33 | Joined May 2000 |
| Molly Shannon | 21 to 26 | 20 to 26 | Joined February 1995 |
| Casey Wilson | 34 | 33 to 34 | Joined February 2008 |
| Brian Doyle-Murray | 5 to 8 | 5 and 7 | Two stints, not on S6 or S8 |
| Al Franken | 11 to 20 | 5, 11, and 13 to 20 | Three stints, not on S12 |
| Don Novello | 5 to 11 | 5 and 11 | Two stints |
| Harry Shearer | 5 to 10 | 5 and 10 | Two stints |

**The 19 additions:** Jeremy Culhane (51), Chloe Troast (49), Chris Elliott (20), Christine Ebersole (7), Robert Smigel (17 to 18), Ben Stiller (14), Fred Wolf (21 to 22), Dan Vitale (11), Peter Aykroyd (5), Tom Davis (5), Jim Downey (5), Tom Schiller (5), Alan Zweibel (5), Paul Shaffer (5), George Coe (1), Michael O'Donoghue (1), Matthew Laurance (6), Laurie Metcalf (6), Emily Prager (6).

Several of those were credited for one to six episodes (Coe, O'Donoghue, Schiller, Zweibel, Downey, Metcalf, Prager). They are included because the picker claims every credited cast member, and hardcore fans enjoy that Laurie Metcalf was technically in the cast for one show. If the clutter bothers Eddie, drop those seven and change the picker's claim.

**Two names stay by choice, not by record.** John Higgins and Martin Herlihy were writers, not credited cast. They stay because Please Don't Destroy was on camera every week for four seasons. Ben Marshall's range starts at S47 for the same reason, though he only became official cast in S51.

**Note for the cast round photos:** Wikipedia photo lookups use the name as the page title. Common names among the additions (Mike O'Brien, Tom Davis, Jim Downey, Fred Wolf) will likely hit disambiguation pages, so those tiles fall back to monograms. That's fine.

## 2. Season tags (the one-line summaries)

- S15: "Mike Myers joins." He joined in S14, January 1989. Say "Myers' first full season."
- S19: "Spartan Cheerleaders debut." They debuted November 11, 1995, which is S21. Replace with "Farley and Sandler still standing."
- S21: "McKinney" listed among the arrivals. He joined in S20, January 1995. Drop him from the S21 list or say "McKinney's first full season."
- S24: "Colin Quinn takes Update." Quinn took the desk January 10, 1998, which is S23. Move that phrase to the S23 tag or drop it.
- S26: "Maya Rudolph joins." She joined in May 2000, the end of S25. Say "Maya's first full season."
- S33: "Poehler's farewell run." Her last episode was November 15, 2008, which is S34. Move it to S34.
- S37: "Timberlake joins Five-Timers." That was March 9, 2013, S38. Move it to S38.
- S38: lists "McKinnon, Strong, Bryant, Bennett, Mooney as featured." McKinnon joined in S37 (April 2012). Bennett and Mooney joined in S39. Only Strong and Bryant are S38 arrivals.
- S39: "Fallon hosts to send off Fey." Fey left the cast in 2006. Rewrite around Seth Meyers' February 1, 2014 send-off, and add Bennett and Mooney arriving.
- S43: "Mikey Day, Heidi Gardner." Day joined in S42. Say "Gardner arrives."
- S44: "Mulaney hosts twice." Once, March 2, 2019.
- S51: "Bowen's farewell after Christmas." His last show was the December 20 Christmas episode. "At Christmas."

## 3. Hot takes

The hot take for S19 ("Spartans debut") and S24 ("Ferrell at full Bush," but his Bush began with the 2000 campaign) are wrong for the same reasons as above. Both are replaced by the full rewrite in DESIGN_COPY_AUDIT.md, section B7, which was written against the corrected dates.

## 4. Sketch catalog ("Watch this next" and "Also in your lane")

- "Bass-O-Matic '76" is filed under S2. It aired April 17, 1976, S1.
- "Spartan Cheerleaders debut" is filed under S19. Move to S21.
- "Jizz In My Pants" is filed under S33. It aired December 6, 2008, S34.
- "Cork Soakers with Janet Jackson" is filed under S30. Janet Jackson hosted April 10, 2004, S29.
- "Janet Reno's Dance Party finale" is filed under S25. Reno appeared January 20, 2001, S26.
- "Celebrity Jeopardy with Burt Reynolds" is filed under S24. Norm was gone by then. The Turd Ferguson episode was October 23, 1999, S25, with Norm hosting. Move to S25 and retitle "Celebrity Jeopardy: Turd Ferguson."
- "Mr. Mike's Least-Loved Bedtime Stories" is filed under S1. The best-known one (The Soiled Kimono) aired December 17, 1977, S3. Move to S3.
- "King Bee with Stevie Wonder" under S4 doesn't match anything I can confirm. The Blues Brothers did "I'm a King Bee" in S3 (April 22, 1978); Stevie Wonder hosted in S8 (May 1983). Eddie decides what this was meant to be, or drop it.

## 5. Option copy (what the user reads on a button)

- Pre-tape sub-question, "Location & mockumentary pre-tapes": cites "Bodega Bathroom. Diner Lobster." Both are live sketches. Keep "Bad Boys" and add "Wells for Boys" or "Inside SoCal."
- 10-to-1 sub-question, "Marcello-era surrealism": cites Domingo as "the current surreal end-of-show stuff." Domingo is a mid-show musical sketch. Rename or recite.
- 10-to-1 sub-question, "Armisen / Hader quiet weirdness": cites "The Two A-holes." That's Wiig and Sudeikis. Swap in "Vinny Vedecci. The Manuel Ortiz Show. Fericito."
- Politics sub-question, "Cabinet & Congress": "Kavanaugh's Matt Damon" is inverted. "Matt Damon's Kavanaugh."
- Update sub-question, "Deadpan one-liners": "Murderer's Row" is an unclear reference. Cut it, or replace with "Note to self."
- Recurring sub-question, "Surreal weirdos": "The Whisperer" is an unclear reference. Confirm or cut.
- Music sub-question, "Now": cites "NewJeans." I can't find a NewJeans performance on SNL. Confirm or cut. (KATSEYE will be the S52 premiere's musical guest, which is a fine replacement once it airs.)

## 6. Option weights (points a button gives to seasons)

- Update desk adaptive, "Colin Quinn": weighted 24, 25, 26. He anchored January 1998 through May 2000, so 23, 24, 25. S26 was Fey and Fallon.
- Update desk adaptive, "Seth Meyers & Amy Poehler": add S34 at weight 1 (they co-anchored until November 2008).
- Impression adaptive, "Pharoah's Obama": weighted from S37. Pharoah took over Obama in September 2012, S38. Armisen had it in S37. Use 38 through 41.
- The Moment, "Buckwheat": weighted S10 at 4. Eddie Murphy was gone by S10. Remove the S10 entry.
- The Moment, "Spartan Cheerleaders": weighted S19 and S20. They didn't exist yet. Remove both; keep 21 through 25.
- The Moment, "Roxbury Guys": add S21 (they debuted in March 1996).
- Recurring sub-question, "Suburban absurdity": weighted S20 at 1 for the Spartans. Remove.
- Host sub-question, "Pop star going double duty": weights skip S38, which had both Bieber (February 2013) and Timberlake (March 2013) doing double duty. Add 38 at weight 3.

## 7. Could not verify: confirm or cut

These are in the current data and I could not confirm them from a source. Eddie knows the show; a thirty-second check each.

- Sketch catalog, S17: "Hans and Franz pump up Schwarzenegger." Arnold's Hans and Franz cameo is real, but confirm it was S17.
- Sketch catalog, S39: "Drunk Uncle on New Year's." Confirm the New Year's framing, or retitle "Drunk Uncle at the desk."
- Sketch catalog, S4: "King Bee with Stevie Wonder." See section 4.
- Update sub-question: "Murderer's Row." See section 5.
- Recurring sub-question: "The Whisperer." See section 5.
- Music sub-question: "NewJeans." See section 5.
- The Moment, "Master Thespian": weighted S12 and S13. Lovitz joined in S11 (1985) and the character dates from then. Consider adding S11.

## Verification

After the change: `npm run build` passes, the cast picker shows 174 names, searching "Elliott" finds Chris Elliott, and picking Al Franken lights up S5, S11, and S13 through S20 in "Your cast overlap" with nothing in between.
