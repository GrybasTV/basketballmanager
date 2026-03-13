# Sutarčių Derybos ir AI Logika

Derybos yra interaktyvus procesas, kuriame susiduria klubo finansinės galimybės ir žaidėjo ambicijos.

## 1. Žaidėjo Lūkesčių Faktoriai (AI Prioritetai)

Prieš sėsdamas prie stalo, žaidėjo AI apskaičiuoja savo vertę rinkoje remdamasis:
*   **Dabartinis OVR:** Bazinė algos vertė.
*   **Potencialas (POT):** Prideda „tikėjimo mokestį“ (ypač jauniems žaidėjams).
*   **Lygos Prestižas:** Žaidėjas sutiks su mažesne alga I Divizijoje nei II Divizijoje (noras laimėti).
*   **Komandos Chemija:** Jei komandoje žaidžia jo draugai arba geras treneris, tai prideda bonusą klubui.
*   **Ištikimybė (Loyalty):** (0-99) Lemia žaidėjo norą likti esamoje komandoje ir polinkį daryti finansines nuolaidas derybų metu.

## 2. Agentų Sufleravimo Sistema (Hints & Feedback)

Derybos nėra aklas spėjimas. Agentas veikia kaip aktyvus tarpininkas, teikiantis užuominas.

### A. Pradiniai lūkesčiai (Pre-Bid Hints)
Prieš pateikiant pirmąjį pasiūlymą, vartotojas gali „pasikalbėti“ su agentu. Agentas duoda suflerį:
*   *Pvz.:* „Mano klientas pirmiausia ieško **Star** vaidmens, alga jam nėra prioritetas.“
*   *Pvz.:* „Mes norime bent 3 metų kontrakto ir solidžios algos, minutės mums rūpi mažiau.“

### B. Lyginamasis grįžtamasis ryšys (Live Feedback)
Laisvųjų agentų lango metu (3-5 dienos), agentas sufleruoja, ko trūksta iki pergalės:
*   **„Geras pasiūlymas, bet...“:** „Esate antroje vietoje. Kitas klubas siūlo 10% didesnę algą.“
*   **„Vaidmens trūkumas“:** „Finansiškai jūsų pasiūlymas geriausias, bet žaidėjas abejoja, ar gaus pakankamai minučių jūsų rotacijoje.“
*   **„Paskutinis šansas“:** Likus 24 valandoms iki sprendimo, agentas gali atsiųsti žinutę: „Jei pridėsite pasirašymo premiją, rytoj sutartis bus jūsų“.

## 2. Derybų Parametrai (Kuo galima prekiauti?)

Vartotojas derybų lange gali keisti:
1.  **Alga (Basic Wage):** Kassavaitinis mokestis.
2.  **Sutarties trukmė:** 1-5 metai.
3.  **Žadamai minutės (Squad Role):**
    *   *Star:* Garantuotos 30+ min. (Mažina algos poreikį).
    *   *Starter:* 20-30 min.
    *   *Rotation / Bench:* <20 min. (Didina algos poreikį, nes žaidėjas rizikuoja prarasti formą).
4.  **Išpirka (Release Clause):** Suma, už kurią bet kuris klubas gali nusipirkti žaidėją.
    *   **Maža išpirka:** Lengvina derybas. Žaidėjas jaučiasi saugus, nes gali bet kada išvykti į stipresnį klubą (tai leidžia pasiūlyti mažesnę algą).
    *   **Didelė išpirka:** Sunkina derybas. Žaidėjas jaučiasi „įkalintas“, todėl reikalauja didesnės algos kaip kompensacijos už prarastą laisvę.
    *   **Be išpirkos:** Ekstremaliai sunku pasirašyti kylančias žvaigždes.
5.  **Pasirašymo premija (Signing Bonus):** Vienkartinė išmoka iš transferų biudžeto. Padeda „palaužti“ užsispyrusį agentą.

## 3. Derybų Procesa (Interaktyvumas)

Derybos vyksta etapais:
1.  **Vartotojo Pasiūlymas:** Vartotojas nustato sąlygas ir siunčia agentui.
2.  **AI Įvertinimas:** Agentas lygina pasiūlymą su lūkesčiais.
    *   *Accept:* Jei pasiūlymas puikus. **Sutartis sudaroma automatiškai ir akimirksniu** (nereikia papildomo patvirtinimo).
    *   *Counter-offer:* Jei trūksta nedaug, agentas atsiunčia savo variantą (pvz. „Pridėkite 1000 EUR prie algos arba metų prie trukmės“).
    *   *Reject:* Jei pasiūlymas įžeidžiantis. **Kantrybės matuoklis (Patience)** sumažėja.
