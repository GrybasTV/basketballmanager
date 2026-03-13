import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
})

// GET - List available teams (without a user)
export async function GET() {
  try {
    const availableTeams = await prisma.team.findMany({
      where: { userId: null },
      include: {
        localLeague: {
          select: { name: true, tier: true }
        },
        country: {
          select: { name: true, code: true }
        },
        _count: {
          select: { players: true }
        }
      },
      orderBy: { prestige: "desc" }
    })

    return NextResponse.json(availableTeams)
  } catch (error) {
    return NextResponse.json({ error: "Nepavyko gauti komandų sąrašo" }, { status: 500 })
  }
}

// POST - Register new user and assign team
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, email, password, teamId } = body

    // Validation
    const validation = registerSchema.safeParse({ username, email, password })
    if (!validation.success) {
      return NextResponse.json(
        { error: "Neteisingi duomenys", details: validation.error.issues },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json({ error: "Vartotojo vardas užimtas" }, { status: 400 })
      }
      return NextResponse.json({ error: "El. paštas užimtas" }, { status: 400 })
    }

    // Check if team is available
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId }
      })

      if (!team) {
        return NextResponse.json({ error: "Komanda nerasta" }, { status: 404 })
      }

      if (team.userId) {
        return NextResponse.json({ error: "Komanda jau užimta" }, { status: 400 })
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        ...(teamId ? { team: { connect: { id: teamId } } } : {}),
      },
      include: {
        team: true
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        teamId: user.team?.id
      }
    }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registracija nepavyko" }, { status: 500 })
  }
}
