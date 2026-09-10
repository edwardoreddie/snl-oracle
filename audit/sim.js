// SNL Oracle scoring simulator.
// Run from the project folder:  node audit/sim.js
// Requires the pure logic to live in src/logic.js (see LOGIC_AUDIT.md, Step 1).
//
// It replays the real quiz flow (aspects > 3 sub-questions > cast > 4 adaptive)
// thousands of times with random answers, plus a few named taste profiles,
// and prints the numbers the audit cares about. Rerun after every fix.

import * as L from "../src/logic.js";

const need = ["ASPECTS", "ASPECT_IDS", "ALL_CAST", "ADAPTIVE_POOL", "SKETCHES", "scoreFromPicks", "topSeasons", "pickNextAdaptive", "predictAge"];
const missing = need.filter((k) => !(k in L));
if (missing.length) {
  console.error("src/logic.js is missing exports: " + missing.join(", ") + ". Do Step 1 of LOGIC_AUDIT.md first.");
  process.exit(1);
}

const LAST_SEASON = Math.max(...Object.keys(L.SEASONS).map(Number));

// If App still keeps the aspect-to-adaptive skip map inside the component, mirror it here.
const covered = L.coveredByAspects || ((ids) => ids.flatMap((id) => ({ update: ["update"], host: ["host-era"], impressions: ["impression"], "ten-to-one": ["ten-to-one"] })[id] || []));

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const byLabel = (q, frag) => q.options.find((o) => o.label.toLowerCase().includes(frag.toLowerCase())) || q.options[0];

// Replays one full quiz. opts lets a profile force specific answers.
export function runQuiz(rng, opts = {}) {
  const picks = [];
  const asked = [];
  const aspects = opts.aspects || shuffle([...L.ASPECT_IDS], rng).slice(0, 3);
  picks.push({ round: 0, type: "aspects", value: aspects, adaptiveId: null });
  aspects.forEach((a, i) => {
    const q = L.ASPECTS[a].subQuestion;
    const opt = opts.subPick ? opts.subPick(a, q) : q.options[Math.floor(rng() * q.options.length)];
    picks.push({ round: 1 + i, type: "single", value: opt, adaptiveId: null });
  });
  const cast = opts.cast || shuffle([...L.ALL_CAST], rng).slice(0, 1 + Math.floor(rng() * 3));
  picks.push({ round: 4, type: "multi-cast", value: cast, adaptiveId: null });
  for (let r = 5; r < 9; r++) {
    const usedIds = picks.filter((p) => p.adaptiveId).map((p) => p.adaptiveId);
    const q = L.pickNextAdaptive(picks, [...usedIds, ...covered(aspects)]);
    if (!q) break;
    asked.push(q.id);
    const opt = opts.adaptivePick ? opts.adaptivePick(q) : q.options[Math.floor(rng() * q.options.length)];
    picks.push({ round: r, type: "single", value: opt, adaptiveId: q.id });
  }
  const scores = L.scoreFromPicks(picks);
  return { picks, asked, scores, top: L.topSeasons(scores, 3), aspects, cast };
}

function pct(n, d) { return (100 * n / d).toFixed(1) + "%"; }
function ranges(arr) {
  if (!arr.length) return "none";
  const out = []; let a = arr[0], b = arr[0];
  for (let i = 1; i <= arr.length; i++) {
    if (arr[i] === b + 1) b = arr[i];
    else { out.push(a === b ? `${a}` : `${a}-${b}`); a = arr[i]; b = arr[i]; }
  }
  return out.join(", ");
}

// ---------- 1. Random answers: which seasons can win? ----------
const N = 20000;
const rng = mulberry32(42);
const wins = {}; const askedCount = {}; let backToBack = 0;
for (let s = 1; s <= LAST_SEASON; s++) wins[s] = 0;
for (let i = 0; i < N; i++) {
  const r = runQuiz(rng);
  wins[r.top[0].season]++;
  r.asked.forEach((id) => (askedCount[id] = (askedCount[id] || 0) + 1));
  for (let k = 0; k < r.asked.length - 1; k++) if (r.asked[k] === "moment" && r.asked[k + 1] === "moment-skip") backToBack++;
}
const rows = Object.entries(wins).map(([s, w]) => [+s, w]).sort((a, b) => b[1] - a[1]);
console.log("=== 1. RANDOM ANSWERS, " + N + " quizzes: who wins? (fair would be about 2% each) ===");
console.log("Top 8:   " + rows.slice(0, 8).map(([s, w]) => `S${s} ${pct(w, N)}`).join("   "));
console.log("Max share: " + pct(rows[0][1], N) + "   TARGET: under 8%");
const starved = rows.filter(([, w]) => w / N < 0.003).map(([s]) => s).sort((a, b) => a - b);
console.log("Seasons under 0.3%: " + starved.length + "  (" + ranges(starved) + ")   TARGET: zero");

