# Wedding Invitation Website System — Requirements for Claude Code

## Project Overview

Build a system that:
1. Collects wedding details from clients via Google Form
2. Generates a **temporary preview site (24h)** with multiple theme options for client to choose
3. After client picks a theme, generates the **final wedding site**
4. Each site has an RSVP form that saves responses to Google Sheets
5. All sites hosted on Cloudflare Pages under one domain (e.g., `pozivnice.rs/marko-i-ana`)

---

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript (no frameworks — keep it simple)
- **Hosting:** Cloudflare Pages (free)
- **Data storage:** Google Sheets (via Google Apps Script)
- **Forms:** HTML forms → Google Apps Script → Google Sheets
- **Build script:** Node.js script to generate static HTML from templates

---

## File Structure

```
wedding-invites/
├── scripts/
│   ├── generate-preview.js    # Creates 24h preview with all themes
│   ├── generate-final.js      # Creates final site with chosen theme
│   ├── cleanup-expired.js     # Removes previews older than 24h
│   └── config.js              # Google Sheets API config
│
├── templates/
│   ├── base.html              # Shared HTML structure
│   ├── themes/
│   │   ├── classic/
│   │   │   ├── style.css
│   │   │   └── preview.jpg    # Theme thumbnail
│   │   ├── modern/
│   │   │   ├── style.css
│   │   │   └── preview.jpg
│   │   ├── romantic/
│   │   │   ├── style.css
│   │   │   └── preview.jpg
│   │   ├── minimal/
│   │   │   ├── style.css
│   │   │   └── preview.jpg
│   │   └── rustic/
│   │       ├── style.css
│   │       └── preview.jpg
│   │
│   └── components/
│       ├── header.html
│       ├── countdown.html
│       ├── story.html
│       ├── details.html
│       ├── rsvp-form.html
│       └── footer.html
│
├── public/                    # Generated sites go here
│   ├── preview/              # Temporary 24h previews
│   │   └── marko-i-ana/
│   │       ├── index.html    # Theme selector page
│   │       ├── classic.html
│   │       ├── modern.html
│   │       ├── romantic.html
│   │       ├── minimal.html
│   │       └── rustic.html
│   │
│   └── site/                 # Final published sites
│       └── marko-i-ana/
│           └── index.html
│
├── data/
│   └── weddings.json         # Local cache of Google Sheet data
│
├── google-apps-script/
│   ├── intake-form-handler.gs    # Processes new client submissions
│   ├── rsvp-handler.gs           # Handles RSVP submissions
│   └── theme-selection-handler.gs # Records chosen theme
│
└── package.json
```

---

## Theme Descriptions

Create 5 distinct themes. Each theme has the same HTML structure but completely different CSS styling:

### 1. Classic (Класична)
- Elegant serif fonts (Playfair Display)
- Colors: ivory, gold, dark gray
- Decorative borders and ornaments
- Traditional formal feel

### 2. Modern (Модерна)
- Clean sans-serif fonts (Montserrat)
- Colors: white, black, one accent color
- Lots of whitespace
- Minimalist, contemporary

### 3. Romantic (Романтична)
- Script fonts for headings (Great Vibes)
- Colors: blush pink, rose gold, cream
- Soft gradients, floral decorations
- Dreamy, soft feel

### 4. Minimal (Минимална)
- Simple system fonts
- Colors: white, black only
- No decorations
- Ultra-clean, text-focused

### 5. Rustic (Рустична)
- Handwritten-style fonts (Amatic SC)
- Colors: kraft brown, forest green, cream
- Wood/paper textures
- Outdoor/nature wedding feel

### RSVP Counter Styling (All Themes)

Each theme must include styles for the RSVP counter:

