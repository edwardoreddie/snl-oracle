# SNL Oracle: scoring logic audit

Written September 9, 2026 against the repo as of the May 18 commit. Every finding below was measured by replaying the real quiz flow in `audit/sim.js`, not by reading the code and guessing. Rerun `node audit/sim.js` after each fix and compare against the TARGET lines it prints.

## How to work this file with Claude Code

- Do the steps in order. Step 0 is the data corrections file and Step 1 is a file split. Both are mechanical and make everything after them testable.
- For each step: explain the change in plain English, make it, run `node audit/sim.js`, show before and after numbers, then wait for Eddie's OK before committing.
- Commit after each step with a short message. Vercel deploys every push, so a bad step can be reverted on its own.
- Never change the look of the site while doing this. Logic only.

## Step 0. Apply DATA_CORRECTIONS.md (start here)

The cast table, several season summaries, eight sketch catalog entries, and a handful of option weights are factually wrong. All of it is listed, with sources and dates, in `audit/DATA_CORRECTIONS.md`, and the corrected cast table is ready to paste from `audit/CAST_TENURE_corrected.js`. Do that file first and commit it on its own. Do not add Season 52 yet. It premieres September 26, 2026 and has nothing to rewatch until a few episodes exist.

## Step 1. Split the logic out of App.jsx (no behavior change)

Right now everything is in one 2,400-line file, so the scoring can't be tested without a browser. Move the pure data and functions into `src/logic.js` and import them back into `App.jsx`.

Move: everything from `FEEDBACK_URL` down through `TOTAL_ROUNDS` (the constants block that ends around line 1028). That is `CAST_TENURE`, `ALL_CAST`, `seasonsFor`, `SEASONS`, `HOT_TAKES`, `ASPECTS`, `ASPECT_IDS`, `ASPECT_ROUND`, `CAST_ROUND`, `MOMENT_OPTIONS`, `ADAPTIVE_POOL`, `SKETCHES`, `pickSketches`, `sketchYouTubeUrl`, `pickCrossSeasonSketches`, `LORNE_QUOTE`, `ARCHETYPES`, `archetypeFromPicks`, `CAST_BOOST`, `scoreFromPicks`, `topSeasons`, `tradeOffsFor`, `predictAge`, `youtubeLink`, `peacockLink`, `pickNextAdaptive`, and the round index constants. Export all of them by name.

Also move the aspect-to-adaptive skip map out of the `App` component into `logic.js` as an exported `coveredByAspects(aspectIds)` function, so the simulator uses the same map the app does.

This exact split was trialed on September 9 and builds clean with `npm run build`. Run `node audit/sim.js` afterward. It should print the baseline numbers in this document.

## Step 2. Season gravity: the weight tables funnel everyone to the same few seasons

**What the sim shows.** With random answers, a fair quiz would let each season win about 2% of the time. Instead Season 42 wins 22%, Season 34 wins 11%, and 17 seasons win under 0.3%. Season 45 never wins at all. The reason is in section 4 of the sim output: S42 can collect 499 points across 38 different answers, while S6 can collect 41 across 4. That is a 12x gap. A user with mixed taste drifts to S42 no matter what they like.

**Why it matters.** Coherent tastes still land right (the named profiles in section 5 all hit their band). The people who get bad results are the majority: fans with taste spread across eras, and casual clickers.

**Fix.** Two parts.

1. Normalize gravity at scoring time rather than hand-editing 500 numbers. At module load, compute each season's total available positive weight (the same sum section 4 prints). In `scoreFromPicks`, divide every aspect, sub-question, and adaptive contribution to a season by `Math.sqrt(total[s] / median)`. Cast boosts are not divided. Tune the exponent (start with square root) until the random-answer max share is under 8% while all five named profiles still land in their band. Do not aim for perfectly flat. A season with a big catalog of famous moments should win a little more often than a nothing season.
2. Fill the starved seasons with real options in Step 3. Normalization alone can't help a season that no answer points to.

