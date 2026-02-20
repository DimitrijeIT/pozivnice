# DigiPoz — Product Specification

**Version:** 1.0  
**Last Updated:** February 2026  
**Domain:** digipoz.rs

---

## Executive Summary

DigiPoz is a Serbian digital wedding invitation platform that automates the entire flow from intake form submission through preview generation, theme selection, and final site publishing with integrated RSVP tracking. The system produces self-contained, single-file HTML wedding invitations hosted on GitHub Pages.

**Target Market:** Serbian couples seeking elegant digital wedding invitations  
**Language:** Serbian Cyrillic (all user-facing content)  
**Pricing Model:** Not defined in codebase (likely flat-fee per invitation)

---

## 1. Product Features

### 1.1 For Couples (End Users)

| Feature | Description |
|---------|-------------|
| **Intake Form** | 6-step wizard collecting wedding details (names, date, venues, timeline, gallery, preferences) |
| **Preview Generation** | Automatic creation of themed preview site within minutes of form submission |
| **Theme Selection** | Interactive preview page showing all available themes for the couple to choose from |
| **Final Publishing** | One-click theme selection publishes permanent invitation at `digipoz.rs/site/{slug}/` |
| **RSVP Dashboard** | Per-couple Google Spreadsheet tracking guest responses in real-time |
| **Customizable Content** | Love story, photo gallery, timeline, dress code, meal options, additional info |

### 1.2 Invitation Features (Guest-Facing)

| Feature | Description |
|---------|-------------|
| **Countdown Timer** | Live countdown to wedding date |
| **Venue Information** | Ceremony + reception details with Google Maps integration |
| **Love Story Section** | Narrative text with optional photo |
| **Timeline** | Visual timeline of relationship milestones |
| **Photo Gallery** | Lightbox-enabled image gallery |
| **RSVP Form** | Guest attendance confirmation with name, guest count, meal preference, message |
| **Calendar Links** | Add-to-calendar (Google Calendar, Apple Calendar, Outlook, ICS) |
| **Dress Code** | Color palette swatches + text instructions |
| **Social Hashtag** | Wedding hashtag display |
| **Scroll Animations** | Smooth reveal animations on scroll |
| **Confetti Effect** | Celebratory confetti animation on RSVP submission |

---

## 2. Design System

### 2.1 Original Themes (2025) — 10 Variants

Single HTML template (`base.html`) with CSS-only differentiation:

| Theme | Style | Typography |
|-------|-------|------------|
| **Classic** | Traditional elegance, gold accents, ornamental | Cormorant Garamond + Lato |
| **Modern** | Clean lines, whitespace, contemporary | Montserrat + Lato |
| **Romantic** | Rose tones, floral motifs, soft | Great Vibes + Lora |
| **Minimal** | Ultra-clean, typography-focused | Inter |
| **Rustic** | Warm earth tones, natural textures | Amatic SC + Josefin Sans |
| **Botanical** | Green palette, eucalyptus, arches | Cormorant Garamond + Nunito |
| **Moody** | Dramatic burgundy, gold highlights | Cormorant Garamond + Josefin Sans |
| **Gatsby** | Art Deco, 1920s glamour, geometric | Poiret One + Josefin Sans |
| **Editorial** | Magazine layout, bold typography | Playfair Display + Source Sans |
| **Whimsical** | Playful illustrations, watercolor, pastel | Caveat + Quicksand |

### 2.2 2026 Layouts — 19 Standalone Templates

Each layout is a complete standalone HTML template with unique structure:

| Layout | Themes | Concept |
|--------|--------|---------|
| **aurora** | cosmic, northern | Northern lights, ethereal particles |
| **botanical** | forest, pressed | Nature, pressed flower herbarium |
| **cinema** | golden, noir | Movie premiere, film credits |
| **concert** | indie, rock | Music festival poster, ticket stub |
| **envelope** | frost, velvet | Animated opening envelope |
| **filmnoir** | classic, golden | 1930s Hollywood glamour |
| **gazette** | broadsheet, tabloid | Newspaper editorial layout |
| **glass** | aurora, frost | Glassmorphism, translucent cards |
| **kinetic** | editorial, moody | Dynamic typography, motion |
| **letter** | romantic, vintage | Handwritten love letter |
| **magazine** | glossy, vogue | Fashion magazine editorial |
| **mediterranean** | amalfi, santorini | Coastal tiles, terracotta |
| **oldmoney** | estate, ivory | Quiet luxury, monograms |
| **passport** | classic, tropical | Travel document booklet |
| **scribble** | pencil, watercolor | Hand-drawn illustrations |
| **storybook** | ink, novel | Chapter-based narrative |
| **telegram** | express, western | 1920s typewriter aesthetic |
| **velvet** | burgundy, navy | Dark mode, baroque opulence |
| **wabisabi** | ink, paper | Japanese scroll, imperfection |

**Total Available Designs:** 29 (10 original + 19 layouts × 2 themes each)

---

## 3. Technical Architecture

