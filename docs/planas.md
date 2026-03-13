„Gemini“ pasakė

Štai atnaujintas ir išplėstas projekto planas, į kurį įtraukiau pradinę jūsų viziją bei papildžiau ją trūkstamais žaidimo mechanikos, ekonomikos ir logikos elementais.
Krepšinio Menedžerio Projekto Planas (Atnaujintas)
Projekto Apžvalga

Pavadinimas: Basketball Manager Pro

Platforma: Žiniatinklis (React, Node.js/Python, Reliacinė DB)

Tipas: Multiplayer krepšinio valdymo žaidimas (Simuliatorius)
Pagrindinė Koncepcija

Žaidimas susideda iš dviejų pagrindinių sluoksnių:

    Lygų ir Turnyrų struktūra: Dvi nepriklausomos, bet lygiagrečiai veikiančios sistemos (Vietinės lygos ir Europos divizijos).
    *   **Vietinė sistema (Local Hierarchy):** 25 šalys, kiekviena turi 2 divizionus po 12 komandų. Iš viso 600 komandų.
    *   **Europos sistema (European Pyramid):** 24 divizionai (Tier 1 iki Tier 24) po 25 komandas. Iš viso 600 vietų.
    *   **Visuotinis aktyvumas:** Kiekviena žaidimo komanda **privalomai** užima vietą abiejose sistemose vienu metu. Nėra „mirusių“ zonų.

    **Rungtynių ritmas (Alternating Days):**
    *   Kas antrą dieną vyksta Vietinės lygos rungtynės, o tarp jų – Europos pirmenybių rungtynės.
    *   Tai užtikrina, kad vartotojas **kiekvieną dieną** turi bent vienerias rungtynes, nepaisant jo lygio.


    Krepšinio simuliacija: Žaidėjų generavimas, komandos komplektacija, ekonomika ir rungtynių variklis (Match Engine).

1. Turnyrų Struktūra
A. Vietinės Lygos (25 šalys × 2 divizijos)

    Struktūra: Kiekviena šalis turi I Diviziją (12 komandų) ir II Diviziją (12 komandų).

    Sezono formatas: 2 ratai (22 rungtynės). I Divizijoje vyksta Playoff'ai (1-8 vietos).

    Promotion/Relegation:

        I Div. 11-12 vietos → nukrenta į II Diviziją.

        II Div. 1-2 vietos → kyla į I Diviziją.

    **Legionierių limitas (Svarbu):**
    *   Kiekviena komanda vietinėje lygoje privalo turėti bent **6 vietinius žaidėjus** (tos pačios šalies pilietybė) 12-os žaidėjų paraiškoje.
    *   Tai riboja galimybę tiesiog supirkti visus geriausius užsieniečius ir skatina investuoti į savo šalies jaunimo ugdymą.

        II Div. 11-12 vietos → sukuriama nauja III Divizija (jei yra poreikis ir pakankamai žaidėjų).



B. Europos Divizijos (European Pyramid)

    Struktūra: 50 divizionų (European 50 → European 1), po 12 komandų kiekvienoje. Iš viso 600 vietų.

    Komandų priskyrimas: Komandos į divizijas skirstomos ne pagal šalį, o miksavimo būdu pagal pajėgumą, užtikrinant tarptautinę konkurenciją.

    Sezono formatas: 2 ratai (22 rungtynės). Po reguliaraus sezono vyksta sinchronizuotos atkrintamosios (8-10 dienų).

    Promotion/Relegation:

        11-12 vietos → nukrenta į žemesnį divizioną.

        1-2 vietos → kyla į aukštesnį divizioną.

    **Legionierių limitas:** Europos divizijose limitų **nėra**. Čia galima sudaryti komandą tik iš užsieniečių, jei biudžetas leidžia.

2. Žaidimo Mechanika ir Ekonomika (Nauja)
A. Žaidėjų Sistema

    Generavimas: Kiekvienas žaidėjas turi unikalius parametrus (skalė 0-99) ir bendrą reitingą (Overall - OVR, skalė 0-99), suskirstytus į 5 kategorijas:
        *   **Biometrika:** Pozicija (PG, SG, SF, PF, C), Ūgis (cm), Svoris (kg), Amžius, Pilietybė.

    **Sudėties limitai:**
    *   **Maksimalus kiekis:** 15 žaidėjų pagrindinėje sudėtyje.
    *   **Minimalus kiekis:** 10 žaidėjų.
    *   **Sudėties apsauga (Emergency Filling):**
        1. **Pirmas žingsnis:** Sistema bando automatiškai pasirašyti pigiausius **Laisvuosius Agentus** (OVR <40) 1 savaitės „Skubiam kontraktui“ (Emergency Contract).
        2. **Kraštutinis atvejis:** Jei laisvųjų agentų rinkoje nėra pakankamai žaidėjų arba klubas neturi nė cento algoms, sistema sugeneruoja laikinus „Gray Shirts“ (OVR 20), kurie dingsta po 7 dienų.
    *   **Rungtynių paraiška:** 12 aktyvių žaidėjų kiekvienoms rungtynėms.
    *   **Techninis pralaimėjimas (20:0):** Skiriamas, jei vartotojas piktybiškai nesusitvarko sudėties (pvz., turi <8 tikrus žaidėjus ilgiau nei 3 dienas).
        *   **Puolimas:** Metimas iš arti, Vidutinis nuotolis, Tritaškiai, Baudos, Kamuolio valdymas, Perdavimai, Puolimo atkovoti kamuoliai.
        *   **Gynyba:** Perimetro gynyba, Vidinė gynyba (Post), Perimti kamuoliai, Blokai, Gynybos atkovoti kamuoliai.
        *   **Fiziniai:** Greitis, Jėga, Šuolis (Vertical), Ištvermė (Stamina), Traumingumas.
        *   **Mentalitetas (Paslėpti):** Krepšinio IQ (sprendimų priėmimas), Šaltakraujiškumas (Clutch), Potencialas.

    Savybių įtaka: Atributai veikia kaip svoriai ir modifikatoriai konkrečiose rungtynių situacijose (pvz., ūgis prideda bonusą blokams ir atkovotiems kamuoliams).

    Progresas: Žaidėjai tobulėja per treniruotes (iki pasiekia savo Potencialą), bet senstant (nuo ~30 m.) fiziniai atributai pradeda kristi.

    Sutartys: Žaidėjai turi atlyginimus (priklauso nuo įgūdžių lygio) ir sutarčių trukmę.