3.  **Paskutinis žodis:** Po 3-4 raundų agentas sako „tai paskutinis mano pasiūlymas“. Jei vartotojas nesutinka – derybos žlunga.

## 4. Agento Asmenybės

*   **Derybininkas (Normal):** Logiškas, linkęs į kompromisus.
*   **Rylys (Aggressive):** Reikalauja kosminių sumų, greitai įsižeidžia, dažnai prašo didelių pasirašymo premijų.
*   **Globėjas (Protective):** Jam labiausiai rūpi „Squad Role“ (minutės) ir trukmė, o ne pinigai (saugo žaidėjo karjerą).

## 5. Derybų Laikas ir Tempas (Urgency)

Kadangi rungtynės vyksta kasdien, derybų laikas yra kritinis faktorius.

*   **Renewals (Savi žaidėjai):** Agentas atsako **iškart**. Kadangi tai privačios derybos, sprendimas gali būti priimtas per kelias sekundes.
*   **Open Market (Laisvieji agentai):** 
    *   **Svarstymo langas:** Agentas neskuba. Gavęs pirmąjį pasiūlymą, jis paskelbia „Aukciono pradžią“, kuri trunka **3-5 dienas** (priklausomai nuo žaidėjo lygio).
    *   **Eiga:** Per šį laikotarpį visi norintys klubai teikia pasiūlymus. Agentas kartą per parą atnaujina informaciją:    *   **Matomumas:** Vartotojas matys statusą: „Gauti 4 pasiūlymai, sprendimas už X valandų“.
    *   **Agento dialogas:** Agentas aktyviai praneša: „Jūsų pasiūlymą aplenkė kitas klubas. Ar turite ką pridurti?“
    *   **Sprendimas:** Dienos pabaigoje AI palygina visų pasiūlymų vertę (Alga + Minutės + Prestižas) ir **automatiškai pasirašo sutartį su laimėtoju**. Vartotojas gauna pranešimą apie sėkmingą (arba ne) sandorį.
sią paketą (Alga + Rolė + Prestižas) pasiūliusiu klubu.
    *   **Privalumas:** Tai leidžia žaidėjams, kurie prisijungia tik kartą per porą dienų, vis tiek sudalyvauti kovoje dėl talentų.

## 4. Sudėties Rezervacija ir Pasiūlymų Limitai (Overflow Protection)

Kad vartotojas „netyčia“ nepasirašytų daugiau žaidėjų nei leidžia sudėties limitas (15) ar biudžetas, taikomos šios taisyklės:

1.  **Viena vieta = Vienas aktyvus pasiūlymas:** Kiekvienas išsiųstas pasiūlymas „rezervuoja“ vietą kito sezono sudėtyje. Jei turi 2 laisvas vietas, gali turėti tik 2 aktyvius pasiūlymus vienu metu.
2.  **Atsarginis sąrašas (Shortlist Queue):** Vartotojas gali paruošti 5-10 pasiūlymų kitiems žaidėjams, kurie stovi „eilėje“.
    *   **Automatinis aktyvavimas:** Jei tavo pagrindinis taikinys atmeta tavo pasiūlymą arba tu jį pats atšauki, sistema **automatiškai** iš eilės viršaus išsiunčia kitą paruoštą pasiūlymą sekančiam žaidėjui. Tai taupyti realų laiką.
3.  **Maksimalus sudėties limitas (15):** Jei tavo sudėtis pilna, norėdamas pridėti naują žaidėją, privalai:
    *   Nutraukti esamą kontraktą nurodant, kad žaidėjas išeis sezono gale (atlaisvinti vietą projektinei sudėčiai).
    *   Įtraukti esamą žaidėją į transferų sąrašą (Selling).
