# Komandos Valdymas (Manager Tools)

Šiame dokumente aprašoma, kokius sprendimus vartotojas (menedžeris) gali priimti ir kaip jie veikia žaidimo eigą.

## 1. Sudėties paraiška (Matchday Roster)
Vartotojas valdo 15 žaidėjų komandą, tačiau rungtynėms registruoja tik **12**.
*   **Active (12):** Šie žaidėjai gali pasirodyti aikštelėje. Jie naudoja ištvermę.
*   **Inactive (3):** Žaidėjai „ilsisi“. Jie nežaidžia, bet jų `Season Fatigue` atsistato iki 0, o `Match Stamina` grįžta į 100%.

## 2. Minučių ir Rotacijos Valdymas
Vartotojas nustato „Gaidę“ (Blueprint), kuria vadovaujasi rungtynių simuliatorius:
*   **Startinis penketas:** Penki žaidėjai, kurie pradės rungtynes.
*   **Minučių paskirstymas:** Kiekvienam žaidėjui priskiriamas tikslinis minučių kiekis (pvz. 32 min, 15 min, 5 min).
    *   *Variklis:* Simuliatorius stengiasi laikytis šio plano, bet tai nėra garantuota. Realybėje minutes koreguoja:
        *   **Pražangos (Foul Trouble):** Jei žaidėjas greitai renka pražangas, jo minutės mažėja nepaisant plano.
        *   **Traumos:** Sustabdo žaidėją akimirksniu.
        *   **Nuovargis:** Jei žaidėjas pavargsta greičiau nei tikėtasi (pvz. dėl didelio tempo), jis sėda anksčiau.
        *   **Rungtynių eiga:** Triuškinimo atveju (Garbage Time) lyderiai sėda ilsėtis, net jei nebuvo išžaidę savo minučių.
*   **Substitutions Logic:** 
    *   *General:* Po 5-6 minučių aikštelėje Stamina nukrenta tiek, kad simuliatorius pradeda ieškoti keitimo pagal vartotojo nustatytą eiliškumą.

## 3. Komandos Taktika (Game Plan)

Vartotojas pasirenka vieną iš stilių, kurie tiesiogiai modifikuoja žaidėjų atributus simuliacijos metu:

| Taktika | Poveikis (Boosts / Debuffs) | Energijos sąnaudos |
| :--- | :--- | :--- |
| **Run & Gun** | +10 Speed, +5 Shooting. -10 Passing (skubėjimas). | Labai didelės |
| **Grind it Out** | +10 Defense, -5 Turnover chance. -10 Shooting. | Mažos |
| **Outside Focus** | +15 3-Point chance. -10 Post Offense. | Normalios |
| **Inside Focus** | +15 Close Shot/Post. -10 3-Point chance. | Normalios |
| **Aggressive Press** | +20 Steal chance. +30 Foul chance. | Kritinės |

## 4. Keitimų nustatymai (Auto-Coach)
Vartotojas gali nustatyti specifines taisykles:
*   **Foul Trouble:** Sėsti ant suolo po 2 pražangų 1 kėlinyje / 4 pražangų iki 4 kėlinio.
*   **Stamina Threshold:** Automatiškai keisti žaidėją, kai jo Stamina nukrenta žemiau X% (vartotojas nustato skaičių).
*   **Garbage Time:** Jei rezultato skirtumas >20 taškų ketvirtajame kėlinyje, leisti žaisti tik atsarginiams (taupyti lyderius).

## 5. Trenerio Sistema (Staff Management)

Jei vartotojas nenori pats valdyti kiekvienos minutės arba taktikos, jis gali pasisamdyti trenerį. Trenerio kokybė (reitingas 0-99) tiesiogiai veikia sprendimus:

### Trenerio Atributai:
*   **Rotacija (0-99):** Gebėjimas idealiai paskirstyti minutes. Geras treneris laiku pasodins pavargusį lyderį ir neleis jam gauti traumos.
*   **Taktika (0-99):** Gebėjimas parinkti tinkamiausią taktiką prieš konkretų varžovą (Pvz. matydamas, kad varžovas neturi gero centro, treneris perjungs į „Inside Focus“).
*   **Ugdymas (0-99):** Suteikia papildomą boostą žaidėjų treniruotėms ir potencialo augimui.
*   **Motyvacija (0-99):** Didina žaidėjų „Clutch“ ir formos (Rhythm) stabilumą.

