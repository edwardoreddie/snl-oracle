import { useState, useMemo, useEffect } from "react";
import {
  FEEDBACK_URL,
  STORY_WIDTH,
  STORY_HEIGHT,
  CAST_TENURE,
  ALL_CAST,
  CAST_ERAS,
  castInEra,
  seasonsFor,
  SEASONS,
  HOT_TAKES,
  ASPECTS,
  ASPECT_IDS,
  ASPECT_ROUND,
  CAST_ROUND,
  ADAPTIVE_POOL,
  pickSketches,
  sketchYouTubeUrl,
  pickCrossSeasonSketches,
  LORNE_QUOTE,
  ARCHETYPES,
  archetypeFromPicks,
  scoreFromPicks,
  topSeasons,
  topContributingAnswers,
  tradeOffsFor,
  predictAge,
  youtubeLink,
  peacockLink,
  pickNextAdaptive,
  ASPECT_ROUND_INDEX,
  SUB_QUESTION_START,
  CAST_ROUND_INDEX,
  ADAPTIVE_START,
  TOTAL_ROUNDS,
  coveredByAspects,
} from "./logic.js";


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
  return Object.keys(CAST_TENURE).filter((name) => seasonsFor(name).includes(season));
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
  const [friendResult, setFriendResult] = useState(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const s = parseInt(params.get("s") || "", 10);
    const a = params.get("a");
    if (!s || !SEASONS[s]) return null;
    return { season: s, archetypeId: a && ARCHETYPES[a] ? a : null };
  });

  // Scroll back to top whenever we change rounds — UX polish for long question screens
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [round]);

  const advance = (value, type, adaptiveId) => {
    setPicks([...picks, { round, type, value, adaptiveId }]);
    setRound(round + 1);
  };

  const clearShareParams = () => {
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  };

  const reset = () => {
    setRound(0);
    setPicks([]);
    clearShareParams();
  };

  const startFromFriend = () => {
    setFriendResult(null);
    clearShareParams();
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
      const allUsed = [...usedIds, ...coveredByAspects(aspectsPick?.value)];
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
          <Header compact={round > 0 || isDone} />
          {friendResult && picks.length === 0 ? (
            <FriendResult result={friendResult} onStart={startFromFriend} />
          ) : !isDone && currentQ ? (
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

function Header({ compact }) {
  // After round 1 the full header is just pushing the question down a third of
  // a phone screen, so it collapses to the title at about half size.
  if (compact) {
    return (
      <div className="text-center mb-6">
        <h1 className="font-marquee" style={{ color: "#f4f1de", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", textShadow: "0 0 14px rgba(255, 200, 71, 0.3)", lineHeight: 1 }}>
          The SNL Oracle
        </h1>
      </div>
    );
  }
  return (
    <div className="text-center mb-10 rise">
      <div className="font-mono mb-3 flicker" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.2em" }}>★ LIVE FROM NEW YORK ★</div>
      <h1 className="font-marquee mb-2" style={{ color: "#f4f1de", fontSize: "clamp(2.5rem, 8vw, 4.5rem)", textShadow: "0 0 20px rgba(255, 200, 71, 0.4), 0 0 40px rgba(230, 57, 70, 0.2)", lineHeight: 1 }}>
        The SNL Oracle
      </h1>
      <div className="font-body italic mx-auto" style={{ color: "#c9b8a0", fontSize: "0.95rem", maxWidth: "460px", lineHeight: 1.45 }}>
        Tell the Oracle what you love. It names your peak season, runs Lorne's math on your age, and hands you a rewatch list.
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
      <div className="flex items-center justify-between mb-6 font-mono" style={{ color: "#a89684", fontSize: "11px", letterSpacing: "0.2em" }}>
        <span>{q.title}</span>
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
      <h2 className="font-body mb-3" style={{ color: "#f4f1de", fontSize: "clamp(1.6rem, 4.5vw, 2.3rem)", lineHeight: 1.2, fontWeight: 600 }}>{q.prompt}</h2>
      {q.sub && <p className="font-body italic mb-8" style={{ color: "#c9b8a0", fontSize: "1.02rem", lineHeight: 1.55 }}>{q.sub}</p>}
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

      <div
        className="flex items-center justify-between mb-5 font-mono"
        style={{ color: "#a89684", fontSize: "11px", letterSpacing: "0.2em", position: "sticky", top: 0, zIndex: 30, background: "#0a0710", paddingTop: "10px", paddingBottom: "10px" }}
      >
        <span style={{ color: ready ? "#ffc847" : "#e63946" }}>
          {ready ? `LOCKED IN 3 / 3` : `PICK ${remaining} MORE`}
        </span>
        <button onClick={submit} disabled={!ready} className="font-mono px-5 py-2 border transition" style={{ borderColor: ready ? "#ffc847" : "#3a2f44", color: ready ? "#0a0710" : "#5a4a3a", background: ready ? "#ffc847" : "transparent", fontSize: "11px", letterSpacing: "0.25em", cursor: ready ? "pointer" : "not-allowed" }}>
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
                <div className="font-digital" style={{ position: "absolute", top: 10, right: 14, color: "#e63946", fontSize: "1.4rem", lineHeight: 1 }}>
                  {order}
                </div>
              )}
              <div className="font-body" style={{ color: "#f4f1de", fontSize: "1.15rem", lineHeight: 1.25, fontWeight: 600 }}>
                {a.label}
              </div>
              <div className="font-body italic mt-1" style={{ color: "#8a7a6a", fontSize: "0.92rem", lineHeight: 1.45 }}>
                {a.sub}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center mt-6">
        <button onClick={submit} disabled={!ready} className="font-mono px-8 py-3 border transition" style={{ borderColor: ready ? "#ffc847" : "#3a2f44", color: ready ? "#0a0710" : "#5a4a3a", background: ready ? "#ffc847" : "transparent", fontSize: "11px", letterSpacing: "0.25em", cursor: ready ? "pointer" : "not-allowed" }}>
          ★ Next ★
        </button>
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
            <div className="font-mono mb-1" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.2em" }}>
              {i === 0 ? "↞ THIS" : "THAT ↠"}
            </div>
            <div className="font-body" style={{ color: "#f4f1de", fontSize: "1.3rem", fontWeight: 600, lineHeight: 1.25 }}>{opt.label}</div>
            <div className="font-body italic mt-1" style={{ color: "#8a7a6a", fontSize: "0.95rem", lineHeight: 1.45 }}>{opt.sub}</div>
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
            <div className="font-body" style={{ color: "#f4f1de", fontSize: "1.05rem", lineHeight: 1.3, fontWeight: 600 }}>{opt.label}</div>
            {opt.sub && <div className="font-body italic mt-1" style={{ color: "#8a7a6a", fontSize: "0.92rem", lineHeight: 1.45 }}>{opt.sub}</div>}
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
  const [era, setEra] = useState(null);
  const photoCount = Object.keys(photos).length;
  const photosLoaded = photoCount > 30;

  const toggle = (name) => {
    if (selected.includes(name)) setSelected(selected.filter((n) => n !== name));
    else if (selected.length < q.max) setSelected([...selected, name]);
  };
  const submit = () => { if (selected.length > 0) onAnswer(selected, "multi-cast"); };

  const empty = selected.length === 0;
  const trimmed = query.trim().toLowerCase();
  const filtered = ALL_CAST
    .filter((name) => (trimmed ? name.toLowerCase().includes(trimmed) : true))
    .filter((name) => (era ? castInEra(name, era) : true));

  return (
    <div className="rise" key={index}>
      <RoundHeader q={q} index={index} total={total} />

      {/* Sticky status bar */}
      <div style={{ position: "sticky", top: 0, background: "rgba(10, 7, 16, 0.92)", padding: "12px 0", zIndex: 5, backdropFilter: "blur(8px)" }}>
        <div className="flex items-center justify-between mb-3 font-mono" style={{ color: "#a89684", fontSize: "11px", letterSpacing: "0.2em" }}>
          <span style={{ color: empty ? "#e63946" : "#ffc847" }}>
            {empty ? "TAP A FACE BELOW ↓" : `SELECTED ${selected.length} / ${q.max}`}
          </span>
          <button onClick={submit} disabled={empty} className="font-mono px-5 py-2 border transition" style={{ borderColor: empty ? "#3a2f44" : "#ffc847", color: empty ? "#5a4a3a" : "#0a0710", background: empty ? "transparent" : "#ffc847", fontSize: "11px", letterSpacing: "0.25em", cursor: empty ? "not-allowed" : "pointer" }}>
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

      <div className="flex flex-wrap gap-2 mt-4">
        {[{ id: null, label: "All" }, ...CAST_ERAS].map((chip) => {
          const active = era === chip.id;
          return (
            <button
              key={chip.id || "all"}
              onClick={() => setEra(chip.id)}
              className="font-mono border transition"
              style={{
                borderColor: active ? "#ffc847" : "#3a2f44",
                color: active ? "#0a0710" : "#c9b8a0",
                background: active ? "#ffc847" : "rgba(255,255,255,0.02)",
                padding: "7px 14px",
                fontSize: "11px",
                letterSpacing: "0.2em",
                cursor: "pointer",
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <div className="font-mono mt-4 mb-3" style={{ color: "#8a7a6a", fontSize: "11px", letterSpacing: "0.2em" }}>
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
                      className="font-digital"
                      style={{
                        fontSize: "1.8rem",
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
              <div className="font-body mt-2 text-center" style={{ fontSize: "11px", color: isSel ? "#e63946" : "#f4f1de", lineHeight: 1.25, fontWeight: 500 }}>
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
  const archetype = archetypeFromPicks(picks, winner.season);
  const seasonPhoto = useSeasonPhoto(winner.season);
  const [showPicks, setShowPicks] = useState(false);
  const [savingStory, setSavingStory] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const downloadDataUrl = (dataUrl, filename) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStoryDataUrl = () => generateStoryImage(winner, archetype);
  const storyFilename = `snl-oracle-s${winner.season}.png`;

  const handleDownloadImage = async () => {
    if (savingStory) return;
    setSavingStory(true);
    setSaveError(null);
    try {
      const dataUrl = renderStoryDataUrl();
      if (!dataUrl) throw new Error("Couldn't render image");
      downloadDataUrl(dataUrl, storyFilename);
    } catch (e) {
      console.error(e);
      setSaveError(e?.message || "Couldn't render image. Try again.");
    }
    setSavingStory(false);
  };

  const handlePostToIG = async () => {
    if (savingStory) return;
    setSavingStory(true);
    setSaveError(null);
    setIgToast(null);
    try {
      const dataUrl = renderStoryDataUrl();
      if (!dataUrl) throw new Error("Couldn't render image");
      // Mobile path: invoke native share sheet with image + caption text.
      // Instagram appears as an option; caption auto-fills.
      if (typeof navigator !== "undefined" && navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], storyFilename, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              text: captionText,
              title: "My SNL Oracle result",
            });
            setSavingStory(false);
            return;
          }
        } catch (e) { /* fall through to desktop path */ }
      }
      // Desktop path: download the image AND copy the caption to clipboard
      // so the user can paste it directly into Instagram.
      downloadDataUrl(dataUrl, storyFilename);
      if (navigator.clipboard) {
        try { await navigator.clipboard.writeText(captionText); } catch (e) { /* clipboard blocked */ }
      }
      setIgToast("Image downloaded · caption copied. Open Instagram and paste.");
      setTimeout(() => setIgToast(null), 5000);
    } catch (e) {
      console.error(e);
      setSaveError(e?.message || "Couldn't render image. Try again.");
    }
    setSavingStory(false);
  };

  // Confidence: how clearly does the winner lead? Wide gap = strong match
  const gap = top[1] ? (winner.score - top[1].score) / Math.max(winner.score, 1) : 1;
  const runnerUp = top[1] || null;
  // A percentage here was always about a third, because it was the winner's
  // share of the top three, and it read as the Oracle being one-third sure.
  const confidence = gap > 0.35
    ? "Not close. This is your season."
    : gap > 0.15
      ? `Clear winner. S${runnerUp ? runnerUp.season : winner.season} was in the running.`
      : `Close call with S${runnerUp ? runnerUp.season : winner.season}. Both are yours.`;
  const confidenceColor = gap > 0.35 ? "#ffc847" : gap > 0.15 ? "#c9b8a0" : "#e63946";

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const primaryAspectId = picks[ASPECT_ROUND_INDEX]?.value?.[0];
  const resultParams = new URLSearchParams();
  resultParams.set("s", String(winner.season));
  if (primaryAspectId) resultParams.set("a", primaryAspectId);
  const resultUrl = `${siteUrl}/?${resultParams.toString()}`;
  const hotTakeForShare = HOT_TAKES[winner.season];
  const captionText = [
    `★ My SNL Oracle peak season: S${winner.season} (${winnerMeta.year}–${winnerMeta.end}) ★`,
    hotTakeForShare ? `\n"${hotTakeForShare}"\n` : "",
    `I'm ${archetype.name}. Find your peak: ${resultUrl}`,
  ].filter(Boolean).join("\n");
  const [copied, setCopied] = useState(false);
  const [igToast, setIgToast] = useState(null);
  const handleCopy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(captionText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resultUrl)}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.replaceState({}, "", `${window.location.pathname}?${resultParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner.season, primaryAspectId]);

  // Conditional Ko-fi floating tip button — only on the result page,
  // styled to match the site (gold + near-black instead of white).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SCRIPT_ID = "kofi-overlay-script";
    const initOverlay = () => {
      if (window.kofiWidgetOverlay && typeof window.kofiWidgetOverlay.draw === "function") {
        try {
          window.kofiWidgetOverlay.draw("snloracle", {
            type: "floating-chat",
            "floating-chat.donateButton.text": "Tip the Oracle",
            "floating-chat.donateButton.background-color": "#ffc847",
            "floating-chat.donateButton.text-color": "#0a0710",
            "floating-chat.position": "bottom-right",
          });
        } catch (e) { /* widget already drawn */ }
      }
    };
    let script = document.getElementById(SCRIPT_ID);
    if (script) {
      initOverlay();
    } else {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
      script.async = true;
      script.onload = initOverlay;
      document.body.appendChild(script);
    }
    return () => {
      // Ko-fi injects elements with IDs starting with "kofi-" plus an
      // overlay <div>; remove them so the floating button vanishes
      // when leaving the result page.
      document.querySelectorAll(
        '[id^="kofi-widget-overlay"], [id^="kofi-button"], [id^="floating-chat"], #kofi-widget-overlay'
      ).forEach((el) => el.remove());
    };
  }, []);

  return (
    <div>
      <div className="mb-10 text-center" style={{ background: "#000", padding: "80px 24px 60px", border: "1px solid #1a1424" }}>
        <div className="font-mono mb-12" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.2em" }}>
          YOUR PEAK SEASON
        </div>
        <div className="font-digital reveal" style={{ fontSize: "clamp(6.5rem, 22vw, 13rem)", color: "#f4f1de", letterSpacing: "-0.02em", lineHeight: 0.95 }}>
          S{winner.season}
        </div>
        <div className="font-digital mt-5" style={{ color: "#c9b8a0", fontSize: "clamp(1.3rem, 4vw, 1.9rem)", letterSpacing: "0.05em" }}>
          {winnerMeta.year}–{String(winnerMeta.end).slice(2)}
        </div>
        <div className="mt-12 pt-7" style={{ borderTop: "1px solid #2a2030" }}>
          <div className="font-mono mb-3" style={{ color: "#6a5a4a", fontSize: "11px", letterSpacing: "0.2em" }}>You are</div>
          <div className="font-body" style={{ color: "#f4f1de", fontSize: "clamp(1.4rem, 4.5vw, 1.9rem)", lineHeight: 1.2, fontWeight: 600 }}>
            {archetype.name}
          </div>
          <p className="font-body italic mx-auto mt-3" style={{ color: "#c9b8a0", fontSize: "1rem", maxWidth: "460px", lineHeight: 1.5 }}>
            {archetype.line}
          </p>
        </div>
        <div className="font-body mt-8" style={{ color: confidenceColor, fontSize: "0.95rem" }}>
          {confidence}
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
        <div className="mb-10 rise" style={{ animationDelay: "0.5s", paddingTop: "20px", paddingBottom: "20px", borderTop: "1px solid #3a2f44", borderBottom: "1px solid #3a2f44" }}>
          <div className="font-mono mb-5 text-center" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.2em" }}>
            The S{winner.season} cast
          </div>
          <div className="flex flex-wrap justify-center" style={{ gap: "6px 16px" }}>
            {castForSeason(winner.season).map((name) => (
              <span key={name} className="font-body" style={{ color: "#c9b8a0", fontSize: "0.98rem", letterSpacing: "0.01em", fontWeight: 500 }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="font-body mx-auto mb-10 text-center" style={{ color: "#c9b8a0", fontSize: "1.05rem", maxWidth: "560px", lineHeight: 1.55 }}>
        {winnerMeta.tag}
      </p>

      <WhyThisSeason winner={winner} picks={picks} runnerUp={runnerUp} />

      <WatchNext season={winner.season} picks={picks} />

      <MoreLikeYourTaste winner={winner} picks={picks} scores={scores} />

      <CastSweetSpot picks={picks} winnerSeason={winner.season} />

      <div className="flex flex-col sm:flex-row gap-3 mb-12 justify-center">
        <a href={peacockLink(winner.season)} target="_blank" rel="noreferrer" className="font-mono text-center px-6 py-3 border transition" style={{ borderColor: "#00a4a6", color: "#00a4a6", fontSize: "12px", letterSpacing: "0.18em", textDecoration: "none" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#00a4a6"; e.currentTarget.style.color = "#0a0710"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00a4a6"; }}>▶ Watch S{winner.season} on Peacock</a>
        <a href={youtubeLink(winner.season)} target="_blank" rel="noreferrer" className="font-mono text-center px-6 py-3 border transition" style={{ borderColor: "#e63946", color: "#e63946", fontSize: "12px", letterSpacing: "0.18em", textDecoration: "none" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#e63946"; e.currentTarget.style.color = "#f4f1de"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#e63946"; }}>▶ Best sketches on YouTube</a>
      </div>

      <div className="mb-12">
        <div className="font-mono mb-4" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.2em" }}>Runners-up</div>
        <div className="space-y-5">
          {top.slice(1).map((t, idx) => {
            const i = idx + 1;
            const m = SEASONS[t.season];
            const tradeoffs = tradeOffsFor(t.season, picks);
            const theirBest = topContributingAnswers(picks, t.season, 1)[0];
            return (
              <div key={t.season} className="flex items-start gap-4 pb-4 border-b" style={{ borderColor: "#3a2f44" }}>
                <div className="font-digital" style={{ color: i === 0 ? "#e63946" : "#ffc847", fontSize: "2rem", lineHeight: 1, minWidth: "36px" }}>{i + 1}</div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <div className="font-body" style={{ color: "#f4f1de", fontSize: "1.2rem", fontWeight: 600 }}>Season {t.season}</div>
                    <div className="font-mono" style={{ color: "#8a7a6a", fontSize: "11px" }}>{m.year}–{String(m.end).slice(2)}</div>
                  </div>
                  <p className="font-body mt-1" style={{ color: "#c9b8a0", fontSize: "0.95rem", lineHeight: 1.5 }}>{m.tag}</p>
                  <div className="mt-2 font-body italic" style={{ color: tradeoffs.length > 0 ? "#e63946" : "#8a7a6a", fontSize: "0.92rem" }}>
                    {tradeoffs.length > 0
                      ? `You'd give up ${tradeoffs.join(", ")}.`
                      : theirBest
                        ? `Same cast for you. You'd still get ${theirBest}.`
                        : "Close on everything you picked."}
                  </div>
                  {i > 0 && (
                    <div className="flex gap-4 mt-3">
                      <a href={peacockLink(t.season)} target="_blank" rel="noreferrer" className="font-mono" style={{ color: "#00a4a6", fontSize: "10px", letterSpacing: "0.18em", textDecoration: "underline" }}>Peacock →</a>
                      <a href={youtubeLink(t.season)} target="_blank" rel="noreferrer" className="font-mono" style={{ color: "#e63946", fontSize: "10px", letterSpacing: "0.18em", textDecoration: "underline" }}>YouTube →</a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {age && (
        <div className="mb-12 py-10" style={{ borderTop: "1px solid #3a2f44", borderBottom: "1px solid #3a2f44" }}>
          <div className="font-mono mb-5 text-center" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.2em" }}>
            THE LORNE THEORY
          </div>
          <p className="font-body italic mx-auto" style={{ color: "#c9b8a0", fontSize: "0.98rem", maxWidth: "560px", lineHeight: 1.65, textAlign: "center" }}>
            "{LORNE_QUOTE.text}"
          </p>
          <div className="font-mono mt-3 text-center" style={{ color: "#6a5a4a", fontSize: "11px", letterSpacing: "0.15em" }}>
            {LORNE_QUOTE.attrib}
          </div>
          <p className="font-body text-center mt-8 mx-auto" style={{ color: "#f4f1de", fontSize: "1rem", maxWidth: "560px", lineHeight: 1.55 }}>
            By Lorne's math, S{winner.season} fans were in high school in {winnerMeta.year} and {winnerMeta.end}. That puts you around {age.ageMin} to {age.ageMax}.
          </p>
          <div className="text-center my-4">
            <span className="font-digital" style={{ color: "#f4f1de", fontSize: "clamp(3.5rem, 12vw, 5.5rem)", lineHeight: 1, letterSpacing: "-0.01em" }}>
              {age.ageMin}–{age.ageMax}
            </span>
          </div>
          <p className="font-body text-center mt-4 mx-auto" style={{ color: "#8a7a6a", fontSize: "0.92rem", maxWidth: "560px", lineHeight: 1.55 }}>
            Off by a decade? Then you found your era on your own, which counts for more.
          </p>
        </div>
      )}

      <div className="mb-10">
        <button
          onClick={() => setShowPicks(!showPicks)}
          className="font-mono mb-4"
          style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.2em", background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          {showPicks ? "Hide your picks" : "Show your picks"}
        </button>
        <div className="space-y-2" hidden={!showPicks}>
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
              <div key={i} className="flex items-baseline gap-3 font-body" style={{ color: "#c9b8a0", fontSize: "0.92rem" }}>
                <span className="font-mono" style={{ color: "#ffc847", fontSize: "10px" }}>0{i + 1}</span>
                <span style={{ color: "#8a7a6a" }} className="italic">{prompt}</span>
                <span style={{ color: "#f4f1de", fontSize: "0.92rem", marginLeft: "auto", textAlign: "right", fontWeight: 500 }}>
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-10">
        <div className="font-mono mb-4" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.2em" }}>Share it.</div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: savingStory ? "Rendering…" : "Post to Instagram", action: handlePostToIG, disabled: savingStory, isButton: true },
            { label: "Post to Facebook", href: facebookUrl },
            { label: savingStory ? "Rendering…" : "↓ Download image", action: handleDownloadImage, disabled: savingStory, isButton: true },
            { label: copied ? "✓ Copied" : "⎘ Copy caption", action: handleCopy, isButton: true, highlighted: copied },
          ].map((item, i) => {
            const baseStyle = {
              borderColor: item.highlighted ? "#ffc847" : "#3a2f44",
              color: item.highlighted ? "#ffc847" : (item.disabled ? "#5a4a3a" : "#f4f1de"),
              padding: "10px 16px",
              fontSize: "11px",
              letterSpacing: "0.18em",
              background: "rgba(255,255,255,0.02)",
              cursor: item.disabled ? "not-allowed" : "pointer",
              textDecoration: "none",
            };
            const onEnter = (e) => { if (!item.disabled && !item.highlighted) e.currentTarget.style.borderColor = "#ffc847"; };
            const onLeave = (e) => { if (!item.highlighted) e.currentTarget.style.borderColor = "#3a2f44"; };
            return item.isButton ? (
              <button key={i} onClick={item.action} disabled={item.disabled} className="font-mono border transition" style={baseStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                {item.label}
              </button>
            ) : (
              <a key={i} href={item.href} target="_blank" rel="noreferrer" className="font-mono border transition" style={baseStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                {item.label}
              </a>
            );
          })}
        </div>
        {saveError && (
          <div className="font-mono mt-3" style={{ color: "#e63946", fontSize: "10px", letterSpacing: "0.2em" }}>
            ✕ {saveError}
          </div>
        )}
        {igToast && (
          <div className="font-mono mt-3" style={{ color: "#ffc847", fontSize: "10px", letterSpacing: "0.2em" }}>
            ✓ {igToast}
          </div>
        )}
      </div>

      <div className="flex justify-center mb-6">
        <button onClick={onReset} className="font-mono px-8 py-3 border transition" style={{ borderColor: "#ffc847", color: "#ffc847", fontSize: "11px", letterSpacing: "0.3em", background: "transparent", cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#ffc847"; e.currentTarget.style.color = "#0a0710"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ffc847"; }}>
          ★ Run It Back ★
        </button>
      </div>

      <div className="text-center mb-2">
        <a
          href={FEEDBACK_URL}
          target="_blank"
          rel="noreferrer"
          className="font-body italic"
          style={{ color: "#8a7a6a", fontSize: "0.9rem", textDecoration: "underline", textDecorationColor: "#3a2f44", textUnderlineOffset: "3px" }}
        >
          Built by one fan. Found something off? Tell me →
        </a>
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

function wrapTextCanvas(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function generateStoryImage(winner, archetype) {
  const meta = SEASONS[winner.season];
  if (!meta) return null;
  const hotTake = HOT_TAKES[winner.season];
  const host = typeof window !== "undefined" ? window.location.host : "the snl oracle";

  const canvas = document.createElement("canvas");
  canvas.width = STORY_WIDTH;
  canvas.height = STORY_HEIGHT;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Brand title — what is this?
  ctx.fillStyle = "#ffc847";
  ctx.font = '900 56px "Arial Black", Impact, sans-serif';
  ctx.fillText("THE SNL ORACLE", STORY_WIDTH / 2, 200);

  // Brand subtitle — what does it do?
  ctx.fillStyle = "#8a7a6a";
  ctx.font = '600 22px "Courier New", monospace';
  ctx.fillText("F I N D   Y O U R   P E A K   S N L   S E A S O N", STORY_WIDTH / 2, 250);

  // Lead-in
  ctx.fillStyle = "#c9b8a0";
  ctx.font = 'italic 34px Georgia, "Times New Roman", serif';
  ctx.fillText("My peak season is", STORY_WIDTH / 2, 410);

  // Giant S##
  ctx.fillStyle = "#f4f1de";
  ctx.font = '900 520px "Arial Black", Impact, sans-serif';
  ctx.fillText(`S${winner.season}`, STORY_WIDTH / 2, 880);

  // Year range
  ctx.fillStyle = "#c9b8a0";
  ctx.font = '700 64px "Arial Black", Impact, sans-serif';
  ctx.fillText(`${meta.year}–${String(meta.end).slice(2)}`, STORY_WIDTH / 2, 970);

  // Hot take (italic serif, wrapped)
  if (hotTake) {
    ctx.fillStyle = "#c9b8a0";
    ctx.font = 'italic 38px Georgia, "Times New Roman", serif';
    const lines = wrapTextCanvas(ctx, `“${hotTake}”`, STORY_WIDTH - 240);
    const lineHeight = 54;
    const blockHeight = lines.length * lineHeight;
    const startY = 1170 - blockHeight / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, STORY_WIDTH / 2, startY + i * lineHeight);
    });
  }

  // Hairline divider
  ctx.fillStyle = "#2a2030";
  ctx.fillRect(120, 1430, STORY_WIDTH - 240, 2);

  // Archetype lead-in
  ctx.fillStyle = "#c9b8a0";
  ctx.font = 'italic 30px Georgia, "Times New Roman", serif';
  ctx.fillText("I'm", STORY_WIDTH / 2, 1520);

  // Archetype name
  ctx.fillStyle = "#f4f1de";
  ctx.font = '900 56px "Arial Black", Impact, sans-serif';
  ctx.fillText(archetype.name, STORY_WIDTH / 2, 1600);

  // CTA lead-in
  ctx.fillStyle = "#8a7a6a";
  ctx.font = '600 24px "Courier New", monospace';
  ctx.fillText("F I N D   Y O U R S   A T", STORY_WIDTH / 2, 1770);

  // host URL in gold
  ctx.fillStyle = "#ffc847";
  ctx.font = '900 36px "Arial Black", Impact, sans-serif';
  ctx.fillText(host, STORY_WIDTH / 2, 1830);

  return canvas.toDataURL("image/png");
}

function FriendResult({ result, onStart }) {
  const meta = SEASONS[result.season];
  const archetype = result.archetypeId ? ARCHETYPES[result.archetypeId] : null;
  return (
    <div className="rise">
      <div className="font-mono mb-4 text-center" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.4em" }}>★ A FRIEND'S RESULT ★</div>
      <div className="mb-8 text-center" style={{ background: "#000", padding: "64px 24px", border: "1px solid #1a1424" }}>
        <div className="font-digital uppercase mb-10" style={{ color: "#c9b8a0", fontSize: "13px", letterSpacing: "0.5em" }}>
          A DIGITAL SHORT
        </div>
        <div className="font-digital" style={{ fontSize: "clamp(5.5rem, 18vw, 10rem)", color: "#f4f1de", letterSpacing: "-0.02em", lineHeight: 0.95 }}>
          S{result.season}
        </div>
        <div className="font-digital uppercase mt-4" style={{ color: "#c9b8a0", fontSize: "clamp(1.1rem, 4vw, 1.6rem)", letterSpacing: "0.08em" }}>
          {meta.year}–{String(meta.end).slice(2)}
        </div>
        {archetype && (
          <div className="mt-10 pt-6" style={{ borderTop: "1px solid #2a2030" }}>
            <div className="font-mono uppercase mb-2" style={{ color: "#6a5a4a", fontSize: "11px", letterSpacing: "0.2em" }}>Their type</div>
            <div className="font-digital uppercase" style={{ color: "#f4f1de", fontSize: "clamp(1.1rem, 4vw, 1.4rem)", letterSpacing: "0.05em" }}>
              {archetype.name}
            </div>
          </div>
        )}
      </div>
      <p className="font-body mx-auto mb-8 text-center" style={{ color: "#c9b8a0", fontSize: "1rem", maxWidth: "520px", lineHeight: 1.55 }}>
        {meta.tag}
      </p>
      <div className="text-center">
        <button onClick={onStart} className="font-digital uppercase px-8 py-4 border transition" style={{ borderColor: "#ffc847", color: "#ffc847", fontSize: "13px", letterSpacing: "0.3em", background: "transparent", cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#ffc847"; e.currentTarget.style.color = "#0a0710"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ffc847"; }}>
          Take the quiz to find yours →
        </button>
      </div>
    </div>
  );
}

function WhyThisSeason({ winner, picks, runnerUp }) {
  const castPick = picks.find((p) => p.type === "multi-cast");
  const castNames = castPick?.value || [];
  const castOnSeason = castNames.filter((name) => seasonsFor(name).includes(winner.season));
  const answers = topContributingAnswers(picks, winner.season, 2);

  // The lead sentence: who you picked, sharing a cast with what you answered.
  let lead;
  if (castOnSeason.length > 0 && answers.length > 0) {
    const verb = castOnSeason.length === 1 ? "shares" : "share";
    lead = `S${winner.season} is where ${joinWithAnd(castOnSeason)} ${verb} a cast with ${joinWithAnd(answers)}.`;
  } else if (answers.length > 0) {
    lead = `S${winner.season} is the season that best matches ${joinWithAnd(answers)}.`;
  } else if (castOnSeason.length > 0) {
    lead = `S${winner.season} is the season ${joinWithAnd(castOnSeason)} shared.`;
  } else {
    lead = `S${winner.season} is the closest fit for what you picked.`;
  }

  // The runner-up line: what the second place season would cost you.
  let second = null;
  if (runnerUp) {
    const missing = tradeOffsFor(runnerUp.season, picks);
    const theirBest = topContributingAnswers(picks, runnerUp.season, 1)[0];
    if (missing.length > 0) {
      const verb = missing.length === 1 ? "wasn't" : "weren't";
      second = `S${runnerUp.season} came second, but ${joinWithAnd(missing)} ${verb} there.`;
    } else if (theirBest) {
      second = `S${runnerUp.season} came second, and it's a fair fight: same cast, and you'd still get ${theirBest}.`;
    } else {
      second = `S${runnerUp.season} came second.`;
    }
  }

  return (
    <div className="mb-12">
      <div className="font-mono mb-3" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.2em" }}>Why this season</div>
      <p className="font-body" style={{ color: "#f4f1de", fontSize: "1.02rem", lineHeight: 1.55 }}>
        {lead}{second ? ` ${second}` : ""}
      </p>
    </div>
  );
}

function joinWithAnd(arr) {
  if (!arr || arr.length === 0) return "";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;
}

function WatchNext({ season, picks }) {
  const sketches = pickSketches(season, picks, 3);
  if (sketches.length === 0) return null;
  return (
    <div className="mb-12">
      <div className="font-mono mb-1" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.2em" }}>
        Watch this next
      </div>
      <p className="font-body italic mb-4" style={{ color: "#8a7a6a", fontSize: "0.92rem" }}>
        Sketches from your season worth queuing up.
      </p>
      <div style={{ borderTop: "1px solid #3a2f44" }}>
        {sketches.map((s) => (
          <a
            key={`${s.season}-${s.title}`}
            href={sketchYouTubeUrl(s)}
            target="_blank"
            rel="noreferrer"
            className="block transition"
            style={{ textDecoration: "none", padding: "16px 4px", borderBottom: "1px solid #3a2f44" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <div className="font-body" style={{ color: "#f4f1de", fontSize: "1.15rem", lineHeight: 1.3, fontWeight: 600 }}>
              {s.title} →
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function castSweetSpots(picks) {
  const castPick = picks.find((p) => p.type === "multi-cast");
  if (!castPick || !castPick.value || castPick.value.length === 0) return null;
  const names = castPick.value;
  const perSeason = {};
  for (let s = 1; s <= 51; s++) perSeason[s] = [];
  names.forEach((name) => {
    seasonsFor(name).forEach((s) => perSeason[s].push(name));
  });
  const seasons = Object.entries(perSeason)
    .map(([s, n]) => ({ season: parseInt(s), names: n }))
    .filter((x) => x.names.length > 0);
  if (seasons.length === 0) return null;
  const maxOverlap = Math.max(...seasons.map((x) => x.names.length));
  return {
    maxOverlap,
    totalCast: names.length,
    best: seasons.filter((x) => x.names.length === maxOverlap).sort((a, b) => a.season - b.season),
  };
}

// One pick, two picks and three picks each need their own sentence. The old
// template produced "All 1 of your cast picks share these seasons."
function overlapLine(sweet) {
  const { totalCast, maxOverlap, names } = { ...sweet, names: sweet.best[0]?.names || [] };
  if (maxOverlap === totalCast) {
    if (totalCast === 1) return `${names[0]} was on all of these:`;
    if (totalCast === 2) return "Both your picks share these seasons:";
    return "All three share these seasons:";
  }
  if (totalCast === 2) return "Your two picks never share a season. These are the closest you get:";
  return `Your three picks never share a season. The closest is two of them, in these:`;
}

function CastSweetSpot({ picks, winnerSeason }) {
  const sweet = castSweetSpots(picks);
  if (!sweet) return null;
  return (
    <div className="mb-12">
      <div className="font-mono mb-3" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.2em" }}>
        Your cast overlap
      </div>
      <p className="font-body mb-4" style={{ color: "#c9b8a0", fontSize: "0.95rem", lineHeight: 1.5 }}>
        {overlapLine(sweet)}
      </p>
      <div className="flex flex-wrap gap-2">
        {sweet.best.slice(0, 10).map((x) => {
          const isWinner = x.season === winnerSeason;
          return (
            <a
              key={x.season}
              href={peacockLink(x.season)}
              target="_blank"
              rel="noreferrer"
              className="font-mono border transition"
              style={{
                borderColor: isWinner ? "#e63946" : "#3a2f44",
                color: isWinner ? "#e63946" : "#f4f1de",
                padding: "8px 14px",
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
                textDecoration: "none",
                background: isWinner ? "rgba(230, 57, 70, 0.12)" : "rgba(255,255,255,0.02)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ffc847"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = isWinner ? "#e63946" : "#3a2f44"; }}
              title={x.names.join(" + ")}
            >
              S{x.season} →
            </a>
          );
        })}
      </div>
    </div>
  );
}

function MoreLikeYourTaste({ winner, picks, scores }) {
  const sketches = pickCrossSeasonSketches(winner.season, picks, 4, scores);
  if (sketches.length === 0) return null;
  return (
    <div className="mb-12">
      <div className="font-mono mb-1" style={{ color: "#ffc847", fontSize: "11px", letterSpacing: "0.2em" }}>
        Also in your lane
      </div>
      <p className="font-body italic mb-4" style={{ color: "#8a7a6a", fontSize: "0.92rem" }}>
        Sketches from other seasons you'd probably rewatch.
      </p>
      <div style={{ borderTop: "1px solid #3a2f44" }}>
        {sketches.map((s) => (
          <a
            key={`${s.season}-${s.title}`}
            href={sketchYouTubeUrl(s)}
            target="_blank"
            rel="noreferrer"
            className="block transition"
            style={{ textDecoration: "none", padding: "14px 4px", borderBottom: "1px solid #3a2f44" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <div className="font-body" style={{ color: "#f4f1de", fontSize: "1.1rem", lineHeight: 1.3, fontWeight: 600 }}>
                {s.title} →
              </div>
              <div className="font-mono" style={{ color: "#8a7a6a", fontSize: "10px", letterSpacing: "0.2em" }}>
                S{s.season}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="mt-14 pt-6 border-t text-center font-mono" style={{ borderColor: "#3a2f44", color: "#6a5a4a", fontSize: "11px", letterSpacing: "0.15em", lineHeight: 1.6 }}>
      <div style={{ color: "#8a7a6a", marginBottom: "10px" }}>studio8h.fan</div>
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
      @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Limelight&family=DM+Mono:wght@300;400;500&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap');
      .font-digital { font-family: 'Archivo Black', 'Arial Black', 'Helvetica Neue', sans-serif; letter-spacing: 0.01em; }
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
