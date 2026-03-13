import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST - Accept an offer and sign the player
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  try {
    const { offerId } = await req.json()

    if (!offerId) {
      return NextResponse.json({ error: "Nenurodytas pasiūlymas" }, { status: 400 })
    }

    // Get offer
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        agent: true
      }
    })

    if (!offer || offer.teamId !== session.user.teamId) {
      return NextResponse.json({ error: "Pasiūlymas nerastas" }, { status: 404 })
    }

    // Get player separately
    const player = await prisma.player.findUnique({
      where: { id: offer.playerId },
      include: { contracts: true }
    })

    if (!player) {
      return NextResponse.json({ error: "Žaidėjas nerastas" }, { status: 404 })
    }

    if (offer.status !== "ACCEPTED") {
      return NextResponse.json({ error: "Pasiūlymas dar nepriimtas" }, { status: 400 })
    }

    // Check roster space
    const team = await prisma.team.findUnique({
      where: { id: session.user.teamId },
      include: { players: true }
    })

    if (!team || team.players.length >= 15) {
      return NextResponse.json({ error: "Sudėtis pilna (15/15)" }, { status: 400 })
    }

    // Check if team can afford wages
    if (team.wageBudget < offer.wageOffered * 44) {
      return NextResponse.json({ error: "Neužtenka biudžeto algoms" }, { status: 400 })
    }

    // End player's current contract
    await prisma.contract.updateMany({
      where: {
        playerId: player.id,
        effectiveAtSeason: { lte: 1 }
      },
      data: {
        expiresAtSeason: 0 // Mark as expired
      }
    })

    // Create new contract
    await prisma.contract.create({
      data: {
        playerId: player.id,
        teamId: session.user.teamId,
        weeklyWage: offer.wageOffered,
        expiresAtSeason: 2, // 1 season contract
        effectiveAtSeason: 1,
        isRenewable: true
      }
    })

    // Transfer player to new team
    await prisma.player.update({
      where: { id: player.id },
      data: {
        teamId: session.user.teamId,
        // Update morale based on role
        morale: offer.roleOffered === "STAR" ? 90 : offer.roleOffered === "STARTER" ? 80 : 70
      }
    })

    // Update offer status
    await prisma.offer.update({
      where: { id: offerId },
      data: { status: "COMPLETED" }
    })

    // Delete other pending offers for this player
    await prisma.offer.deleteMany({
      where: {
        playerId: player.id,
        status: "PENDING"
      }
    })

    return NextResponse.json({
      success: true,
      message: `Žaidėjas ${player.firstName} ${player.lastName} pasirašė sutartį!`
    })
  } catch (error) {
    console.error("Transfer accept error:", error)
    return NextResponse.json({ error: "Nepavyko užbaigti transfero" }, { status: 500 })
  }
}
