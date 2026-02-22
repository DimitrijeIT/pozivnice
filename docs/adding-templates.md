# Adding New Templates to DigiPoz

Complete guide for adding a new 2026 layout template or a new theme to an existing layout.

---

## Table of Contents

1. [Template Spec](#1-template-spec)
2. [Adding a New 2026 Layout](#2-adding-a-new-2026-layout)
3. [Adding a Theme to an Existing Layout](#3-adding-a-theme-to-an-existing-layout)
4. [File Checklist](#4-file-checklist)
5. [Testing](#5-testing)
6. [Deployment](#6-deployment)

---

## 1. Template Spec

Every 2026 layout template is a **self-contained single HTML file** with inline CSS and JS. It must satisfy the following requirements.

### 1.1 Required HTML Structure

```html
<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>{{BRIDE_NAME}} & {{GROOM_NAME}} — Позивница за венчање</title>
  {{THEME_FONTS}}
  <style>
    /* Layout-specific structural CSS (500-800+ lines typical) */
  </style>
  {{THEME_CSS}}
</head>
<body>
  <!-- Skip link for accessibility -->
  <a href="#rsvp-form" class="skip-link">Прескочи на РСВП</a>

  <!-- SECTIONS (see 1.2) -->

  <script>
    /* Layout-specific JS (see 1.5) */
  </script>

  <!-- DigiPoz Badge (see 1.6) -->
</body>
</html>
```

**Head requirements:**
- `lang="sr"` on `<html>`
- `<meta name="robots" content="noindex, nofollow">` (all invitations are private)
- `{{THEME_FONTS}}` in `<head>` -- replaced with Google Fonts `<link>` tags at build time
- `{{THEME_CSS}}` in `<head>` after the inline `<style>` block -- replaced with `<style>` tag containing `tokens.css` + `mobile.css` + theme CSS at build time
- Title must use `{{BRIDE_NAME}}` and `{{GROOM_NAME}}`

### 1.2 Required Sections

Every template **must** include these sections. The HTML structure and styling are unique per layout, but the data and functionality must be present.

| # | Section | Required Placeholders | Notes |
|---|---------|----------------------|-------|
| 1 | **Hero / Header** | `{{BRIDE_NAME}}`, `{{GROOM_NAME}}`, `{{WEDDING_DATE_FORMATTED}}` | Names and date prominently displayed |
| 2 | **Countdown** | `{{WEDDING_DATE_ISO}}` via `data-date` attr | Animated days/hours/minutes/seconds timer |
| 3 | **Invitation Message** | `{{INVITATION_INTRO}}`, `{{INVITATION_TEXT}}`, `{{INVITATION_SIGNATURE}}` | The couple's personal message |
| 4 | **Venue Details** | `{{CEREMONY_VENUE}}`, `{{CEREMONY_ADDRESS}}`, `{{CEREMONY_TIME}}`, `{{CEREMONY_MAP_URL}}`, `{{RECEPTION_VENUE}}`, `{{RECEPTION_ADDRESS}}`, `{{RECEPTION_TIME}}`, `{{RECEPTION_MAP_URL}}` | Ceremony + reception with map links |
| 5 | **RSVP Form** | `{{WEDDING_SLUG}}`, `{{RSVP_SCRIPT_URL}}`, `{{RSVP_DEADLINE}}` | Full form with attendance, guests, message (see 1.4) |
| 6 | **Footer** | `{{BRIDE_NAME}}`, `{{GROOM_NAME}}` | Couple names at minimum |
| 7 | **DigiPoz Badge** | None (static HTML) | Brand attribution (see 1.6) |

### 1.3 Optional Sections (Conditional Blocks)

These sections are wrapped in `{{#IF_*}}...{{/IF_*}}` blocks and only render when the couple provides the data.

| Section | Conditional | Placeholders |
|---------|------------|--------------|
| Story / Love story | `{{#IF_STORY}}` | `{{STORY_TEXT}}` |
| Story photo | `{{#IF_STORY_PHOTO}}` | `{{STORY_PHOTO_URL}}` |
| Timeline | `{{#IF_TIMELINE}}` | `{{STORY_CARDS}}` (raw HTML) |
| Photo gallery | `{{#IF_GALLERY}}` | `{{GALLERY_ITEMS}}` (raw HTML) |
| Music player | `{{#IF_MUSIC}}` | `{{MUSIC_URL}}`, `{{MUSIC_TITLE}}`, `{{MUSIC_ARTIST}}` |
| Dress code | `{{#IF_DRESS_CODE}}` | `{{DRESS_CODE_TEXT}}`, `{{DRESS_CODE_COLOR_SWATCHES}}` (raw HTML) |
| Additional info | `{{#IF_ADDITIONAL_INFO}}` | `{{ADDITIONAL_INFO}}` |
| Hashtag | `{{#IF_HASHTAG}}` | `{{WEDDING_HASHTAG}}` |
| Meal selection | `{{#IF_MEAL_OPTIONS}}` | `{{MEAL_OPTIONS}}` (raw HTML `<option>` elements) |
| Calendar buttons | `{{#IF_CEREMONY_MAP}}` (or always) | `{{CALENDAR_BUTTONS}}` (raw HTML) |
| Ceremony map link | `{{#IF_CEREMONY_MAP}}` | `{{CEREMONY_MAP_URL}}` |
| Reception map link | `{{#IF_RECEPTION_MAP}}` | `{{RECEPTION_MAP_URL}}` |
| Pull quote | `{{#IF_PULL_QUOTE}}` | `{{PULL_QUOTE}}` |

**Note:** `STORY_CARDS`, `GALLERY_ITEMS`, `CALENDAR_BUTTONS`, `MEAL_OPTIONS`, `DRESS_CODE_COLOR_SWATCHES` are **raw HTML** -- they are not escaped during placeholder replacement. All other placeholders are HTML-escaped unless they end in `_URL` or `_ISO`.

### 1.4 RSVP Form Spec

The RSVP form is critical -- it must follow this exact pattern for Google Apps Script compatibility.

```html
<form id="rsvp-form">
  <input type="hidden" name="slug" value="{{WEDDING_SLUG}}">

  <!-- Required: Guest name -->
  <input type="text" id="guest-name" name="name" required autocomplete="name">

  <!-- Required: Guest email -->
  <input type="email" id="guest-email" name="email" required autocomplete="email">

  <!-- Required: Attendance radio -->
  <fieldset>
    <div role="radiogroup">
      <label><input type="radio" name="attending" value="yes" required><span>Долазим</span></label>
      <label><input type="radio" name="attending" value="no"><span>Нажалост, не могу</span></label>
    </div>
  </fieldset>

  <!-- Required: Guest count (shown only when attending=yes) -->
  <div id="guests-group">
    <select id="guests-count" name="guests_count">
      <option value="1">1 особа</option>
      <option value="2">2 особе</option>
      <option value="3">3 особе</option>
      <option value="4">4 особе</option>
    </select>
  </div>

  <!-- Optional: Meal selection (conditional) -->
  {{#IF_MEAL_OPTIONS}}
  <div id="meal-group">
    <select id="meal-choice" name="meal_preference">
      <option value="">Изаберите...</option>
      {{MEAL_OPTIONS}}
    </select>
  </div>
  {{/IF_MEAL_OPTIONS}}

  <!-- Required: Message textarea -->
  <textarea id="guest-message" name="message" rows="3"></textarea>

  <!-- Required: Submit button -->
  <button type="submit" id="submit-btn">Потврди долазак</button>
</form>

<!-- Required: Error and success states -->
<div class="form-error hidden" id="form-error" role="alert">
  Дошло је до грешке. Молимо покушајте поново.
</div>
<div class="form-success hidden" id="form-success" role="status" aria-live="polite">
  <h3>Хвала!</h3>
  <p>Ваша потврда је забележена.</p>
</div>

<!-- Required: Deadline display -->
<p>Молимо потврдите до {{RSVP_DEADLINE}}</p>
```

**Field names are fixed** (the Google Apps Script handler expects these exact `name` attributes):
- `slug` -- routes to the correct per-couple spreadsheet
- `name` -- guest full name
- `email` -- guest email
- `attending` -- `"yes"` or `"no"`
- `guests_count` -- number 1-4
- `meal_preference` -- selected meal (optional)
- `message` -- free-text message

**Element IDs are fixed** (the inline JS references them):
- `rsvp-form`, `submit-btn`, `form-error`, `form-success`, `guests-group`, `meal-group`

### 1.5 Required JavaScript

Every template must include an inline `<script>` block (wrapped in an IIFE) with these features:

```javascript
(function() {
  // 1. COUNTDOWN TIMER (required)
  // Read wedding date from a data attribute: data-date="{{WEDDING_DATE_ISO}}"
  // Update #days, #hours, #minutes, #seconds every second
  // Handle past dates gracefully (show 00:00:00:00)

  // 2. RSVP FORM HANDLER (required)
  // - Toggle guests-group and meal-group visibility based on attending radio
  // - On submit: POST JSON to {{RSVP_SCRIPT_URL}} with mode: 'no-cors'
  // - Content-Type must be 'text/plain;charset=utf-8' (avoids CORS preflight)
  // - On success: hide form, show #form-success
  // - On error: re-enable button, show #form-error

  // 3. LAYOUT-SPECIFIC FEATURES (varies per template)
  // - Scroll animations, navigation dots, envelope opening, etc.
})();
```

**RSVP submission pattern (must be exact):**

```javascript
const formData = new FormData(form);
await fetch('{{RSVP_SCRIPT_URL}}', {
  method: 'POST',
  mode: 'no-cors',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify(Object.fromEntries(formData.entries()))
});
```

### 1.6 DigiPoz Badge (Required)

Every template must end with the DigiPoz branding badge, placed just before `</body>`:

```html
<!-- DigiPoz Badge -->
<a href="https://www.instagram.com/digipoz_/" target="_blank" rel="noopener" class="digipoz-badge" title="Napravljeno od strane DigiPoz">
  <svg class="digipoz-badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="#B8860B" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="5" stroke="#B8860B" stroke-width="1.5"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="#B8860B"/>
  </svg>
  <span class="digipoz-badge-text">Digi<span>Poz</span></span>
</a>
```

The badge CSS is provided by `mobile.css` (loaded via `{{THEME_CSS}}`). No additional CSS needed.

### 1.7 Accessibility Requirements

- `<a href="#rsvp-form" class="skip-link">` skip link at top of body
- `aria-labelledby` on the RSVP form pointing to the form heading
- `aria-required="true"` on required inputs
- `role="radiogroup"` on attendance radio group
- `role="alert"` on error message
- `role="status"` and `aria-live="polite"` on success message
- All images must have `alt` attributes
- Form labels must be associated with inputs via `for`/`id`

### 1.8 CSS Requirements

The inline `<style>` block contains all layout-specific structural CSS. Theme-specific colors and typography come from `{{THEME_CSS}}`.

**Your inline CSS should:**
- Use CSS custom properties for all colors, fonts, and decorative values (themes override these via `:root`)
- Include `.hidden { display: none !important; }` utility class
- Include `.skip-link` styling (visually hidden, visible on focus)
- Include responsive breakpoints (min 768px for tablet, 480px for small mobile)
- Support `prefers-reduced-motion: reduce` (disable animations)
- Use `env(safe-area-inset-bottom)` for fixed bottom elements on notched devices

**Your inline CSS should NOT:**
- Define colors directly -- use CSS custom properties that themes can override
- Import external stylesheets (everything must be self-contained)

### 1.9 Content Language

All user-facing text must be in **Serbian Cyrillic**:

| Element | Serbian Text |
|---------|-------------|
| Attendance: yes | Долазим |
| Attendance: no | Нажалост, не могу |
| Guest count label | Број гостију |
| Meal label | Избор јела |
| Meal placeholder | Изаберите... |
| Message placeholder | Оставите поруку... |
| Submit button | Потврди долазак (or themed variant) |
| Submitting state | Шаљем... |
| Success heading | Хвала! |
| Error message | Дошло је до грешке. Молимо покушајте поново. |
| RSVP deadline | Молимо потврдите до {{RSVP_DEADLINE}} |
| Person count options | 1 особа, 2 особе, 3 особе, 4 особе |

---

## 2. Adding a New 2026 Layout

### Step 1: Create the Base Template

Create `templates/base-{layout}.html` following the spec in Section 1.

Use an existing template as a reference. Recommended starting points by complexity:
- **Simple:** `base-letter.html` (840 lines) -- single-page letter metaphor
- **Medium:** `base-cinema.html` (1059 lines) -- scroll-snap sections
- **Complex:** `base-envelope.html` (1465 lines) -- interactive envelope with animations

### Step 2: Create Theme Directories

Create at least one theme (two recommended):

```
templates/themes-{layout}/
  {theme1}/style.css
  {theme2}/style.css    (recommended)
```

A theme CSS file defines the visual identity via `:root` custom properties plus layout-specific style overrides. Typical structure:

```css
/* ======================
   {Layout} Theme: {Theme Name}
   ====================== */

:root {
  /* --- Color Palette --- */
  --color-bg: #...;
  --color-text: #...;
  --color-accent: #...;
  --color-gold: #...;
  /* ... more colors specific to your layout's CSS variables */

  /* --- Typography --- */
  --font-display: 'Font Name', serif;
  --font-body: 'Font Name', sans-serif;

  /* --- Layout-specific tokens --- */
  /* Define whatever CSS variables your base template references */
}

/* Section-specific overrides */
.your-section { /* ... */ }

/* Responsive adjustments */
@media (max-width: 768px) { /* ... */ }
```

**Important:** The variable names in your theme CSS must match what your base template's inline `<style>` block references. There is no fixed set of variable names -- each layout defines its own.

### Step 3: Register in config.js

Add your layout to `LAYOUT_REGISTRY` in `scripts/config.js`:

```javascript
'{layout}': {
  name: 'Назив на српском',           // Serbian Cyrillic display name
  description: 'Опис стила на српском',  // Serbian description
  themes: ['{theme1}'],                // Array of registered theme IDs
  themeNames: {
    '{theme1}': 'Назив теме'           // Serbian theme display name
  },
  themeDescriptions: {
    '{theme1}': 'Опис теме на српском'
  },
  fonts: '<link href="https://fonts.googleapis.com/css2?family=...&display=swap" rel="stylesheet">'
  // No isOriginal flag (absence = 2026 layout)
},
```

**Registry rules:**
- Key must be lowercase alphanumeric with hyphens only (this becomes the URL slug)
- Must NOT conflict with existing original theme names (classic, modern, romantic, minimal, rustic, botanical-original, moody, gatsby, editorial, whimsical)
- `fonts` must be a complete `<link>` tag for Google Fonts matching what the theme CSS `--font-display` / `--font-body` reference
- `themes` array determines which themes are available in the generation pipeline -- only themes listed here will be generated

### Step 4: Add to Template Visibility

Add your layout to `scripts/template-visibility.json`:

```json
"{layout}": {
  "hidden": false,
  "order": 20,
  "tags": ["tag1", "tag2"]
}
```

**Fields:**
- `hidden`: Set `true` to hide from previews (useful during development)
- `order`: Display order (lower = shown first). Existing layouts use 1-19.
- `tags`: Descriptive tags for filtering. Use existing tags: `popular`, `formal`, `minimal`, `nature`, `trending`, `dark`, `dramatic`, `vintage`, `creative`, `romantic`, `luxury`, `modern`, `classic`, `unique`, `artsy`, `elegant`

### Step 5: Add Screenshot Entry

Add your layout to the `layouts` array in `scripts/generate-screenshots.js`:

```javascript
{ name: '{layout}', theme: '{default_theme}' },
```

### Step 6: Add Demo Data Link

If you want a demo preview on the showcase page, you need to generate it. Use the sample wedding data:

```bash
node scripts/generate-layout-preview.js demo {layout}
```

This creates `public/preview/demo-{layout}/` with themed HTML files and an index page.

### Step 7: Add to Homepage and Showcase

Add a card to `public/index.html` in the layouts grid:

```html
<a href="preview/demo-{layout}/" target="_blank" class="layout-card reveal">
  <div class="layout-card-preview">
    <img src="screenshots/{layout}.webp" loading="lazy" alt="{Layout Name}">
    <div class="layout-card-preview-overlay">
      <span class="layout-card-preview-cta">Погледај демо &rarr;</span>
    </div>
  </div>
  <div class="layout-card-info">
    <div class="layout-card-name">{Layout Name}</div>
    <div class="layout-card-desc">{Serbian description}</div>
    <div class="layout-card-tag">2026</div>
  </div>
</a>
```

Add a corresponding entry in `public/showcase.html` (same card pattern).

---

## 3. Adding a Theme to an Existing Layout

This is simpler -- you only create a CSS file and register it.

### Step 1: Create Theme CSS

Create `templates/themes-{layout}/{new-theme}/style.css`.

Copy an existing theme for the same layout and modify colors, fonts, and decorative properties. The CSS variable names must match what the layout's base template expects.

### Step 2: Register the Theme

In `scripts/config.js`, add the theme to the existing layout entry:

```javascript
'{layout}': {
  // ... existing fields ...
  themes: ['{existing-theme}', '{new-theme}'],  // Add to array
  themeNames: {
    '{existing-theme}': '...',
    '{new-theme}': 'Назив нове теме'             // Add Serbian name
  },
  themeDescriptions: {
    '{existing-theme}': '...',
    '{new-theme}': 'Опис нове теме'              // Add Serbian description
  },
},
```

### Step 3: Add Google Fonts (if different)

If the new theme uses different fonts than the existing layout's `fonts` field, you'll need to update the `fonts` string to include all font families used across all themes. The `fonts` field is shared across all themes in a layout.

### Step 4: Regenerate Demo Preview

```bash
node scripts/generate-layout-preview.js demo {layout}
```

This regenerates the demo with all registered themes.

---

## 4. File Checklist

### New Layout Checklist

| # | File | Action | Required |
|---|------|--------|----------|
| 1 | `templates/base-{layout}.html` | Create | Yes |
| 2 | `templates/themes-{layout}/{theme}/style.css` | Create (1+ themes) | Yes |
| 3 | `scripts/config.js` | Add to `LAYOUT_REGISTRY` | Yes |
| 4 | `scripts/template-visibility.json` | Add entry | Yes |
| 5 | `scripts/generate-screenshots.js` | Add to `layouts` array | Yes |
| 6 | `public/preview/demo-{layout}/` | Generate via CLI | Yes |
| 7 | `public/screenshots/{layout}.webp` | Generate via CLI | Yes |
| 8 | `public/index.html` | Add layout card to grid | Recommended |
| 9 | `public/showcase.html` | Add layout card | Recommended |

### New Theme Checklist

| # | File | Action | Required |
|---|------|--------|----------|
| 1 | `templates/themes-{layout}/{theme}/style.css` | Create | Yes |
| 2 | `scripts/config.js` | Add theme to layout's `themes`/`themeNames`/`themeDescriptions` | Yes |
| 3 | `public/preview/demo-{layout}/` | Regenerate | Yes |

---

## 5. Testing

### 5.1 Generate a Preview

```bash
# Generate layout preview with sample data
node scripts/generate-layout-preview.js demo {layout}

# Or with real wedding data
node scripts/generate-layout-preview.js {slug} {layout}
```

### 5.2 Visual Inspection

Start the dev server and check manually:

```bash
npm run serve
# Opens http://localhost:3000
```

**Check each theme at:**
- `http://localhost:3000/preview/demo-{layout}/{theme}.html`
- `http://localhost:3000/preview/demo-{layout}/index.html` (theme selector)

### 5.3 Inspection Checklist

| Check | What to verify |
|-------|---------------|
| Desktop (1200px+) | Full layout renders correctly |
| Tablet (768px) | Responsive breakpoints work |
| Mobile (375px) | All content readable, touch targets 44px+ |
| Countdown | Timer ticks and shows correct values |
| RSVP form | Form submits without JS errors (check console) |
| RSVP toggle | Guests/meal fields hide when "Нажалост, не могу" selected |
| Map links | "Прикажи на мапи" opens Google Maps |
| Calendar buttons | If included, all 3 links work (Google, Outlook, ICS) |
| Conditional blocks | Sections hide when data is absent (test with minimal data) |
| DigiPoz badge | Badge visible at bottom, links to Instagram |
| Animations | Smooth on desktop, reduced/disabled with `prefers-reduced-motion` |
| Fonts | Google Fonts load (check Network tab) |
| Console | Zero JS errors |

### 5.4 Generate Final Site

```bash
# Test final site generation
node scripts/generate-final.js demo {layout}/{theme}
```

Verify the output at `public/site/demo/index.html`.

### 5.5 Generate Screenshot

```bash
# Requires demo preview to exist first
npm run screenshots
```

Verify `public/screenshots/{layout}.webp` looks correct.

---

## 6. Deployment

### Automatic (Production)

Once your changes are pushed to `main`, the `deploy-pages.yml` workflow deploys `public/` to GitHub Pages if any file in `public/` changed. Demo previews and screenshots are included.

Wedding-specific previews are generated automatically via `generate-preview.yml` when couples submit the intake form. Final sites are generated via `generate-final.yml` when couples select a theme.

### Manual (Development)

```bash
# Generate all layout previews at once
npm run layout:all

# Generate screenshots for all layouts
npm run screenshots

# Start dev server
npm run serve
```

---

## Appendix A: Complete Placeholder Reference

### Always Available

| Placeholder | Source | Escaped |
|------------|--------|---------|
| `{{BRIDE_NAME}}` | `bride_name` | Yes |
| `{{GROOM_NAME}}` | `groom_name` | Yes |
| `{{WEDDING_DATE_FORMATTED}}` | Computed from `wedding_date` | Yes |
| `{{WEDDING_DATE_ISO}}` | `wedding_date` | No |
| `{{WEDDING_YEAR}}` | Extracted from `wedding_date` | Yes |
| `{{BRIDE_NAME_INITIAL}}` | First char of `bride_name` | Yes |
| `{{GROOM_NAME_INITIAL}}` | First char of `groom_name` | Yes |
| `{{CEREMONY_VENUE}}` | `ceremony_venue` | Yes |
| `{{CEREMONY_ADDRESS}}` | `ceremony_address` | Yes |
| `{{CEREMONY_TIME}}` | `ceremony_time` (default: "14:00") | Yes |
| `{{RECEPTION_VENUE}}` | `reception_venue` | Yes |
| `{{RECEPTION_ADDRESS}}` | `reception_address` | Yes |
| `{{RECEPTION_TIME}}` | `reception_time` (default: "18:00") | Yes |
| `{{INVITATION_INTRO}}` | `invitation_intro` (default provided) | Yes |
| `{{INVITATION_TEXT}}` | `invitation_text` (default provided) | Yes |
| `{{INVITATION_SIGNATURE}}` | `invitation_signature` (default provided) | Yes |
| `{{WEDDING_SLUG}}` | Computed via `slugify()` | Yes |
| `{{RSVP_DEADLINE}}` | `rsvp_deadline` or fallback | Yes |
| `{{RSVP_SCRIPT_URL}}` | From `config.js` | No |
| `{{THEME_CSS}}` | Assembled CSS | No (raw) |
| `{{THEME_FONTS}}` | Google Fonts links | No (raw) |

### Conditional (Present Only When Data Exists)

| Placeholder | Source | Escaped |
|------------|--------|---------|
| `{{CEREMONY_MAP_URL}}` | `ceremony_map_url` | No |
| `{{RECEPTION_MAP_URL}}` | `reception_map_url` | No |
| `{{STORY_TEXT}}` | `story_text` | Yes |
| `{{STORY_PHOTO_URL}}` | `story_photo_url` | No |
| `{{PULL_QUOTE}}` | `pull_quote` | Yes |
| `{{DRESS_CODE_TEXT}}` | `dress_code_text` | Yes |
| `{{ADDITIONAL_INFO}}` | `additional_info` | Yes |
| `{{WEDDING_HASHTAG}}` | `wedding_hashtag` | Yes |
| `{{MUSIC_URL}}` | `music_url` | No |
| `{{MUSIC_TITLE}}` | `music_title` | Yes |
| `{{MUSIC_ARTIST}}` | `music_artist` | Yes |

### Raw HTML (Never Escaped)

| Placeholder | Generated By |
|------------|-------------|
| `{{STORY_CARDS}}` | `generate-layout-preview.js` from `timeline` array |
| `{{TIMELINE_ITEMS}}` | `utils.generateTimelineItems()` from `timeline` array |
| `{{GALLERY_ITEMS}}` | `utils.generateGalleryItems()` from `gallery` array |
| `{{CALENDAR_BUTTONS}}` | `utils.generateCalendarButtons()` |
| `{{MEAL_OPTIONS}}` | `utils.generateMealOptions()` from `meal_options` array |
| `{{DRESS_CODE_COLOR_SWATCHES}}` | `utils.generateColorSwatches()` from `dress_code_colors` |

### Conditional Flags

| Flag | True When |
|------|-----------|
| `{{#IF_STORY}}` | `story_text` is non-empty |
| `{{#IF_STORY_PHOTO}}` | `story_photo_url` is non-empty |
| `{{#IF_TIMELINE}}` | `timeline` array has items |
| `{{#IF_GALLERY}}` | `gallery` array has items |
| `{{#IF_MUSIC}}` | `music_url` is non-empty |
| `{{#IF_DRESS_CODE}}` | `dress_code_text` is non-empty |
| `{{#IF_DRESS_CODE_COLORS}}` | `dress_code_colors` array has items |
| `{{#IF_CEREMONY_MAP}}` | `ceremony_map_url` is non-empty |
| `{{#IF_RECEPTION_MAP}}` | `reception_map_url` is non-empty |
| `{{#IF_ADDITIONAL_INFO}}` | `additional_info` is non-empty |
| `{{#IF_HASHTAG}}` | `wedding_hashtag` is non-empty |
| `{{#IF_MEAL_OPTIONS}}` | `meal_options` array has items |
| `{{#IF_PULL_QUOTE}}` | `pull_quote` is non-empty |

---

## Appendix B: Sample Wedding Data Schema

Reference: `data/sample-wedding.json`

```json
{
  "bride_name": "Ана",
  "groom_name": "Марко",
  "wedding_date": "2025-06-21",
  "ceremony_venue": "Храм Светог Саве",
  "ceremony_address": "Крушедолска 2а, Београд",
  "ceremony_time": "14:00",
  "ceremony_map_url": "https://maps.google.com/...",
  "reception_venue": "Ресторан Франш",
  "reception_address": "Булевар ослобођења 18, Београд",
  "reception_time": "18:00",
  "reception_map_url": "https://maps.google.com/...",
  "invitation_intro": "Драги наши,",
  "invitation_text": "Са великом радошћу вас позивамо...",
  "invitation_signature": "Са љубављу, Ана и Марко",
  "story_text": "Наша прича почела је...",
  "story_photo_url": "https://example.com/photo.jpg",
  "pull_quote": "Свака љубавна прича је лепа...",
  "timeline": [
    { "date": "2020-03", "title": "Први сусрет", "description": "...", "icon": "coffee" }
  ],
  "gallery": [
    { "url": "https://example.com/1.jpg", "caption": "Наш први плес" }
  ],
  "music_url": "https://example.com/song.mp3",
  "music_title": "Perfect",
  "music_artist": "Ed Sheeran",
  "dress_code_text": "Елегантно формално",
  "dress_code_colors": ["#E8D5B7", "#B8860B", "#2C2420"],
  "additional_info": "Паркинг је обезбеђен...",
  "wedding_hashtag": "АнаИМарко2025",
  "rsvp_deadline": "2025-06-01",
  "meal_options": [
    { "value": "meat", "label": "Месо" },
    { "value": "fish", "label": "Риба" },
    { "value": "vegan", "label": "Веганско" }
  ],
  "contact_email": "ana.marko@example.com"
}
```

---

## Appendix C: Existing Layouts Reference

| Layout | Themes (registered) | Metaphor | Lines |
|--------|-------------------|----------|-------|
| aurora | northern | Aurora borealis | ~900 |
| botanical | forest | Scientific herbarium | ~950 |
| cinema | noir | Movie premiere | 1059 |
| concert | rock | Festival poster | ~950 |
| envelope | velvet | Interactive envelope | 1465 |
| filmnoir | classic | Film noir detective | ~900 |
| gazette | broadsheet | Newspaper front page | ~950 |
| glass | frost | Glassmorphism | ~900 |
| kinetic | editorial | Kinetic typography | ~850 |
| letter | romantic | Handwritten love letter | 840 |
| magazine | vogue | Fashion magazine cover | ~950 |
| mediterranean | amalfi | Mediterranean coastline | ~900 |
| oldmoney | ivory | Old money estate | ~900 |
| passport | classic | Travel passport | ~1000 |
| scribble | watercolor | Hand-drawn sketches | ~900 |
| storybook | novel | Fairy tale book | ~950 |
| telegram | western | Vintage telegram | ~900 |
| velvet | burgundy | Luxury velvet texture | ~900 |
| wabisabi | paper | Japanese wabi-sabi | ~850 |

**Note:** Most layouts have a second theme on disk (e.g., cinema/golden, envelope/frost) that is not yet registered in `LAYOUT_REGISTRY`. Register them in config.js to make them available.