```css
/* Base counter styles - customize colors per theme */
.rsvp-counter {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: 2rem 0;
    padding: 1.5rem;
    background: var(--counter-bg, #f9f9f9);
    border-radius: 12px;
}

.counter-item {
    text-align: center;
}

.counter-number {
    display: block;
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--counter-number-color, #333);
}

.counter-item.attending .counter-number {
    color: var(--accent-color, #2ecc71);
}

.counter-label {
    font-size: 0.85rem;
    color: var(--counter-label-color, #666);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Mobile responsive */
@media (max-width: 480px) {
    .rsvp-counter {
        flex-direction: column;
        gap: 1rem;
    }
    .counter-number {
        font-size: 2rem;
    }
}
```

---

## Google Form Fields (Client Intake)

Create a Google Form with these fields for clients to fill:

```
BASIC INFO:
- Bride's full name (Име младе)
- Groom's full name (Име младожење)
- Wedding date (Датум венчања)
- Wedding time - ceremony (Време церемоније)
- Wedding time - reception (Време прославе)
- Client email (Емаил за контакт)
- Client phone (Телефон)

LOCATIONS:
- Ceremony venue name (Назив места церемоније)
- Ceremony address (Адреса церемоније)
- Ceremony Google Maps link (optional)
- Reception venue name (Назив места прославе)
- Reception address (Адреса прославе)
- Reception Google Maps link (optional)

CONTENT:
- Welcome message / invitation text (Текст позивнице)
- Our story - how we met (Како смо се упознали) - optional
- Dress code (Dress code) - optional
- Special notes for guests (Посебне напомене) - optional

RSVP SETTINGS:
- RSVP deadline (Рок за потврду доласка)
- Allow plus ones? Yes/No (Дозволити додатне госте?)
- Ask about meal preferences? Yes/No (Питати за избор јела?)
- Meal options if yes (Понуђена јела) - comma separated

MEDIA:
- Main photo of couple (URL or upload)
- Additional photos (URLs or uploads) - optional

LANGUAGE:
- Site language: Serbian Cyrillic / Serbian Latin / Both / English
```

---

## Script 1: generate-preview.js

**Purpose:** Generate a 24h preview with all 5 themes for client to choose

**Input:** 
- Wedding slug (e.g., "marko-i-ana")
- Wedding data from Google Sheets

**Output:**
- `public/preview/{slug}/index.html` — Theme selector page
- `public/preview/{slug}/classic.html`
- `public/preview/{slug}/modern.html`
- `public/preview/{slug}/romantic.html`
- `public/preview/{slug}/minimal.html`
- `public/preview/{slug}/rustic.html`

**Theme Selector Page (index.html) Requirements:**
```
- Show all 5 theme thumbnails in a grid
- Each thumbnail is clickable → opens that theme preview
- Display: "Ваш преглед истиче за: XX:XX:XX" (countdown timer)
- Each theme preview has a button: "Изабери ову тему" (Select this theme)
- Selecting theme sends choice to Google Apps Script
- After selection, show confirmation message
- Store preview creation timestamp in filename or metadata
```

**Behavior:**
```javascript
// Pseudocode
1. Fetch wedding data from Google Sheet by slug
2. For each theme in [classic, modern, romantic, minimal, rustic]:
   - Load base.html template
   - Load theme CSS
   - Replace placeholders with wedding data:
     {{BRIDE_NAME}}, {{GROOM_NAME}}, {{DATE}}, {{TIME}}, etc.
   - Generate RSVP form with unique form ID
   - Save as public/preview/{slug}/{theme}.html
3. Generate index.html theme selector
4. Record creation timestamp
5. Commit and push to GitHub (triggers Cloudflare deploy)
```

---

## Script 2: generate-final.js

**Purpose:** Generate the final wedding site after client chooses theme

**Input:**
- Wedding slug
- Chosen theme name

**Output:**
- `public/site/{slug}/index.html` — Final wedding site