4.  **Auto-atšaukimas:** Kai tik pasirašoma sutartis, kuri užpildo paskutinę laisvą vietą (15/15), visi kiti tavo išsiųsti pasiūlymai ir eilėje esantys planai yra **anuliuojami akimirksniu**.
*   **Instant Sign (Skubus pasirašymas):** 
    *   **Taisyklė:** Žaidėjai, esantys laisvųjų agentų rinkos „dugne“ (apatiniai 30% pagal OVR, dažniausiai <45 OVR), gali būti pasirašyti **iškart**, be laukimo periodo.
    *   **Kodėl?** Šie žaidėjai neturi didelės paklausos, todėl jų agentams naudingiau gauti bet kokį kontraktą čia ir dabar. Tai leidžia vartotojui greitai užkamšyti sudėties skyles traumų atveju.
## 5. Derybų Dinamika ir Terminai (Blitz Logic)

Kad vartotojas neliktų be žaidėjų dėl ilgų derybų:

1.  **Pasiūlymo atšaukimas (Withdrawal):** Vartotojas gali bet kada atšaukti išsiųstą pasiūlymą. Tai akimirksniu atlaisvina sudėties rezervacijos vietą (Slot). To prireikia, jei agentas sufleruoja, kad žaidėjas pasirinks kitą klubą.
2.  **Agento būsenos atnaujinimas:** Kiekvieną dieną vartotojas mato indikatorių (Pvz.: „Tavo pasiūlymas yra Top 3“ arba „Esi permuštas kitų klubų“). Tai leidžia laiku priimti sprendimą: kelti algą arba trauktis.
3.  **Sezono pabaigos „Blitz“:** Likus 48 val. iki sezono starto (Midnight Reset), agentų „svarstymo langas“ visiems žaidėjams sumažinamas iki 24 valandų, kad procesas vyktų dvigubai sparčiau.
4.  **Nespėjus pasirašyti:** Visi laisvieji agentai, kurie nebuvo pasirašyti iki sezono starto, lieka rinkoje ir po „perjungimo“, tačiau komanda be 10-ies žaidėjų gaus „Emergency“ pakaitalus savo rungtynėms.

## 6. Laisvųjų agentų specifika

Dėl laisvųjų agentų konkuruoja keli klubai vienu metu. Jei vartotojas delsia, kitas klubas (AI) gali pateikti geresnį pasiūlymą ir „pavogti“ žaidėją tavo akyse.

## 7. Lojalumo Nuolaida (Home Team Discount)

Ši mechanika skatina vartotojus išlaikyti komandos branduolį. Jei žaidėjas yra ištikimas ir ilgai rungtyniauja klube, jis gali sutikti su mažesne alga nei prašytų kitur.

*   **Skaičiavimo formulė:** Nuolaida = `(Stažas metais * 2%) + (Ištikimybė / 10 * 1%)`.
    *   *Pavyzdys:* 5 metus žaidžiantis veteranas su 80 Ištikimybės suteiktų 10% + 8% = **18% nuolaidą**.
    *   *Maksimali nuolaida:* Gali siekti iki **25%**.
*   **Sąlyga:** Nuolaida taikoma TIK tada, kai derybos vyksta su esamu klubu. Jei žaidėjas tampa laisvuoju agentu arba derasi su kitu klubu, jo lūkesčiai yra 100%.
*   **Poveikis deryboms:** Žaidėjai su aukšta ištikimybe turi didesnį **Kantrybės matuoklį** besiderant su savo dabartiniu klubu.

## 8. Sutarčių Laikas ir Strategija (Contract Timing)

Derybos gali vykti dviem pagrindiniais etapais:

1.  **Renewals (Pratęsimai):** Vartotojas gali bet kada sezono metu siūlyti naują sutartį žaidėjui, kurio kontraktas dar galioja.
    *   *Sėkmės faktorius:* Jei žaidėjo **Ištikimybė** aukšta, jis mielai pasirašys iš anksto.
    *   *Atmetimo rizika:* Jei žaidėjas jaučia, kad jo vertė kyla, jis gali delsti iki tarpsezonio, tikėdamasis „aukciono“ tarp klubų.
2.  **Laisvųjų Agentų langas (Offseason):** Tai pagrindinis derybų metas. Tik pasibaigus sezonui, visi žaidėjai be kontraktų pasirodo rinkoje.
3.  **Išankstiniai susitarimai (Pre-contracts):** Jei žaidėjo sutartis baigiasi po mažiau nei 25% sezono laiko, jis gali pradėti derybas su kitais klubais. Jei susitariama, žaidėjas prisijungs prie naujo klubo tik **pasibaigus dabartiniam sezonui**.


