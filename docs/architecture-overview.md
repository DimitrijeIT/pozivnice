# DigiPoz - Architecture Overview

## End-to-End Process

```
Instagram/ManyChat ──> Google Form ──> Google Sheet ──> GitHub Actions ──> GitHub Pages
     (lead)            (intake)        (data store)     (generation)      (hosting)
```

---

## 1. Customer Acquisition

**Instagram** is the primary channel. Posts, reels, and stories drive traffic.

**ManyChat** automates responses:
- Comment triggers send auto-DMs with the intake form link
- Keyword-based DM replies handle inquiries 24/7
- Leads are captured and logged to Google Sheets

The couple fills out a **Google Form** with wedding details (names, date, venues, story, preferences).

---

## 2. Preview Generation

```
Google Form submit
      |
      v
Google Sheet (new row)
      |
      v
Apps Script: intake-form-handler-automated.gs
      |  - reads form data
      |  - generates slug (Cyrillic -> Latin)
      |  - sends GitHub dispatch webhook
      v
GitHub Actions: generate-preview.yml
      |  - runs: node scripts/generate-preview.js {slug}
      |  - generates 10 themed HTML files from base.html
      |  - deploys to GitHub Pages
      v
Email sent to couple: "Your preview is ready"
      |
      v
https://pozivnice.rs/preview/{slug}/
```

The preview page shows all 10 theme options. The couple browses and picks one.

---

## 3. Theme Selection & Final Site

```
Couple clicks "Select" on preferred theme
      |
      v
POST to Apps Script: theme-selection-handler-automated.gs
      |  - validates slug + theme
      |  - sends GitHub dispatch webhook
      v
GitHub Actions: generate-final.yml
      |  - runs: node scripts/generate-final.js {slug} {theme}
      |  - generates single-theme HTML
      |  - deploys to GitHub Pages
      |  - deletes preview folder
      v
Email sent to couple: "Your invitation is live"
      |
      v
https://pozivnice.rs/site/{slug}/   (permanent)
```

---

## 4. Guest RSVP

```
Form submit (intake handler)
      |  - creates per-couple Google Spreadsheet
      |  - shares as "anyone with link can view"
      |  - registers in RSVP_Lookup tab (slug -> spreadsheet ID)
      |  - includes rsvp_sheet_url in GitHub dispatch + email
      v
Couple shares invitation link with guests
      |
      v
Guest visits invitation site
      |  - views wedding details, countdown, story, gallery
      |  - fills RSVP form (name, attendance, meal, message)
      v
POST to Apps Script: rsvp-handler.gs
      |  - looks up per-couple spreadsheet ID from RSVP_Lookup
      |  - validates submission
      |  - writes to per-couple Google Spreadsheet
      |  - calculates attendance counts
      |  - sends notification email to couple (optional)
      v
Per-couple Google Spreadsheet: live RSVP dashboard
      (viewable by couple via shared link)
```

---

## System Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Lead capture | Instagram + ManyChat | Acquire customers |
| Data intake | Google Forms + Sheets | Collect wedding details |
| Orchestration | Google Apps Script | Webhook triggers between services |
| Generation | Node.js scripts | Build HTML from templates + data |
| CI/CD | GitHub Actions | Automated build & deploy |
| Hosting | GitHub Pages | Serve static invitation sites |
| RSVP storage | Google Sheets (per-couple) | Track guest responses |
| Notifications | Gmail SMTP | Email couples at each stage |

---

## Key Files

```
scripts/
  generate-preview.js     # Build 10 theme previews
  generate-final.js       # Build final single-theme site
  utils.js                # Template processing, data prep, validation
  config.js               # Theme registry, URLs, settings

google-apps-script/
  intake-form-handler-automated.gs      # Form -> GitHub webhook
  theme-selection-handler-automated.gs  # Selection -> GitHub webhook
  rsvp-handler.gs                       # Guest RSVP -> per-couple Google Sheet
  rsvp-count-handler.gs                 # RSVP statistics from per-couple sheets

.github/workflows/
  generate-preview.yml    # Triggered by: new-wedding dispatch
  generate-final.yml      # Triggered by: theme-selected dispatch
  deploy-pages.yml        # Triggered by: push to public/

templates/
  base.html               # Main template (used by original 10 themes)
  base-{layout}.html      # Standalone layout templates (16 layouts)
  themes/{theme}/style.css # Theme-specific styles
```

---

## Data Flow Summary

1. **Couple fills Google Form** with wedding details
2. **Google Sheet** stores the data; **Apps Script** fires on submit
3. **GitHub Actions** generates 10 preview HTML files, deploys to Pages
4. **Email** notifies couple with preview link
5. **Couple selects theme**; Apps Script triggers final generation
6. **GitHub Actions** builds final site, deploys permanently
7. **Email** notifies couple with live invitation URL
8. **Guests RSVP** through the invitation; responses go to per-couple Google Spreadsheets
9. **Couple tracks RSVPs** in real-time via their dedicated spreadsheet (shared link in email)
