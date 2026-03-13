import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch team roster with all available players
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
        localLeague: true
      }
    })

    if (!team) {
      return NextResponse.json({ error: "Komanda nerasta" }, { status: 404 })
    }

    // Get all players in local league (for trade/transfer consideration)
    const localLeaguePlayers = await prisma.player.findMany({
      where: {
        team: {
          localLeagueId: team.localLeagueId
        }
      },
      include: {
        team: {
          select: { id: true, name: true, city: true }
        }
      },
      orderBy: { ovr: "desc" }
    })

    // Count local players (from local league)
    const localPlayerCount = team.players.filter(p =>
      p.teamId === team.id || localLeaguePlayers.some(lp => lp.id === p.id)
    ).length

    return NextResponse.json({
      team,
      localPlayerCount,
      localLeaguePlayers: localLeaguePlayers.filter(p => p.teamId !== team.id)
    })
  } catch (error) {
    console.error("Roster fetch error:", error)
    return NextResponse.json({ error: "Nepavyko gauti sudėties" }, { status: 500 })
  }
}

// PUT - Update roster (set active players, set bench, etc.)
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  try {
    const { activePlayerIds, benchPlayerIds } = await req.json() as any

    const team = await prisma.team.findUnique({
      where: { id: session.user.teamId },
      include: {
        players: true,
        localLeague: true
      }
    })

    if (!team) {
      return NextResponse.json({ error: "Komanda nerasta" }, { status: 404 })
    }

    // Validate total players (max 15)
    const allPlayerIds = [...(activePlayerIds || []), ...(benchPlayerIds || [])]
    if (allPlayerIds.length > 15) {
      return NextResponse.json({ error: "Maksimalus žaidėjų skaičius - 15" }, { status: 400 })
    }

    // Validate local players (max 6 in local leagues)
    // Local players are those from local league countries
    const localPlayers = await prisma.player.findMany({
      where: {
        id: { in: allPlayerIds },
        birthCountry: {
          code: { in: ["LT", "LV", "EE", "PL"] } // Baltics + nearby
        }
      }
    })

    if (team.localLeague.type === "LOCAL_I" || team.localLeague.type === "LOCAL_II") {
      if (localPlayers.length > 6) {
        return NextResponse.json({
          error: `Vietinių žaidėjų limitas: 6/12. Dabartinis: ${localPlayers.length}/${allPlayerIds.length}`
        }, { status: 400 })
      }
    }

    // Validate all players belong to team
    const teamPlayerIds = team.players.map(p => p.id)
    const invalidPlayers = allPlayerIds.filter((id: string) => !teamPlayerIds.includes(id))

    if (invalidPlayers.length > 0) {
      return NextResponse.json({ error: "Kai kurie žaidėjai nepriklauso jūsų komandai" }, { status: 400 })
    }

    // Here you would update player positions/roles
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: "Sudėtis atnaujinta",
      activeCount: activePlayerIds?.length || 0,
      benchCount: benchPlayerIds?.length || 0
    })
  } catch (error) {
    console.error("Roster update error:", error)
    return NextResponse.json({ error: "Nepavyko atnaujinti sudėties" }, { status: 500 })
  }
}
