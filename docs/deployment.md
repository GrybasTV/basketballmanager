# 🚀 Deployment Guide (Cloudflare D1 + Next.js)

Šis gidas paaiškina, kaip paruošti ir išleisti „Basketball Manager“ naudojant Cloudflare D1 duomenų bazę.

## 1. Cloudflare D1 Paruošimas
Tavo bazė jau sukonfigūruota `wrangler.toml` faile:
- **Database Name:** `basketballmanager`
- **ID:** `8229ea3e-5299-4046-8bac-a2095e2e65fb`

### Migracijų vykdymas į debesį:
Norėdami perkelti savo DB schemą į Cloudflare, naudok šią komandą:
```bash
npx wrangler d1 execute basketballmanager --file=./prisma/migrations/init.sql
```
*(Pastaba: Pirmiausia sugeneruok migraciją su `npx prisma migrate diff`)*

## 2. Prijungimas kode (Prisma Adapter)
Kadangi naudojame Cloudflare D1, Next.js programėlėje turime naudoti D1 adapterį. Tavo `src/lib/prisma.ts` turėtų atrodyti taip:

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

export const runtime = 'edge' // Svarbu Cloudflare/Vercel Edge funkcijoms

export const getPrisma = (d1: D1Database) => {
  const adapter = new PrismaD1(d1)
  return new PrismaClient({ adapter })
}
```

## 3. Talpinimas (Deployment)

### Variantas A: Cloudflare Pages (Rekomenduojama)
1. Prijunk savo GitHub repozitoriją prie Cloudflare Pages.
2. Build command: `npm run build`.
3. Build output directory: `.vercel/output/static` (jei naudojamas @cloudflare/next-on-pages) arba standartinis.
4. **SVARBU:** Settings -> Functions -> D1 Database Bindings pridėk kintamąjį `DB`, nurodantį tavo `basketballmanager` bazę.

### Variantas B: Vercel + D1
Jei liksi prie Vercel, turėsi pasiekti D1 per HTTP API, kas gali būti lėčiau. Rekomenduojama naudoti Cloudflare Pages geriausiam „puzlės“ veikimui.

## 4. Reikalingi paketai
Įsitikink, kad įdiegti šie paketai:
```bash
npm install @prisma/adapter-d1 @cloudflare/workers-types
```