B. Komandos Ekonomika

    Pajamos: Bilietų pardavimai (priklauso nuo arenos dydžio ir komandos rezultatų), rėmėjų sutartys, priziniai fondai.

    Išlaidos: Žaidėjų ir personalo atlyginimai, arenos išlaikymas.

    Transferų rinka: Galimybė pirkti/parduoti žaidėjus kitiems vartotojams (aukciono principu) arba pasirašyti sutartis su laisvaisiais agentais.

3. Rungtynių Variklis (Match Engine) (Nauja)

    Simuliacija (Play-by-Play): Rungtynės skaidomos į atskirus epizodus (posession), kuriuose lyginami žaidėjų atributai ridenant virtualų kauliuką (RNG):
        *   **Atakos kūrimas:** Ball Handling + Speed vs Perimeter Defense + Steal. Laimėjus puolimui sukuriamas "Shoot Boost" (laisvas metimas).
        *   **Metimas:** Atitinkamas metimo atributas vs Gynyba. Pridedami modifikatoriai: "Open Shot" (+15%), "Contested" (-12%), "Clutch" (+10% pabaigoje).
        *   **Kova dėl kamuolio:** Rebounding + Vertical + Strength. Gynyba turi bazinį pranašumą (pozicija).

    Nuovargio sistema: Kiekvieną epizodą Stamina krenta. Kai žaidėjo momentinė ištvermė <60%, taikomi debuffai: -15% Speed, -10% taiklumas, didesnis traumų šansas.

    Taktikos nustatymai: Vartotojo parinktas braižas tiesiogiai modifikuoja komandos atributus:
        *   **Run & Gun:** +10% Speed/3pt, bet Stamina krenta 20% greičiau ir daugiau klaidų.
        *   **Daugiau perdavimų:** Mažesnė klaidų tikimybė, bet lėtesnis žaidimo tempas.

    Laiko tempas (Pacing): Automatizuotas rungtynių vykdymas nustatytu laiku. Vartotojas gali peržiūrėti tekstinę eigą (Log).

Diegimo Etapai (Perrikiuotas ir Logiškas Eiliškumas)
1 Etapas: Bazinė Infrastruktūra ir Architektūra

    Vartotojų registracija (JWT, profiliai).

    Duomenų bazės struktūros sukūrimas (Šalys, Divizijos, Komandos).

    Algoritmas, kuris vartotojui priskiria laisvą komandą (arba sukuria naują diviziją).



2 Etapas: Žaidėjai ir Ekonomika (Turinio generavimas)

    Virtualių krepšininkų generavimo algoritmas (vardai, pavardės, atributai, amžius).

    Pradinių sudėčių sugeneravimas visoms vartotojų komandoms.

    Bazinė komandos ekonomika (pradinis biudžetas, algų skaičiavimas).

3 Etapas: Komandos Valdymas (Vartotojo sąsaja)

    Komandos sudėties peržiūra ir valdymas.

    Penketukų ir keitimų nustatymas.

    Taktikos parinkimas artėjančioms rungtynėms.

    Treniruočių režimo priskyrimas.

4 Etapas: Rungtynių Variklis (Core žaidimo logika)

    Algoritmo sukūrimas, kuris paima dviejų komandų sudėtis, taktiką ir sugeneruoja rungtynių rezultatą (Play-by-play tekstinė transliacija arba tiesiog galutinė statistika).

    Taškų, atkovotų kamuolių, traumų ir nuovargio skaičiavimas po rungtynių.

5 Etapas: Sezono Ciklas

    Tvarkaraščių generavimas (22 vietinės ir 48 Europos rungtynės).

    Kasdienių automatizuotų procesų (CRON jobs) paleidimas: variklis automatiškai sužaidžia numatytas dienos rungtynes.

    Turnyrinių lentelių atnaujinimas realiu laiku.

6 Etapas: Po Sezono ir Analitika

    Vietinių lygų atkrintamosios varžybos (Playoff'ai).

    Prizinių pinigų išdalinimas, žaidėjų sutarčių atnaujinimas.

    Promotion/Relegation mechanikos įvykdymas (komandų perkėlimas aukštyn/žemyn abiejose sistemose).

    Istorinių duomenų išsaugojimas, lygos lyderių statistika.