**Behavior:**
```javascript
// Pseudocode
1. Fetch wedding data from Google Sheet
2. Get selected theme from sheet
3. Load base.html + selected theme CSS
4. Generate final site with all sections:
   - Header with couple names
   - Countdown timer to wedding
   - Our story section (if provided)
   - Event details (ceremony + reception)
   - RSVP form
   - Footer
5. Save to public/site/{slug}/index.html
6. Delete preview folder public/preview/{slug}/
7. Update Google Sheet status to "published"
8. Commit and push to GitHub
```

---

## Script 3: cleanup-expired.js

**Purpose:** Remove preview folders older than 24 hours

**Run:** Daily via GitHub Actions or cron

**Behavior:**
```javascript
// Pseudocode
1. Scan public/preview/ folder
2. For each preview folder:
   - Check creation timestamp (from metadata or Google Sheet)
   - If older than 24 hours AND no theme selected:
     - Delete folder
     - Update Google Sheet status to "expired"
     - Optionally send email notification to client
3. Commit and push if changes made
```

---

## Google Apps Script 1: intake-form-handler.gs

**Trigger:** On Google Form submission

**Behavior:**
```javascript
function onFormSubmit(e) {
  // 1. Get form responses
  // 2. Generate slug from names: "marko-i-ana"
  // 3. Add row to master Wedding Sheet with:
  //    - All form data
  //    - Status: "pending_preview"
  //    - Created: timestamp
  //    - Preview URL: (empty)
  //    - Selected theme: (empty)
  // 4. Call webhook or send notification to trigger preview generation
  // 5. Send email to client with preview link (once generated)
}
```

---

## Google Apps Script 2: theme-selection-handler.gs

**Purpose:** Handle when client clicks "Select this theme"

**Endpoint:** POST request from theme selector page

```javascript
function doPost(e) {
  // 1. Get slug and selected theme from request
  // 2. Update Google Sheet row:
  //    - Selected theme: {theme}
  //    - Status: "theme_selected"
  //    - Selection time: timestamp
  // 3. Return success response
  // 4. Trigger final site generation (webhook or manual)
}
```

---

## Google Apps Script 3: rsvp-handler.gs

