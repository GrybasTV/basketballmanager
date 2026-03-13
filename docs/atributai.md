# Žaidėjų Atributų Detalizacija (0-99)

Šiame dokumente aprašomi visi žaidėjų reitingai ir jų tiesioginė įtaka „Play-by-Play“ rungtynių varikliui.

## 1. Biometriniai Duomenys
| Atributas | Reikšmė | Poveikis simuliacijai |
| :--- | :--- | :--- |
| **Ūgis (cm)** | 160-230 | Prideda bonusą prie **Blokų**, **Atkovotų kamuolių** ir **Metimų iš po krepšio**. Neturi tiesioginės baudos greičiui, bet itin aukšti ir greiti žaidėjai pasitaiko labai retai (Anomalijų sistema). |
| **Pilietybė** | Šalis | Svarbu vietinių lygų legionierių limitams. |
| **Svoris (kg)** | 70-150 | Įtakoja **Jėgos** efektyvumą. Sunkesni žaidėjai geriau stumdosi baudos aikštelėje, bet greičiau pavargstą. |
| **Amžius** | 16-40+ | Lemia progresą (jauni tobulėja greičiau) ir fizinį nuosmukį (vyresniems krenta Speed/Stamina). |

## 2. Puolimo Įgūdžiai (0-99)
| Atributas | Poveikis simuliacijai |
| :--- | :--- |
| **Metimas iš arti** | Tikimybė pataikyti iš po krepšio (Layups/Dunks). Labai priklauso nuo ūgio pranašumo. |
| **Vidutinis nuotolis** | Taiklumas iš 3-6 metrų zonos. Pagrindinis ginklas SF/PF pozicijoms. |
| **Tritaškiai** | Taiklumas už perimetro linijos. Lemiamas faktorius "Stretch" tipo žaidėjams. |
| **Baudos metimai** | Tikimybė pataikyti po pražangos. Svarbu rungtynių pabaigoje. |
| **Kamuolio valdymas** | Mažina klaidų (Turnovers) tikimybę varantis kamuolį. Leidžia išvengti „Steal“ bandymų. |
| **Perdavimai** | Tikimybė atlikti tikslų perdavimą. Aukštas reitingas suteikia +10-15% "Catch & Shoot" boostą komandos draugui. |
| **Puolimo atk. kam.** | Tikimybė nusiimti kamuolį po netaiklaus metimo. Suteikia „Antro šanso“ (Second Chance) ataką. |

## 3. Gynybos Įgūdžiai (0-99)
| Atributas | Poveikis simuliacijai |
| :--- | :--- |
| **Perimetro gynyba** | Tikimybė sulaikyti varžovą prie tritaškio linijos. Mažina varžovo tritaškių ir vidutinių metimų taiklumą. |
| **Vidinė gynyba** | Tikimybė sustabdyti varžovą po krepšiu. Blokuoja prasiveržimus ir mažina "Close Shot" taiklumą. |
| **Perimti kamuoliai** | Šansas „pavogti“ kamuolį varovui besivarant arba perduodant. Sukuria greitą puolimą (Fast Break). |
| **Blokai** | Tikimybė numušti varžovo metimą. Sėkmė labai priklauso nuo Ūgio ir Šuolio (Vertical). |
| **Gynybos atk. kam.** | Tikimybė užbaigti varžovo ataką pasiimant kamuolį. Sunkiau nei puolime (bazinis pranašumas gynybai). |

## 4. Fiziniai Atributai (0-99)
| Atributas | Poveikis simuliacijai |
| :--- | :--- |
| **Greitis** | Lemia, kaip greitai žaidėjas persivaro kamuolį ir grįžta į gynybą. Svarbu „Fast Break“ situacijose. |
| **Jėga** | Naudojama „Post-up“ žaidime. Stipresnis žaidėjas nustumia varžvovą ir gauna geresnę poziciją metimui. |
| **Šuolis** | Tiesioginis modifikatorius **Blokams** ir **Atkovotiems kamuoliams**. |
| **Ištvermė (Stamina)** | Maksimalus kiekis energijos. Jai senkant, visų kitų atributų efektyvumas krenta (nuo -5% iki -25%). |
| **Traumingumas** | Tikimybė gauti traumą susidūrimo metu arba dėl didelio nuovargio. |

