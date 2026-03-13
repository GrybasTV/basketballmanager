export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch player statistics with achievements
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const playerId = searchParams.get("playerId")
  const season = searchParams.get("season")

  try {
    // If playerId specified, get detailed stats
    if (playerId) {
      const player = await prisma.player.findUnique({
        where: { id: playerId },
        include: {
          team: { select: { name: true, city: true } },
          birthCountry: true,
          stats: {
            where: season ? { season: parseInt(season) } : undefined,
            orderBy: { season: "desc" }
          },
          matchStats: {
            take: 10,
            orderBy: { match: { playedAt: "desc" } },
            include: {
              match: {
                select: {
                  homeScore: true,
                  awayScore: true,
                  homeTeam: { select: { name: true } },
                  awayTeam: { select: { name: true } }
                }
              }
            }
          }
        }
      })

      if (!player) {
        return NextResponse.json({ error: "Žaidėjas nerastas" }, { status: 404 })
      }

      // Calculate career totals
      const careerStats = await prisma.playerStats.groupBy({
        by: ["playerId"],
        where: { playerId },
        _sum: {
          points: true,
          rebounds: true,
          assists: true,
          steals: true,
          blocks: true,
          gamesPlayed: true,
          minutes: true
        }
      })

      // Find achievements (records, milestones)
      const achievements = []

      if (player.stats.length > 0) {
        const latest = player.stats[0]

        // Scoring milestones
        if (latest.points >= 20) achievements.push({ id: "ppg20", name: "20+ PPG", icon: "🏀", color: "gold" })
        if (latest.points >= 30) achievements.push({ id: "ppg30", name: "30+ PPG", icon: "🔥", color: "purple" })

        // Double-double
        if ((latest.points >= 10 && latest.rebounds >= 10) ||
            (latest.points >= 10 && latest.assists >= 10) ||
            (latest.rebounds >= 10 && latest.assists >= 10)) {
          achievements.push({ id: "double", name: "Double-Double", icon: "📊", color: "blue" })
        }

        // Triple-double (rare)
        if (latest.points >= 10 && latest.rebounds >= 10 && latest.assists >= 10) {
          achievements.push({ id: "triple", name: "Triple-Double", icon: "👑", color: "yellow" })
        }

        // Defensive achievements
        if (latest.steals >= 2) achievements.push({ id: "thief", name: "Vagis", icon: "🦊", color: "gray" })
        if (latest.blocks >= 2) achievements.push({ id: "blocker", name: "Blokuotojas", icon: "🧱", color: "red" })
      }

      return NextResponse.json({
        player,
        careerStats: careerStats[0]?._sum,
        achievements
      })
    }

    // Get all team players with their stats
    const team = await prisma.team.findUnique({
      where: { id: session.user.teamId },
      include: {
        players: {
          include: {
            stats: {
              where: season ? { season: parseInt(season) } : undefined,
              orderBy: { season: "desc" },
              take: 1
            }
          },
          orderBy: { ovr: "desc" }
        }
      }
    })

    if (!team) {
      return NextResponse.json({ error: "Komanda nerasta" }, { status: 404 })
    }

    return NextResponse.json({ players: team.players })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: "Nepavyko gauti statistikos" }, { status: 500 })
  }
}
