# The SNL Oracle

> Tell us what you love. We'll tell you when you watched.

An interactive quiz that maps your taste in *Saturday Night Live* to your peak season across all 51 years of the show.

Nine rounds. Adaptive after round 5. Returns your top three seasons with trade-off analysis, a personality archetype, Lorne Michaels' and Bill Murray's takes on why everyone thinks their cast was the best, and direct streaming links to Peacock and YouTube.

## How it works

- **Rounds 1–4** are binary "this or that" questions chosen to genuinely fork the audience along real spectrums: kind of laugh, format preference, tone, performer DNA.
- **Round 5** is a multi-select picker for up to three cast members you cannot live without. These weigh roughly four times heavier than any other pick.
- **Rounds 6–9** are adaptive. After each round the algorithm computes your current top season candidates and selects the next question from a pool of eight refinement questions (Update desk, iconic moment, sketch type, impression, etc.) — whichever question most cleanly discriminates between your remaining candidates.
- The result page shows your bullseye season with cover photo from Wikipedia, both Lorne's and Bill Murray's quotes about generational taste, an age prediction based on the Lorne theory, your archetype, and direct streaming links.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build for production

```bash
npm run build
```

Outputs to `/dist`.

## Deploy

**Vercel** (easiest): push this repo to GitHub, then import the repo at [vercel.com/new](https://vercel.com/new). Vercel auto-detects Vite and deploys with zero config.

**Netlify**: push to GitHub, then connect at [app.netlify.com](https://app.netlify.com). Build command: `npm run build`. Publish directory: `dist`.

**Static hosting**: `npm run build` and upload the contents of `/dist` anywhere static.

## A note on cast member photos

Photos are fetched live from Wikipedia's MediaWiki API at runtime. Wikipedia allows CORS via the `origin=*` parameter, so this works from any deployed environment.

It does **not** work inside the claude.ai artifact preview, which has Content Security Policy restrictions on outbound `fetch()` calls. When running anywhere else (localhost, Vercel, Netlify) photos load normally. When they can't load, the picker falls back to color-coded monograms — each cast member gets a deterministic hue derived from their name.

## Data sources

- Cast tenure data: hand-curated from each cast member's Wikipedia article
- Season metadata: hand-curated from `Saturday Night Live season N` Wikipedia articles
- Cast member photos: fetched from Wikipedia at runtime
- Season cover photos: fetched from the season's Wikipedia page infobox at runtime
- Streaming links: Peacock direct season URL and YouTube search URL

## Tech

- Vite
- React 18
- Tailwind CSS (for utility classes; most styling is inline)
- Google Fonts (Anton, Limelight, DM Mono, Newsreader) loaded via `@import`

Single-file React application. All state, scoring, and components live in `src/App.jsx`.

## License

MIT.