// ---------- 2. Adaptive rounds: are they adaptive? ----------
console.log("\n=== 2. ADAPTIVE QUESTIONS: how often each is asked ===");
Object.entries(askedCount).sort((a, b) => b[1] - a[1]).forEach(([id, c]) => console.log(`  ${id.padEnd(12)} ${pct(c, N)}`));
console.log("moment then moment-skip back to back: " + pct(backToBack, N) + "   TARGET: 0%, and no question above 60%");

// ---------- 3. Coverage: eras with no fitting option ----------
function gaps(options) {
  const set = new Set(); options.forEach((o) => Object.keys(o.weight || {}).forEach((s) => set.add(+s)));
  const g = []; for (let s = 1; s <= LAST_SEASON; s++) if (!set.has(s)) g.push(s); return g;
}
console.log("\n=== 3. COVERAGE: seasons with no option that fits (user is forced off their era) ===");
L.ASPECT_IDS.forEach((id) => { const g = gaps(L.ASPECTS[id].subQuestion.options); console.log(`  sub ${id.padEnd(12)} ${String(g.length).padStart(2)} uncovered: ${ranges(g)}`); });
L.ADAPTIVE_POOL.forEach((q) => { const g = gaps(q.options); console.log(`  adp ${q.id.padEnd(12)} ${String(g.length).padStart(2)} uncovered: ${ranges(g)}`); });

// ---------- 4. Weight gravity per season ----------
const tot = {}; for (let s = 1; s <= LAST_SEASON; s++) tot[s] = 0;
const add = (w, m) => Object.entries(w || {}).forEach(([s, v]) => { tot[s] += v * m; });
L.ASPECT_IDS.forEach((id) => { const a = L.ASPECTS[id]; add(a.weight, 4); a.subQuestion.options.forEach((o) => add(o.weight, 5)); });
L.ADAPTIVE_POOL.filter((q) => !q.negate).forEach((q) => q.options.forEach((o) => add(o.weight, 5)));
// Gravity is measured AFTER the scoring-time divisor, because that is what a
// user actually experiences. The raw table totals are printed underneath for
// reference; Step 2 deliberately leaves those alone.
const div = L.GRAVITY_DIVISOR || {};
const eff = Object.entries(tot).map(([s, v]) => [+s, v / (div[s] || 1)]).sort((a, b) => b[1] - a[1]);
const g = Object.entries(tot).map(([s, v]) => [+s, v]).sort((a, b) => b[1] - a[1]);
const fmt = (rows) => rows.map(([s, v]) => `S${s} ${v.toFixed(0)}`).join("  ");
console.log("\n=== 4. GRAVITY: points a season can collect across every positive answer, after the divisor ===");
console.log("Heaviest: " + fmt(eff.slice(0, 5)) + "   Lightest: " + fmt(eff.slice(-5)));
console.log("Heaviest to lightest ratio: " + (eff[0][1] / Math.max(1, eff[eff.length - 1][1])).toFixed(1) + "x   TARGET: under 4x");
console.log("  (raw tables, before the divisor: " + fmt(g.slice(0, 3)) + " ... " + fmt(g.slice(-3)) + "   ratio " + (g[0][1] / Math.max(1, g[g.length - 1][1])).toFixed(1) + "x)");

