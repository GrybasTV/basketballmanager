# AI Komandų Valdymo Logika (AI GM)

Nors žaidimas skirtas vartotojams, komandos be savininkų (arba laikinai apleistos) yra valdomos AI GM modulio, kuris užtikrina lygų konkurencingumą.

## 1. Sudėties Optimizavimas

AI GM kasdien skenuoja savo sudėtį (15 žaidėjų) ir vertina:
*   **Pozicijų balansą:** Jei trūksta bent vienos pozicijos (PG, SG, SF, PF, C), AI GM tampa aktyviu pirkėju.
*   **OVR gylį:** AI bando išlaikyti vidutinį komandos reitingą, atitinkantį jos diviziono lygį.
*   **Ateities planavimą:** Jei komandoje daug veteranų (32+ m.), AI GM bando pasirašyti bent 2-3 jaunus talentus (16-19 m.).

## 2. Dalyvavimas Laisvųjų Agentų rinkoje

AI komandos dalyvauja bendrame 3-5 dienų derybų lange:
*   **Logika:** AI įvertina žaidėją pagal savo „Prestižą“. Stipriausi klubai siūlo maksimalias algas žvaigždėms.
*   **Konkurencija:** AI gali permušti (outbid) vartotojo pasiūlymą, jei žaidėjas puikiai tinka AI komandos poreikiams.
*   **Sprendimas:** AI pateikia vieną galutinį pasiūlymą per paskutines 24 valandas, remdamasis kitų klubų (įskaitant vartotojus) aktyvumu.

## 3. Transferų Strategija (Pirkimas / Pardavimas)

*   **Selling:** Jei žaidėjo alga užima per didelę biudžeto dalį arba jo OVR krenta, AI GM įtraukia jį į transferų sąrašą.
*   **Buying:** AI stebi transferų sąrašą. Jei vartotojas įdeda gerą žaidėją už prieinamą sumą, AI komanda gali pateikti pasiūlymą jį pirkti.

## 4. Sutartys ir Pratęsimai

AI GM yra labai atsargus su savo biudžetu:
*   **Lojalumas:** AI stengiasi pratęsti sutartis su savo lyderiais dar sezono metu (Renewals), kad jie netaptų laisvaisiais agentais.
*   **Derybos:** AI derybų procesas su agentais yra automatizuotas (greitas paprastų taisyklių skenavimas: „Ar telpa į biudžetą? Ar atitinka OVR poreikį? Taip/Ne“).

## 5. Finansinis Saugumas ir Bankroto Prevencija

AI GM niekada nebankrutuoja aklai. Jis laikosi griežtų finansinių taisyklių:
1.  **Biudžeto Rezervas:** AI GM niekada nesiūlys kontraktų, kurie užpildytų 100% algų biudžeto. Visada paliekama 5-10% „rezervas“ nenumatytoms traumoms ar pigioms progoms.
2.  **Kritinis nurašymas (Restructuring):** Jei prognozuojamos pajamos krenta (pvz. iškrenta į žemesnę lygą), AI GM pirmiausia į transferų sąrašą įtraukia žaidėjus su didžiausiomis algomis (dažniausiai veteranus), nepaisant jų svarbos žaidimui.
3.  **Lygos dotacijos:** AI komandoms taikomas minimalus „pajamų dugnas“ (League Safety Net), kad jos visada galėtų išlaikyti bent minimalią 10-ies žaidėjų sudėtį (pakaitalus).

---

**Tikslas:** AI komandos neturi būti „neklystančios“. Jos gali padaryti klaidų (pvz., nusipirkti per brangų žaidėją), kad pasaulis atrodytų natūralus ir vartotojas turėtų šansų jas „apžaisti“ rinkoje.
