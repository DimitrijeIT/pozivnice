# DigiPoz Architecture Document

Complete technical reference for the DigiPoz Serbian wedding invitation platform.

---

## System Overview

```
┌─────────────┐    ┌──────────────┐    ┌──────────────────┐    ┌───────────────┐    ┌──────────────┐
│  Instagram   │───>│ Google Form  │───>│ Google Apps Script│───>│ GitHub Actions │───>│ GitHub Pages │
│  + ManyChat  │    │  (intake)    │    │  (orchestration)  │    │  (generation)  │    │  (hosting)   │
└─────────────┘    └──────────────┘    └──────────────────┘    └───────────────┘    └──────────────┘
                                              │                                            │
                                              v                                            v
                                    ┌──────────────────┐                         ┌──────────────────┐
                                    │  Google Sheets    │                         │  digipoz.rs    │
                                    │  (RSVP per-couple)│<───── Guest RSVPs ─────│  /site/{slug}/   │
                                    └──────────────────┘                         └──────────────────┘
```

**Domain:** digipoz.rs (GitHub Pages with custom domain)
**Language:** All user-facing text is Serbian Cyrillic
**Output:** Self-contained single-file HTML (all CSS/JS inlined, no external deps except Google Fonts)

---

## 1. Customer Acquisition

Instagram is the primary channel. Posts, reels, and stories drive traffic to the intake form.

ManyChat automates responses:
- Comment triggers send auto-DMs with the intake form link
- Keyword-based DM replies handle inquiries 24/7

The couple fills out the **intake form** (`public/form.html`) with wedding details (names, date, venues, story, preferences). This form submits directly to a Google Form via `formResponse` endpoint using `no-cors` mode.

---

## 2. Preview Generation Pipeline

```
Couple submits intake form
      │
      v
Google Form → Google Sheet (new row)
      │
      v
Apps Script: intake-form-handler-automated.gs
      │  1. Reads form data from sheet
      │  2. Generates slug via Cyrillic→Latin transliteration (Милица-Стефан → milica-stefan-2026)
      │  3. Creates per-couple RSVP Google Spreadsheet
      │  4. Registers spreadsheet in RSVP_Lookup tab (slug → spreadsheet ID)
      │  5. Sends repository_dispatch webhook to GitHub (event: new-wedding)
      v
GitHub Actions: generate-preview.yml
      │  1. Validates slug format (alphanumeric + hyphens only)
      │  2. Saves wedding data JSON to data/{slug}.json
      │  3. Runs: node scripts/generate-preview.js {slug}
      │  4. Generates 10 original theme variants + selector page
      │  5. Persists wedding data to gh-pages for final generation
      │  6. Deploys to GitHub Pages via peaceiris/actions-gh-pages@v4
      v
Email sent to couple: "Ваш преглед позивнице је спреман!"
      │  Contains: Preview URL + RSVP spreadsheet link
      v
https://digipoz.rs/preview/{slug}/
```

### 2026 Layout Previews

2026 layouts use a separate pipeline via `generate-layout-preview.js`:

```
node scripts/generate-layout-preview.js {layout} {slug}
      │  1. Loads base-{layout}.html standalone template
      │  2. Assembles CSS: tokens.css + mobile.css + themes-{layout}/{theme}/style.css
      │  3. Replaces placeholders (own implementation, not shared utils.js)
      │  4. Processes conditionals
      │  5. Creates metadata.json for cleanup compatibility
      v
public/preview/{slug}-{layout}/
      ├── {theme1}.html
      ├── {theme2}.html
      ├── index.html (theme selector)
      └── metadata.json
```

---

## 3. Theme Selection & Final Site Generation

```
Couple clicks "Изабери" on preferred theme
      │
      v
POST to Apps Script: theme-selection-handler-automated.gs
      │  1. Validates slug + theme
      │  2. Sends repository_dispatch webhook (event: theme-selected)
      v
GitHub Actions: generate-final.yml
      │  1. Validates slug and theme format
      │  2. Downloads wedding data from gh-pages branch
      │  3. Runs: node scripts/generate-final.js {slug} {theme}
      │     - Original themes: "classic", "modern", etc.
      │     - 2026 layouts: "envelope/velvet", "aurora/northern", etc.
      │  4. Deploys final site to GitHub Pages
      │  5. Cleans up preview folder and wedding data from gh-pages
      v
Email sent to couple: "Ваша позивница је спремна!"
      │  Contains: Final site URL + RSVP spreadsheet link
      v
https://digipoz.rs/site/{slug}/   (permanent)
```