### Automatinis valdymas:
*   Vartotojas gali pažymėti „Leisti treneriui valdyti minutes“. 
*   **Geras treneris (80+):** Atidžiai stebės OVR, nuovargį, pražangas ir netgi duos daugiau minučių vunderkindams su aukštu potencialu, kad jie tobulėtų.
*   **Prastas treneris (<40):** Gali daryti keistus keitimus, pamiršti lyderius ant suolo arba „nuvaryti nuo kojų“ pagrindinius žaidėjus, taip didindamas traumų riziką.

## 6. Treniruočių Fokusas
Vartotojas nustato, ką komanda veikia tarp rungtynių:
*   **Individualus fokusas:** Pvz., „Centras dirba tik ties baudų metimais“.
*   **Komandinis fokusas:** „Šią savaitę geriname gynybą (Defense +5% training speed)“.

## 7. Komandos Kapitonas (Team Captain)

Vartotojas gali paskirti vieną žaidėją komandos kapitonu. Tai nėra tik simbolinis vaidmuo – kapitonas tiesiogiai veikia komandos psichologiją ir rezultatus.

### Kapitono įtaka:
*   **Emocinis stabilumas:** Jei komanda pralaimi kelias rungtynes iš eilės, geras kapitonas sumažina neigiamą įtaką žaidėjų **Formai (Rhythm)**.
*   **Jaunimo mentorystė:** Jei kapitonas turi aukštą **Basketball IQ** (80+), visi komandos vunderkindai (16-19 m.) gauna nedidelį **Training Boost** (+5% greičiau tobulėja).
*   **Lyderystė aikštelėje:** Kai kapitonas yra aikštelėje rungtynių metu, komandos draugai gauna nedidelį **Clutch** bonusą ir rečiau daro „kvailas“ pražangas.
*   **Chemija:** Kapitonas padeda greičiau integruoti naujus žaidėjus į komandą (mažina laiko tarpą, kol žaidėjas „apšyla“ naujoioje ekipoje).

### Kas yra geras kapitonas?
Variklis vertina šiuos faktorius skaičiuodamas kapitono efektyvumą:
1.  **Amžius:** Geriausiai šį vaidmenį atlieka veteranai (30+ m.).
2.  **Stažas komandoje:** Kuo ilgiau žaidėjas rungtyniauja tavo klube, tuo didesnis jo autoritetas.
3.  **Basketball IQ:** Protingas žaidėjas geriau valdo komandos draugus.
4.  **Charakteris:** Slaptas rodiklis, nurodantis, ar žaidėjas yra lyderis, ar intravertas.

## 8. Neaktyvumo Politika (Inactivity Management)

Kadangi žaidimas vyksta „gyvai“ ir kasdien, vartotojo nebuvimas neturi sustabdyti lygos procesų.

### A. AI Pagalbininkas (Minkštas neaktyvumas – 3-5 dienos)
Jei vartotojas neprisijungia ilgiau nei **3 dienas**:
*   **Automatika:** Įsijungia „AI Assistant“ režimas. 
*   **Veiksmai:** AI automatiškai parenka geriausią sudėtį rungtynėms, stebi nuovargį ir traumas, bei paskiria treniruotes.
*   **Derybos:** AI gali pratęsti sutartis su esamais žaidėjais (Renewals), bet tik už konservatyvią rinkos kainą. AI nesiūlo sutarčių naujiems laisviesiems agentams be vartotojo žinios.

### B. Atleidimas iš pareigų (Kietas neaktyvumas – 14 dienų)
Jei vartotojas neprisijungia ilgiau nei **14 dienų** (t.y. praleidžia beveik visą sezoną):
*   **Atleidimas:** Vartotojas oficialiai atleidžiamas iš klubo vadovo pareigų.
*   **Klubo statusas:** Komanda tampa „Laisva AI komanda“. 
*   **Valdymas:** Ją pilnai perima AI GM modulis (perka/parduoda žaidėjus, siekia rezultatų), kol komandą pasirinks naujas realus vartotojas.
*   **Istorija:** Buvęs vartotojas praranda prieigą prie šio klubo valdymo, bet jo pasiekimai (laimėti titulai) lieka klubo istorijoje.

### C. Atostogų režimas (Vacation Mode)
Vartotojas gali nustatyti „Atostogas“ iki **21 dienos**:
*   Šiuo laikotarpiu AI Assistant valdys komandą, bet vartotojas **nebus atleistas**. 
*   Reikalavimas: Prieš išeinant į atostogas, vartotojas turi būti nustatęs finansinį limitą (Budget Cap), kurį AI gali naudoti per tą laiką.