### 3.1 Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Static HTML/CSS/JS (vanilla, no framework) |
| **Hosting** | GitHub Pages (custom domain: digipoz.rs) |
| **Build** | Node.js scripts |
| **Automation** | GitHub Actions (3 workflows) |
| **Backend** | Google Apps Script (serverless) |
| **Database** | Google Sheets (per-couple RSVP tracking) |
| **Forms** | HTML form → Google Forms endpoint |
| **Marketing** | Instagram + ManyChat automation |

### 3.2 System Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CUSTOMER JOURNEY                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Instagram ──► Intake Form ──► Preview Generation ──► Theme Selection        │
│       │            │                  │                     │                │
│       │            ▼                  ▼                     ▼                │
│       │       Google Form      10+ Theme Previews     Final Site Published   │
│       │            │           digipoz.rs/preview/  digipoz.rs/site/     │
│       │            ▼                                        │                │
│       │       Apps Script ──────────────────────────────────┘                │
│       │            │                                                         │
│       │            ▼                                                         │
│       │       GitHub Actions (repository_dispatch)                           │
│       │            │                                                         │
│       │            ▼                                                         │
│       │       GitHub Pages Deploy                                            │
│       │                                                                      │
│       └───────────────────────────────────────────────────────────────────── │
│                                                                              │
│                              GUEST JOURNEY                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Receive Link ──► View Invitation ──► Submit RSVP ──► Couple Notified       │
│       │               │                    │                │               │
│       │               ▼                    ▼                ▼               │
│       │      Countdown, Gallery,     Apps Script      Google Sheet          │
│       │      Timeline, Venues        (rsvp-handler)   (per-couple)          │
│       │                                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Directory Structure

```
invitations/
├── .github/workflows/          # GitHub Actions (3 workflows)
│   ├── generate-preview.yml    # Triggered on form submission
│   ├── generate-final.yml      # Triggered on theme selection
│   └── deploy-pages.yml        # Manual deployments
│
├── data/                       # Wedding data JSON files
│   └── {slug}.json             # Per-couple wedding data
│
├── google-apps-script/         # Google Apps Script handlers
│   ├── intake-form-handler-automated.gs
│   ├── theme-selection-handler-automated.gs
│   ├── rsvp-handler.gs
│   └── love-story-handler.gs
│
├── public/                     # GitHub Pages root
│   ├── index.html              # Landing page
│   ├── form.html               # Intake form wizard
│   ├── showcase.html           # Theme showcase gallery
│   ├── preview/{slug}/         # Temporary preview sites
│   └── site/{slug}/            # Final published sites
│
├── scripts/                    # Node.js build scripts
│   ├── config.js               # Theme registry, URLs, settings
│   ├── utils.js                # Template processing, validation
│   ├── generate-preview.js     # Generate original theme previews
│   ├── generate-layout-preview.js  # Generate 2026 layout previews
│   ├── generate-final.js       # Generate final published site
│   ├── serve.js                # Development server
│   └── cleanup-expired.js      # Remove expired previews
│
└── templates/
    ├── base.html               # Original shared template
    ├── base-{layout}.html      # 19 standalone 2026 templates
    ├── script.js               # Client-side JS (inlined)
    ├── *.css                   # Shared CSS files
    ├── themes/{theme}/         # 10 original theme CSS
    └── themes-{layout}/{theme}/ # 2026 layout-specific CSS
```

---

## 4. Data Specification

### 4.1 Wedding Data Schema (JSON)

**Required Fields:**

```json
{
  "slug": "milica-stefan-2026",
  "bride_name": "Милица",
  "groom_name": "Стефан",
  "wedding_date": "2026-09-12",
  "ceremony_venue": "Храм Светог Саве",
  "ceremony_address": "Крушедолска 2а, Београд",
  "ceremony_time": "15:00"
}
```

**Optional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `reception_venue` | string | Reception location name |
| `reception_address` | string | Reception address |
| `reception_time` | string | Reception start time (HH:MM) |
| `ceremony_map_url` | URL | Google Maps link for ceremony |
| `reception_map_url` | URL | Google Maps link for reception |
| `story_text` | string | Love story narrative |
| `story_photo_url` | URL | Love story photo |
| `pull_quote` | string | Featured quote |
| `invitation_intro` | string | Intro text |
| `invitation_text` | string | Main invitation body |
| `invitation_signature` | string | Signature line |
| `dress_code_text` | string | Dress code instructions |
| `dress_code_colors` | array | Hex color swatches |
| `wedding_hashtag` | string | Social media hashtag |
| `rsvp_deadline` | date | RSVP deadline (ISO) |
| `meal_options` | array | Meal choice options |
| `timeline` | array | Timeline events |
| `gallery` | array | Photo gallery items |
| `additional_info` | string | Extra information |
| `contact_email` | string | Couple's email |

### 4.2 Timeline Event Schema

```json
{
  "date": "Јун 2023",
  "title": "Први сусрет",
  "description": "Случајно смо се срели у кафићу.",
  "icon": "☕"
}
```

### 4.3 Gallery Item Schema

```json
{
  "url": "https://example.com/photo.jpg",
  "thumbnail": "https://example.com/photo-thumb.jpg",
  "caption": "Наш први одмор"
}
```

