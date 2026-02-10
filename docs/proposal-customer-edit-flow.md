# Proposal: Customer Data Correction Flow

## Problem

After a couple submits the intake form, there is **no way for them to correct typos or update their data**. The current system has zero edit/correction mechanisms — the only path is contacting admin manually (which isn't even prompted anywhere in the UI).

Common scenarios:
- Misspelled venue name or address
- Wrong time entered
- Changed venue/date after submission
- Typo in email (means they won't get notifications)
- Forgot to add story/hashtag/dress code details

## Current Architecture Constraints

- Form submits to Google Forms → Google Sheets
- Same slug (bride-groom names) is deterministic — re-submission creates same slug
- No duplicate detection in intake handler (it processes every submission)
- Preview generation is triggered via GitHub Actions repository_dispatch
- No email is sent to the couple after submission (only admin gets notified)
- Preview page has no edit UI — just theme selection + 24h timer

## Proposed Solutions (3 options, can combine)

---

### Option A: "Edit Your Details" Button on Preview Page (Recommended)

**What**: Add a small "Nesto nije tacno? Izmenite podatke" link on the preview/theme-selector page that opens a pre-filled version of the intake form.

**How it works**:
1. When preview is generated, the wedding JSON data is already available
2. Add a correction link to the preview index page: `form.html?edit=SLUG`
3. The form page detects the `?edit=SLUG` parameter
4. Fetch the existing data from a small JSON endpoint (or embed it in the preview page as a data attribute)
5. Pre-fill all form fields with existing data
6. On submit, the same Google Form flow runs again — since the slug is identical, the GitHub Action regenerates the preview with corrected data

**Pros**:
- Minimal backend changes (re-submission with same slug already works)
- Couple sees the correction option right when they're reviewing their preview
- Self-service, no admin involvement needed

**Effort**: Medium
- Add `?edit` query param handling to form.html JS
- Add data embedding in preview index page (or a tiny JSON file per wedding)
- Add "edit" link to preview-index.html template
- Test re-generation flow with same slug

---

### Option B: Correction Form on Preview Page (Simpler)

**What**: Instead of re-using the full intake form, add a lightweight "Report a correction" form directly on the preview page.

**How it works**:
1. Add a collapsible "Nesto nije tacno?" section at the bottom of the preview index page
2. Simple textarea: "Sta treba ispraviti?" + their email (pre-filled from data)
3. Submits to a new Google Apps Script endpoint or a simple Google Form
4. Admin receives notification, makes the correction manually, re-triggers preview

**Pros**:
- Very simple to implement
- No re-submission logic needed
- Works for edge cases (complex corrections the form can't capture)

**Cons**:
- Requires admin involvement for every correction
- Slower turnaround for the couple

**Effort**: Low
- Add HTML section to preview-index.html template
- Create simple Google Form or Apps Script endpoint
- Wire up the submission

---

### Option C: Confirmation Email with Edit Link (Best UX, More Work)

**What**: After form submission, send an automated email to the couple with a summary of their data and an edit link.

**How it works**:
1. In `intake-form-handler-automated.gs`, after processing, send email to `contact_email`
2. Email contains:
   - Summary of all submitted data
   - "If anything is wrong, click here to correct it" link → `form.html?edit=SLUG`
   - Preview link (once ready)
3. The edit link pre-fills the form (same as Option A)
4. Re-submission regenerates preview

**Pros**:
- Best UX — couple gets confirmation + correction opportunity immediately
- Also solves the "no email sent to couple" gap
- Professional touch (other services do this)

**Cons**:
- Requires Google Apps Script email sending changes
- Need to figure out data retrieval for pre-filling (Apps Script web app endpoint returning JSON?)

**Effort**: High
- Add `MailApp.sendEmail()` to intake handler with HTML template
- Build data retrieval endpoint in Apps Script
- Add pre-fill logic to form.html
- Test email deliverability

---

## Recommendation

**Start with Option B** (correction form on preview page) — it's quick to build, immediately useful, and covers the most common scenario (couple spots the typo when previewing).

**Then add Option C** (confirmation email) as a follow-up — it's the best UX and also fills the gap of "we don't email the couple at all today."

Option A (pre-filled edit form) can be added later when there's enough volume to justify reducing admin workload.

## Technical Notes

- Re-submission with the same bride+groom names generates the same slug, so the GitHub Action will overwrite the existing preview — this is the desired behavior for corrections
- The intake handler does NOT check for duplicates, so a re-submission will simply create a new row in Google Sheets. Consider adding a dedup check (find existing row by slug, update instead of append)
- For pre-filling the form via URL params, the form.html already has field IDs that match the data keys — parsing query params into fields is straightforward