---

## 4. Guest RSVP Flow

```
Guest visits invitation site
      │  Views: countdown, venue, story, RSVP form
      │
      v
Fills RSVP form (name, attendance, guest count, meal, message)
      │
      v
Client-side JS sends POST to RSVP_SCRIPT_URL
      │  - mode: 'no-cors' (opaque response, optimistic success)
      │  - Content-Type: text/plain;charset=utf-8
      │  - Body: JSON with slug, name, email, attending, guests_count, meal_preference, message
      v
Apps Script: rsvp-handler.gs
      │  1. Parses POST data
      │  2. Validates required fields (slug, name, attending)
      │  3. Looks up per-couple spreadsheet via RSVP_Lookup tab (slug → spreadsheet ID)
      │  4. Opens per-couple Google Spreadsheet
      │  5. Deduplicates by name (case-insensitive update if exists)
      │  6. Writes row: Име | Е-маил | Телефон | Долази | Број гостију | Оброк | Порука | Време
      │  7. Optionally sends email notification to couple
      v
Per-couple Google Spreadsheet: live RSVP dashboard
      (viewable by couple via shared link from email)
```

**Important:** All 29 templates share one global `RSVP_SCRIPT_URL`. The `slug` in the POST body routes to the correct per-couple spreadsheet.

---

## 5. Template Systems

### 5.1 Original System (2025) — 10 Themes

Single shared `templates/base.html` (345 lines). Themes differ only in CSS.

**Themes:** classic, modern, romantic, minimal, rustic, botanical, moody, gatsby, editorial, whimsical

**CSS Assembly:**
- `{{THEME_CSS}}` = `themes/{theme}/style.css`
- `{{ANIMATIONS_CSS}}` = animations.css + components.css + backgrounds.css + decorations.css + mobile.css
- `{{THEME_FONTS}}` = Google Fonts link from `utils.getThemeFonts()`
- `{{INLINE_SCRIPT}}` = templates/script.js (pre-processed with placeholder values)

**Features:** RSVP form, gallery/lightbox, countdown, calendar links, dress code with color swatches, meal options, love story, timeline, map/venue, confetti animation, scroll animations.

### 5.2 2026 Layouts — 19 Standalone Templates

Each layout is a self-contained `templates/base-{layout}.html` with inline `<style>` and `<script>` blocks.

| Layout | Themes | Concept |
|--------|--------|---------|
| aurora | cosmic, northern | Northern lights, ethereal particles |
| botanical | forest, pressed | Nature, pressed flower herbarium |
| cinema | golden, noir | Movie premiere, film credits |
| concert | indie, rock | Music festival poster, ticket stub |
| envelope | frost, velvet | Animated opening envelope |
| filmnoir | classic, golden | 1930s Hollywood glamour |
| gazette | broadsheet, tabloid | Newspaper editorial layout |
| glass | aurora, frost | Glassmorphism, translucent cards |
| kinetic | editorial, moody | Dynamic typography, motion |
| letter | romantic, vintage | Handwritten love letter |
| magazine | glossy, vogue | Fashion magazine editorial |
| mediterranean | amalfi, santorini | Coastal tiles, terracotta |
| oldmoney | estate, ivory | Quiet luxury, monograms |
| passport | classic, tropical | Travel document booklet |
| scribble | pencil, watercolor | Hand-drawn illustrations |
| storybook | ink, novel | Chapter-based narrative |
| telegram | express, western | 1920s typewriter aesthetic |
| velvet | burgundy, navy | Dark mode, baroque opulence |
| wabisabi | ink, paper | Japanese scroll, imperfection |

**CSS Assembly (2026):**
- `{{THEME_CSS}}` = tokens.css + mobile.css + `themes-{layout}/{theme}/style.css`
- `{{THEME_FONTS}}` = from LAYOUT_REGISTRY config

