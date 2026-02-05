# Потпуна Аутоматизација - Упутство за Подешавање

## Преглед система

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────────┐
│  Google Form    │ ───▶ │ Google Sheet │ ───▶ │ GitHub Actions  │
│  (пријава)      │      │ (база)       │      │ (генерисање)    │
└─────────────────┘      └──────────────┘      └─────────────────┘
                                                       │
                                                       ▼
                                               ┌─────────────────┐
                                               │  GitHub Pages   │
                                               │  (хостинг)      │
                                               └─────────────────┘
                                                       │
                                                       ▼
                                               ┌─────────────────┐
                                               │  Е-маил младенцима │
                                               └─────────────────┘
```

---

## Корак 1: GitHub подешавање

### 1.1 Креирај GitHub репозиторијум

1. Иди на [github.com/new](https://github.com/new)
2. Име: `invitations` (или како желиш)
3. Означи "Public" (потребно за GitHub Pages)
4. Кликни "Create repository"

### 1.2 Пусх кода на GitHub

```bash
cd /path/to/invitations
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/invitations.git
git push -u origin main
```

### 1.3 Укључи GitHub Pages

1. Иди на Settings > Pages
2. Source: "GitHub Actions"
3. Сачекај да се прва акција заврши

### 1.4 Креирај Personal Access Token

1. Иди на [github.com/settings/tokens](https://github.com/settings/tokens)
2. "Generate new token (classic)"
3. Име: "Wedding Invitations Automation"
4. Означи: `repo` (full control)
5. Кликни "Generate token"
6. **САЧУВАЈ ТОКЕН** - видећеш га само једном!

### 1.5 Подеси Email Secrets (за аутоматске е-маилове)

1. Иди на Settings > Secrets and variables > Actions
2. Додај ове секрете:
   - `EMAIL_USERNAME`: твој Gmail (нпр. `pozivnice.rs@gmail.com`)
   - `EMAIL_PASSWORD`: App Password (не обична лозинка!)

**За App Password:**
1. Иди на [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Изабери "Mail" и "Other (Custom name)"
3. Унеси име "GitHub Actions"
4. Копирај генерисану лозинку

---

## Корак 2: Google Form

### 2.1 Креирај форму

1. Иди на [forms.google.com](https://forms.google.com)
2. Нова форма
3. Наслов: **"Пријава за венчање - Позивнице"**

### 2.2 Додај поља (ТАЧНА ИМЕНА!)

```
Секција 1: Основни подаци
━━━━━━━━━━━━━━━━━━━━━━━━━
• Име младе * [Кратак одговор]
• Име младожење * [Кратак одговор]
• Датум венчања * [Датум]
• Е-маил за контакт * [Кратак одговор]
• Телефон за контакт [Кратак одговор]

Секција 2: Церемонија
━━━━━━━━━━━━━━━━━━━━━━━━━
• Место церемоније * [Кратак одговор]
• Адреса церемоније * [Кратак одговор]
• Време церемоније * [Кратак одговор] (нпр. 14:00)
• Google Maps линк за церемонију [Кратак одговор]

Секција 3: Прослава
━━━━━━━━━━━━━━━━━━━━━━━━━
• Место прославе * [Кратак одговор]
• Адреса прославе * [Кратак одговор]
• Време прославе * [Кратак одговор] (нпр. 17:00)
• Google Maps линк за прославу [Кратак одговор]

