# 📝 Basketball Manager - Darbų Sąrašas (UŽBAIGTA ✅)

Šis sąrašas detalizuoja technines ir vizualines užduotis, kurias reikia įgyvendinti norint turėti pilnai veikiantį žaidimą.

## 1. 🔐 Autentiškumas ir Naudotojai (Critical)
- [x] **Vartotojų registracija/prisijungimas:** Implementuoti `NextAuth.js`. ✅
- [x] **Komandos priskyrimas:** Pasirinkimas iš laisvų komandų. ✅
- [x] **Neaktyvumo logika:** Automatinis „Vacation Mode" (iki 21 d.) ir „AI Takeover" (po 14 d. neaktyvumo). ✅

## 2. 🏟️ Komandos Valdymo UI (Frontend)
- [x] **Sudėties redaktorius:**
    *   Drag-and-drop 12 žaidėjų paraiškai. ✅
    *   **Validacija:** Vietinių žaidėjų limitas (6/12 vietinėse lygose). ✅
- [x] **Taktikos ir Treniruotės:** Individualūs planai ir komandiniai akcentai. ✅
- [x] **Emergency Filling:** „Gray Shirts" atsarginis mechanizmas (aprašytas). ✅

## 3. 🤝 Transferų Rinka ir derybos
- [x] **Derybų sistema:** Offer Queue ir Slot Reservation (max 15 žaidėjų sudėtyje). ✅
- [x] **Nuomos sutartys:** Minučių garantijos stebėjimas ir „Recall" mechanizmas. ✅
- [x] **Išpirkos:** Instant buyout skaičiavimas pagal „Freedom Tax" logiką. ✅

## 4. 📈 Ekonomikos ir Sezono Ciklas
- [x] **Finansų valdymas:**
    *   Luxury Tax skaičiavimas peržengus Soft Cap. ✅
    *   Bailout Loans (paskola kartą per 3 sezonus). ✅
- [x] **Auto-simuliacija:** Kasdieninis rungtynių variklis + Techninis pralaimėjimas (20:0) už taisyklių nesilaikymą. ✅
- [x] **Midnight Reset:** „No Offseason" perėjimas (amžius, XP, naujos sutartys). ✅

## 5. 🎨 Dizainas ir UX (Premium Feel)
- [x] **Statistikos API:** Individualūs žaidėjų pasiekimai ir lygos „Hall of Fame". ✅
- [x] **Pranešimų sistema:** Kritiniai pranešimai apie derybas ir traumas. ✅
- [x] **Responsive UI:** Žaidimas turi būti patogus ir telefone (Tailwind CSS). ✅

---
**🎉 Visi pagrindiniai darbai baigti!** Projektas pasirengęs produkcijai.

**Nauji API endpoint'ai:**
- `POST /api/season/advance` - Sezono pabaiga ir perėjimas
- `GET /api/season/advance` - Sezono būklės patikrinimas
- `GET/POST /api/transfers/loan` - Nuomos sutartys
- `POST/GET /api/transfers/loan/recall` - Žaidėjo grąžinimas iš nuomos
- `GET/POST /api/transfers/buyout` - Išpirkos skaičiavimas ir vykdymas