### 4.4 RSVP Submission Schema

```json
{
  "slug": "milica-stefan-2026",
  "name": "Марко Петровић",
  "email": "marko@example.com",
  "phone": "+381 66 123 4567",
  "attending": true,
  "guests_count": 2,
  "meal_preference": "Месо",
  "message": "Честитамо!"
}
```

---

## 5. URL Structure

| URL Pattern | Purpose |
|-------------|---------|
| `digipoz.rs/` | Landing page |
| `digipoz.rs/form.html` | Intake form |
| `digipoz.rs/showcase.html` | Theme showcase |
| `digipoz.rs/preview/{slug}/` | Theme preview (temporary, 24h) |
| `digipoz.rs/preview/{slug}/index.html` | Theme selector page |
| `digipoz.rs/preview/{slug}/{theme}.html` | Individual theme preview |
| `digipoz.rs/site/{slug}/` | Final published invitation |

### Slug Format

Cyrillic names are transliterated to URL-safe Latin:
- Input: `Милица` + `Стефан` + `2026`
- Output: `milica-stefan-2026`
- Pattern: `^[a-z0-9-]+$`

---

## 6. API Endpoints (Google Apps Script)

### 6.1 RSVP Submission

```
POST {RSVP_SCRIPT_URL}
Content-Type: text/plain;charset=utf-8
Mode: no-cors

Body: JSON with slug, name, email, attending, guests_count, meal_preference, message
```

### 6.2 Theme Selection

```
POST {THEME_SELECTION_URL}
Content-Type: text/plain;charset=utf-8
Mode: no-cors

Body: JSON with slug, theme
```

---

## 7. Security Measures

| Vector | Mitigation |
|--------|------------|
| **Shell Injection** | Workflow inputs validated with regex, passed via `env:` blocks |
| **XSS** | Template variables HTML-escaped by default; raw fields explicitly whitelisted |
| **CORS** | All submissions use `mode: 'no-cors'` with `text/plain` for GAS compatibility |
| **SEO/Privacy** | `noindex, nofollow` meta tag on all invitation pages |
| **Data Exposure** | Wedding data cleaned up from gh-pages after final generation |
| **Credentials** | API keys stored in GAS Script Properties, URLs use env var overrides |

---

## 8. Build Commands

```bash
npm run serve          # Dev server on port 3000
npm run preview        # node scripts/generate-preview.js <slug>
npm run generate       # node scripts/generate-final.js <slug> <theme>
npm run layout         # node scripts/generate-layout-preview.js <layout> [slug]
npm run layout:all     # Generate all 19 layout previews with demo data
npm run layout:list    # List available 2026 layouts
npm run cleanup        # Remove expired previews (>24h)
npm run validate       # Validate config.js settings
npm run screenshots    # Generate theme screenshots (Playwright)
```

---

## 9. Dependencies

**Production:**
- `fs-extra` — Enhanced file system operations
- `playwright` — Browser automation for screenshots

**External Services:**
- Google Forms — Intake form backend
- Google Sheets — RSVP data storage
- Google Apps Script — Serverless backend
- GitHub Actions — CI/CD automation
- GitHub Pages — Static hosting
- Google Fonts — Typography

---

## 10. Limitations & Known Issues

| Issue | Status | Notes |
|-------|--------|-------|
| No automated tests | Open | No test suite configured |
| No linter | Open | No ESLint/Prettier setup |
| Code duplication | Open | `generate-layout-preview.js` duplicates utils from `utils.js` |
| Optimistic RSVP | By design | `no-cors` mode means success shown even if server fails |
| Calendar links | Partial | Only in `base.html` and `base-envelope.html` |
| Manual GAS deploy | Open | No clasp CLI; copy-paste deployment |

---

## 11. Future Enhancements (Potential)

1. **Automated Testing** — Add Jest/Playwright test suite
2. **Linting** — ESLint + Prettier configuration
3. **Utils Consolidation** — Merge duplicate code from layout generator
4. **Calendar Links** — Add to all 2026 templates
5. **Clasp Integration** — Automated GAS deployment
6. **Internationalization** — Support for other languages/regions
7. **Payment Integration** — Stripe/PayPal for order processing
8. **CMS Interface** — Admin panel for managing invitations
9. **Analytics** — Track invitation views and RSVP rates
10. **Email Templates** — Automated email notifications to couples

---

## 12. Glossary

| Term | Definition |
|------|------------|
| **Slug** | URL-safe identifier derived from couple names + year |
| **Theme** | CSS-only variant of the original base template |
| **Layout** | Complete standalone 2026 template with unique HTML structure |
| **GAS** | Google Apps Script |
| **gh-pages** | GitHub Pages branch for static hosting |
| **RSVP** | Répondez s'il vous plaît — Guest response form |
| **Intake Form** | Initial form couples fill with wedding details |
| **Preview** | Temporary multi-theme site for couple to choose from |
| **Final Site** | Permanent single-theme published invitation |

---

*Document generated from codebase analysis. For technical implementation details, see [architecture.md](architecture.md).*
