# Complete DigiPoz Setup Guide (From Scratch)

## Overview: What connects to what

```
Google Form  →  Master Sheet  →  Script 1 (Intake)  →  GitHub Actions  →  Preview site
                                        ↓
                                  Creates per-couple RSVP sheets
                                  Registers in RSVP_Lookup tab

Preview site  →  Script 2 (Theme Selection)  →  GitHub Actions  →  Final site

Final site RSVP form  →  Script 3 (RSVP Handler)  →  Per-couple RSVP sheet
```

---

## STEP 1: Create a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name it: `DigiPoz Wedding Automation`
4. Expiration: 90 days (or longer)
5. Scopes: check **`repo`** (full repo access)
6. Click **Generate token**
7. **Copy and save the token** — you'll need it in Steps 4 and 5

---

## STEP 2: Create the Google Form

1. Go to https://docs.google.com/forms
2. Create a new form with these **exact** field names (in this order):

| # | Field Name | Type |
|---|-----------|------|
| 1 | Име младе | Short text |
| 2 | Име младожење | Short text |
| 3 | Е-маил за контакт | Short text |
| 4 | Телефон за контакт | Short text |
| 5 | Датум венчања | Date |
| 6 | Рок за потврду доласка (RSVP) | Date |
| 7 | Место церемоније | Short text |
| 8 | Адреса церемоније | Short text |
| 9 | Време церемоније | Short text |
| 10 | Google Maps линк за церемонију | Short text |
| 11 | Место прославе | Short text |
| 12 | Адреса прославе | Short text |
| 13 | Време прославе | Short text |
| 14 | Google Maps линк за прославу | Short text |
| 15 | Ваша прича (како сте се упознали) | Long text |
| 16 | Дрес код | Short text |
| 17 | Хаштаг венчања | Short text |
| 18 | Додатне напомене | Long text |

