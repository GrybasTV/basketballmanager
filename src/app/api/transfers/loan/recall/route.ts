export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST - Recall a player from loan (for team that owns the player)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  try {
    const { playerId } = await req.json() as any

    if (!playerId) {
      return NextResponse.json({ error: "Nenurodytas žaidėjas" }, { status: 400 })
    }

    // Find the player's current loan contract
    const loanContract = await prisma.contract.findFirst({
      where: {
        playerId,
        isLoan: true,
        expiresAtSeason: { gt: 0 } // Still active
      },
      include: {
        player: {
          include: {
            contracts: {
              where: { isLoan: false },
              orderBy: { createdAt: "desc" },
              take: 1
            }
          }
        }
      }
    })

    if (!loanContract) {
      return NextResponse.json({ error: "Žaidėjas nėra nuomojamas" }, { status: 404 })
    }

    // Find the original/owning contract (non-loan)
    const owningContract = loanContract.player.contracts[0]

    if (!owningContract) {
      return NextResponse.json({ error: "Negalima rasti pradinės sutarties" }, { status: 404 })
    }

    // Verify the user's team owns the player (not the loaning team)
    if (owningContract.teamId !== session.user.teamId) {
      return NextResponse.json({ error: "Jūs neturite teisės grąžinti šį žaidėją" }, { status: 403 })
    }

    // Check loan minutes guarantee
    const currentSeason = await prisma.seasonState.findFirst()
    const season = currentSeason?.season || 1

    // Get player's stats this season
    const playerStats = await prisma.matchPlayerStats.aggregate({
      where: {
        playerId,
        match: { matchDay: { lte: 44 } }
      },
      _sum: { minutes: true }
    })

    const minutesPlayed = playerStats._sum.minutes || 0

    // If minutes guarantee not met, calculate penalty
    let penalty = 0
    if (minutesPlayed < (loanContract.loanMinGuarantee || 0)) {
      const missingMinutes = (loanContract.loanMinGuarantee || 0) - minutesPlayed
      penalty = Math.ceil((missingMinutes / 100) * loanContract.weeklyWage) // Penalty based on wage
    }

    // Recall the player
    await prisma.$transaction([
      // End the loan contract
      prisma.contract.update({
        where: { id: loanContract.id },
        data: { expiresAtSeason: season } // End loan now
      }),
      // Transfer player back to owning team
      prisma.player.update({
        where: { id: playerId },
        data: { teamId: owningContract.teamId }
      }),
      // If penalty, deduct from owning team's budget
      ...(penalty > 0 ? [
        prisma.team.update({
          where: { id: owningContract.teamId },
          data: {
            transferBudget: { decrement: penalty }
          }
        })
      ] : [])
    ])

    return NextResponse.json({
      success: true,
      message: penalty > 0
        ? `Žaidėjas grąžintas. Nuomininkas turi sumokėti ${penalty}$ už neįvykdytas minutes.`
        : "Žaidėjas sėkmingai grąžintas.",
      penalty,
      minutesPlayed,
      guaranteed: loanContract.loanMinGuarantee
    })
  } catch (error) {
    console.error("Loan recall error:", error)
    return NextResponse.json({ error: "Nepavyko grąžinti žaidėjo" }, { status: 500 })
  }
}

// GET - Get recallable players (for owning team)
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  try {
    // Find all players owned by user's team that are currently loaned out
    const loanedPlayers = await prisma.contract.findMany({
      where: {
        teamId: session.user.teamId,
        isLoan: false,
        expiresAtSeason: { gt: 0 } // Still active
      },
      include: {
        player: {
          include: {
            contracts: {
              where: {
                isLoan: true,
                expiresAtSeason: { gt: 0 }
              }
            },
            team: {
              select: { id: true, name: true, city: true }
            }
          }
        }
      }
    })

    // Filter to only those who have active loan contracts to other teams
    const recallable = loanedPlayers
      .filter(c => c.player.contracts.length > 0)
      .map(c => ({
        id: c.player.id,
        firstName: c.player.firstName,
        lastName: c.player.lastName,
        position: c.player.position,
        age: c.player.age,
        ovr: c.player.ovr,
        loanTeam: c.player.team, // This is actually the loaning team
        loanContract: c.player.contracts[0]
      }))

    return NextResponse.json({ recallable })
  } catch (error) {
    console.error("Recallable players error:", error)
    return NextResponse.json({ error: "Nepavyko gauti sąrašo" }, { status: 500 })
  }
}
