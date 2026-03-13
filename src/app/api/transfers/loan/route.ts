export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Constants
const LOAN_DURATION_SEASONS = 1 // Loan lasts 1 season
const MIN_LOAN_MINUTES = 500 // Minimum guaranteed minutes for loan
const MAX_LOAN_MINUTES = 1500 // Maximum guaranteed minutes

// GET - Get available players for loan
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const position = searchParams.get("position")

    // Get players from other teams (available for loan)
    const availablePlayers = await prisma.player.findMany({
      where: {
        teamId: { not: session.user.teamId },
        age: { gte: 18, lte: 26 }, // Young players preferred for loans
        ovr: { gte: 60, lte: 80 }, // Mid-range players
        ...(position && { position }),
        // Exclude players already on loan
        contracts: {
          some: {
            isLoan: false,
            expiresAtSeason: { gt: 0 }
          }
        }
      },
      include: {
        team: {
          select: { id: true, name: true, city: true }
        },
        birthCountry: true,
        contracts: {
          where: { isLoan: false },
          orderBy: { expiresAtSeason: "desc" },
          take: 1
        }
      },
      take: 50,
      orderBy: { ovr: "desc" }
    })

    // Get team's current loaned players
    const loanedPlayers = await prisma.contract.findMany({
      where: {
        teamId: session.user.teamId,
        isLoan: true,
        expiresAtSeason: { gt: 0 }
      },
      include: {
        player: {
          include: {
            birthCountry: true,
            team: {
              select: { id: true, name: true, city: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      available: availablePlayers.map(p => ({
        ...p,
        currentWage: p.contracts[0]?.weeklyWage || 0,
        contractExpires: p.contracts[0]?.expiresAtSeason || null,
        originalTeam: p.team
      })),
      loaned: loanedPlayers
    })
  } catch (error) {
    console.error("Loan market error:", error)
    return NextResponse.json({ error: "Nepavyko gauti nuomos rinkos" }, { status: 500 })
  }
}

// POST - Offer loan contract to a player
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  try {
    const { playerId, wageOffered, minutesGuaranteed, roleOffered } = await req.json() as any

    // Validate inputs
    if (!playerId || !wageOffered || !minutesGuaranteed) {
      return NextResponse.json({ error: "Trūksta duomenų" }, { status: 400 })
    }

    if (minutesGuaranteed < MIN_LOAN_MINUTES || minutesGuaranteed > MAX_LOAN_MINUTES) {
      return NextResponse.json({
        error: `Minučių garantija turi būti tarp ${MIN_LOAN_MINUTES} ir ${MAX_LOAN_MINUTES}`
      }, { status: 400 })
    }

    // Check team's roster space
    const team = await prisma.team.findUnique({
      where: { id: session.user.teamId },
      include: { players: true }
    })

    if (!team || team.players.length >= 15) {
      return NextResponse.json({ error: "Sudėtis pilna (15/15)" }, { status: 400 })
    }

    // Get player and current contract
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        contracts: {
          where: { isLoan: false },
          orderBy: { expiresAtSeason: "desc" },
          take: 1
        }
      }
    })

    if (!player) {
      return NextResponse.json({ error: "Žaidėjas nerastas" }, { status: 404 })
    }

    // Check if player already has a loan offer
    const existingLoan = await prisma.contract.findFirst({
      where: {
        playerId,
        isLoan: true,
        expiresAtSeason: { gt: 0 }
      }
    })

    if (existingLoan) {
      return NextResponse.json({ error: "Žaidėjas jau yra nuomojamas" }, { status: 400 })
    }

    // Get current season to determine when contract starts
    const seasonState = await prisma.seasonState.findFirst()
    const currentSeason = seasonState?.season || 1
    const nextSeason = currentSeason + 1

    // Create loan contract (starts next season)
    await prisma.contract.create({
      data: {
        playerId,
        teamId: session.user.teamId,
        weeklyWage: wageOffered,
        expiresAtSeason: nextSeason,
        effectiveAtSeason: nextSeason,
        isLoan: true,
        loanMinGuarantee: minutesGuaranteed,
        isRenewable: false // Loans typically not auto-renewed
      }
    })

    return NextResponse.json({
      success: true,
      message: `Nuomos pasiūlymas išsiųstas. Žaidėjas prisijungs prie ${nextSeason} sezono.`,
      playerId,
      teamId: session.user.teamId
    })
  } catch (error) {
    console.error("Loan offer error:", error)
    return NextResponse.json({ error: "Nepavyko siųsti pasiūlymo" }, { status: 500 })
  }
}

// DELETE - Cancel loan offer
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const contractId = searchParams.get("id")

  if (!contractId) {
    return NextResponse.json({ error: "Nenurodyta sutartis" }, { status: 400 })
  }

  try {
    // Verify contract belongs to user's team
    const contract = await prisma.contract.findUnique({
      where: { id: contractId }
    })

    if (!contract || contract.teamId !== session.user.teamId) {
      return NextResponse.json({ error: "Sutartis nerasta" }, { status: 404 })
    }

    // Only allow canceling if not yet active
    const seasonState = await prisma.seasonState.findFirst()
    if (contract.effectiveAtSeason <= (seasonState?.season || 1)) {
      return NextResponse.json({ error: "Negalima atšaukti aktyvios sutarties" }, { status: 400 })
    }

    await prisma.contract.delete({
      where: { id: contractId }
    })

    return NextResponse.json({
      success: true,
      message: "Nuomos pasiūlymas atšauktas"
    })
  } catch (error) {
    console.error("Loan cancel error:", error)
    return NextResponse.json({ error: "Nepavyko atšaukti" }, { status: 500 })
  }
}