### 5.3 Template Variable System

Implemented in `scripts/utils.js` (original) and `scripts/generate-layout-preview.js` (2026):

- `{{VARIABLE}}` — HTML-escaped replacement. `_URL` and `_ISO` fields are not escaped.
- `{{#IF_CONDITION}}...{{/IF_CONDITION}}` — Conditional blocks shown when data key is truthy.
- Raw HTML fields (no escaping): `THEME_CSS`, `ANIMATIONS_CSS`, `THEME_FONTS`, `CALENDAR_BUTTONS`, `TIMELINE_ITEMS`, `GALLERY_ITEMS`, `MEAL_OPTIONS`, `DRESS_CODE_COLOR_SWATCHES`, `_themeCss`, `_themeFonts`, `STORY_CARDS`.

---

## 6. Wedding Data Schema

JSON files in `data/` directory. Keys use `snake_case`, placeholders use `SCREAMING_SNAKE_CASE`.

### Required Fields

| Field | Type | Example |
|-------|------|---------|
| `bride_name` | string | "Милица" |
| `groom_name` | string | "Стефан" |
| `wedding_date` | ISO date | "2026-09-12" |
| `ceremony_venue` | string | "Храм Светог Саве" |
| `ceremony_address` | string | "Крушедолска 2а, Београд" |
| `ceremony_time` | HH:MM | "15:00" |

### Optional Fields

| Field | Type | Purpose |
|-------|------|---------|
| `reception_venue` | string | Reception location |
| `reception_address` | string | Reception address |
| `reception_time` | HH:MM | Reception start time |
| `ceremony_map_url` | URL | Google Maps link |
| `reception_map_url` | URL | Google Maps link |
| `story_text` | string | Love story text |
| `pull_quote` | string | Featured quote |
| `invitation_intro` | string | Intro text (default: "Са радошћу вас позивамо") |
| `invitation_text` | string | Main invitation body |
| `invitation_signature` | string | Signature (default: "Bride & Groom") |
| `dress_code_text` | string | Dress code (default: "Елегантна одећа") |
| `dress_code_colors` | array | Color swatches for dress code |
| `wedding_hashtag` | string | Social hashtag |
| `rsvp_deadline` | ISO date | RSVP deadline |
| `meal_options` | array | Meal choice options |
| `timeline` | array | Love story timeline events |
| `gallery` | array | Photo gallery items |
| `additional_info` | string | Extra information |
| `music_url` | URL | Background music |
| `contact_email` | string | Couple's email for notifications |

### Slug Generation

Cyrillic names are transliterated to Latin for URL-safe slugs:
- `Милица` + `Стефан` + `2026` → `milica-stefan-2026`
- Transliteration: ж→z, ш→s, ч→c, ћ→c, etc.

---

## 7. Scripts Reference

| Script | Lines | Purpose | Trigger |
|--------|-------|---------|---------|
| `config.js` | 617 | Theme/layout registry, URLs, settings | Imported by all generators |
| `utils.js` | 883 | Template processing, validation, date formatting | Imported by generators |
| `generate-preview.js` | 316 | Build 10 original theme previews | GitHub Actions / CLI |
| `generate-layout-preview.js` | 857 | Build 2026 layout previews | CLI / `npm run layout` |
| `generate-final.js` | 312 | Build final site (original + 2026) | GitHub Actions / CLI |
| `cleanup-expired.js` | 178 | Remove expired previews | `npm run cleanup` |
| `serve.js` | 247 | Dev server on port 3000 | `npm run serve` |
| `generate-screenshots.js` | 83 | Playwright screenshots | `npm run screenshots` |
| `generate-images.js` | 488 | AI image generation (Pollinations/Together) | `npm run images` |
| `generate-images-chatgpt.js` | 517 | ChatGPT/DALL-E image generation | `npm run images:chatgpt` |

---

## 8. Google Apps Script Files