3. Click the **Responses** tab → Click the Google Sheets icon → **Create a new spreadsheet**
4. Name the spreadsheet: **"DigiPoz Master"** — this is your **Master Spreadsheet**
5. Open the spreadsheet, note the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/edit
                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                          This is your MASTER_SPREADSHEET_ID
   ```

---

## STEP 3: Update `public/form.html` with Google Form Entry IDs

1. Open your Google Form in **edit mode**
2. Open the form **preview** (eye icon)
3. Right-click → **View Page Source**
4. Search for `entry.` — you'll see each field's entry ID (e.g., `entry.308366218`)
5. Map each field to the correct entry ID in `public/form.html` (around line 1016):

```javascript
FIELD_MAP: {
  bride_name: 'entry.XXXXXXXXX',      // Име младе
  groom_name: 'entry.XXXXXXXXX',      // Име младожење
  contact_email: 'entry.XXXXXXXXX',   // Е-маил за контакт
  contact_phone: 'entry.XXXXXXXXX',   // Телефон за контакт
  wedding_date: 'entry.XXXXXXXXX',    // Датум венчања
  rsvp_deadline: 'entry.XXXXXXXXX',   // Рок за потврду доласка
  ceremony_venue: 'entry.XXXXXXXXX',  // Место церемоније
  ceremony_address: 'entry.XXXXXXXXX',// Адреса церемоније
  ceremony_time: 'entry.XXXXXXXXX',   // Време церемоније
  ceremony_map_url: 'entry.XXXXXXXXX',// Google Maps линк за церемонију
  reception_venue: 'entry.XXXXXXXXX', // Место прославе
  reception_address: 'entry.XXXXXXXXX',// Адреса прославе
  reception_time: 'entry.XXXXXXXXX',  // Време прославе
  reception_map_url: 'entry.XXXXXXXXX',// Google Maps линк за прославу
  story_text: 'entry.XXXXXXXXX',      // Ваша прича
  dress_code_text: 'entry.XXXXXXXXX', // Дрес код
  wedding_hashtag: 'entry.XXXXXXXXX', // Хаштаг венчања
  additional_info: 'entry.XXXXXXXXX'  // Додатне напомене
}
```

Also update `GOOGLE_FORM_URL` with the form's action URL:
```
https://docs.google.com/forms/d/e/XXXXXXXXXX/formResponse
```

> **Note:** The `dress_code_text` entry ID is currently incomplete in form.html (`entry.` with no number). Make sure to fill it in.

---

## STEP 4: Script 1 — Intake Form Handler (Trigger)

This runs **inside the Master Spreadsheet**. It fires on every form submission.

1. Open your **DigiPoz Master** spreadsheet
2. Go to **Extensions → Apps Script**
3. Delete any existing code in `Code.gs`
4. Paste the entire contents of `google-apps-script/intake-form-handler-automated.gs`
5. Click **Project Settings** (gear icon on left sidebar)
6. Scroll to **Script Properties** → Click **Add script property**:

| Property | Value |
|----------|-------|
| `GITHUB_TOKEN` | Your token from Step 1 |
| `GITHUB_REPO` | `DimitrijeIT/pozivnice` (your username/repo) |

7. Set up the **trigger**:
   - Click **Triggers** (clock icon on left sidebar)
   - Click **+ Add Trigger**
   - Function: **`onFormSubmit`**
   - Event source: **From spreadsheet**
   - Event type: **On form submit**
   - Click **Save**
   - Google will ask for permissions — **Allow** everything (Drive, Sheets, Mail, URL fetch)

8. **Test it**: Run the `testGitHubTrigger` function from the editor (play button). Check the **Execution Log** — you should see `Trigger result: SUCCESS`.

### What this does

When a form is submitted, it:
- Reads the form data from the spreadsheet
- Generates a slug (e.g., `ana-marko`)
- Creates a new per-couple RSVP spreadsheet
- Creates an `RSVP_Lookup` tab (auto-created on first submission) and registers the RSVP sheet
- Triggers the `generate-preview.yml` GitHub Action via `repository_dispatch`

---

## STEP 5: Script 2 — Theme Selection Handler (Web App)

This is a **separate** Apps Script project. It handles theme selection from the preview page + correction requests.

1. Go to https://script.google.com → Click **New project**
2. Name it: **"DigiPoz Theme Selection Handler"**
3. Delete default code, paste the entire contents of `google-apps-script/theme-selection-handler-automated.gs`
4. Click **Project Settings** (gear icon) → **Script Properties** → Add:

| Property | Value |
|----------|-------|
| `GITHUB_TOKEN` | Same token from Step 1 |
| `GITHUB_REPO` | `DimitrijeIT/pozivnice` (same as above) |
| `MASTER_SPREADSHEET_ID` | The spreadsheet ID from Step 2 |

5. **Deploy as Web App**:
   - Click **Deploy → New deployment**
   - Click the gear icon → select **Web app**
   - Description: `Theme Selection Handler`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
   - **Copy the Web App URL** (looks like `https://script.google.com/macros/s/XXXXXX/exec`)

6. **Test it**: Open the Web App URL in a browser. You should see a status page saying "Configured" in green.

### What this does

- Receives POST from preview page when couple selects a theme
- Looks up RSVP sheet URL + contact email from Master Spreadsheet
- Triggers `generate-final.yml` GitHub Action
- Also handles correction requests (writes to `Corrections` tab, emails admin)

---

## STEP 6: Script 3 — RSVP Handler (Web App)

Another **separate** Apps Script project for handling guest RSVP submissions.

1. Go to https://script.google.com → Click **New project**
2. Name it: **"DigiPoz RSVP Handler"**
3. Delete default code, paste the entire contents of `google-apps-script/rsvp-handler.gs`
4. Click **Project Settings** → **Script Properties** → Add:

| Property | Value |
|----------|-------|
| `MASTER_SPREADSHEET_ID` | The spreadsheet ID from Step 2 |

5. **Deploy as Web App**:
   - Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, authorize permissions
   - **Copy the Web App URL**

### What this does

When a guest submits an RSVP on the wedding invitation:
- Looks up the per-couple RSVP spreadsheet from `RSVP_Lookup` tab
- Writes the RSVP data to that couple's dedicated spreadsheet
- Returns updated attendance counts

---

## STEP 7: Update `scripts/config.js` with Web App URLs

