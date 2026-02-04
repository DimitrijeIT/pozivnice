# ManyChat - Kompletno uputstvo za podešavanje

*Automatizacija Instagram DM-ova, komentara i lead generisanja za DigiPoz*

---

## Sadržaj

1. [Pregled sistema](#pregled-sistema)
2. [Kreiranje ManyChat naloga](#kreiranje-manychat-naloga)
3. [Povezivanje sa Instagram nalogom](#povezivanje-sa-instagram-nalogom)
4. [Osnove ManyChat interfejsa](#osnove-manychat-interfejsa)
5. [Automatizacija komentara (Comment Automation)](#automatizacija-komentara)
6. [Automatizacija DM poruka (DM Automation)](#automatizacija-dm-poruka)
7. [Lead generisanje - Prikupljanje kontakata](#lead-generisanje)
8. [Prodajni tokovi (Sales Flows)](#prodajni-tokovi)
9. [Integracija sa Google Sheets](#integracija-sa-google-sheets)
10. [Keyword automatizacija](#keyword-automatizacija)
11. [Story Mentions & Replies](#story-mentions--replies)
12. [Growth Tools - Alati za rast](#growth-tools)
13. [Šabloni poruka za DigiPoz](#sabloni-poruka-za-digipoz)
14. [Analitika i praćenje](#analitika-i-pracenje)
15. [Česta pitanja i rešenja problema](#cesta-pitanja-i-resenja-problema)

---

## Pregled sistema

```
┌─────────────────────┐     ┌──────────────────┐     ┌────────────────────┐
│  Instagram post     │     │    ManyChat       │     │  Google Sheets     │
│  (komentar/DM)      │ ──▶ │  (automatizacija) │ ──▶ │  (baza kontakata)  │
└─────────────────────┘     └──────────────────┘     └────────────────────┘
                                    │
                                    ▼
                            ┌──────────────────┐
                            │  Automatski DM    │
                            │  sa linkom/info   │
                            └──────────────────┘
                                    │
                                    ▼
                            ┌──────────────────┐
                            │  digipoz.rs       │
                            │  (sajt/narudžba)  │
                            └──────────────────┘
```

### Šta ManyChat radi za DigiPoz?

| Funkcija | Opis | Korist |
|----------|------|--------|
| **Comment Automation** | Automatski DM kada neko komentariše post | Više leadova sa svakog posta |
| **DM Automation** | Automatski odgovori na poruke | Odgovor 24/7, bez čekanja |
| **Lead Collection** | Prikupljanje email/telefon kroz chat | Baza potencijalnih klijenata |
| **Sales Funnel** | Vođenje korisnika od interesovanja do kupovine | Više konverzija |
| **Keyword Triggers** | Automatski odgovori na ključne reči | Brzo pružanje informacija |
| **Google Sheets** | Automatsko slanje podataka u tabelu | Centralizovana baza |

### Zašto ManyChat za DigiPoz?

- **85% ljudi** koji pišu u DM očekuju odgovor u roku od sat vremena
- **Instagram algoritam** favorizuje profile koji brzo odgovaraju
- **Automatizacija komentara** može povećati engagement 3-5x
- **Lead capture** pretvara zainteresovane u kontakte koje možeš pratiti

---

## Kreiranje ManyChat naloga

### Korak 1: Registracija

1. Otvori [manychat.com](https://manychat.com)
2. Klikni **"Get Started Free"**
3. Izaberi **"Sign up with Facebook"** (obavezno — ManyChat zahteva Facebook nalog)
4. Dozvoli pristup kada te pita Facebook

### Korak 2: Izbor kanala

1. Na pitanje "Which channel do you want to connect?" izaberi **Instagram**
2. Ako te pita za Facebook Messenger, možeš i to uključiti (opciono)
3. WhatsApp možeš dodati kasnije (zahteva Meta Business verifikaciju)

### Korak 3: Izbor plana

| Plan | Cena | Preporuka |
|------|------|-----------|
| **Free** | $0/mesec | Za početak i testiranje (do 1.000 kontakata) |
| **Pro** | $15/mesec | Kada kreneš sa ozbiljnim kampanjama |

**Preporuka:** Počni sa besplatnim planom. Nadogradi na Pro kada:
- Imaš više od 1.000 kontakata
- Trebaš napredne funkcije (A/B testiranje, custom fields)
- Želiš ukloniti ManyChat branding

### Korak 4: Osnovna podešavanja

1. **Time Zone:** Izaberi `(UTC+01:00) Belgrade`
2. **Default Reply Language:** Serbian (ako nema, ostavi English)
3. **Business Name:** `DigiPoz`
4. **Business Category:** `E-Commerce` ili `Services`

---

## Povezivanje sa Instagram nalogom

### Preduslovi

Pre nego što povežeš ManyChat sa Instagramom, proveri:

- [ ] Instagram nalog `@digipoz_` je **Business** ili **Creator** nalog
- [ ] Instagram nalog je **povezan sa Facebook stranicom**
- [ ] Imaš **admin pristup** Facebook stranici
- [ ] Instagram nalog ima **najmanje 1.000 pratilaca** (ovo je META zahtev za DM API — bez toga komentari rade ali DM automatizacija ne)

> **Napomena:** Ako imaš manje od 1.000 pratilaca, ManyChat i dalje radi za Comment Automation, ali DM Automation neće raditi dok ne dostigneš 1.000. Fokusiraj se prvo na rast pratilaca.

### Korak 1: Povezivanje

1. U ManyChat dashboardu idi na **Settings** (levi meni, ikonica zupčanika)
2. Klikni na **Instagram**
3. Klikni **"Connect Instagram Account"**
4. Uloguj se u Facebook (ako nisi)
5. Izaberi Facebook stranicu koja je povezana sa `@digipoz_`
6. Izaberi Instagram nalog `@digipoz_`
7. Dozvoli sve tražene dozvole:
   - Upravljanje porukama
   - Upravljanje komentarima
   - Pristup profilu
8. Klikni **"Done"**

### Korak 2: Verifikacija

1. Vrati se u ManyChat
2. Trebalo bi da vidiš zelenu kvačicu pored Instagram naziva
3. Testiraj: pošalji sebi DM sa drugog naloga i proveri da li ManyChat registruje poruku

### Rešavanje problema sa povezivanjem

| Problem | Rešenje |
|---------|---------|
| Ne vidim Instagram nalog | Proveri da li je Business/Creator nalog |
| Greška pri povezivanju | Disconnectuj i ponovo poveži Facebook stranicu |
| Nema dozvola | Idi na Facebook > Settings > Business Integrations > ManyChat > daj sve dozvole |
| DM ne radi | Proveri da li imaš 1.000+ pratilaca |

---

## Osnove ManyChat interfejsa

### Glavni delovi dashboarda

```
┌─────────────────────────────────────────────┐
│  ManyChat Dashboard                         │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Home     │  [Glavni radni prostor]          │
│ Contacts │                                  │
│ Automati.│  Ovde praviš flowove,            │
│ Flows    │  vidiš kontakte,                 │
│ Broadcast│  pratiš analitiku                │
│ Settings │                                  │
│ Analytics│                                  │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### Ključni pojmovi

| Pojam | Objašnjenje |
|-------|-------------|
| **Flow** | Tok konverzacije — niz poruka i akcija |
| **Trigger** | Okidač koji pokreće flow (komentar, ključna reč, DM) |
| **Action** | Nešto što ManyChat uradi (pošalje poruku, sačuva podatak) |
| **Condition** | Uslov koji određuje šta se dešava sledeće |
| **Custom Field** | Polje za čuvanje podataka o korisniku (ime, email, telefon) |
| **Tag** | Oznaka za kategorizaciju kontakata |
| **Keyword** | Ključna reč koja pokreće automatski odgovor |
| **Growth Tool** | Alat za privlačenje novih kontakata u ManyChat |

---

## Automatizacija komentara

Ovo je najmoćnija funkcija za DigiPoz. Kada neko komentariše tvoj post, ManyChat automatski šalje DM.

### Kako funkcioniše

```
Korisnik komentariše "INFO" na post
         ↓
ManyChat automatski lajkuje komentar
         ↓
ManyChat šalje DM korisniku sa informacijama
         ↓
Korisnik u DM-u dobija meni sa opcijama
         ↓
Korisnik bira opciju → dobija link/info
```

### Kreiranje Comment Automation

#### Korak 1: Napravi novi flow

1. Idi na **Automation** u levom meniju
2. Klikni **"+ New Automation"**
3. Izaberi **"Start from Scratch"**
4. Imenuj flow: `Komentari - Dizajni Info`

#### Korak 2: Podesi trigger

1. Klikni **"Choose a Trigger"**
2. Izaberi **"Instagram Comment"**
3. Podešavanja triggera:

```
Trigger: Instagram Comment

Post Selection:
  ○ All Posts (svi postovi)
  ● Specific Post (izaberi post)    ← preporučeno za početak

Comment must contain (komentar mora da sadrži):
  [x] Specific keywords
  Ključne reči: INFO, CENA, DIZAJN, LINK, POZIVNICA, DETALJI

Additional Settings:
  [x] Like the comment (lajkuj komentar)
  [x] Reply to comment (odgovori na komentar — opciono)
  Comment reply: "Pogledaj DM! 💌"
```

> **Važno:** Uvek uključi "Like the comment" — ovo povećava engagement.

#### Korak 3: Napravi DM flow

Posle triggera, dodaj poruke koje korisnik dobija u DM:

**Prva poruka (odmah):**
```
Zdravo! 👋

Hvala što te interesuju naše digitalne pozivnice za venčanje!

Imamo 19 potpuno različitih dizajna — od filmske premijere do ljubavnog pisma. ✨

Šta te zanima?
```

**Dodaj Quick Reply dugmad:**

| Dugme | Tekst |
|-------|-------|
| 1 | Pogledaj dizajne |
| 2 | Koliko košta? |
| 3 | Kako funkcioniše? |
| 4 | Želim da naručim |

#### Korak 4: Napravi odgovore za svako dugme

**Dugme "Pogledaj dizajne":**
```
Imamo 19 jedinstvenih stilova! Evo nekih najpopularnijih:

🎬 Cinema — kao filmska premijera
📖 Storybook — vaša ljubavna priča
🌍 Passport — za parove koji vole putovanja
📰 Gazette — novinarski stil
💌 Love Letter — romantično pismo
🎵 Concert — festivalski poster

👉 Pogledaj sve dizajne: https://digipoz.rs/showcase.html

Koji ti se najviše dopada?
```

**Dugme "Koliko košta?":**
```
Evo naših paketa:

🆓 BESPLATNO — probaj 1 dizajn (sa watermarkom)

⭐ STARTER — 39€
  • 3 layouta, 5 tema
  • RSVP sistem
  • 6 meseci hosting

💎 STANDARD — 59€ (najpopularniji!)
  • Svih 19 layouta
  • Sve teme
  • RSVP + Google Maps
  • 12 meseci hosting

👑 PREMIUM — 89€
  • Sve iz Standard paketa
  • Custom domen (vašeime.rs)
  • Neograničen hosting

Trenutno imamo akciju za prvih 50 parova! 🎉
Želiš više detalja?
```

**Dugme "Kako funkcioniše?":**
```
Super jednostavno! Evo kako:

1️⃣ Popuniš kratak formular sa detaljima venčanja
2️⃣ Mi generišemo preview sa više tema (u roku od 24h)
3️⃣ Ti izabereš omiljenu temu
4️⃣ Dobiješ finalni link za deljenje sa gostima

Tvoja pozivnica uključuje:
✅ Automatski RSVP sistem
✅ Google Maps za lokaciju
✅ Countdown do venčanja
✅ Galerija fotografija
✅ Optimizovano za mobilni

👉 Pogledaj primer: https://digipoz.rs/showcase.html

Želiš da započneš?
```

**Dugme "Želim da naručim":**
```
Odlično! 🎉

Da bih te povezao sa nama, treba mi par informacija:

Kako se zoveš?
```
*(Ovde započinje Lead Collection flow — vidi sekciju ispod)*

### Kreiranje Comment Automation za specifične kampanje

#### Kampanja: "Koji stil ste vi?" — Quiz post

**Trigger:** Komentar na quiz postu sa brojem (1-6)

**Post caption primer:**
```
Koji stil vas opisuje? Napišite broj u komentarima!

1️⃣ Glamurozni — filmska premijera (Cinema)
2️⃣ Romantični — ljubavno pismo (Letter)
3️⃣ Avanturisti — pasoš za ljubav (Passport)
4️⃣ Kreativni — magazine cover (Magazine)
5️⃣ Retro — vintage telegram (Telegram)
6️⃣ Bajkoviti — storybook (Storybook)
```

**DM odgovor za svaki broj:**

Komentar "1" → šalje Cinema preview i link
Komentar "2" → šalje Letter preview i link
...i tako dalje.

#### Kampanja: "LINK" — Univerzalni trigger

Za svaki post gde u caption staviš "Napiši LINK u komentar za više info":

```
Trigger: Ključna reč "LINK"

DM:
Evo linka koji si tražio/la! 👇

🔗 https://digipoz.rs

Imaš neko pitanje? Slobodno pitaj, tu sam! 😊
```

---

## Automatizacija DM poruka

### Default Welcome Message

Kada neko prvi put pošalje DM `@digipoz_` nalogu:

1. Idi na **Automation** > **"+ New Automation"**
2. Trigger: **"Instagram Direct Message"**
3. Condition: **"Is First Interaction" = Yes**

**Poruka:**
```
Zdravo i dobro došli u DigiPoz! 💌

Mi pravimo digitalne pozivnice za venčanje koje vaši gosti nikada nisu videli.

Kako vam mogu pomoći?
```

**Quick Reply dugmad:**
- Pogledaj dizajne
- Cene i paketi
- Imam pitanje
- Želim da naručim

### Automatski odgovori za česta pitanja

Napravi flows za najčešća pitanja:

| Ključna reč | Automatski odgovor |
|-------------|-------------------|
| `cena`, `koliko`, `košta`, `cene` | Cenovnik sa paketima |
| `dizajn`, `primer`, `showcase` | Link na showcase stranicu |
| `rsvp`, `potvrda` | Objašnjenje RSVP sistema |
| `koliko traje`, `rok`, `hosting` | Info o hosting trajanju |
| `kako`, `proces`, `naručim` | Korak po korak objašnjenje |

---

## Lead generisanje

### Kreiranje Custom Fields

Pre nego što počneš sa prikupljanjem podataka, napravi polja:

1. Idi na **Settings** > **Custom Fields**
2. Klikni **"+ New Custom Field"**
3. Napravi sledeća polja:

| Ime polja | Tip | Opis |
|-----------|-----|------|
| `ime_mlade` | Text | Ime mlade |
| `ime_mladozenje` | Text | Ime mladoženje |
| `datum_vencanja` | Text | Datum venčanja |
| `email` | Email | Email adresa |
| `telefon` | Phone | Broj telefona |
| `izabrani_stil` | Text | Koji dizajn ih zanima |
| `budzet` | Text | Budget (paket) |
| `status_lead` | Text | Status leada (novi/u kontaktu/konvertovan) |

### Lead Collection Flow

Ovo je flow koji prikuplja podatke od zainteresovanih korisnika:

```
"Želim da naručim" (dugme)
         ↓
"Kako se zoveš?"
         ↓ (sačuvaj u Custom Field: Full Name)
"A kako se zove tvoj/a izabranik/ca?"
         ↓ (sačuvaj u Custom Field: ime_mladozenje)
"Kada je veliko veselje? 🎉 (datum venčanja)"
         ↓ (sačuvaj u Custom Field: datum_vencanja)
"Koji dizajn ti se najviše dopada?
  1. Cinema 🎬
  2. Passport 🌍
  3. Storybook 📖
  4. Magazine 📰
  5. Drugi / još ne znam"
         ↓ (sačuvaj u Custom Field: izabrani_stil)
"Super! Još samo email da ti pošaljemo detalje:"
         ↓ (sačuvaj u Custom Field: email)
"Hvala! 🎉

Evo šta sledi:
1. Naš tim će ti se javiti u roku od 24h
2. Dobićeš preview pozivnice sa više tema
3. Izabereš omiljenu i gotovo!

U međuvremenu, pogledaj dizajne:
https://digipoz.rs/showcase.html

Hvala što si izabrala DigiPoz! 💌"
         ↓
Action: Dodaj tag "lead-instagram"
Action: Postavi status_lead = "novi"
Action: Pošalji podatke u Google Sheets
```

### Kako napraviti ovaj flow u ManyChat

#### Korak 1: Napravi flow

1. **Automation** > **"+ New Automation"** > **"Start from Scratch"**
2. Imenuj: `Lead Collection - Narudžbina`

#### Korak 2: Dodaj poruke sa input kolekcijom

Za svako pitanje:

1. Dodaj **"Send Message"** blok
2. Upiši pitanje
3. Ispod dodaj **"User Input"** blok
4. Izaberi tip inputa (Text, Email, Phone)
5. U "Save response to" izaberi odgovarajući Custom Field
6. Opciono dodaj validaciju (npr. email format)

#### Korak 3: Dodaj akcije na kraju

1. Dodaj **"Action"** blok
2. Izaberi **"Add Tag"** → upiši `lead-instagram`
3. Dodaj još jedan **"Action"** blok
4. Izaberi **"Set Custom Field"** → `status_lead` = `novi`

#### Korak 4: Poveži sa Google Sheets (vidi sekciju ispod)

---

## Prodajni tokovi

### Flow 1: Novi posetilac → Lead → Kupac

```
Trigger: Prvi DM ili komentar
         ↓
Welcome poruka sa opcijama
         ↓
[Korisnik bira opciju]
         ↓
┌─────────────────┬──────────────────┬─────────────────┐
│ Pogledaj dizajn │  Cene i paketi   │ Želim naručiti  │
└────────┬────────┴────────┬─────────┴────────┬────────┘
         ↓                 ↓                   ↓
   Showcase link      Cenovnik DM        Lead Collection
         ↓                 ↓                   ↓
   "Koji ti se       "Koji paket       Prikupi podatke
    dopada?"          te zanima?"            ↓
         ↓                 ↓           Prosledi timu
   Lead Collection    Lead Collection
```

### Flow 2: Follow-up za leadove (Pro plan)

Ovo zahteva ManyChat Pro ($15/mesec):

```
Dan 0: Lead prikupljen
         ↓ (posle 24h)
Dan 1: "Zdravo [Ime]! Da li si pogledao/la dizajne?
        Evo linka: [showcase link]"
         ↓ (posle 3 dana)
Dan 4: "Uskoro ističe akcija za prvih 50 parova!
        Još uvek te čeka popust. 🎉"
         ↓ (posle 7 dana)
Dan 7: "Zdravo [Ime], samo da proverim —
        ako imaš neko pitanje, slobodno pitaj!
        Tu smo da pomognemo. 💌"
```

**Kako napraviti:**

1. U flow-u dodaj **"Smart Delay"** blok
2. Postavi **"Wait for 24 hours"**
3. Dodaj poruku
4. Dodaj još jedan Smart Delay za 3 dana
5. Nastavi niz

> **Važno:** Instagram ima ograničenje — možeš slati poruke korisniku samo **24 sata** od poslednje interakcije. Posle toga, korisnik mora sam da pokrene konverzaciju. Zato koristimo komentar automatizaciju da "ponovo pokrenemo" 24h prozor.

### Flow 3: Upsell — posle kupovine

```
Tag: kupac
         ↓
"Tvoja pozivnica je gotova! 🎉

 Da li znaš da možeš da nadogradiš na Premium paket?

 ✅ Custom domen (markoiana.rs)
 ✅ Neograničen hosting
 ✅ Prioritetna podrška

 Samo 30€ razlike! Zanima te?"
```

---

## Integracija sa Google Sheets

### Zašto Google Sheets?

- Centralizovana baza svih leadova
- Lako deljenje sa timom
- Može se povezati sa postojećim DigiPoz sistemom (Google Forms → Sheets)
- Besplatno

### Korak 1: Poveži Google nalog

1. Idi na **Settings** > **Integrations**
2. Pronađi **Google Sheets**
3. Klikni **"Connect"**
4. Uloguj se u Google nalog koji koristiš za DigiPoz
5. Dozvoli pristup

### Korak 2: Napravi Google Sheet za leadove

Napravi novi Sheet: **"DigiPoz - Instagram Leadovi"**

Kolone:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Datum | Ime | Partner | Datum venčanja | Email | Telefon | Stil | Paket | Status |

### Korak 3: Dodaj Google Sheets akciju u flow

1. U Lead Collection flow-u, posle poslednje poruke
2. Dodaj **"Action"** blok
3. Izaberi **"Google Sheets"** > **"Insert Row"**
4. Izaberi spreadsheet: `DigiPoz - Instagram Leadovi`
5. Izaberi sheet: `Sheet1`
6. Mapiraj polja:

| Kolona u Sheets | ManyChat polje |
|-----------------|----------------|
| Datum | `{{current_date}}` |
| Ime | `{{full_name}}` |
| Partner | `{{custom.ime_mladozenje}}` |
| Datum venčanja | `{{custom.datum_vencanja}}` |
| Email | `{{custom.email}}` |
| Telefon | `{{custom.telefon}}` |
| Stil | `{{custom.izabrani_stil}}` |
| Paket | `{{custom.budzet}}` |
| Status | `novi` |

### Korak 4: Testiraj

1. Pošalji DM sa test naloga
2. Prođi kroz ceo lead collection flow
3. Proveri da li se red pojavio u Google Sheets

---

## Keyword automatizacija

### Podešavanje ključnih reči

1. Idi na **Automation** > **Keywords**
2. Za svaku ključnu reč napravi trigger:

### Lista ključnih reči za DigiPoz

| Ključna reč | Tip | Odgovor |
|-------------|-----|---------|
| `cena` | Contains | Cenovnik sa paketima |
| `cene` | Contains | Cenovnik sa paketima |
| `koliko` | Contains | Cenovnik sa paketima |
| `košta` | Contains | Cenovnik sa paketima |
| `dizajn` | Contains | Link na showcase |
| `primer` | Contains | Link na showcase |
| `stil` | Contains | Link na showcase |
| `naruči` | Contains | Lead collection flow |
| `narudžbina` | Contains | Lead collection flow |
| `hoću` | Contains | Lead collection flow |
| `želim` | Contains | Lead collection flow |
| `rsvp` | Contains | Objašnjenje RSVP-a |
| `kako` | Contains | Objašnjenje procesa |
| `info` | Contains | Opšte informacije |
| `pomoc` | Contains | Poruka sa svim opcijama |
| `pomoć` | Contains | Poruka sa svim opcijama |
| `zdravo` | Is | Welcome poruka |
| `ćao` | Is | Welcome poruka |

### Napomena o keyword tipovima

- **Is** — tačno poklapa (korisnik napiše samo tu reč)
- **Contains** — sadrži reč bilo gde u poruci
- **Begins with** — poruka počinje tom reči

> **Preporuka:** Koristi "Contains" za većinu reči, a "Is" samo za pozdrave.

---

## Story Mentions & Replies

### Automatski odgovor kada neko pomene @digipoz_ u svojoj priči

1. **Automation** > **"+ New Automation"**
2. Trigger: **"Instagram Story Mention"**

**Poruka:**
```
Hvala što si nas pomenuo/la u priči! 🥰

To nam mnogo znači! Ako ti se dopadaju naši dizajni,
rado ćemo ti napraviti pozivnicu sa posebnim popustom
od 10%!

Piši nam kad budeš spreman/na! 💌
```

**Akcija:** Dodaj tag `story-mention`

### Automatski odgovor na Story Reply

1. **Automation** > **"+ New Automation"**
2. Trigger: **"Instagram Story Reply"**

**Poruka:**
```
Hvala na poruci! 😊

Javi mi šta te zanima i rado ću pomoći:

• Dizajni — pogledaj sve na digipoz.rs
• Cene — od 39€
• Narudžbina — kreće za 5 minuta!

Šta te interesuje?
```

---

## Growth Tools

Growth Tools su načini da privu$eš nove kontakte u ManyChat izvan standardnih komentara i DM-ova.

### 1. Instagram Post CTA šablon

U svaki post dodaj poziv na akciju:

```
💌 Želiš ovakvu pozivnicu? Napiši DIZAJN u komentar
i posaćemo ti sve detalje u DM!
```

ili:

```
👇 Napiši CENA u komentarima za cenovnik u DM-u!
```

### 2. Reel CTA

Na kraju svakog reela dodaj tekst ili voiceover:

```
"Napiši INFO u komentar i poslaćemo ti link u DM!"
```

### 3. Story sa pozivom na DM

Koristi "Pitaj me nešto" sticker sa tekstom:
```
"Pošalji mi 💌 za info o digitalnim pozivnicama"
```

### 4. Bio link

U bio dodaj:
```
👇 Pošalji nam poruku za besplatan preview!
```

### 5. Instagram Live

Tokom lajva podsećaj:
```
"Pošaljite mi DM sa rečju POZIVNICA za posebnu ponudu!"
```

---

## Šabloni poruka za DigiPoz

### Šablon 1: Dobrodošlica

```
Zdravo i dobro došli u DigiPoz! 💌

Mi pravimo digitalne pozivnice za venčanje sa 19
jedinstvenih dizajna koje vaši gosti nikada nisu videli.

🎬 Cinema — filmska premijera
📖 Storybook — vaša priča
🌍 Passport — za avanturiste
📰 Gazette — novinarski stil

Kako vam mogu pomoći?
```

### Šablon 2: Cenovnik

```
Evo naših paketa:

🆓 BESPLATNO
  Probaj 1 dizajn sa watermarkom

⭐ STARTER — 39€
  3 layouta • 5 tema • RSVP • 6 meseci

💎 STANDARD — 59€ ⬅️ Najpopularniji!
  Svi layouti • Sve teme • RSVP + mapa • 12 meseci

👑 PREMIUM — 89€
  Sve iz Standard + custom domen + zauvek online

Trenutna akcija: prvih 50 parova dobija 50% popusta! 🎉

Koji paket te zanima?
```

### Šablon 3: Kako funkcioniše

```
Evo kako do tvoje pozivnice:

1️⃣ Popuniš kratak formular (5 min)
2️⃣ Dobiješ preview sa više tema (24h)
3️⃣ Izabereš omiljenu temu
4️⃣ Dobiješ link za goste — gotovo! 🎉

Svaka pozivnica uključuje:
✅ RSVP — gosti potvrde dolazak
✅ Google Maps — lokacija restorana
✅ Countdown — odbrojavanje do venčanja
✅ Galerija — vaše fotografije
✅ Mobilni prikaz — 85% gostiju gleda na telefonu

Spreman/na da počneš?
```

### Šablon 4: Posle prikupljanja leada

```
Odlično, [Ime]! 🎉

Hvala na interesovanju! Evo šta sledi:

1. Naš tim pregleda tvoje podatke
2. U roku od 24h dobiješ preview pozivnice
3. Izabereš dizajn koji ti se najviše dopada
4. Finalna pozivnica je tvoja!

Imaš pitanje u međuvremenu? Samo piši!

Pozdrav od DigiPoz tima! 💌
```

### Šablon 5: Akcija / Promocija

```
🚨 Posebna ponuda za tebe!

Prvih 50 parova koji naruče pozivnicu
ovog meseca dobijaju 50% POPUSTA!

Umesto 59€ → samo 29.50€ za STANDARD paket!
Uključuje SVE: 19 dizajna, RSVP, mapu, 12 meseci.

⏰ Preostalo: [X] mesta

Želiš da iskoristiš ponudu?
```

### Šablon 6: Odgovor na "skupo je"

```
Razumem! 😊 Evo malog poređenja:

📄 Štampane pozivnice za 150 gostiju:
  Dizajn: ~50€
  Štampa: ~150€
  Koverte: ~30€
  Poštarina: ~100€
  UKUPNO: ~330€

📱 DigiPoz digitalna pozivnica:
  Standard paket: 59€
  + RSVP sistem uključen
  + Google Maps uključen
  + Menjanje detalja besplatno
  UKUPNO: 59€

Ušteda: 270€! Plus, nema stresa sa štampanjem. 😉

Želiš da vidiš preview besplatno?
```

---

## Analitika i praćenje

### ManyChat analitika

U **Analytics** sekciji pratiš:

| Metrika | Šta znači | Cilj |
|---------|-----------|------|
| **Total Contacts** | Ukupan broj kontakata | Rast mesec za mesec |
| **New Contacts** | Novi kontakti ovog perioda | 50+/mesec |
| **Message Open Rate** | % kontakata koji otvore DM | 80%+ |
| **Click Rate** | % koji klikne na link | 20%+ |
| **Flow Completion** | % koji završi ceo flow | 60%+ |

### Tagovi za praćenje

Koristi tagove da kategorizuješ kontakte:

| Tag | Značenje |
|-----|----------|
| `lead-instagram` | Došao sa Instagrama |
| `lead-komentar` | Trigger bio komentar |
| `lead-dm` | Trigger bio direktna poruka |
| `story-mention` | Pomenuo nas u priči |
| `zainteresovan-starter` | Zanima ga Starter paket |
| `zainteresovan-standard` | Zanima ga Standard paket |
| `zainteresovan-premium` | Zanima ga Premium paket |
| `kupac` | Kupio pozivnicu |
| `follow-up-potreban` | Treba ga kontaktirati |

### Mesečni izveštaj — šta pratiti

```
Mesečni izveštaj - DigiPoz ManyChat
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Novi kontakti:          ___
Lead-ovi prikupljeni:   ___
Konverzije (kupovine):  ___
Conversion rate:        ___%
Najuspešniji flow:      ___
Najpopularniji dizajn:  ___
Najčešće pitanje:       ___
```

---

## Česta pitanja i rešenja problema

### ManyChat ne šalje DM-ove

**Mogući razlozi:**
1. Instagram nalog ima manje od 1.000 pratilaca
2. ManyChat dozvole su istekle — ponovo poveži nalog
3. Instagram je privremeno ograničio nalog (previše poruka)
4. Flow nije aktiviran (proveri da li je "Active" uključen)

**Rešenje:**
- Settings > Instagram > Disconnect > Reconnect
- Proveri pratioce (mora 1.000+)
- Smanji frekvencu slanja na 30-50 poruka/sat

### Instagram blokira poruke

**Razlog:** Instagram ima limete za automatske poruke

**Limiti:**
| Tip | Limit |
|-----|-------|
| DM poruke/sat | ~50 |
| DM poruke/dan | ~200 |
| Komentari/sat | ~30 |

**Kako izbeći blokadu:**
- Ne šalji previše poruka odjednom
- Nemoj koristiti iste poruke za sve (variraj tekst)
- Dodaj pauze između poruka (1-3 sekunde)
- Ne komentariši automatski na svaki komentar — samo lajkuj

### Korisnik ne dobija DM posle komentara

**Mogući razlozi:**
1. Korisnik ima zatvorene DM-ove (privatni nalog)
2. Korisnik je blokirao nalog
3. Keyword ne odgovara — proveri pravopis i velika/mala slova
4. Flow nije aktivan

**Rešenje:**
- Proveri da li je keyword podešen na "Contains" (ne "Is")
- Testiraj sa sopstvenim nalogom
- Proveri ManyChat logove za greške

### Kako pratiti ROI?

```
Prihod od ManyChat kontakata
÷ (ManyChat cena + vreme za podešavanje)
= ROI

Primer:
10 konverzija × 59€ = 590€ prihoda
ManyChat Pro: 15€/mesec
ROI = 590€ / 15€ = 39x povraćaj investicije
```

---

## Preporuke za lansiranje

### Faza 1: Osnovno podešavanje (prva nedelja)

- [ ] Kreirati ManyChat nalog
- [ ] Povezati sa @digipoz_ Instagram nalogom
- [ ] Napraviti Custom Fields za leadove
- [ ] Napraviti Welcome DM flow
- [ ] Napraviti Comment Automation za ključnu reč "INFO"
- [ ] Napraviti Keyword automatizaciju za "cena" i "dizajn"
- [ ] Povezati Google Sheets
- [ ] Testirati sve flowove

### Faza 2: Napredne automatizacije (druga nedelja)

- [ ] Napraviti Lead Collection flow
- [ ] Napraviti flow za svaki dizajn posebno
- [ ] Dodati Story Mention automatizaciju
- [ ] Dodati "Koji stil ste vi?" quiz flow
- [ ] Napraviti flow za upsell (posle kupovine)

### Faza 3: Optimizacija (treća nedelja i dalje)

- [ ] Analizirati koji flowovi imaju najbolju konverziju
- [ ] A/B testirati poruke (Pro plan)
- [ ] Dodati follow-up sequence za leadove
- [ ] Optimizovati ključne reči na osnovu čestih pitanja
- [ ] Pratiti mesečne metrike

### Faza 4: Skaliranje

- [ ] Dodati WhatsApp kanal (zahteva Meta Business verifikaciju)
- [ ] Napraviti segmentirane kampanje po tipu dizajna
- [ ] Integrisati sa email marketingom
- [ ] Koristiti ManyChat za retargeting kampanje

---

## Napredni saveti

### 1. Koristi Conditions za pametnije flowove

```
Ako korisnik ima tag "kupac" →
  Nemoj slati prodajne poruke
  Umesto toga, pitaj za recenziju

Ako korisnik ima tag "zainteresovan-premium" →
  Ponudi Premium preview
  Naglasi custom domen benefit
```

### 2. Personalizuj poruke

Koristi `{{first_name}}` u porukama:
```
"Zdravo {{first_name}}!
 Videli smo da te zanima Cinema dizajn.
 Evo ekskluzivnog primerka..."
```

### 3. Koristi "Ice Breakers"

Instagram dozvoljava do 4 "Ice Breaker" poruke — to su predefinisani odgovori koje korisnik vidi kada otvori DM:

1. "Pogledaj dizajne"
2. "Koliko košta?"
3. "Kako naručiti?"
4. "Imam pitanje"

Podesi u: Settings > Instagram > Ice Breakers

### 4. Kombinuj sa Instagram Ads

Kada kreiraš Instagram reklamu, izaberi cilj "Messages" i poveži sa ManyChat flow-om. Svako ko klikne na reklamu automatski ulazi u prodajni tok.

### 5. Sezonska automatizacija

Prilagodi poruke sezoni venčanja:
- **Januar-Mart:** "Rano je, ali nije prerano za pozivnicu!"
- **April-Jun:** "Sezona venčanja je tu — poslednja mesta za juni!"
- **Jul-Septembar:** "Jesenja venčanja zaslužuju posebne pozivnice"
- **Oktobar-Decembar:** "Planirate venčanje 2027? Krenite sad!"

---

*Dokument v1.0 — Februar 2026*
*Za DigiPoz (@digipoz_) — digipoz.rs*
