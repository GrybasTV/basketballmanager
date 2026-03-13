# Projekto Roadmap (Statusas: MVP UŽBAIGTA)

## ✅ MVP - UŽBAIGTA (2026-03-13)

**Įgyvendinta:**
- Duomenų bazė (14 lentelių)
- Pasaulio generatorius (12 komandų, 180 žaidėjų)
- Match Engine (pilna simuliacija)
- API Routes (9 endpointų)
- UI Dashboard (5 puslapių)

---

## 1 Faza: Pasaulio Inicijavimas ✅

| Elementas | Statusas | Pastabos |
|-----------|----------|----------|
| Lentelių Schema | ✅ | 14 lentelių sukurta |
| Lygų/Komandų Gen. | ✅ | 1 lyga, 12 komandų |
| Žaidėjų Generavimas | ✅ | 180 žaidėjų su atributais |
| Personalo Gen. | ✅ | 12 trenerių, 8 agentai |

---

## 2 Faza: Rungtynių Variklis ✅

| Elementas | Statusas | Pastabos |
|-----------|----------|----------|
| Simuliacijos Logika | ✅ | OVR, atributų įtaka |
| XP ir Treniruotės | ⏳ | Planuojama |
| Statistikos | ✅ | MatchPlayerStats sukurta |
| Tvarkaraštis | ✅ | 132 rungtynės (22 dienos) |

---

## 3 Faza: Rinka, Ekonomika ir AI GM ⏳

| Elementas | Statusas | Pastabos |
|-----------|----------|----------|
| Derybų Logika | ⏳ | Agentai sukurti, bet nėra UI |
| Transferų Sistema | ⏳ | Lentelės užfiksuotos |
| Ekonomikos Balansas | ⏳ | Algų biudžetas, bet nėra ciklo |
| AI GM Aktyvumas | ⏳ | Visos komandos AI |

---

## 4 Faza: Vartotojo Dashboard ✅

| Elementas | Statusas | Pastabos |
|-----------|----------|----------|
| Sudėties Valdymas | ⏳ | Peržiūra veikia, redagavimas ne |
| Lygų Apžvalga | ✅ | Standings veikia |
| Pranešimų Centras | ⏳ | Lentelė užfiksuota |

---

## 5 Faza: Sezono Kulminacija ⏳

| Elementas | Statusas | Pastabos |
|-----------|----------|----------|
| Play-offs | ⏳ | Lentelės užfiksuotos |
| Kilimas/Kritimas | ⏳ | |
| Metinis Reset | ⏳ | |

---

## Prioritetai (Kita Iteracija)

1. **Derybų sistema** - Laisvi agentai, kontraktai
2. **Ekonomikos ciklas** - Pajamos po rungtynių
3. **Treniruotės** - Žaidėjų progresas
4. **Play-off** - Atkrintamosios varžybos
5. **Auth** - Vartotojų sistema

---

## Technikos Stack

| Komponentas | Versija |
|-------------|---------|
| Next.js | 16.1.6 |
| Prisma | 6.19.2 |
| SQLite | įtraukta |
| Tailwind | 4.x |
| TypeScript | 5.x |
