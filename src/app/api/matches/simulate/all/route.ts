export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { simulateMatch } from "@/lib/matchEngine"

// POST - Simulate all pending matches for a match day
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  // Only admin or system can simulate matches (for now, allow any logged user)
  if (!session?.user) {
    return NextResponse.json({ error: "Neprisijungęs" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const matchDay = searchParams.get("matchDay")
  const leagueId = searchParams.get("leagueId")

  try {
    // Get season state
    const seasonState = await prisma.seasonState.findFirst()

    if (!seasonState) {
      return NextResponse.json({ error: "Sezono būklė nerasta" }, { status: 404 })
    }

    // Get pending matches
    const matches = await prisma.match.findMany({
      where: {
        isPlayed: false,
        ...(matchDay && { matchDay: parseInt(matchDay) }),
        ...(leagueId && { leagueId }),
        matchDay: { lte: seasonState.matchDay } // Only simulate current or past matches
      },
      include: {
        homeTeam: {
          include: { players: true }
        },
        awayTeam: {
          include: { players: true }
        }
      },
      take: 50 // Limit to 50 matches per request
    })

    if (matches.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Nėra rungtynių simuliuoti",
        results: []
      })
    }

    const results = []

    // Simulate each match
    for (const match of matches) {
      try {
        // Check for technical loss (rule violations)
        const shouldCheckViolation = Math.random() < 0.05 // 5% chance for demo

        if (shouldCheckViolation) {
          // Check roster requirements
          const homePlayerCount = match.homeTeam.players.length
          const awayPlayerCount = match.awayTeam.players.length

          // Technical loss for having < 10 players
          let homeTechLoss = false
          let awayTechLoss = false

          if (homePlayerCount < 10) homeTechLoss = true
          if (awayPlayerCount < 10) awayTechLoss = true

          if (homeTechLoss && !awayTechLoss) {
            await applyTechnicalLoss(match.id, "home")
            results.push({
              matchId: match.id,
              homeScore: 0,
              awayScore: 20,
              technicalLoss: true,
              reason: "Namų komandai per mažai žaidėjų"
            })
            continue
          } else if (awayTechLoss && !homeTechLoss) {
            await applyTechnicalLoss(match.id, "away")
            results.push({
              matchId: match.id,
              homeScore: 20,
              awayScore: 0,
              technicalLoss: true,
              reason: "Svečiams per mažai žaidėjų"
            })
            continue
          }
        }

        // Normal simulation
        const result = simulateMatch({
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          season: seasonState.season
        })

        // Save match result
        await prisma.match.update({
          where: { id: match.id },
          data: {
            homeScore: result.homeScore,
            awayScore: result.awayScore,
            isPlayed: true,
            playedAt: new Date()
          }
        })

        // Save player stats
        await prisma.matchPlayerStats.createMany({
          data: [
            ...result.homeStats.map(s => ({ ...s, matchId: match.id })),
            ...result.awayStats.map(s => ({ ...s, matchId: match.id }))
          ]
        })

        // Update player stats (season totals)
        await updateSeasonStats(result.homeStats, seasonState.season)
        await updateSeasonStats(result.awayStats, seasonState.season)

        results.push({
          matchId: match.id,
          homeScore: result.homeScore,
          awayScore: result.awayScore,
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name
        })

      } catch (error) {
        console.error(`Failed to simulate match ${match.id}:`, error)
        results.push({
          matchId: match.id,
          error: "Simuliacija nepavyko"
        })
      }
    }

    // Update season state if all matches for current day are played
    const pendingMatches = await prisma.match.count({
      where: {
        isPlayed: false,
        matchDay: seasonState.matchDay
      }
    })

    if (pendingMatches === 0 && seasonState.matchDay < 44) {
      await prisma.seasonState.update({
        where: { id: seasonState.id },
        data: { matchDay: seasonState.matchDay + 1 }
      })
    }

    return NextResponse.json({
      success: true,
      simulated: results.length,
      results
    })
  } catch (error) {
    console.error("Simulation error:", error)
    return NextResponse.json({ error: "Simuliacija nepavyko" }, { status: 500 })
  }
}