## 5. Mentalitetas (0-99)
| Atributas | Poveikis simuliacijai |
| :--- | :--- |
| **Krepšinio IQ** | „Sprendimų priėmėjas“. Lemia, ar žaidėjas mes sunku metimą, ar atiduos perdavimą laisvam draugui. |
| **Šaltakraujiškumas** | Suteikia boostą (+10-15%) metimams paskutinėmis minutėmis, kai rezultatas apylygis. |
| **Ištikimybė (Loyalty)** | (0-99) Lemia žaidėjo prisirišimą prie komandos ir norą likti joje ilgą laiką. |
| **Moralė (Morale)** | (0-99) Dinamiškas rodiklis, nurodantis dabartinę žaidėjo nuotaiką ir pasitenkinimą. |
| **Potencialas** | Nurodo lubas, kiek žaidėjas gali patobulėti treniruočių metu. (Vartotojui paprastai slepiamas). |

## 6. Pozicijų „Soft Caps“ (Tipiniai rėžiai 0-99)

Šie rėžiai naudojami generuojant įprastus žaidėjus. Jie užtikrina, kad žaidėjai atitiktų savo pozicijos standartus, bet palieka vietos tobulėjimui.

| Atributų grupė | PG | SG | SF | PF | C |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Ūgis (cm)** | 175-195 | 190-205 | 198-210 | 203-215 | 208-230 |
| **Greitis** | 80-99 | 75-95 | 70-90 | 50-80 | 30-65 |
| **Metimas (3PT)** | 70-95 | 75-99 | 65-90 | 40-80 | 20-60 |
| **Vidinė gynyba** | 10-40 | 20-50 | 40-75 | 70-95 | 80-99 |
| **Kamuolio valdymas**| 85-99 | 75-90 | 60-85 | 40-70 | 20-50 |
| **Jėga** | 20-50 | 30-65 | 50-80 | 75-95 | 85-99 |

## 7. „Vunderkindų“ ir Anomalijų Sistema

Žaidimas generavimo metu naudoja specialų algoritmą, kuris leidžia sukurti išskirtinius žaidėjus, laužančius aukščiau nurodytas taisykles:

1.  **Vunderkindas (Rare - 5% šansas):** Žaidėjas, kurio **Potencialas** yra 90-99. Jo pradiniai atributai gali būti žemi, bet jis tobulės dvigubai greičiau nei kiti.
2.  **Anomališka Fizika (Ultra Rare - 1% šansas):** Žaidėjas, kuris visiškai ignoruoja savo pozicijos „Soft Caps“.
    *   *Pvz.:* 222 cm ūgio centras su 90 Greičiu ir 85 Kamuolio valdymu.
    *   *Pvz.:* 175 cm įžaidėjas su 95 Jėga ir 90 Vidine gynyba.

Šie žaidėjai yra transferų rinkos „aukso luitai“, kurių medžiojimas yra viena pagrindinių menedžerio veiklų.

## 8. Žaidėjo Gyvenimo Ciklas ir Karjeros Pabaiga

Žaidėjai nėra statiški. Jų atributai keičiasi priklausomai nuo amžiaus fazės.

### A. Tobulėjimo Fazė (18–25 m.)
*   **Atributų augimas:** Didžiausias progresas per treniruotes.
*   **Fizika:** Galimas ūgio augimas (+1-3 cm iki 20 m.) ir svorio/raumenų masės didėjimas.
*   **Potencialas:** Šioje fazėje geriausiai matosi, ar žaidėjas pasieks savo „lubas“.

### B. Pikas (26–30 m.)
*   **Maksimumas:** 29-30 metai yra fizinių galimybių ir patirties sankirta. Tai aukščiausias žaidėjo OVR taškas.
*   **Stabilumas:** Atributai beveik nekrenta, žaidėjas demonstruoja geriausią krepšinį.

### C. „Nuosmukio Nuokalnė“ (Individualu)
*   **Kintama pradžia (RNG):** Nors vidurkis yra 31 m., kiekvienas žaidėjas turi individualų „Piko pabaigos“ rodiklį:
    *   **Anstyvas perdegimas (5% šansas):** Nuosmukis prasideda jau 23–25 m. (traumos arba psichologija).
    *   **Standartas (85% šansas):** Nuosmukis prasideda 29–31 m.
    *   **Ilgaamžis (10% šansas):** Išlaiko piką iki 34–35 m. (tikros legendos).
*   **Degradacijos greitis:** Tai taip pat kintamas rodiklis. Vieni praranda po -2 OVR, kiti – po -8 per sezoną.
*   **Fizika:** *Speed*, *Vertical* ir *Stamina* krenta agresyviausiai.
*   **Patirtis:** *Basketball IQ* ir *Clutch* gali kompensuoti dalį praradimų iki tam tikros ribos.

