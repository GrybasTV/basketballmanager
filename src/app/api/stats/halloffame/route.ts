import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch Hall of Fame (all-time leaders)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category") || "points"
  const limit = parseInt(searchParams.get("limit") || "50")

  const categoryMap: Record<string, any> = {
    points: { sum: { points: true }, orderBy: { _sum: { points: "desc" as const } } },
    rebounds: { sum: { rebounds: true }, orderBy: { _sum: { rebounds: "desc" as const } } },
    assists: { sum: { assists: true }, orderBy: { _sum: { assists: "desc" as const } } },
    steals: { sum: { steals: true }, orderBy: { _sum: { steals: "desc" as const } } },
    blocks: { sum: { blocks: true }, orderBy: { _sum: { blocks: "desc" as const } } },
  }

  const selected = categoryMap[category] || categoryMap.points

  try {
    const leaders = await prisma.playerStats.groupBy({
      by: ["playerId"],
      ...selected,
      where: { gamesPlayed: { gte: 10 } }, // Minimum games filter
      take: limit,
    })

    // Fetch player details
    const playerIds = leaders.map(l => l.playerId)
    const players = await prisma.player.findMany({
      where: { id: { in: playerIds } },
      include: {
        team: { select: { name: true, city: true } },
        birthCountry: true
      }
    })

    // Combine stats with player details
    const hallOfFame = leaders.map(leader => {
      const player = players.find(p => p.id === leader.playerId)!
      return {
        player,
        total: leader._sum,
      }
    })

    // Get season leaders (current season)
    const currentSeason = await prisma.playerStats.findMany({
      where: { season: 1 },
      orderBy: { points: "desc" },
      take: 10,
      include: {
        player: {
          include: {
            team: { select: { name: true, city: true } }
          }
        }
      }
    })

    return NextResponse.json({
      hallOfFame,
      seasonLeaders: currentSeason,
      categories: Object.keys(categoryMap)
    })
  } catch (error) {
    console.error("Hall of Fame fetch error:", error)
    return NextResponse.json({ error: "Nepavyko gauti duomenų" }, { status: 500 })
  }
}