Update these 2 URLs in `scripts/config.js`:

```javascript
THEME_SELECTION_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_2_URL/exec',
RSVP_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_3_URL/exec',
```

Also update `GOOGLE_SHEET_ID` (line 11) with your Master Spreadsheet ID.

---

## STEP 8: (Optional) Set up Email Notifications from GitHub Actions

To send automatic emails to couples when their preview/final site is ready:

1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
2. Add these secrets:

| Secret | Value |
|--------|-------|
| `EMAIL_USERNAME` | Your Gmail address (e.g., `digipoz.rs@gmail.com`) |
| `EMAIL_PASSWORD` | A Gmail **App Password** (not your regular password) |

To create a Gmail App Password:
- Go to https://myaccount.google.com/apppasswords
- You need 2-factor auth enabled
- Generate an app password for "Mail"

---

## STEP 9: Commit and Push

After updating `form.html` and `config.js`, commit and push:

```bash
git add public/form.html scripts/config.js
git commit -m "Update form entry IDs and Apps Script URLs"
git push
```

---

## Reference: What you should have after setup

### Components

| Component | Where | URL to save |
|-----------|-------|-------------|
| Master Spreadsheet | Google Sheets | Spreadsheet ID |
| Script 1: Intake Handler | Inside Master Sheet's Apps Script | (no URL, trigger-based) |
| Script 2: Theme Selection | Separate Apps Script project | Web App URL → `config.js` |
| Script 3: RSVP Handler | Separate Apps Script project | Web App URL → `config.js` |

### Master Spreadsheet Tabs (auto-created)

| Tab | Created by | Purpose |
|-----|-----------|---------|
| Form Responses | Google Forms (auto) | Raw form data |
| RSVP_Lookup | Script 1 (auto on first submit) | Maps slug → RSVP spreadsheet ID |
| Corrections | Script 2 (auto on first correction) | Customer correction requests |

### Script Properties Summary

| Script | Properties needed |
|--------|------------------|
| Script 1 (Intake) | `GITHUB_TOKEN`, `GITHUB_REPO` |
| Script 2 (Theme Selection) | `GITHUB_TOKEN`, `GITHUB_REPO`, `MASTER_SPREADSHEET_ID` |
| Script 3 (RSVP) | `MASTER_SPREADSHEET_ID` |

---

## Testing the Full Flow

1. Submit the form at `form.html` (or the Google Form directly)
2. Check the Master Sheet — new row should appear in "Form Responses"
3. Check GitHub Actions — `generate-preview.yml` should be running
4. After ~2-3 min, preview should be live at `https://digipoz.rs/preview/{slug}/`
5. On the preview page, select a theme → `generate-final.yml` triggers
6. After ~2 min, final site is at `https://digipoz.rs/site/{slug}/`
7. Submit a test RSVP on the final site → check the per-couple RSVP spreadsheet

---

## Troubleshooting

### "GitHub Action not triggered"
- Check Script Properties: `GITHUB_TOKEN` and `GITHUB_REPO` are set correctly
- Run `testGitHubTrigger` in Script 1 and check the Execution Log
- Make sure the token has `repo` scope and hasn't expired

### "RSVP not saving"
- Check that `MASTER_SPREADSHEET_ID` is set in Script 3
- Check that the `RSVP_Lookup` tab exists in the Master Spreadsheet
- Check that the per-couple RSVP spreadsheet ID in `RSVP_Lookup` is valid

### "Theme selection not working"
- Check that `MASTER_SPREADSHEET_ID` is set in Script 2
- Open the Theme Selection Web App URL in browser — should show "Configured" in green
- Check that `THEME_SELECTION_URL` in `config.js` matches the deployed URL

### "Permissions error"
- Re-run any function in the script editor to re-trigger the authorization flow
- Make sure "Execute as: Me" and "Who has access: Anyone" are set for all web apps

### "Web App URL changed after redeployment"
- When you redeploy, choose **"New deployment"** (not "Manage deployments" > edit)
- Or use "Manage deployments" > edit the existing deployment to keep the same URL
- Update `config.js` if the URL changes