### D. Karjeros Pabaiga (Retirement)
*   **Tipinis amžius:** 32–36 metai, bet dėl tikimybių sistemos gali svyruoti nuo 27 iki 42 metų.
*   **Priežastys:**
    1. **OVR limitas:** Rezultatyvumo ir naudos komandai praradimas.
    2. **Traumos:** Sunkios traumos vėlyvame amžiuje dažnai tampa „paskutiniu lašu“.
    3. **Motyvacija (RNG):** Kai kurie žaidėjai nusprendžia pasitraukti būdami pike (reti atvejai).

## 9. Naujų Žaidėjų Generavimas (Entry Logic)

Kas sezoną į žaidimą (dažniausiai į laisvųjų agentų rinką arba naujokų biržą) įtraukiami nauji žaidėjai. Jų amžius ir potencialas yra tiesiogiai susiję.

| Amžiaus grupė | Tikimybė | Potencialo lubos | Aprašymas |
| :--- | :--- | :--- | :--- |
| **16–17 m.** | **10%** | **99** | „Vunderkindų“ amžius (pvz. Luka Dončić tipas). Labai žemas pradinis OVR, bet milžiniškas Potential. |
| **18–19 m.** | **60%** | **95** | Pagrindinė naujokų banga. Dauguma būsimų All-Stars ateina čia. |
| **20–23 m.** | **20%** | **~80** | Universitetus baigę arba vėlyvesni talentai. |
| **24–27 m.** | **10%** | **~65** | Suformuoti žaidėjai „skylių užkamšymui“. |

### Pagrindinės taisyklės:
1.  **Potencialo ir Amžiaus koreliacija:** Kuo vyresnis naujas žaidėjas sugeneruojamas, tuo mažesnis skirtumas tarp jo dabartinio OVR ir Potencialo.
    *   *Pvz.:* 16-metis gali turėti 25 OVR ir 95 POT (+70 augimas per karjerą).
    *   *Pvz.:* 25-metis gali turėti 58 OVR ir 62 POT (+4 augimas).
2.  **Superžvaigždžių taisyklė:** 95+ potencialą gali turėti TIK žaidėjai iki 18 metų. Tai skatina klubus skautinti labai jaunus talentus.
3.  **Laisvieji agentai:** Visi naujai generuojami žaidėjai, kurie nepatenka į jokią komandą starto metu, tampa laisvaisiais agentais ir yra prieinami visiems projektams.

---

## 10. „Talentų Piramidė“ (Scarcity Curve)

| Potential OVR | Žaidėjų klasė | Tikimybė lygos mastu |
| :--- | :--- | :--- |
| **95 - 99** | **Legendos (GOAT)** | **~0.1%** (Tik jauniems) |
| **90 - 94** | **Superžvaigždės** | **~1-2%** (Tik jauniems) |
| **80 - 89** | **All-Stars** | **~5%** |
| **50 - 79** | **Vidutiniokai** | **~75%** (Pagrindinė masė) |
| **1 - 49** | **Silpni / Gylis** | **~18%** |

---

## 12. Dinaminio Potencialo Sistema

Potencialas nėra nekintama reikšmė. Jis gali svyruoti priklausomai nuo žaidėjo aplinkos ir patirties:

*   **Žaidybinis laikas (Minutes):** Jaunimui (iki 23 m.) tai pagrindinis tobulėjimo variklis.
    *   **Augimas (+1..+3 POT/sezonui):** Jei žaidėjas gauna solidžias minutes (>20 min.) ir gerai pasirodo.
    *   **Stagnacija (-2..-5 POT/sezonui):** Jei talentas sėdi ant suolo (<5 min.) ir neturi progų progresuoti.
*   **Aukšto lygio varžybos:** Žaidimas Europos divizijose prieš stipresnius varžovus suteikia didesnį „Potential Boost“ šansą nei tik vietinė lyga.
*   **Sunkios traumos:** Kritinis faktorius. Sunki trauma (pvz., nutrūkę raiščiai) gali negrįžtamai numušti potencialą (nuo -5 iki -15 punktų), nes žaidėjas praranda fizines „lubas“.

---

## 13. Ištvermės (Stamina) ir Nuovargio Sistema

Ištvermė žaidime veikia dviem lygiais: **Rungtynių** ir **Sezono (akumuliacinė)**.

