# Google & GitHub Setup Guide

Complete setup instructions for the DigiPoz wedding invitation platform — Google Sheets, Google Apps Script, GitHub Actions, and RSVP system.

---

## 1. Master Google Spreadsheet

Create one master Google Spreadsheet that serves as the central hub. This spreadsheet needs two tabs:

### Tab 1: Weddings (default sheet)

This is the sheet linked to the Google Form intake. Column headers should match the form questions:

| Ime mlade | Ime mladozenje | Datum vencanja | Mesto ceremonije | Adresa ceremonije | Vreme ceremonije | ... |
|-----------|---------------|---------------|-----------------|-------------------|-----------------|-----|

The intake form handler reads from this sheet automatically when form responses arrive.

### Tab 2: RSVP_Lookup

This tab is **created automatically** by the intake form handler on first use. If you need to create it manually:

| Column A | Column B | Column C |
|----------|----------|----------|
| **Slug** | **Spreadsheet ID** | **Created At** |
| ana-marko | 1BxiMVs0XRA5nFMdKv... | 2026-01-15T10:30:00Z |
| petar-jovana | 1CyiNWt1YSB6oGNeL... | 2026-01-20T14:00:00Z |

- **Slug**: URL-safe identifier generated from couple names (Cyrillic transliterated)
- **Spreadsheet ID**: The ID of the per-couple RSVP spreadsheet (from the URL: `docs.google.com/spreadsheets/d/{THIS_PART}/`)
- **Created At**: ISO timestamp

**Copy the Spreadsheet ID** from the URL bar — you will need it for multiple script properties.

---

## 2. Per-Couple RSVP Spreadsheets

Each wedding gets its own dedicated Google Spreadsheet for tracking RSVPs. These are **created automatically** when a new form submission comes in (via `intake-form-handler-automated.gs`).

### Automatic Creation (default flow)

When the intake form handler processes a submission, it:
1. Creates a new spreadsheet named `RSVP - Bride & Groom (slug)`
2. Sets up a sheet named `Potvrde dolaska` with these headers:

| Ime | E-mail | Telefon | Dolazi | Broj gostiju | Obrok | Poruka | Vreme prijave |
|-----|--------|---------|--------|-------------|-------|--------|---------------|

3. Sets sharing to "Anyone with the link can view"
4. Registers the spreadsheet ID in the `RSVP_Lookup` tab

### Manual Creation (if needed)

If you need to create an RSVP sheet manually:

1. Create a new Google Spreadsheet
2. Name the first sheet `Potvrde dolaska`
3. Add these headers in row 1:
   - A1: `Ime`
   - B1: `E-mail`
   - C1: `Telefon`
   - D1: `Dolazi`
   - E1: `Broj gostiju`
   - F1: `Obrok`
   - G1: `Poruka`
   - H1: `Vreme prijave`
4. Set sharing: Share > Anyone with the link > Viewer
5. Copy the Spreadsheet ID from the URL
6. Add a row to the `RSVP_Lookup` tab in the master spreadsheet:
   - Column A: the wedding slug (e.g., `ana-marko`)
   - Column B: the new spreadsheet ID
   - Column C: current date/time

---

## 3. Google Apps Script Deployments

There are **4 separate Google Apps Script projects** to deploy. Each handles a different part of the system.

### 3.1 Intake Form Handler (`intake-form-handler-automated.gs`)

**Purpose**: Processes new Google Form submissions, creates per-couple RSVP sheets, triggers GitHub Actions to generate previews.

**Where to deploy**: In the Script Editor of the **master spreadsheet** (the one linked to the Google Form).

**Setup**:
1. Open the master spreadsheet
2. Extensions > Apps Script
3. Paste the code from `google-apps-script/intake-form-handler-automated.gs`
4. Add **Script Properties** (Project Settings > Script Properties):

