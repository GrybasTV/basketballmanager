# Pasaulio Inicijavimo Logika (Initial World Seed)

Šis dokumentas aprašo, kaip sukuriamas žaidimo pasaulis prieš pradedant pirmąjį sezoną.

## 1. Geografinis ir Struktūrinis pamatas
*   **Šalys:** 25 krepšinio šalys.
*   **Lygos:** Kiekviena šalis turi Divizioną I (12 komandų) ir Divizioną II (12 komandų).
*   **Europos Divizijos:** 25 tarptautiniai divizionai po 25 komandas.

## 2. Masinis Žaidėjų Generavimas
Sukuriamas pirminis žaidėjų baseinas (Player Pool):
*   **Kiekis:** ~12,000 unikalių krepšininkų.
*   **Pasiskirstymas:**
    *   **Elite (OVR 80-99):** Tik 1-2% viso baseino. Jie priskiriami stipriausiems I Diviziono ir Europos klubams.
    *   **Pro (OVR 60-79):** Apie 15%. Pagrindiniai I Diviziono žaidėjai.
    *   **Average (OVR 40-59):** Apie 65%. II Diviziono ir atsarginių pagrindas.
    *   **Youth/Prospects:** Likę žaidėjai, didelis dėmesys 16-19 m. jaunuoliams.

## 3. Dinaminis Sutarčių „Užsėjimas“
Kad rinka nebūtų statiška, pradinės sutartys generuojamos su skirtinga pabaigos data:
*   33% žaidėjų sutartis baigiasi po 1 metų.
*   33% žaidėjų sutartis baigiasi po 2 metų.
*   34% žaidėjų sutartis baigiasi po 3 metų.
*   *Tai užtikrina, kad kiekvieną sezoną transferų rinka bus aktyvi.*

## 4. Agento ir Trenerio Priskyrimas
*   **Agentai:** Sukuriamas ~500-1000 agentų fondas, kiekvienas žaidėjas atsitiktine tvarka suporuojamas su agentu pagal jo lygį.
*   **Treneriai:** Kiekviena iš 600 komandų gauna vyr. trenerį, kurio reitingas atitinka komandos lygį.

## 5. Laisvųjų Agentų Rinka (Starting Market)
Po komandų užpildymo lieka apie 10-15% laisvų žaidėjų. Tai yra pirmoji transferų lango pasiūla vartotojui.

---

**Inicijavimo trukmė:** Šis procesas atliekamas vieną kartą kuriant serverį/duomenų bazę. Vėliau pasaulis evoliucionuoja natūraliai (senėjimas, nauji žaidėjų generavimai, karjeros pabaigos).
