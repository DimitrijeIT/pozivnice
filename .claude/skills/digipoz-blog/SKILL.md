---
name: digipoz-blog
description: Write GEO-optimized Serbian blog articles for DigiPoz wedding invitations website. Use when user says "write blog post", "new article", "blog saveti", "GEO article", "saveti article", or wants to add content to the /saveti/ section. Generates complete HTML article pages with JSON-LD structured data, FAQ schema, and proper internal linking.
---

# DigiPoz Blog Article Writer

Write GEO-optimized blog articles for the DigiPoz wedding invitations website (digipoz.rs/saveti/).

## What This Skill Does

Creates complete, self-contained HTML article pages that:
- Follow the GEO (Generative Engine Optimization) template for AI citation
- Match the DigiPoz website design exactly
- Include Article, FAQPage, and BreadcrumbList JSON-LD schemas
- Use proper OG and Twitter Card meta tags
- Link to related articles and the main site

## Content Language

- **Page title, meta tags, JSON-LD, nav, breadcrumb, footer, h1, category tag**: Serbian Cyrillic
- **Article body content (h2, h3, paragraphs, lists, blockquotes)**: Serbian Latin
- This matches how Serbian users search (Latin) while keeping the site structure consistent (Cyrillic)

## GEO Article Template

Every article MUST follow this structure (from blog_geo/blog_article_template.md). Do NOT skip sections:

```
# NASLOV (pitanje koje korisnik postavlja)

## Ukratko
(2-3 rečenice koje direktno odgovaraju na pitanje. Ovo je deo koji AI najčešće citira.)

## Kada / Zašto / Kome je važno
(Kratko objašnjenje konteksta.)

## Detaljno objašnjenje
(3-6 kratkih pasusa, bez marketinga, edukativno i neutralno.)

## Koraci (lista)
1. Korak
2. Korak
...

## Primer
(Realističan primer ili scenario.)

## Primer poruke / teksta (ako primenjivo)
> Kopiraj-paste blok teksta

## Najčešće greške
- Greška
- Greška

## Saveti iz prakse
- Praktičan savet
- Praktičan savet

## Česta pitanja
### Pitanje 1
Kratak odgovor (1-2 rečenice)

### Pitanje 2
Kratak odgovor
```

## Content Map

Articles are organized across 8 categories (see blog_geo/blog_article_template.md for the full content map of ~60 planned articles):

1. **Osnove venčanja** - Planning basics, guest lists, budgets
2. **Pozivnice** (primary authority) - Timing, digital vs printed, sending
3. **Tekstovi pozivnica** - Example texts, formal/informal
4. **Poruke gostima** - Reminders, thank you messages
5. **Etiketa** - Wedding etiquette
6. **Digitalno venčanje** - Digital tools, websites
7. **Problemi i realne situacije** - Common issues
8. **Checkliste i resursi** - Templates, checklists

## Existing Articles

These articles already exist in /saveti/. Use them for internal linking:

| Slug | Title (Cyrillic) | Category |
|------|-------------------|----------|
| kako-poceti-organizaciju | Како почети организацију свадбе | Основе |
| lista-gostiju | Како направити листу гостију за свадбу | Основе |
| kada-se-salju-pozivnice | Када се шаљу позивнице за свадбу | Позивнице |
| kako-poslati-digitalnu-pozivnicu | Како послати дигиталну позивницу за свадбу | Позивнице |
| rsvp | Како тражити потврду доласка (RSVP) | Позивнице |
| podsetnik | Како послати подсетник за свадбу гостима | Комуникација |

## HTML Article Template

Each article is a complete self-contained HTML file at `public/saveti/{slug}.html`.

### Design tokens (must match exactly):
```css
:root {
  --color-bg: #FDFBF7;
  --color-surface: #FFFFFF;
  --color-text: #2C2420;
  --color-text-secondary: #6B5E57;
  --color-text-muted: #9B8F88;
  --color-accent: #B8860B;
  --color-accent-light: #D4A843;
  --color-accent-bg: #F7F0E3;
  --color-border: #E8E0D6;
  --color-border-light: #F0EBE4;
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Source Sans 3', system-ui, sans-serif;
}
```

### Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Source+Sans+3:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### Required JSON-LD schemas (3 separate script tags):

1. **Article** schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{TITLE_CYRILLIC}",
  "description": "{DESCRIPTION_CYRILLIC}",
  "datePublished": "{YYYY-MM-DD}",
  "author": {"@type": "Organization", "name": "DigiPoz", "url": "https://digipoz.rs"},
  "publisher": {"@type": "Organization", "name": "DigiPoz", "url": "https://digipoz.rs", "logo": {"@type": "ImageObject", "url": "https://digipoz.rs/digipoz_logo.png"}},
  "mainEntityOfPage": {"@type": "WebPage", "@id": "https://digipoz.rs/saveti/{SLUG}.html"},
  "inLanguage": "sr"
}
```

2. **FAQPage** schema (from the "Česta pitanja" section, translated to Cyrillic):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "{Q_CYRILLIC}", "acceptedAnswer": {"@type": "Answer", "text": "{A_CYRILLIC}"}}
  ]
}
```