// ---------- 5. Named profiles: do coherent tastes land where they should? ----------
console.log("\n=== 5. NAMED PROFILES (top 3 should sit inside the expected band) ===");
const profiles = [
  { name: "Eddie: Forte + Armisen, weird Update, Lonely Island, Forte 10-to-1", expect: "S31-35",
    aspects: ["update", "pretape", "ten-to-one"],
    subPick: (a, q) => a === "update" ? byLabel(q, "Weird character") : a === "pretape" ? byLabel(q, "Lonely Island") : byLabel(q, "Forte"),
    cast: ["Will Forte", "Fred Armisen"],
    adaptive: { moment: "Dick in a Box", "moment-skip": "Land Shark", "sketch-type": "Almost-broken", impression: "Ferrell", bores: "original-cast", update: "Seth Meyers & Amy", feel: "friend group", "host-era": "comedian", "ten-to-one": "Forte" } },
  { name: "70s fan: Gilda, Belushi, Aykroyd, punk bookings, raw theater feel", expect: "S1-5",
    aspects: ["loose", "music", "update"],
    subPick: (a, q) => a === "loose" ? byLabel(q, "Raw downtown") : a === "music" ? byLabel(q, "Original punk") : byLabel(q, "Sharp commentary"),
    cast: ["Gilda Radner", "John Belushi", "Dan Aykroyd"],
    adaptive: { update: "Chevy", moment: "Land Shark", "moment-skip": "Bad Bunny", feel: "New York theater", bores: "Heavy political", "sketch-type": "Recurring", impression: "Carvey" } },
  { name: "Modern fan: Bowen, Sherman, Marcello, Sherman gross-outs, weird correspondents", expect: "S46-50",
    aspects: ["recurring", "ten-to-one", "update"],
    subPick: (a, q) => a === "recurring" ? byLabel(q, "Modern") : a === "ten-to-one" ? byLabel(q, "Sherman") : byLabel(q, "Weird character"),
    cast: ["Bowen Yang", "Sarah Sherman", "Marcello Hernández"],
    adaptive: { moment: "Iceberg", "moment-skip": "Land Shark", "sketch-type": "Almost-broken", impression: "JAJ", bores: "original-cast", feel: "friend group", "host-era": "pop star" } },
  { name: "Mixed fan: Farley + Hader + McKinnon, loser characters, Jost/Che, Lonely Island", expect: "S31-37 or S18",
    aspects: ["recurring", "update", "pretape"],
    subPick: (a, q) => a === "recurring" ? byLabel(q, "Loser") : a === "update" ? byLabel(q, "Cool detached") : byLabel(q, "Lonely Island"),
    cast: ["Chris Farley", "Bill Hader", "Kate McKinnon"],
    adaptive: { moment: "Matt Foley", "moment-skip": "Land Shark", "sketch-type": "Recurring", impression: "McKinnon", bores: "original-cast", feel: "friend group", "host-era": "comedian" } },
  { name: "90s fan: Farley, Sandler, Hartman, Coffee Talk, Norm at the desk", expect: "S16-22",
    aspects: ["recurring", "update", "impressions"],
    subPick: (a, q) => a === "recurring" ? byLabel(q, "Loser") : a === "update" ? byLabel(q, "Deadpan") : byLabel(q, "Hartman"),
    cast: ["Chris Farley", "Adam Sandler", "Phil Hartman"],
    adaptive: { moment: "Matt Foley", "moment-skip": "Bad Bunny", "sketch-type": "Recurring", bores: "Weird 10-to-1", feel: "friend group", "host-era": "comedian" } },
];
for (const p of profiles) {
  const r = runQuiz(() => 0.5, { aspects: p.aspects, subPick: p.subPick, cast: p.cast, adaptivePick: (q) => byLabel(q, p.adaptive[q.id] || "zzz") });
  console.log(`  ${p.name}\n     expect ${p.expect.padEnd(14)} got ${r.top.map((t) => `S${t.season} (${t.score.toFixed(0)})`).join("  ")}   asked: ${r.asked.join(" > ")}`);
}

// ---------- 6. Cast boost scale ----------
console.log("\n=== 6. CAST BOOST per season for a few picks (one strongest sub-answer = 20 pts) ===");
["Kenan Thompson", "Phil Hartman", "Will Forte", "Chris Farley", "Luke Null", "Jeremy Culhane"].forEach((n) => {
  const picks = [{ round: 4, type: "multi-cast", value: [n], adaptiveId: null }];
  const sc = L.scoreFromPicks(picks);
  const vals = Object.values(sc).filter((v) => v > 0);
  if (!vals.length) { console.log(`  ${n.padEnd(16)} not in CAST_TENURE (see Step 0)`); return; }
  console.log(`  ${n.padEnd(16)} ${L.seasonsFor(n).length} seasons -> ${Math.max(...vals).toFixed(1)} pts to the peak season`);
});
console.log("TARGET: a single pick never exceeds about 15 pts to any one season, and never drops below about 3");

// ---------- 7. Sketch catalog coverage ----------
const noSketch = []; const oneSketch = [];
for (let s = 1; s <= LAST_SEASON; s++) { const c = L.SKETCHES.filter((k) => k.season === s).length; if (c === 0) noSketch.push(s); else if (c === 1) oneSketch.push(s); }
console.log("\n=== 7. WATCH THIS NEXT: sketch catalog coverage ===");
console.log("Seasons with no sketches: " + (noSketch.join(", ") || "none") + "   With one: " + (oneSketch.join(", ") || "none") + "   TARGET: every season has at least 2");

// ---------- 8. Age formula ----------
const yr = new Date().getFullYear();
console.log("\n=== 8. AGE FORMULA ===");
console.log("predictAge(32) = " + JSON.stringify(L.predictAge(32)) + "   (this year is " + yr + "; the range should shift by one each January)");
