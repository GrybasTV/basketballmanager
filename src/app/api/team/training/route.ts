export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch training plans and team tactics
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id: session.user.teamId },
      include: {
        players: {
          orderBy: { ovr: "desc" }
        },
        coaches: true
      }
    })

    if (!team) {
      return NextResponse.json({ error: "Komanda nerasta" }, { status: 404 })
    }

    // Default tactics if not set
    const tactics = {
      offense: "BALANCED", // BALANCED, INSIDE_OUT, PERIMETER, FAST_BREAK
      defense: "MAN_TO_MAN", // MAN_TO_MAN, ZONE_2_3, ZONE_3_2, PRESS
      pace: "MODERATE", // SLOW, MODERATE, FAST
      rotationDepth: 8 // Number of players in rotation
    }

    return NextResponse.json({
      team,
      tactics,
      trainingPlans: team.players.map(p => ({
        playerId: p.id,
        focus: "BALANCED", // SHOOTING, DEFENSE, PLAYMAKING, REBOUNDING, PHYSICAL, BALANCED
        intensity: 50 // 0-100
      }))
    })
  } catch (error) {
    console.error("Training fetch error:", error)
    return NextResponse.json({ error: "Nepavyko gauti duomenų" }, { status: 500 })
  }
}

// PUT - Update training plans and tactics
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  try {
    const { tactics, trainingPlans } = await req.json() as any

    // Update team tactics (would store in separate table in full implementation)
    // Update training plans for players

    // Simulate training effect (would be a background job in production)
    return NextResponse.json({
      success: true,
      message: "Taktikos ir treniruotės atnaujintos"
    })
  } catch (error) {
    console.error("Training update error:", error)
    return NextResponse.json({ error: "Nepavyko atnaujinti" }, { status: 500 })
  }
}