async function applyTechnicalLoss(matchId: string, losingSide: "home" | "away") {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: { include: { players: true } },
      awayTeam: { include: { players: true } }
    }
  })

  if (!match) return

  // Technical loss: 0-20
  const homeScore = losingSide === "home" ? 0 : 20
  const awayScore = losingSide === "away" ? 0 : 20

  await prisma.match.update({
    where: { id: matchId },
    data: {
      homeScore,
      awayScore,
      isPlayed: true,
      playedAt: new Date()
    }
  })

  // Create placeholder stats for winning team
  const winningTeam = losingSide === "home" ? match.awayTeam : match.homeTeam

  for (const player of winningTeam.players.slice(0, 10)) {
    await prisma.matchPlayerStats.create({
      data: {
        matchId,
        playerId: player.id,
        teamId: winningTeam.id,
        minutes: 20,
        points: Math.floor(Math.random() * 10) + 2,
        rebounds: Math.floor(Math.random() * 5) + 1,
        assists: Math.floor(Math.random() * 3),
        steals: Math.floor(Math.random() * 2),
        blocks: Math.floor(Math.random() * 2),
        turnovers: Math.floor(Math.random() * 3),
        fouls: Math.floor(Math.random() * 3),
        fgMade: Math.floor(Math.random() * 4) + 1,
        fgAttempted: Math.floor(Math.random() * 8) + 4,
        threePtMade: Math.floor(Math.random() * 2),
        threePtAtt: Math.floor(Math.random() * 4) + 1,
        ftMade: Math.floor(Math.random() * 3),
        ftAttempted: Math.floor(Math.random() * 4) + 1
      }
    })
  }
}

async function updateSeasonStats(matchStats: any[], season: number) {
  for (const stat of matchStats) {
    const existing = await prisma.playerStats.findUnique({
      where: {
        playerId_season: {
          playerId: stat.playerId,
          season
        }
      }
    })

    if (existing) {
      await prisma.playerStats.update({
        where: { id: existing.id },
        data: {
          gamesPlayed: existing.gamesPlayed + 1,
          gamesStarted: existing.gamesStarted + (stat.minutes >= 25 ? 1 : 0),
          minutes: existing.minutes + stat.minutes,
          points: existing.points + stat.points,
          rebounds: existing.rebounds + stat.rebounds,
          assists: existing.assists + stat.assists,
          steals: existing.steals + stat.steals,
          blocks: existing.blocks + stat.blocks,
          turnovers: existing.turnovers + stat.turnovers,
        }
      })
    } else {
      await prisma.playerStats.create({
        data: {
          playerId: stat.playerId,
          season,
          gamesPlayed: 1,
          gamesStarted: stat.minutes >= 25 ? 1 : 0,
          minutes: stat.minutes,
          points: stat.points,
          rebounds: stat.rebounds,
          assists: stat.assists,
          steals: stat.steals,
          blocks: stat.blocks,
          turnovers: stat.turnovers,
        }
      })
    }

    // Recalculate percentages from all match stats
    const allMatchStats = await prisma.matchPlayerStats.findMany({
      where: {
        playerId: stat.playerId,
        match: {
          matchDay: { lte: 44 } // All matches in season
        }
      }
    })

    const totalFgMade = allMatchStats.reduce((sum, s) => sum + s.fgMade, 0)
    const totalFgAttempted = allMatchStats.reduce((sum, s) => sum + s.fgAttempted, 0)
    const totalThreePtMade = allMatchStats.reduce((sum, s) => sum + s.threePtMade, 0)
    const totalThreePtAtt = allMatchStats.reduce((sum, s) => sum + s.threePtAtt, 0)
    const totalFtMade = allMatchStats.reduce((sum, s) => sum + s.ftMade, 0)
    const totalFtAttempted = allMatchStats.reduce((sum, s) => sum + s.ftAttempted, 0)

    await prisma.playerStats.update({
      where: {
        playerId_season: {
          playerId: stat.playerId,
          season
        }
      },
      data: {
        fgPercent: totalFgAttempted > 0 ? (totalFgMade / totalFgAttempted) * 100 : null,
        threePtPercent: totalThreePtAtt > 0 ? (totalThreePtMade / totalThreePtAtt) * 100 : null,
        ftPercent: totalFtAttempted > 0 ? (totalFtMade / totalFtAttempted) * 100 : null,
      }
    })
  }
}