3. **BreadcrumbList**:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Почетна", "item": "https://digipoz.rs"},
    {"@type": "ListItem", "position": 2, "name": "Савети", "item": "https://digipoz.rs/saveti/"},
    {"@type": "ListItem", "position": 3, "name": "{BREADCRUMB_CYRILLIC}"}
  ]
}
```

### Required meta tags:
```html
<meta property="og:title" content="{TITLE} — DigiPoz савети">
<meta property="og:description" content="{DESCRIPTION}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://digipoz.rs/saveti/{SLUG}.html">
<meta property="og:image" content="https://digipoz.rs/digipoz_logo.png">
<meta property="og:locale" content="sr_RS">
<meta property="og:site_name" content="DigiPoz">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{TITLE} — DigiPoz савети">
<meta name="twitter:description" content="{DESCRIPTION}">
<meta name="twitter:image" content="https://digipoz.rs/digipoz_logo.png">
<link rel="canonical" href="https://digipoz.rs/saveti/{SLUG}.html">
<link rel="alternate" hreflang="sr" href="https://digipoz.rs/saveti/{SLUG}.html">
```

### Nav HTML (Cyrillic, paths relative to /saveti/):
```html
<nav class="nav" id="nav">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="../digipoz_logo.png" alt="DigiPoz"><span class="nav-logo-text">Digi<span>Poz</span></span></a>
    <button class="nav-mobile-toggle" id="nav-toggle" aria-label="Мени"><span></span><span></span><span></span></button>
    <ul class="nav-links" id="nav-links">
      <li><a href="../showcase.html">Дизајни</a></li>
      <li><a href="../cene.html">Цене</a></li>
      <li><a href="./" class="active">Савети</a></li>
      <li><a href="/#features">Могућности</a></li>
      <li><a href="/#faq">Питања</a></li>
      <li><a href="../form.html" class="nav-cta">Креирајте позивницу</a></li>
    </ul>
  </div>
</nav>
```

### Article body structure:
```html
<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="/">Почетна</a> <span>/</span> <a href="./">Савети</a> <span>/</span> <span>{Title}</span>
</nav>
<article class="article">
  <header class="article-header">
    <div class="article-category">{Category Cyrillic}</div>
    <h1>{Title Cyrillic}</h1>
    <div class="article-meta">DigiPoz тим · {month year Cyrillic}</div>
  </header>
  <div class="article-summary"><p>{Ukratko content Latin}</p></div>
  <div class="article-body">
    <!-- h2 sections, p, ul, ol, blockquote - all in Latin -->
  </div>
</article>
<nav class="related-articles" aria-label="Повезани чланци">
  <h2>Повезано</h2>
  <ul class="related-list">
    <li><a href="{slug}.html">{Title Cyrillic}</a></li>
  </ul>
</nav>
<div class="article-cta">
  <div class="article-cta-inner">
    <h2>Спремни за вашу позивницу?</h2>
    <p>Креирајте јединствену дигиталну позивницу за ваше венчање за само 5 минута.</p>
    <a href="../form.html" class="btn">Креирајте позивницу &rarr;</a>
  </div>
</div>
```

### Footer:
```html
<footer class="footer">
  <div class="footer-logo">Digi<span>Poz</span></div>
  <div class="footer-text">Дигиталне позивнице за венчање</div>
  <ul class="footer-links">
    <li><a href="../showcase.html">Сви дизајни</a></li>
    <li><a href="../cene.html">Цене</a></li>
    <li><a href="./">Савети</a></li>
    <li><a href="https://www.instagram.com/digipoz_/" target="_blank" rel="noopener">Instagram</a></li>
  </ul>
  <div class="footer-copy">&copy; 2026 DigiPoz. Сва права задржана.</div>
</footer>
```

## After Creating a New Article

1. **Update the listing page** (`public/saveti/index.html`): Add a new card to the grid and update the ItemList JSON-LD
2. **Update the sitemap** (`public/sitemap.xml`): Add the new article URL
3. **Update this skill**: Add the new article to the "Existing Articles" table above for internal linking

## Slug Convention

Slugs are derived from the Latin article title in kebab-case:
- "Kako početi organizaciju svadbe" → `kako-poceti-organizaciju`
- "Kada se šalju pozivnice za svadbu" → `kada-se-salju-pozivnice`
- Remove diacritics (č→c, š→s, ž→z, ć→c, đ→dj)

## Writing Guidelines

- **Tone**: Educational, neutral, practical. No marketing language in article body.
- **Length**: 800-1500 words per article
- **Structure**: Follow the GEO template exactly - AI models extract from structured content
- **"Ukratko" section**: This is the most important section. AI models cite these 2-3 sentences directly. Make them factual, specific, and self-contained.
- **Examples**: Always include realistic, relatable examples for Serbian couples
- **"Primer poruke"**: Include copy-paste message templates whenever applicable
- **FAQ**: Always include 2-4 frequently asked questions with concise answers
- **Internal links**: Link to 2-3 related existing articles in the "Povezano" section

## Reference

For the full content map with ~60 planned article topics, see: `blog_geo/blog_article_template.md`
