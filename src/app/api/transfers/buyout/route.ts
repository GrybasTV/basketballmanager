import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Constants for Freedom Tax calculation
const FREEDOM_TAX_BASE = 0.5 // 50% base tax
const FREEDOM_TAX_MULTIPLIER = 0.1 // Additional 10% per remaining season
const MIN_BUYOUT = 10000 // Minimum buyout amount

interface BuyoutCalculation {
  playerId: string
  playerName: string
  currentWage: number
  remainingSeasons: number
  remainingValue: number
  freedomTax: number
  totalBuyout: number
  canAfford: boolean
  teamBudget: number
}

// GET - Calculate buyout cost for a specific player
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const playerId = searchParams.get("playerId")
  const contractId = searchParams.get("contractId")
  const listAll = searchParams.get("list") === "true"

  // If listAll=true, return all buyout-eligible contracts
  if (listAll) {
    try {
      const seasonState = await prisma.seasonState.findFirst()
      const currentSeason = seasonState?.season || 1

      const contracts = await prisma.contract.findMany({
        where: {
          teamId: session.user.teamId,
          expiresAtSeason: { gt: currentSeason },
          isLoan: false
        },
        include: {
          player: true
        }
      })

      const buyoutEligible = contracts.map((contract) => {
        const remainingSeasons = contract.expiresAtSeason - currentSeason
        const remainingValue = contract.weeklyWage * 44 * remainingSeasons
        const freedomTax = Math.round(
          remainingValue * FREEDOM_TAX_BASE +
          (remainingValue * remainingSeasons * FREEDOM_TAX_MULTIPLIER)
        )
        const totalBuyout = Math.max(MIN_BUYOUT, freedomTax)

        return {
          contractId: contract.id,
          player: {
            id: contract.player.id,
            firstName: contract.player.firstName,
            lastName: contract.player.lastName,
            position: contract.player.position,
            ovr: contract.player.ovr
          },
          weeklyWage: contract.weeklyWage,
          remainingSeasons,
          expiresAtSeason: contract.expiresAtSeason,
          buyoutAmount: totalBuyout
        }
      })

      return NextResponse.json({ contracts: buyoutEligible })
    } catch (error) {
      console.error("Buyout list error:", error)
      return NextResponse.json({ error: "Nepavyko gauti sąrašo" }, { status: 500 })
    }
  }

  // Otherwise, calculate buyout for specific player/contract
  if (!playerId && !contractId) {
    return NextResponse.json({ error: "Nurodykite žaidėją ar sutartį" }, { status: 400 })
  }

  try {
    // Get team budget
    const team = await prisma.team.findUnique({
      where: { id: session.user.teamId }
    })

    if (!team) {
      return NextResponse.json({ error: "Komanda nerasta" }, { status: 404 })
    }

    // Get contract
    let contract
    if (contractId) {
      contract = await prisma.contract.findUnique({
        where: { id: contractId },
        include: { player: true }
      })
    } else {
      contract = await prisma.contract.findFirst({
        where: {
          playerId: playerId!,
          expiresAtSeason: { gt: 0 },
          isLoan: false
        },
        include: { player: true }
      })
    }

    if (!contract) {
      return NextResponse.json({ error: "Sutartis nerasta" }, { status: 404 })
    }

    // Get current season
    const seasonState = await prisma.seasonState.findFirst()
    const currentSeason = seasonState?.season || 1

    // Calculate remaining seasons
    const remainingSeasons = Math.max(0, contract.expiresAtSeason - currentSeason)

    // Calculate Freedom Tax
    // Formula: (weeklyWage * 44 * remainingSeasons * baseTax) + (extraTax per season)
    const remainingContractValue = contract.weeklyWage * 44 * remainingSeasons
    const freedomTax = Math.round(
      remainingContractValue * FREEDOM_TAX_BASE +
      (remainingContractValue * remainingSeasons * FREEDOM_TAX_MULTIPLIER)
    )
    const totalBuyout = Math.max(MIN_BUYOUT, freedomTax)

    const calculation: BuyoutCalculation = {
      playerId: contract.player.id,
      playerName: `${contract.player.firstName} ${contract.player.lastName}`,
      currentWage: contract.weeklyWage,
      remainingSeasons,
      remainingValue: remainingContractValue,
      freedomTax,
      totalBuyout,
      canAfford: team.transferBudget >= totalBuyout,
      teamBudget: team.transferBudget
    }

    return NextResponse.json(calculation)
  } catch (error) {
    console.error("Buyout calculation error:", error)
    return NextResponse.json({ error: "Nepavyko suskaičiuoti" }, { status: 500 })
  }
}

// POST - Execute buyout (release player from contract)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  try {
    const { playerId, contractId } = await req.json() as any

    if (!playerId && !contractId) {
      return NextResponse.json({ error: "Nurodykite žaidėją ar sutartį" }, { status: 400 })
    }

    // Get contract and verify ownership
    let contract
    if (contractId) {
      contract = await prisma.contract.findFirst({
        where: {
          id: contractId,
          teamId: session.user.teamId // Must be team's contract
        },
        include: { player: true }
      })
    } else {
      contract = await prisma.contract.findFirst({
        where: {
          playerId,
          teamId: session.user.teamId,
          expiresAtSeason: { gt: 0 },
          isLoan: false
        },
        include: { player: true }
      })
    }

    if (!contract) {
      return NextResponse.json({ error: "Sutartis nerasta arba nepriklauso jūsų komandai" }, { status: 404 })
    }

    // Get current season and calculate buyout
    const seasonState = await prisma.seasonState.findFirst()
    const currentSeason = seasonState?.season || 1
    const remainingSeasons = Math.max(0, contract.expiresAtSeason - currentSeason)
    const remainingContractValue = contract.weeklyWage * 44 * remainingSeasons
    const freedomTax = Math.round(
      remainingContractValue * FREEDOM_TAX_BASE +
      (remainingContractValue * remainingSeasons * FREEDOM_TAX_MULTIPLIER)
    )
    const totalBuyout = Math.max(MIN_BUYOUT, freedomTax)

    // Check if team can afford
    const team = await prisma.team.findUnique({
      where: { id: session.user.teamId }
    })

    if (!team || team.transferBudget < totalBuyout) {
      return NextResponse.json({
        error: "Nepakanka biudžeto",
        required: totalBuyout,
        available: team?.transferBudget || 0
      }, { status: 400 })
    }

    // Execute buyout
    await prisma.$transaction([
      // End the contract
      prisma.contract.update({
        where: { id: contract.id },
        data: { expiresAtSeason: currentSeason } // Contract ends now
      }),
      // Set player morale low (they were cut)
      prisma.player.update({
        where: { id: contract.playerId },
        data: { morale: 30 }
      }),
      // Deduct from budget
      prisma.team.update({
        where: { id: session.user.teamId },
        data: {
          transferBudget: { decrement: totalBuyout }
        }
      })
    ])

    return NextResponse.json({
      success: true,
      message: `${contract.player.firstName} ${contract.player.lastName} išpirktas už ${totalBuyout}$. Sutartis nutraukta, žaidėjo moražė nukrito.`,
      playerId: contract.playerId,
      buyoutAmount: totalBuyout,
      remainingBudget: team.transferBudget - totalBuyout
    })
  } catch (error) {
    console.error("Buyout execution error:", error)
    return NextResponse.json({ error: "Nepavyko įvykdyti išpirkos" }, { status: 500 })
  }
}