| Property | Value |
|----------|-------|
| `GITHUB_TOKEN` | Your GitHub Personal Access Token (needs `repo` scope) |
| `GITHUB_REPO` | `YourUsername/invitations` (e.g., `DimitrijeIT/pozivnice`) |
| `NOTIFY_EMAIL` | Your email for fallback notifications |

5. Set up **Trigger**:
   - Triggers (clock icon) > Add Trigger
   - Function: `onFormSubmit`
   - Event source: From spreadsheet
   - Event type: On form submit

**No web app deployment needed** — this runs via trigger only.

### 3.2 Theme Selection Handler (`theme-selection-handler-automated.gs`)

**Purpose**: Receives theme selection from the preview page, triggers GitHub Actions to generate the final site.

**Where to deploy**: As a **standalone Apps Script project** (not in the spreadsheet).

**Setup**:
1. Go to [script.google.com](https://script.google.com) > New project
2. Paste the code from `google-apps-script/theme-selection-handler-automated.gs`
3. Add **Script Properties**:

| Property | Value |
|----------|-------|
| `GITHUB_TOKEN` | Same GitHub token |
| `GITHUB_REPO` | Same repo path |
| `MASTER_SPREADSHEET_ID` | ID of the master spreadsheet |

4. **Deploy as Web App**:
   - Deploy > New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click Deploy
5. **Copy the Web App URL** — this goes into `config.js` as `THEME_SELECTION_URL`

### 3.3 RSVP Handler (`rsvp-handler.gs`)

**Purpose**: Receives RSVP form submissions from wedding invitation pages, saves responses to the per-couple spreadsheet.

**Where to deploy**: As a **standalone Apps Script project**.

**Setup**:
1. Go to [script.google.com](https://script.google.com) > New project
2. Paste the code from `google-apps-script/rsvp-handler.gs`
3. Add **Script Properties**:

| Property | Value |
|----------|-------|
| `MASTER_SPREADSHEET_ID` | ID of the master spreadsheet |

4. **Deploy as Web App**:
   - Deploy > New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click Deploy
5. **Copy the Web App URL** — this goes into `config.js` as `RSVP_SCRIPT_URL`

### 3.4 RSVP Count Handler (`rsvp-count-handler.gs`)

**Purpose**: Returns live RSVP statistics (attending count, guest count) for the invitation pages. Uses 60-second cache.

**Where to deploy**: As a **standalone Apps Script project**.

**Setup**:
1. Go to [script.google.com](https://script.google.com) > New project
2. Paste the code from `google-apps-script/rsvp-count-handler.gs`
3. Add **Script Properties**:

| Property | Value |
|----------|-------|
| `MASTER_SPREADSHEET_ID` | ID of the master spreadsheet |

4. **Deploy as Web App**:
   - Deploy > New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click Deploy
5. **Copy the Web App URL** — this goes into `config.js` as `RSVP_COUNT_SCRIPT_URL`

---

## 4. GitHub Configuration

### Repository Secrets

Go to your GitHub repo > Settings > Secrets and variables > Actions. Add these secrets:

| Secret | Value | Used by |
|--------|-------|---------|
| `EMAIL_USERNAME` | Gmail address for sending notifications | Both workflows |
| `EMAIL_PASSWORD` | Gmail App Password (not your login password) | Both workflows |

**Note**: `GITHUB_TOKEN` is automatically provided by GitHub Actions — you don't need to add it as a secret.

### Gmail App Password

To generate a Gmail App Password (required for email notifications):
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security > 2-Step Verification (must be enabled)
3. App passwords > Generate
4. Select "Mail" and your device
5. Copy the 16-character password — use this as `EMAIL_PASSWORD`

### GitHub Personal Access Token (for Apps Script)

The token used in Script Properties needs the `repo` scope:
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Generate new token (classic)
3. Select `repo` scope (full control of private repositories)
4. Copy the token — use this as `GITHUB_TOKEN` in Script Properties

### Workflow Files

Two workflows must exist in `.github/workflows/`:

- **`generate-preview.yml`** — Triggered by `repository_dispatch` event type `new-wedding`. Generates all theme previews.
- **`generate-final.yml`** — Triggered by `repository_dispatch` event type `theme-selected`. Generates the final single-theme site.

These are already set up in the repository.

---

## 5. config.js Configuration

Update `scripts/config.js` with the deployed Web App URLs:

```js
THEME_SELECTION_URL: 'https://script.google.com/macros/s/YOUR_THEME_HANDLER_ID/exec',
RSVP_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_RSVP_HANDLER_ID/exec',
RSVP_COUNT_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_RSVP_COUNT_HANDLER_ID/exec',
GOOGLE_SHEET_ID: 'YOUR_MASTER_SPREADSHEET_ID',
```

### Current Status

| Config Key | Status |
|------------|--------|
| `THEME_SELECTION_URL` | Configured |
| `RSVP_SCRIPT_URL` | Configured |
| `RSVP_COUNT_SCRIPT_URL` | **Not configured** (empty string) |
| `GOOGLE_SHEET_ID` | **Not configured** (placeholder) |

---

## 6. Complete Flow Summary

```
Google Form submission
  |
  v
intake-form-handler-automated.gs (trigger: onFormSubmit)
  |-- Creates per-couple RSVP spreadsheet
  |-- Registers in RSVP_Lookup tab
  |-- Triggers GitHub Action (event: new-wedding)
  |
  v
generate-preview.yml (GitHub Actions)
  |-- Saves wedding data as data/{slug}.json
  |-- Runs generate-preview.js
  |-- Deploys to GitHub Pages: /preview/{slug}/
  |-- Sends email with preview link + RSVP sheet link
  |
  v
Couple visits preview, selects a theme
  |-- POST to theme-selection-handler-automated.gs
  |
  v
theme-selection-handler-automated.gs (web app)
  |-- Looks up RSVP sheet URL from RSVP_Lookup
  |-- Looks up contact email from Weddings tab
  |-- Triggers GitHub Action (event: theme-selected)
  |
  v
generate-final.yml (GitHub Actions)
  |-- Runs generate-final.js with selected theme
  |-- Deploys to GitHub Pages: /site/{slug}/
  |-- Sends email with final site link + RSVP sheet link
  |
  v
Guests visit /site/{slug}/, fill in RSVP form
  |-- POST to rsvp-handler.gs
  |
  v
rsvp-handler.gs (web app)
  |-- Looks up per-couple spreadsheet via RSVP_Lookup
  |-- Saves RSVP to per-couple sheet
  |-- Returns updated counts
```

---

## 7. Redeploying After Code Changes

When you update any Apps Script code:

1. Open the script project
2. Make your changes
3. Deploy > Manage deployments
4. Click the pencil icon on your active deployment
5. Set Version to "New version"
6. Click Deploy

The Web App URL stays the same — no need to update config.js.

---

## 8. Troubleshooting

### RSVP submissions fail with "No RSVP spreadsheet found"
- Check the `RSVP_Lookup` tab in the master spreadsheet
- Verify the slug matches exactly (case-sensitive)
- Verify the Spreadsheet ID in column B is correct

### GitHub Action not triggered
- Check Script Properties: `GITHUB_TOKEN` and `GITHUB_REPO` must be set
- Verify the token hasn't expired
- Check Apps Script Executions log for errors

### Email notifications not sending
- Verify `EMAIL_USERNAME` and `EMAIL_PASSWORD` secrets in GitHub
- The password must be a Gmail App Password, not your login password
- 2-Step Verification must be enabled on the Gmail account

### Per-couple RSVP spreadsheet not created
- Check that the Apps Script has Drive permissions (first run will prompt)
- Check Executions log in the intake form handler script
- Manually create using the steps in Section 2

### Clearing RSVP count cache
- Open the RSVP Count Handler script
- Run `clearCache('slug-here')` from the editor
- Cache auto-expires after 60 seconds