Секција 4: Додатне информације
━━━━━━━━━━━━━━━━━━━━━━━━━
• Ваша прича (како сте се упознали) [Пасус]
• Дрес код [Кратак одговор]
• Рок за потврду доласка (RSVP) [Датум]
• Хаштаг венчања [Кратак одговор] (нпр. #АнаИМарко2025)
• Додатне напомене [Пасус]
```

### 2.3 Повежи са Sheet-ом

1. У форми кликни на "Responses" таб
2. Кликни зелену иконицу Sheets
3. "Create a new spreadsheet"
4. Име: "Позивнице - База"

---

## Корак 3: Google Apps Script

### 3.1 Отвори Script Editor

1. У Google Sheet-у иди на Extensions > Apps Script
2. Обриши постојећи код

### 3.2 Додај скрипту

1. Копирај садржај фајла: `google-apps-script/intake-form-handler-automated.gs`
2. Налепи у Apps Script editor
3. Сачувај (Ctrl+S)

### 3.3 Подеси Script Properties

1. Кликни на ⚙️ Project Settings (лево)
2. Скролуј до "Script Properties"
3. Кликни "Add script property"
4. Додај:

| Property | Value |
|----------|-------|
| `GITHUB_TOKEN` | ghp_xxxxxxxxxxxx (твој токен) |
| `GITHUB_REPO` | username/invitations |
| `NOTIFY_EMAIL` | tvoj@email.com (опционо) |

### 3.4 Подеси Trigger

1. Кликни на ⏰ Triggers (лево)
2. "+ Add Trigger"
3. Подешавања:
   - Function: `onFormSubmit`
   - Event source: `From spreadsheet`
   - Event type: `On form submit`
4. Кликни "Save"
5. Дозволи приступ када те пита

---

## Корак 4: Theme Selection Handler

### 4.1 Додај нови фајл у Apps Script

1. У истом Apps Script пројекту
2. Кликни "+" поред Files
3. Име: `theme-selection`
4. Копирај садржај: `google-apps-script/theme-selection-handler-automated.gs`

### 4.2 Deploy као Web App

1. Кликни "Deploy" > "New deployment"
2. Type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone"
5. Кликни "Deploy"
6. Копирај URL (изгледа овако: `https://script.google.com/macros/s/ABC.../exec`)

### 4.3 Ажурирај config.js

```javascript
THEME_SELECTION_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
```

---

## Корак 5: RSVP Handler

### 5.1 Додај RSVP скрипту

1. У Apps Script, додај нови фајл: `rsvp`
2. Копирај садржај: `google-apps-script/rsvp-handler.gs`

### 5.2 Deploy као Web App

1. Deploy > New deployment
2. Исте поставке као горе
3. Копирај URL

### 5.3 Ажурирај config.js

```javascript
RSVP_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_RSVP_SCRIPT_ID/exec',
```

---

## Тестирање

### Тест 1: Форма → Preview

1. Попуни Google форму са тест подацима
2. Провери Google Sheet - треба да се појави нови ред
3. Провери GitHub Actions - треба да се покрене workflow
4. Сачекај ~2 минута
5. Провери `https://username.github.io/invitations/preview/ime-ime/`

### Тест 2: Theme Selection → Final Site

1. Отвори preview страницу
2. Изабери тему
3. Провери GitHub Actions - нови workflow
4. Сачекај ~2 минута
5. Финална страница на `https://username.github.io/invitations/site/ime-ime/`

---

## Проблеми и решења

### GitHub Action не ради

- Провери да ли је токен валидан
- Провери да ли има `repo` scope
- Провери Actions логове за грешке

### Email се не шаље

- Провери да ли је App Password исправан
- Провери да ли је 2FA укључен на Gmail-у
- Провери Secrets у GitHub-у

### Form trigger не ради

- Провери Triggers у Apps Script
- Провери Executions log за грешке
- Провери да ли су Script Properties подешени

---

## Цео ток (кад је све подешено)

```
1. Младенци попуне Google форму
         ↓ (аутоматски)
2. Подаци сачувани у Sheet
         ↓ (аутоматски)
3. GitHub Action генерише preview
         ↓ (аутоматски, ~2 мин)
4. Младенци добију е-маил са линком
         ↓
5. Младенци изаберу тему
         ↓ (аутоматски)
6. GitHub Action генерише финалну страницу
         ↓ (аутоматски, ~2 мин)
7. Младенци добију е-маил са финалним линком
         ↓
8. Гости попуњавају RSVP на страници
         ↓ (аутоматски)
9. RSVP подаци иду у посебан Google Spreadsheet за сваки пар
```

**Потпуно аутоматски! 🎉**