**Purpose:** Save RSVP responses to client's sheet AND return updated count

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const slug = data.wedding_slug;
  
  // Get or create RSVP sheet for this wedding
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('RSVP_' + slug);
  
  if (!sheet) {
    sheet = ss.insertSheet('RSVP_' + slug);
    sheet.appendRow(['Timestamp', 'Name', 'Attending', 'Guests', 'Meal', 'Message']);
  }
  
  // Append new RSVP
  sheet.appendRow([
    new Date(),
    data.guest_name,
    data.attending,
    data.num_guests || 1,
    data.meal || '',
    data.message || ''
  ]);
  
  // Calculate totals for response
  const counts = calculateCounts(sheet);
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      ...counts
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function calculateCounts(sheet) {
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1); // Skip header
  
  let totalResponses = rows.length;
  let totalAttending = 0;
  let totalGuests = 0;
  
  rows.forEach(row => {
    const attending = row[2]; // 'yes' or 'no'
    const guests = parseInt(row[3]) || 1;
    
    if (attending === 'yes') {
      totalAttending++;
      totalGuests += guests;
    }
  });
  
  return {
    totalResponses: totalResponses,
    totalAttending: totalAttending,
    totalGuests: totalGuests
  };
}
```

---

## Google Apps Script 4: rsvp-count-handler.gs

**Purpose:** Return current RSVP count (GET request for page load)

```javascript
function doGet(e) {
  const slug = e.parameter.slug;
  
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('RSVP_' + slug);
  
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({
        totalResponses: 0,
        totalAttending: 0,
        totalGuests: 0
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const counts = calculateCounts(sheet);
  
  return ContentService
    .createTextOutput(JSON.stringify(counts))
    .setMimeType(ContentService.MimeType.JSON);
}

function calculateCounts(sheet) {
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1);
  
  let totalResponses = rows.length;
  let totalAttending = 0;
  let totalGuests = 0;
  
  rows.forEach(row => {
    if (row[2] === 'yes') {
      totalAttending++;
      totalGuests += parseInt(row[3]) || 1;
    }
  });
  
  return { totalResponses, totalAttending, totalGuests };
}
```

---

## Wedding Site Sections (base.html)

```html
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BRIDE_NAME}} & {{GROOM_NAME}} — Венчање</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- HEADER -->
    <header class="hero">
        <div class="hero-content">
            <p class="pre-title">Позивамо вас на венчање</p>
            <h1 class="couple-names">{{BRIDE_NAME}} & {{GROOM_NAME}}</h1>
            <p class="wedding-date">{{DATE_FORMATTED}}</p>
        </div>
    </header>

    <!-- COUNTDOWN -->
    <section class="countdown" id="countdown">
        <h2>До венчања</h2>
        <div class="countdown-timer">
            <div class="time-block"><span id="days">00</span><label>дана</label></div>
            <div class="time-block"><span id="hours">00</span><label>сати</label></div>
            <div class="time-block"><span id="minutes">00</span><label>минута</label></div>
            <div class="time-block"><span id="seconds">00</span><label>секунди</label></div>
        </div>
    </section>

    <!-- INVITATION TEXT -->
    <section class="invitation">
        <p>{{INVITATION_TEXT}}</p>
    </section>

    <!-- OUR STORY (optional) -->
    {{#IF_STORY}}
    <section class="our-story">
        <h2>Наша прича</h2>
        <p>{{STORY_TEXT}}</p>
    </section>
    {{/IF_STORY}}

    <!-- EVENT DETAILS -->
    <section class="details">
        <div class="event ceremony">
            <h3>Церемонија</h3>
            <p class="time">{{CEREMONY_TIME}}</p>
            <p class="venue">{{CEREMONY_VENUE}}</p>
            <p class="address">{{CEREMONY_ADDRESS}}</p>
            {{#IF_CEREMONY_MAP}}
            <a href="{{CEREMONY_MAP_LINK}}" target="_blank" class="map-link">📍 Види на мапи</a>
            {{/IF_CEREMONY_MAP}}
        </div>
        <div class="event reception">
            <h3>Прослава</h3>
            <p class="time">{{RECEPTION_TIME}}</p>
            <p class="venue">{{RECEPTION_VENUE}}</p>
            <p class="address">{{RECEPTION_ADDRESS}}</p>
            {{#IF_RECEPTION_MAP}}
            <a href="{{RECEPTION_MAP_LINK}}" target="_blank" class="map-link">📍 Види на мапи</a>
            {{/IF_RECEPTION_MAP}}
        </div>
    </section>

    <!-- DRESS CODE (optional) -->
    {{#IF_DRESSCODE}}
    <section class="dresscode">
        <h2>Dress Code</h2>
        <p>{{DRESSCODE}}</p>
    </section>
    {{/IF_DRESSCODE}}

    <!-- RSVP FORM -->
    <section class="rsvp" id="rsvp">
        <h2>Потврда доласка</h2>
        <p>Молимо вас да потврдите долазак до {{RSVP_DEADLINE}}</p>
        
        <!-- RSVP COUNTER -->
        <div class="rsvp-counter" id="rsvp-counter">
            <div class="counter-item">
                <span class="counter-number" id="total-responses">—</span>
                <span class="counter-label">потврда</span>
            </div>
            <div class="counter-item attending">
                <span class="counter-number" id="total-attending">—</span>
                <span class="counter-label">долази</span>
            </div>
            <div class="counter-item">
                <span class="counter-number" id="total-guests">—</span>
                <span class="counter-label">гостију укупно</span>
            </div>
        </div>
        
        <form id="rsvp-form" class="rsvp-form">
            <input type="hidden" name="wedding_slug" value="{{SLUG}}">
            
            <div class="form-group">
                <label for="guest_name">Име и презиме *</label>
                <input type="text" id="guest_name" name="guest_name" required>
            </div>
            
            <div class="form-group">
                <label for="attending">Да ли долазите? *</label>
                <select id="attending" name="attending" required>
                    <option value="">— Изаберите —</option>
                    <option value="yes">Да, долазим</option>
                    <option value="no">Нажалост, не могу</option>
                </select>
            </div>
            
            {{#IF_PLUS_ONES}}
            <div class="form-group" id="guests-group">
                <label for="num_guests">Број гостију (укључујући вас)</label>
                <input type="number" id="num_guests" name="num_guests" min="1" max="10" value="1">
            </div>
            {{/IF_PLUS_ONES}}
            
            {{#IF_MEAL_CHOICES}}
            <div class="form-group" id="meal-group">
                <label for="meal">Избор јела</label>
                <select id="meal" name="meal">
                    <option value="">— Изаберите —</option>
                    {{MEAL_OPTIONS}}
                </select>
            </div>
            {{/IF_MEAL_CHOICES}}
            
            <div class="form-group">
                <label for="message">Порука за младенце (опционо)</label>
                <textarea id="message" name="message" rows="3"></textarea>
            </div>
            
            <button type="submit" class="submit-btn">Пошаљи потврду</button>
        </form>
        
        <div id="form-success" class="success-message" style="display:none;">
            <p>✓ Хвала на потврди! Видимо се на венчању! 🎉</p>
        </div>
    </section>

    <!-- FOOTER -->
    <footer>
        <p>{{BRIDE_NAME}} & {{GROOM_NAME}}</p>
        <p>{{DATE_FORMATTED}}</p>
    </footer>

    <script src="script.js"></script>
    
    <!-- RSVP Counter Script -->
    <script>
        // Fetch RSVP count on page load
        async function loadRsvpCount() {
            try {
                const response = await fetch('{{RSVP_COUNT_SCRIPT_URL}}?slug={{SLUG}}');
                const data = await response.json();
                
                document.getElementById('total-responses').textContent = data.totalResponses;
                document.getElementById('total-attending').textContent = data.totalAttending;
                document.getElementById('total-guests').textContent = data.totalGuests;
            } catch (err) {
                console.log('Could not load RSVP count');
            }
        }
        
        // Load on page ready
        loadRsvpCount();
        
        // Refresh count after successful RSVP submission
        // (called from form submit handler)
    </script>
</body>
</html>
```

---

## Theme Selector Page (preview/index.html)

```html
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Изаберите тему — {{BRIDE_NAME}} & {{GROOM_NAME}}</title>
    <style>
        /* Inline styles for selector page */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, sans-serif; background: #f5f5f5; padding: 2rem; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { text-align: center; margin-bottom: 0.5rem; }
        .subtitle { text-align: center; color: #666; margin-bottom: 1rem; }
        .timer { text-align: center; font-size: 1.5rem; color: #e74c3c; margin-bottom: 2rem; }
        .themes { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .theme-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: transform 0.2s; }
        .theme-card:hover { transform: translateY(-5px); }
        .theme-card img { width: 100%; height: 200px; object-fit: cover; }
        .theme-card h3 { padding: 1rem 1rem 0.5rem; }
        .theme-card p { padding: 0 1rem; color: #666; font-size: 0.9rem; }
        .theme-card .buttons { padding: 1rem; display: flex; gap: 0.5rem; }
        .theme-card a, .theme-card button { flex: 1; padding: 0.75rem; border-radius: 6px; text-align: center; text-decoration: none; font-weight: 500; cursor: pointer; }
        .preview-btn { background: #f0f0f0; color: #333; border: none; }
        .select-btn { background: #2ecc71; color: white; border: none; }
        .selected { text-align: center; padding: 3rem; }
        .selected h2 { color: #2ecc71; }
    </style>
</head>
<body>
    <div class="container">
        <h1>{{BRIDE_NAME}} & {{GROOM_NAME}}</h1>
        <p class="subtitle">Изаберите тему за вашу позивницу</p>
        <p class="timer">Преглед истиче за: <span id="expire-timer">24:00:00</span></p>
        
        <div class="themes" id="themes-grid">
            <!-- Classic -->
            <div class="theme-card">
                <img src="themes/classic/preview.jpg" alt="Класична тема">
                <h3>Класична</h3>
                <p>Елегантна и традиционална, са златним детаљима</p>
                <div class="buttons">
                    <a href="classic.html" class="preview-btn" target="_blank">Прегледај</a>
                    <button class="select-btn" onclick="selectTheme('classic')">Изабери</button>
                </div>
            </div>
            
            <!-- Modern -->
            <div class="theme-card">
                <img src="themes/modern/preview.jpg" alt="Модерна тема">
                <h3>Модерна</h3>
                <p>Чист и минималистички дизајн</p>
                <div class="buttons">
                    <a href="modern.html" class="preview-btn" target="_blank">Прегледај</a>
                    <button class="select-btn" onclick="selectTheme('modern')">Изабери</button>
                </div>
            </div>
            
            <!-- Romantic -->
            <div class="theme-card">
                <img src="themes/romantic/preview.jpg" alt="Романтична тема">
                <h3>Романтична</h3>
                <p>Нежне боје и флорални детаљи</p>
                <div class="buttons">
                    <a href="romantic.html" class="preview-btn" target="_blank">Прегледај</a>
                    <button class="select-btn" onclick="selectTheme('romantic')">Изабери</button>
                </div>
            </div>
            
            <!-- Minimal -->
            <div class="theme-card">
                <img src="themes/minimal/preview.jpg" alt="Минимална тема">
                <h3>Минимална</h3>
                <p>Једноставност и фокус на текст</p>
                <div class="buttons">
                    <a href="minimal.html" class="preview-btn" target="_blank">Прегледај</a>
                    <button class="select-btn" onclick="selectTheme('minimal')">Изабери</button>
                </div>
            </div>
            
            <!-- Rustic -->
            <div class="theme-card">
                <img src="themes/rustic/preview.jpg" alt="Рустична тема">
                <h3>Рустична</h3>
                <p>Природни материјали и топле боје</p>
                <div class="buttons">
                    <a href="rustic.html" class="preview-btn" target="_blank">Прегледај</a>
                    <button class="select-btn" onclick="selectTheme('rustic')">Изабери</button>
                </div>
            </div>
        </div>
        
        <div class="selected" id="selected-message" style="display:none;">
            <h2>✓ Тема је изабрана!</h2>
            <p>Ваша позивница ће бити готова ускоро.</p>
            <p>Добићете емаил са линком.</p>
        </div>
    </div>
    
    <script>
        // Expiry countdown
        const expiryTime = new Date('{{EXPIRY_TIMESTAMP}}').getTime();
        
        setInterval(() => {
            const now = Date.now();
            const diff = expiryTime - now;
            
            if (diff <= 0) {
                document.getElementById('expire-timer').textContent = 'ИСТЕКЛО';
                document.getElementById('themes-grid').innerHTML = '<p style="text-align:center;grid-column:1/-1;">Преглед је истекао. Контактирајте нас за нови линк.</p>';
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('expire-timer').textContent = 
                `${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
        }, 1000);
        
        // Theme selection
        async function selectTheme(theme) {
            if (!confirm(`Да ли сте сигурни да желите тему "${theme}"?`)) return;
            
            try {
                const response = await fetch('{{THEME_SELECTION_SCRIPT_URL}}', {
                    method: 'POST',
                    body: JSON.stringify({
                        slug: '{{SLUG}}',
                        theme: theme
                    })
                });
                
                if (response.ok) {
                    document.getElementById('themes-grid').style.display = 'none';
                    document.getElementById('selected-message').style.display = 'block';
                }
            } catch (err) {
                alert('Грешка. Покушајте поново.');
            }
        }
    </script>
</body>
</html>
```

---

## Google Sheets Structure

### Sheet 1: "Weddings" (Master List)
| slug | bride_name | groom_name | date | status | selected_theme | preview_created | theme_selected_at | published_at | ... |
|------|------------|------------|------|--------|----------------|-----------------|-------------------|--------------|-----|

### Sheet 2: "RSVP_{slug}" (One per wedding, auto-created)
| timestamp | guest_name | attending | num_guests | meal | message |
|-----------|------------|-----------|------------|------|---------|
| 2025-06-01 10:30 | Марко Марковић | yes | 2 | Месо | Честитамо! |
| 2025-06-01 11:45 | Јована Јовић | yes | 1 | Риба | Једва чекамо! |
| 2025-06-01 14:20 | Петар Петровић | no | 0 | | Жао нам је... |

**Calculated totals (from this example):**
- Total responses: 3
- Total attending: 2
- Total guests: 3 (2 + 1)

---

## Workflow Summary

```
1. CLIENT FILLS GOOGLE FORM
         ↓
2. GOOGLE APPS SCRIPT ADDS TO SHEET
         ↓
3. YOU RUN: node scripts/generate-preview.js marko-i-ana
         ↓
4. PREVIEW DEPLOYED TO: pozivnice.rs/preview/marko-i-ana/
         ↓
5. CLIENT GETS EMAIL WITH PREVIEW LINK
         ↓
6. CLIENT VIEWS ALL 5 THEMES, CLICKS "IZABERI"
         ↓
7. GOOGLE APPS SCRIPT RECORDS CHOICE
         ↓
8. YOU RUN: node scripts/generate-final.js marko-i-ana
         ↓
9. FINAL SITE DEPLOYED TO: pozivnice.rs/site/marko-i-ana/
         ↓
10. WEDDING GUESTS VISIT & RSVP
         ↓
11. RSVP DATA SAVED TO CLIENT'S GOOGLE SHEET
```

---

## Commands for Claude Code

```bash
# Initial setup
claude "Set up the project structure as defined in requirements. Initialize npm, create all folders and placeholder files."

# Create templates
claude "Create the base.html template with all sections. Include countdown timer JavaScript and RSVP form handling."

# Create themes
claude "Create CSS for all 5 themes: classic, modern, romantic, minimal, rustic. Each should be visually distinct."

# Create scripts
claude "Create generate-preview.js that reads wedding data and generates preview pages with all themes."

claude "Create generate-final.js that generates the final site with the selected theme."

claude "Create cleanup-expired.js that removes previews older than 24 hours."

# Create Google Apps Scripts
claude "Create the Google Apps Script files for form handling, theme selection, and RSVP processing."

# Test
claude "Generate a test wedding preview for couple 'Test' and 'User' with sample data."
```

---

## Environment Variables / Config

```javascript
// config.js
module.exports = {
  GOOGLE_SHEET_ID: 'your-sheet-id',
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/xxx/exec',
  THEME_SELECTION_URL: 'https://script.google.com/macros/s/yyy/exec',
  RSVP_SCRIPT_URL: 'https://script.google.com/macros/s/zzz/exec',
  RSVP_COUNT_SCRIPT_URL: 'https://script.google.com/macros/s/aaa/exec',
  DOMAIN: 'pozivnice.rs',
  PREVIEW_EXPIRY_HOURS: 24
};
```

---

## Notes for Claude Code

1. **Keep it simple** — No React, no build tools, just HTML/CSS/JS
2. **Serbian language** — All user-facing text in Serbian Cyrillic, with option for Latin
3. **Mobile-first** — All themes must be responsive
4. **Fast loading** — Minimize external dependencies, inline critical CSS
5. **Accessibility** — Proper labels, contrast, semantic HTML
6. **Progressive enhancement** — Site works without JavaScript (except countdown/form)