| Script | Deployment | Purpose |
|--------|------------|---------|
| `intake-form-handler-automated.gs` | Web app | Form submit → GitHub webhook + RSVP spreadsheet creation |
| `theme-selection-handler-automated.gs` | Web app | Theme selection → GitHub webhook |
| `rsvp-handler.gs` | Web app | Guest RSVP → per-couple spreadsheet |
| `love-story-handler.gs` | Web app | AI story generation (Gemini proxy) |
| `intake-form-handler.gs` | Manual | Legacy non-automated form handler |
| `theme-selection-handler.gs` | Manual | Legacy non-automated theme handler |

**Deployment:** Currently manual (copy-paste into Apps Script editor, Deploy > New deployment). No clasp CLI or automated deployment configured.

**Script Properties required:**
- `GITHUB_TOKEN` — Personal access token for repository_dispatch
- `GITHUB_REPO` — Repository identifier (owner/repo)
- `MASTER_SPREADSHEET_ID` — Master spreadsheet with RSVP_Lookup tab
- `GEMINI_API_KEY` — For love-story-handler (Gemini 2.5 Flash)

---

## 9. GitHub Actions Workflows

### generate-preview.yml
- **Triggers:** `repository_dispatch` (type: new-wedding), `workflow_dispatch`
- **Security:** Slug validated via regex `^[a-z0-9-]+$`, inputs passed via `env:` blocks (not `${{ }}` interpolation)
- **Output:** Deploys preview to `preview/{slug}/` on gh-pages

### generate-final.yml
- **Triggers:** `repository_dispatch` (type: theme-selected), `workflow_dispatch`
- **Theme format:** Original: `classic` | 2026: `layout/theme` (e.g., `envelope/velvet`)
- **Security:** Slug + theme validated via regex, inputs sanitized
- **Cleanup:** Removes preview folder and wedding data JSON after final generation

### deploy-pages.yml
- **Triggers:** Push to `main` branch affecting `public/**`
- **Purpose:** Manual deployments (showcase, landing page, form updates)

---

## 10. Directory Structure

```
invitations/
├── .claude/                    # Claude Code config (agents, skills, settings)
├── .github/workflows/          # GitHub Actions (3 workflows)
├── data/                       # Wedding data JSON files
├── docs/                       # Documentation
├── google-apps-script/         # Google Apps Script files (6 handlers)
├── marketing/                  # Marketing strategy, campaigns, content
├── public/                     # Hosted content (GitHub Pages root)
│   ├── index.html              # Landing page
│   ├── form.html               # Intake form (6-step wizard)
│   ├── showcase.html           # Theme showcase gallery
│   ├── preview/                # Temporary preview sites
│   └── site/                   # Final published sites
├── scripts/                    # Node.js generation scripts (11 files)
└── templates/                  # HTML/CSS/JS templates
    ├── base.html               # Original shared template
    ├── base-{layout}.html      # 19 standalone 2026 templates
    ├── script.js               # Client-side JS (inlined into originals)
    ├── *.css                   # Shared CSS files
    ├── themes/                 # 10 original theme CSS directories
    └── themes-{layout}/        # 19 layout-specific theme directories
```

---

## 11. Security Considerations

- **Shell injection:** Workflow inputs validated with regex and passed via `env:` blocks
- **XSS:** Template variables are HTML-escaped by default; raw fields explicitly whitelisted
- **CORS:** All RSVP submissions use `mode: 'no-cors'` with `text/plain` Content-Type
- **Privacy:** `noindex, nofollow` meta tag on all invitation templates
- **Data exposure:** Wedding data temporarily stored on gh-pages during preview period; cleaned up on final generation
- **Credentials:** GAS URLs in config.js have env var overrides; Script Properties store API keys

---

## 12. Known Limitations

1. **No test suite** — No automated tests configured
2. **No linter** — No ESLint or Prettier
3. **Duplicate code** — `generate-layout-preview.js` reimplements `formatDate`, `processConditionals`, `replacePlaceholders` separately from `utils.js`
4. **Optimistic RSVP** — `no-cors` means success is shown even if the server-side write fails
5. **Manual GAS deployment** — No clasp CLI integration; code must be copy-pasted
6. **Calendar links** — Only available in `base.html` and `base-envelope.html`; placeholder support added to layout generator but not yet added to other 2026 template HTML
