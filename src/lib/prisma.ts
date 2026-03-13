/// <reference types="@cloudflare/workers-types" />
import { PrismaClient } from "@prisma/client"
import { PrismaD1 } from "@prisma/adapter-d1"

// Tipas Cloudflare D1 bazei
interface CloudflareEnv {
  DB: D1Database
}

const createPrismaClient = () => {
  // Tikriname ar esame Cloudflare aplinkoje (pvz. per process.env.DB)
  // Cloudflare Pages/Workers aplinkoje 'DB' yra prieinamas per rišimą (binding)
  const runtimeEnv = (process as any).env as unknown as CloudflareEnv
  
  if (runtimeEnv.DB) {
    const adapter = new PrismaD1(runtimeEnv.DB)
    return new PrismaClient({ adapter })
  }

  // Lokali aplinka (SQLite)
  return new PrismaClient()
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
