import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Economy constants
const SOFT_CAP = 800000 // $800,000
const LUXURY_TAX_RATE = 1.5 // 150% tax on amount over soft cap
const BAILOUT_LOAN_AMOUNT = 200000 // $200,000 loan
const BAILOUT_COOLDOWN_SEASONS = 3 // Can only use once every 3 seasons

// GET - Fetch team economy data
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
          include: {
            contracts: true
          }
        },
        coaches: true
      }
    })

    if (!team) {
      return NextResponse.json({ error: "Komanda nerasta" }, { status: 404 })
    }

    // Calculate weekly wages
    const weeklyWages = team.players.reduce((sum, player) => {
      const contract = player.contracts.find(c => c.teamId === team.id)
      return sum + (contract?.weeklyWage || 0)
    }, 0)

    const coachWages = team.coaches.reduce((sum, coach) => sum + coach.salary, 0)
    const totalWeeklyWages = weeklyWages + coachWages
    const annualWages = totalWeeklyWages * 44 // 44 games/weeks per season

    // Calculate Luxury Tax
    const isOverCap = annualWages > SOFT_CAP
    const overCapAmount = Math.max(0, annualWages - SOFT_CAP)
    const luxuryTax = Math.round(overCapAmount * LUXURY_TAX_RATE)

    // Calculate remaining budget
    const remainingBudget = team.transferBudget - (isOverCap ? luxuryTax : 0)

    // Simulate bailout loan status (would be stored in DB in full implementation)
    const bailoutAvailable = true // Simplified for now
    const bailoutCount = 0 // Number of times used

    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        transferBudget: team.transferBudget,
        wageBudget: team.wageBudget
      },
      finances: {
        softCap: SOFT_CAP,
        annualWages,
        weeklyWages: totalWeeklyWages,
        isOverCap,
        overCapAmount,
        luxuryTax,
        remainingBudget,
        projectedBudget: team.transferBudget - luxuryTax
      },
      payroll: {
        playerCount: team.players.length,
        weeklyWages,
        coachWages,
        totalWeeklyWages
      },
      bailout: {
        available: bailoutAvailable,
        amount: BAILOUT_LOAN_AMOUNT,
        cooldown: BAILOUT_COOLDOWN_SEASONS,
        usedCount: bailoutCount
      }
    })
  } catch (error) {
    console.error("Economy fetch error:", error)
    return NextResponse.json({ error: "Nepavyko gauti ekonomikos duomenų" }, { status: 500 })
  }
}

// POST - Request bailout loan
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  try {
    const { action } = await req.json()

    if (action === "bailout") {
      // Check if bailout is available
      const team = await prisma.team.findUnique({
        where: { id: session.user.teamId }
      })

      if (!team) {
        return NextResponse.json({ error: "Komanda nerasta" }, { status: 404 })
      }

      // In a full implementation, you'd check:
      // 1. Cooldown period (3 seasons since last use)
      // 2. Store bailout usage in a separate table
      // 3. Deduct from future budgets

      // Grant the loan
      const updatedTeam = await prisma.team.update({
        where: { id: session.user.teamId },
        data: {
          transferBudget: {
            increment: BAILOUT_LOAN_AMOUNT
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: `Gavote ${BAILOUT_LOAN_AMOUNT}$ paskolą! Ši suma bus atimta iš kito sezono biudžeto.`,
        newBudget: updatedTeam.transferBudget
      })
    }

    return NextResponse.json({ error: "Nežinomas veiksmas" }, { status: 400 })
  } catch (error) {
    console.error("Economy action error:", error)
    return NextResponse.json({ error: "Nepavyko atlikti veiksmo" }, { status: 500 })
  }
}
