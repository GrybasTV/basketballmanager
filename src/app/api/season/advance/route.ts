import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Constants for season progression
const AGE_INCREASE = 1
const FORM_RESET_CHANCE = 0.3 // 30% chance to reset form towards baseline
const FATIGUE_CARRYOVER = 0.2 // 20% of fatigue carries over

// POST - Advance to next season (Midnight Reset / No Offseason)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  // Only admin or system can advance season
  if (!session?.user) {
    return NextResponse.json({ error: "Neprisijungęs" }, { status: 401 })
  }

  try {
    // Get current season state
    const seasonState = await prisma.seasonState.findFirst()

    if (!seasonState) {
      return NextResponse.json({ error: "Sezono būklė nerasta" }, { status: 404 })
    }

    // Check if season is complete (all 44 match days played)
    if (seasonState.matchDay < 44) {
      return NextResponse.json({
        error: "Sezonas dar nebaigtas",
        currentMatchDay: seasonState.matchDay,
        requiredMatchDay: 44
      }, { status: 400 })
    }

    const currentSeason = seasonState.season
    const nextSeason = currentSeason + 1

    // Start transaction for season advance
    const result = await prisma.$transaction(async (tx) => {
      // 1. AGE UP all players
      const players = await tx.player.findMany()
      const ageUpdates = players.map(player => ({
        id: player.id,
        age: player.age + AGE_INCREASE
      }))

      for (const update of ageUpdates) {
        await tx.player.update({
          where: { id: update.id },
          data: { age: update.age }
        })
      }

      // 2. Update player form and rhythm
      for (const player of players) {
        // Reset fatigue partially (20% carries over)
        const newFatigueSeason = Math.floor(player.fatigueSeason * FATIGUE_CARRYOVER)

        // Reset form: 30% chance to move towards baseline (70), otherwise keep current
        let newForm = player.form
        if (Math.random() < FORM_RESET_CHANCE) {
          const diff = 70 - newForm
          newForm = newForm + Math.floor(diff * 0.5) // Move 50% towards baseline
        }

        // Reset rhythm partially
        const newRhythm = Math.min(99, Math.max(0, player.rhythm - 20))

        await tx.player.update({
          where: { id: player.id },
          data: {
            fatigueSeason: newFatigueSeason,
            form: newForm,
            rhythm: newRhythm,
            // Reset injury status for healthy/in rehab players
            ...(player.injuryStatus === "REHAB" && {
              injuryStatus: "HEALTHY"
            })
          }
        })
      }

      // 3. Activate new contracts (those with effectiveAtSeason == nextSeason)
      const pendingContracts = await tx.contract.findMany({
        where: { effectiveAtSeason: nextSeason },
        include: { player: true }
      })

      for (const contract of pendingContracts) {
        // Transfer player to new team
        await tx.player.update({
          where: { id: contract.playerId },
          data: { teamId: contract.teamId }
        })
      }

      // 4. Handle expiring contracts
      const expiringContracts = await tx.contract.findMany({
        where: { expiresAtSeason: currentSeason }
      })

      for (const contract of expiringContracts) {
        // Mark as expired by setting expiresAtSeason to 0
        await tx.contract.update({
          where: { id: contract.id },
          data: { expiresAtSeason: 0 }
        })

        // If this was a loan contract, return player to original team
        if (contract.isLoan) {
          // Find player's most recent non-loan contract or leave teamless
          const originalContract = await tx.contract.findFirst({
            where: {
              playerId: contract.playerId,
              isLoan: false,
              expiresAtSeason: { gt: 0 }
            },
            orderBy: { createdAt: "desc" }
          })

          if (originalContract) {
            await tx.player.update({
              where: { id: contract.playerId },
              data: { teamId: originalContract.teamId }
            })
          }
        }
      }

      // 5. Generate new matches for next season (44 match days)
      const leagues = await tx.league.findMany({
        include: { localTeams: true }
      })

      for (const league of leagues) {
        const teams = league.localTeams
        if (teams.length < 2) continue

        // Round-robin schedule (simplified - home and away)
        const matches = []
        const teamsPerMatchday = Math.min(teams.length, 10) // Max 10 games per day

        for (let matchDay = 1; matchDay <= 44; matchDay++) {
          // Shuffle teams for each match day
          const shuffled = [...teams].sort(() => Math.random() - 0.5)

          for (let i = 0; i < shuffled.length - 1; i += 2) {
            if (i + 1 < shuffled.length) {
              matches.push({
                leagueId: league.id,
                homeTeamId: shuffled[i].id,
                awayTeamId: shuffled[i + 1].id,
                matchDay,
                isPlayed: false,
                isPlayoff: false
              })
            }
          }
        }

        await tx.match.createMany({
          data: matches
        })
      }

      // 6. Reset season state
      const newSeasonState = await tx.seasonState.update({
        where: { id: seasonState.id },
        data: {
          season: nextSeason,
          matchDay: 1,
          phase: "REGULAR_SEASON"
        }
      })

      return {
        newSeason: nextSeason,
        playersUpdated: players.length,
        contractsActivated: pendingContracts.length,
        contractsExpired: expiringContracts.length
      }
    })

    return NextResponse.json({
      success: true,
      message: `Sezonas ${currentSeason} baigtas. Pradedamas sezonas ${nextSeason}`,
      ...result
    })
  } catch (error) {
    console.error("Season advance error:", error)
    return NextResponse.json({ error: "Nepavyko pereiti į kitą sezoną" }, { status: 500 })
  }
}

// GET - Get current season state and time until reset
export async function GET() {
  try {
    const seasonState = await prisma.seasonState.findFirst()

    if (!seasonState) {
      return NextResponse.json({ error: "Sezono būklė nerasta" }, { status: 404 })
    }

    // Calculate matches remaining
    const remainingMatches = await prisma.match.count({
      where: {
        isPlayed: false,
        matchDay: { lte: seasonState.matchDay }
      }
    })

    // Estimate days until season end (1 day per match day)
    const daysUntilEnd = 44 - seasonState.matchDay + remainingMatches

    return NextResponse.json({
      season: seasonState.season,
      matchDay: seasonState.matchDay,
      phase: seasonState.phase,
      matchesRemaining: remainingMatches,
      daysUntilEnd: daysUntilEnd > 0 ? daysUntilEnd : 0,
      canAdvance: seasonState.matchDay >= 44 && remainingMatches === 0
    })
  } catch (error) {
    console.error("Season state error:", error)
    return NextResponse.json({ error: "Nepavyko gauti sezono būklę" }, { status: 500 })
  }
}