### A. Rungtynių Ištvermė (Match Stamina)
*   Kiekvienas žaidėjas pradeda rungtynes su 100% energijos (jei nėra pavargęs po praėjusių rungtynių).
*   **Kritimas:** Energija senka kiekvieną minutę aikštelėje.
*   **Debuffai:** Kai energija nukrenta žemiau 50%, pradedami taikyti laikinai mažėjantys reitingai:
    *   **50% Stamina:** -5% Speed, -5% Shooting.
    *   **25% Stamina:** -20% Speed, -15% Shooting, -30% Defense.
*   **Poilsis:** Sėdint ant suolo, energija šiek tiek atsistato (priklauso nuo `Stamina` atributo), bet niekada negrįžta į 100% tų pačių rungtynių metu.

### B. Sezono Nuovargis (Season Fatigue) ir Atsistatymas
*   **Akumuliacija:** Kiekviena sužaista minutė didina „sezono nuovargį“. Žaidžiant 2 rungtynes per dieną (vietinės lygos + Europos diviziono), nuovargis kaupiasi dvigubai greičiau.
*   **Atsistatymas:**
    *   **Praleistos rungtynės (Bench):** Jei žaidėjas registruotas, bet nepasirodo aikštelėje, jis atstato **+25%** energijos.
    *   **Neįtraukimas į sudėtį (Rest Day):** Jei žaidėjas visai nežaidžia rungtynių tą dieną, jis atstato **100%** energijos ir „išsivalo“ sukauptą sezono nuovargį.
*   **Strategija:** Komandos, žaidžiančios tarptautiniuose turnyruose, privalo turėti gilesnę sudėtį (12-15 žaidėjų), nes pagrindiniai lyderiai neatlaikys 2-3 rungtynių per dieną ritmo.

### C. Tvarkaraščio Intensyvumas
*   **Tarptautinės komandos:** Žaidžia 1 vietinę ir 1-2 tarptautines rungtynes per dieną.
*   **Vietinės komandos:** Kad išlaikytų aktyvumą, komandos, kurios nedalyvauja Europos divizionuose, vietinėje lygoje gali žaisti **dvigubai dažniau** (pvz., 2 rungtynes per dieną), taip greičiau baigdamos sezono ratą arba turėdamos intensyvesnį vietinį tvarkaraštį.

---

## 14. Traumų Variklis

Traumos nėra tik atsitiktinumas – tai pasekmė.

*   **Rizikos faktoriai:**
    1.  `Traumingumas` (0-99): Bazinis žaidėjo polinkis susižeisti.
    2.  `Nuovargis`: Jei žaidėjas žaidžia su <25% Stamina, traumų šansas išauga 5 kartus.
    3.  `Žaidybinis krūvis`: Per didelis minučių kiekis per savaitę.
*   **Traumų tipai:**
    *   **Lengvos (Day-to-Day):** Žaidėjas gali žaisti, bet su -15% OVR bauda, arba praleidžia 1-2 dienas.
    *   **Vidutinės:** 1-4 savaitės (pvz. patempta kulkšnis).
    *   **Sunkios:** 2-9 mėnesiai (plyšę raiščiai). Tokios traumos, kaip sutarėme, **mažina žaidėjo Potencialą**.

---

## 15. Formos faktorius (Form / Rhythm)

Forma (0-99) nurodo žaidėjo dabartinį „karštį“.

*   **Kaip tai veikia:** Tai laikinai modifikuoja *Shooting* ir *Basketball IQ* atributus.
*   **Kritimas/Kilimas:**
    *   **Hot Streak:** Jei paskutinėse 3 rungtynėse žaidėjas meta virš savo vidurkio, jo forma kyla (+5 OVR prie metimų).
    *   **Cold Streak:** Jei žaidėjas kelias rungtynes „mėto plytas“ arba visai nežaidžia, jo forma krenta (laikinas debuffas).
*   **Nauda:** Tai priverčia vartotoją stebėti statistiką. Kartais geriau leisti į aikštę žemesnio reitingo žaidėją, kuris dabar yra „ant bangos“ (aukšta forma).

---

## 16. Kaip skaičiuojamas OVR (0-99)?
Tai yra svertinis vidurkis, kurio formulė priklauso nuo pozicijos.
*   **PG OVR:** Perdavimai (25%), Kamuolio valdymas (20%), Perimetro gynyba (15%), Tritaškiai (15%)...
*   **C OVR:** Vidinė gynyba (25%), Atkovoti kamuoliai (25%), Ūgis/Jėga (20%), Metimas iš arti (15%)...