**Targets.** Max random share under 8%. Zero seasons under 0.3%. Gravity ratio under 4x. All five named profiles inside their expected band.

## Step 3. Coverage gaps: whole eras have no option that fits

**What the sim shows.** Section 3 lists, for every question, the seasons where none of the options apply. The worst:

- Update style: nothing for S1 to S10. There is no Chevy, Curtin, Aykroyd, or Murray desk option. A 70s Update fan is forced to pick something from 1985 or later.
- Host energy and the host-era adaptive: nothing before S22.
- 10-to-1 flavor: nothing before S28. Weird late sketches did not start with Forte.
- Cold open style: nothing for S1 to S11 or S16 to S21.
- Impression era: nothing for S1 to S13. No Aykroyd Carter, no Piscopo Reagan, no Carvey-adjacent 80s.
- Recurring type: nothing for S26 to S34 (the Ferrell-to-Wiig years) and S1 to S6.

**Why it matters.** Every forced answer pushes the user toward an era they didn't pick, and stacks onto the gravity problem in Step 2.

**Fix.** Add one or two options per question for each uncovered era. Eddie knows the show; Claude Code should propose the options and weights and Eddie approves. Examples to start from:

- Update style: "The original desk" (Chevy, Jane, Dan and Bill) S1 to 5. "Anchor as straight man" (Brad Hall S8 to 9, Kevin Nealon S17 to 19, Colin Quinn S23 to 25). Those two options close every Update gap the sim lists.
- Host energy: "Steve Martin owning the building" S2 to 5. "Musician hosts of the early years" S1 to 10.
- 10-to-1 flavor: "Aykroyd and Belushi getting strange" S1 to 4. "Murphy and Piscopo loose bits" S6 to 9. "Sandler and Farley closing the show" S16 to 20. Eddie should sanity-check these; the 10-to-1 as a named idea is newer than the sketches it describes.
- Impression era: "Aykroyd's Nixon and Carter" S1 to 4. "Piscopo's Reagan" S7 to 9. "Hammond's Gore" S26 to 27.
- Recurring type: "Ferrell-era bigness" (Spartans, Cowbell, Celebrity Jeopardy) S21 to 27. "Wiig-era weirdos" (Target Lady, Gilly, Penelope) S31 to 37.

Rerun the sim after each question is filled. The uncovered counts should drop and the starved-season list in section 1 should shrink.

## Step 4. The adaptive rounds are not adaptive

**What the sim shows.** Section 2. "The Moment" is asked in 99% of quizzes, "The Skip" in 97%, and 95% of the time they come back to back. That is the same 37-option list twice in a row, in rounds 6 and 7, for almost every user. Meanwhile "Host" is asked 8% of the time and "10-to-1" 10%. The four "adaptive" rounds are effectively fixed.

**Why.** `pickNextAdaptive` scores a question by counting how many different options the top five candidate seasons "prefer." A 37-option list always produces the most distinct preferences, so it always wins. The tiebreak (`spread`) adds up total weight, which rewards questions that give everyone points, not questions that separate seasons. And a season with no weights in a question is counted as preferring option 0, which is a bug that makes "The Feel" look like it discriminates when it doesn't.

**Fix.**

1. Replace the discrimination score. For each question, for each option, take that option's weights across the current top five seasons and compute the spread (max minus min, or variance). Sum across options. High sum means answering this question will pull the candidates apart. Ignore candidates that have zero weight everywhere in the question, and penalize questions where two or more of the top five have no weight at all (the question can't help them).
2. Never ask `moment-skip` in the round right after `moment`. Better: only offer the skip question when the top two candidates are within 15% of each other, since that is the one situation a negative signal is needed.
3. Make "The Moment" actually adaptive. Instead of all 37 options, show the 8 to 10 options that carry weight for the current top eight candidate seasons, plus two wildcards from elsewhere. Shorter screen, and it discriminates among things the user has actually seen.
4. The same trimming fixes a subtler flaw in "The Skip": a 24-year-old skipping "Land Shark" is not rejecting Season 1, they have never seen it. Unfamiliarity currently scores as dislike, up to 20 points against a season. Only offering skip options from the user's own candidate seasons removes that.

