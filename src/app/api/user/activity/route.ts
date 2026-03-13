export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Constants
const VACATION_MAX_DAYS = 21
const AI_TAKEOVER_DAYS = 14
const INACTIVITY_WARNING_DAYS = 7

// GET - Check user activity status
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Neprisijungęs" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        team: {
          include: {
            players: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Vartotojas nerastas" }, { status: 404 })
    }

    const now = new Date()
    const lastLogin = user.lastLoginAt || user.createdAt
    const daysSinceLogin = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))

    // Check vacation mode
    const isInVacation = user.vacationModeEnd !== null && user.vacationModeEnd > now
    const vacationDaysRemaining = user.vacationModeEnd
      ? Math.ceil((user.vacationModeEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0

    // Check AI takeover status
    const isAiTakeover = daysSinceLogin >= AI_TAKEOVER_DAYS && !isInVacation
    const teamIsAiControlled = user.team?.isAiControlled || false

    // Warnings
    const warnings = []
    if (daysSinceLogin >= INACTIVITY_WARNING_DAYS && !isInVacation) {
      warnings.push({
        type: "INACTIVITY",
        message: `Jūs neprisijungę jau ${daysSinceLogin} dienų. Po ${AI_TAKEOVER_DAYS} dienų AI perims komandą.`,
        severity: daysSinceLogin >= AI_TAKEOVER_DAYS - 3 ? "high" : "medium"
      })
    }

    if (user.team) {
      // Check for roster issues
      const playerCount = user.team.players.length
      if (playerCount < 10) {
        warnings.push({
          type: "ROSTER",
          message: `Komandos sudėtis: ${playerCount}/12. Reikalinga papildyti!`,
          severity: playerCount < 8 ? "high" : "medium"
        })
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        lastLoginAt: user.lastLoginAt,
        daysSinceLogin
      },
      vacation: {
        isInVacation,
        endDate: user.vacationModeEnd,
        daysRemaining: vacationDaysRemaining,
        maxDays: VACATION_MAX_DAYS
      },
      aiTakeover: {
        isTriggered: isAiTakeover,
        teamControlled: teamIsAiControlled,
        daysUntilTakeover: Math.max(0, AI_TAKEOVER_DAYS - daysSinceLogin)
      },
      team: user.team ? {
        id: user.team.id,
        name: user.team.name,
        isAiControlled: user.team.isAiControlled,
        playerCount: user.team.players.length
      } : null,
      warnings
    })
  } catch (error) {
    console.error("Activity check error:", error)
    return NextResponse.json({ error: "Nepavyko patikrinti aktyvumo" }, { status: 500 })
  }
}

// POST - Set vacation mode
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Neprisijungęs" }, { status: 401 })
  }

  try {
    const { action, days } = await req.json() as any

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { team: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Vartotojas nerastas" }, { status: 404 })
    }

    if (action === "start_vacation") {
      const vacationDays = Math.min(Math.max(1, days || 7), VACATION_MAX_DAYS)
      const vacationEnd = new Date()
      vacationEnd.setDate(vacationEnd.getDate() + vacationDays)

      await prisma.user.update({
        where: { id: user.id },
        data: {
          vacationModeEnd: vacationEnd,
          lastLoginAt: new Date()
        }
      })

      // Enable AI control for team during vacation
      if (user.team) {
        await prisma.team.update({
          where: { id: user.team.id },
          data: { isAiControlled: true }
        })
      }

      return NextResponse.json({
        success: true,
        message: `Atostojų režimas aktyvuotas ${vacationDays} dienų. AI perims komandos valdymą.`,
        vacationEnd
      })
    }

    if (action === "end_vacation") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          vacationModeEnd: null,
          lastLoginAt: new Date()
        }
      })

      // Disable AI control when returning
      if (user.team) {
        await prisma.team.update({
          where: { id: user.team.id },
          data: { isAiControlled: false }
        })
      }

      return NextResponse.json({
        success: true,
        message: "Atostojų režimas baigtas. Grąžinote komandos valdymą."
      })
    }

    if (action === "extend_vacation") {
      if (!user.vacationModeEnd) {
        return NextResponse.json({ error: "Nėra aktyvaus atostojų režimo" }, { status: 400 })
      }

      const additionalDays = Math.min(Math.max(1, days || 7), VACATION_MAX_DAYS)
      const currentEnd = new Date(user.vacationModeEnd)
      const maxEnd = new Date()
      maxEnd.setDate(maxEnd.getDate() + VACATION_MAX_DAYS)

      // Calculate new end date
      const newEnd = new Date(Math.max(currentEnd.getTime(), new Date().getTime()))
      newEnd.setDate(newEnd.getDate() + additionalDays)

      // Don't exceed max
      const finalEnd = newEnd > maxEnd ? maxEnd : newEnd

      await prisma.user.update({
        where: { id: user.id },
        data: { vacationModeEnd: finalEnd }
      })

      const daysRemaining = Math.ceil((finalEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

      return NextResponse.json({
        success: true,
        message: `Atostojos pratęstos. Liko ${daysRemaining} dienų.`,
        vacationEnd: finalEnd
      })
    }

    return NextResponse.json({ error: "Nežinomas veiksmas" }, { status: 400 })
  } catch (error) {
    console.error("Vacation mode error:", error)
    return NextResponse.json({ error: "Nepavyko atlikti veiksmo" }, { status: 500 })
  }
}

// DELETE - Force disable AI takeover (return from inactivity)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Neprisijungęs" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { team: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Vartotojas nerastas" }, { status: 404 })
    }

    // Reset vacation mode and last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        vacationModeEnd: null,
        lastLoginAt: new Date()
      }
    })

    // Return team control to user
    if (user.team) {
      await prisma.team.update({
        where: { id: user.team.id },
        data: { isAiControlled: false }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Komanda grąžinta jums. Sėkmingų rungtynių!"
    })
  } catch (error) {
    console.error("Return from inactivity error:", error)
    return NextResponse.json({ error: "Nepavyko grąžinti komandos" }, { status: 500 })
  }
}
