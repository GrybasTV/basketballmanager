# Transferų Sistema (Klubas vs Klubas)

Transferų sistema leidžia keistis žaidėjais, kurie turi galiojančias sutartis, sumokant transfero mokestį.

## 1. Pirkimo būdai

### A. Išpirkos aktyvavimas (Release Clause)
Jei sutartyje numatyta išpirka, procesas yra skubus:
*   Pirkėjas sumoka fiksuotą sumą.
*   Dabartinis klubas **privalo** leisti žaidėjui derėtis dėl naujos sutarties.
*   Jei žaidėjas sutinka su pirkėjo sąlygomis – jis iškart keliauja į naują komandą.
*   **Derybinis efektas:** Maža išpirka veikia kaip žaidėjo saugiklis (lengviau susitarti dėl mažesnės algos). Didelė išpirka yra „bauda“ už laisvės suvaržymą, todėl žaidėjas reikalauja didesnės algos.

### B. Derybos dėl kainos
Jei išpirkos nėra arba pirkėjas nori mokėti mažiau:
*   Pateikiamas pasiūlymas komandai (Transfer Fee).
*   Klubas vertina: Žaidėjo OVR, amžių, likusį kontrakto laiką (jei liko 3 mėnesiai – kaina krenta, jei 3 metai – kaina pikas).
*   Galima pridėti specialias sąlygas: **% nuo kito pardavimo** (Sell-on Clause).

## 2. Transferų Langai

Siekdami realistiškumo, transferus ribojame laikotarpiais:
*   **Vasaros langas (Offseason):** Visos operacijos galimos.
*   **Žiemos langas (Sezono viduryje):** Trumpas 1-2 savaičių langas skubiam sudėties taisymui.
*   **Uždarytas langas:** Galima pasirašyti tik **Laisvuosius agentus** (jei numatyta laisva vieta sudėtyje).

## 3. Žaidėjo Nuoma (Loaning)

Idealu jaunų talentų ugdymui, bet su griežtomis sąlygomis, kad žaidėjas „nemarinuotųsi“ ant suolo:

*   **Minučių garantija (Playing Time Agreement):** Nuomos sutartyje pirkėjas **privalo** įsipareigoti skirti minimalų minučių kiekį (pvz., 15+, 25+ min.).
*   **Finansai:** Pirkėjas moka dalį arba visą žaidėjo algą. Jei žaidėjas žaidžia mažiau nei sutarta, pirkėjas gali būti baudžiamas papildomu mokesčiu.
*   **Nuomos atšaukimas (Recall Clause):**
    *   Savininkas turi teisę **nutraukti nuomą akimirksniu**, jei pirkėjas nevykdo minučių susitarimo (pvz., per paskutines 3 rungtynes žaidėjas žaidė <50% sutarto laiko).
    *   Jei žaidėjas „marinuojamas“ ant suolo, jo **Moralė** krenta, o **XP progresas** sustoja, todėl greitas atšaukimas yra būtinas.
*   **Žaidybinė nauda:** Gavęs minučių kitoje komandoje, žaidėjas kelia savo OVR ir grįžta pas tave pasiruošęs kovoti dėl vietos tavo sudėtyje.

## 4. AI Logika Pardavimui

AI klubas sutiks parduoti žaidėją, jei:
1.  Pasiūlyta suma viršija rinkos vertę (OVR x POT koeficientas).
2.  Žaidėjas yra „nelaimingas“ (žema Moralė) ir nori išeiti.
3.  Žaidėjui liko mažiau nei 25% kontrakto laiko (AI bando gauti bent kiek pinigų, kol žaidėjas netapo laisvuoju agentu).

---

**Menedžerio pergalė:** Sugebėti rasti žaidėją transferų sąraše, kurio išpirka yra mažesnė nei jo reali vertė, ir jį „perimti“ greičiau nei kiti.