**Targets.** No adaptive question asked in more than 60% of quizzes. Moment-then-skip back to back at 0%. Named profiles still land.

## Step 5. The cast boost is upside down at the extremes

**What the sim shows.** Section 6. `CAST_BOOST = 40` is split evenly across a performer's tenure. Kenan gives 1.7 points per season, which is noise. Farley gives 8. A one-season featured player gives 40 points to a single season, which equals two of the strongest possible answers. The README claims cast picks weigh about four times more than anything else; that is only true for short tenures.

**Fix.** Use `per = Math.min(15, 24 / Math.sqrt(tenureLength))`. That gives Luke Null 15, Farley 10.7, Forte 8.5, Hartman 8.5, Armisen 6.9, Kenan 5. Optionally count a performer's first season at half weight, since featured-player rookie years rarely define anyone's peak. Keep cast boosts out of the Step 2 normalization.

**Targets.** Any single pick between about 3 and 15 points to its peak season.

## Step 6. "More like your taste" ignores your taste

**What the code does.** `pickCrossSeasonSketches` sorts candidate sketches by aspect overlap, then iconic first, then earliest season first. It never looks at the user's scores. A modern fan who won S49 gets sent to S18 "Opera Man" first. Eddie's S32 result recommends S3 "Mr. Bill" and S10 "White Like Me."

**Fix.** Pass the score table in and sort by the user's score for the sketch's season (their runner-up seasons first), then by aspect overlap. Keep the one-per-season rule.

## Step 7. Watch This Next comes up empty for some winners

**What the sim shows.** Section 7. Seasons 6, 9, 11, and 28 have zero sketches in the catalog, so the "Watch This Next" section renders nothing for those winners. Seasons 5, 29, 38, and 44 have one. Every recent season has only two or three, which is thin for the seasons people are most likely to land on.

**Fix.** Data work. At least two entries per season, four or five for S40 onward. Eddie approves each batch.

## Step 8. Small logic fixes, bundle these into one commit

- `predictAge` hardcodes 2026. Use `new Date().getFullYear()`. The "Lorne age" will be a year off starting January.
- `coveredByAspects` only maps four aspects. Add `cold-open` and `topical` to `impression`, `recurring` to `sketch-type`, and `pretape` to `sketch-type`, so a user who already answered a sub-question on a topic does not get the adaptive version of the same question.
- The host sub-question and the host-era adaptive question are near duplicates with hand-copied weights, and so are impression-era and impression. Once the skip map above is fixed, delete the adaptive duplicates or have them share one options array so there is one place to edit.
- The archetype and the share link's `a` parameter come from whichever aspect the user tapped first. The number badges show order, but nothing says the first tap matters. Either add one line under the Round 1 prompt ("Your first pick becomes your archetype") or derive the archetype from the aspect that contributed the most points to the winning season. The second is better and is one loop over the picks.
- `winnerPct` on the result page divides by the sum of the top three scores. After the negative-signal questions a runner-up can be negative, which makes the percentage nonsense. Clamp scores at zero before summing.

## Verification checklist before calling it done

- `node audit/sim.js` hits every TARGET line.
- `npm run build` passes.
- Play the live quiz three times: your own taste, a 70s taste, a modern taste. Each should land in its band, the four adaptive rounds should differ between runs, and the same list should never appear twice in a row.
- Share link, story image, Ko-fi button, and feedback link still work. None of this touches them, but check.

## Baseline numbers, September 9, 2026

- Random-answer max share: S42 at 22.1%. Seasons under 0.3%: 17.
- Gravity ratio: 12.2x.
- Adaptive: moment 99%, moment-skip 97%, back to back 95%, host-era 8%, ten-to-one 10%.
- Cast boost range: 1.7 (Kenan) to 40 (any one-season player).
- Sketch catalog: four seasons with zero, four with one.
- Named profiles: all five land in band. That part works today and must still work after every step.
