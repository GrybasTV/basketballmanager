import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Constants
const MAX_ROSTER_SIZE = 15
const OFFER_EXPIRY_HOURS = 48
const MAX_OFFERS_PER_TEAM = 5

// GET - Fetch transfer market and active offers
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const leagueId = searchParams.get("leagueId")

  try {
    const team = await prisma.team.findUnique({
      where: { id: session.user.teamId },
      include: {
        players: true
      }
    })

    if (!team) {
      return NextResponse.json({ error: "Komanda nerasta" }, { status: 404 })
    }

    // Count roster slots
    const rosterCount = team.players.length
    const availableSlots = MAX_ROSTER_SIZE - rosterCount

    // Get active offers for user's team
    const activeOffers = await prisma.offer.findMany({
      where: {
        teamId: session.user.teamId,
        status: "PENDING"
      },
      include: {
        agent: true
      },
      orderBy: { createdAt: "desc" }
    })

    // Get transfer market (players from other teams)
    const marketPlayers = await prisma.player.findMany({
      where: {
        teamId: { not: session.user.teamId },
        ...(leagueId && {
          team: {
            localLeagueId: leagueId
          }
        })
      },
      include: {
        team: {
          select: { id: true, name: true, city: true }
        },
        birthCountry: true,
        contracts: {
          where: { teamId: { not: session.user.teamId } },
          orderBy: { expiresAtSeason: "asc" }
        }
      },
      take: 50,
      orderBy: { ovr: "desc" }
    })

    // Calculate estimated transfer value
    const playersWithValues = marketPlayers.map(player => {
      const contract = player.contracts[0]
      const baseValue = (player.ovr * 10000) + (player.pot * 5000)
      const ageAdjustment = player.age < 24 ? 1.2 : player.age > 30 ? 0.7 : 1
      const estimatedValue = Math.round(baseValue * ageAdjustment)

      return {
        ...player,
        estimatedValue,
        currentWage: contract?.weeklyWage || 0,
        contractExpires: contract?.expiresAtSeason || null
      }
    })

    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        transferBudget: team.transferBudget,
        rosterCount,
        availableSlots,
        canOffer: availableSlots > 0 && activeOffers.length < MAX_OFFERS_PER_TEAM
      },
      marketPlayers: playersWithValues,
      activeOffers,
      limits: {
        maxRosterSize: MAX_ROSTER_SIZE,
        maxOffers: MAX_OFFERS_PER_TEAM
      }
    })
  } catch (error) {
    console.error("Transfer fetch error:", error)
    return NextResponse.json({ error: "Nepavyko gauti transferų duomenų" }, { status: 500 })
  }
}

// POST - Make an offer to a player
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  try {
    const { playerId, wageOffered, roleOffered, minutesOffered, offerCategory } = await req.json() as any

    // Validate inputs
    if (!playerId || !wageOffered || !roleOffered) {
      return NextResponse.json({ error: "Trūksta duomenų" }, { status: 400 })
    }

    const team = await prisma.team.findUnique({
      where: { id: session.user.teamId },
      include: { players: true }
    })

    if (!team) {
      return NextResponse.json({ error: "Komanda nerasta" }, { status: 404 })
    }

    // Check roster space (reserved slots)
    const rosterCount = team.players.length
    const pendingOffers = await prisma.offer.count({
      where: {
        teamId: session.user.teamId,
        status: "PENDING"
      }
    })

    if (rosterCount + pendingOffers >= MAX_ROSTER_SIZE) {
      return NextResponse.json({
        error: `Pasiektas sudėties limitas (${MAX_ROSTER_SIZE}). Atšaukite kitus pasiūlymus.`
      }, { status: 400 })
    }

    if (pendingOffers >= MAX_OFFERS_PER_TEAM) {
      return NextResponse.json({
        error: `Pasiektas pasiūlymų limitas (${MAX_OFFERS_PER_TEAM}).`
      }, { status: 400 })
    }

    // Check if player exists
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: { contracts: true }
    })

    if (!player) {
      return NextResponse.json({ error: "Žaidėjas nerastas" }, { status: 404 })
    }

    // Check if offer already exists
    const existingOffer = await prisma.offer.findFirst({
      where: {
        playerId,
        teamId: session.user.teamId,
        status: "PENDING"
      }
    })

    if (existingOffer) {
      return NextResponse.json({ error: "Jau siūlėte šiam žaidėjui" }, { status: 400 })
    }

    // Get or create agent for player
    let agent = await prisma.agent.findFirst({
      where: {
        offers: {
          some: { playerId }
        }
      }
    })

    if (!agent) {
      agent = await prisma.agent.create({
        data: {
          name: `Agent of ${player.firstName} ${player.lastName}`,
          greed: Math.floor(Math.random() * 40) + 40,
          reputation: Math.floor(Math.random() * 40) + 40,
          negotiation: Math.floor(Math.random() * 40) + 40
        }
      })
    }

    // Create the offer
    const offer = await prisma.offer.create({
      data: {
        playerId,
        teamId: session.user.teamId,
        agentId: agent.id,
        wageOffered,
        roleOffered,
        minutesOffered: minutesOffered || 20,
        offerCategory: offerCategory || "CURRENT_SEASON",
        status: "PENDING"
      },
      include: {
        agent: true
      }
    })

    // Simulate agent response (simplified)
    const currentWage = player.contracts[0]?.weeklyWage || 0
    const wageIncrease = (wageOffered - currentWage) / Math.max(1, currentWage)

    // Higher offer = better chance of acceptance
    // Agent greed affects this
    const acceptanceChance = Math.min(0.95,
      0.3 + (wageIncrease * 0.5) - (agent.greed / 200)
    )

    let offerStatus = "PENDING"
    if (Math.random() < acceptanceChance * 0.3) {
      // 30% chance of immediate acceptance for good offers
      offerStatus = "ACCEPTED"
    } else if (wageIncrease < 0.1) {
      // Lowball offers get rejected
      offerStatus = "REJECTED"
    }

    // Update offer status
    await prisma.offer.update({
      where: { id: offer.id },
      data: { status: offerStatus }
    })

    return NextResponse.json({
      success: true,
      offer: { ...offer, status: offerStatus },
      message: offerStatus === "ACCEPTED"
        ? "Žaidėjas priėmė pasiūlymą! Pasirašykite sutartį."
        : offerStatus === "REJECTED"
        ? "Agentas atmetė pasiūlymą."
        : "Pasiūlymas išsiųstas. Laukite atsakymo."
    })
  } catch (error) {
    console.error("Transfer offer error:", error)
    return NextResponse.json({ error: "Nepavyko siųsti pasiūlymo" }, { status: 500 })
  }
}

// DELETE - Withdraw an offer
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.teamId) {
    return NextResponse.json({ error: "Turite turėti komandą" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const offerId = searchParams.get("id")

  if (!offerId) {
    return NextResponse.json({ error: "Nenurodytas pasiūlymas" }, { status: 400 })
  }

  try {
    // Verify offer belongs to user's team
    const offer = await prisma.offer.findUnique({
      where: { id: offerId }
    })

    if (!offer || offer.teamId !== session.user.teamId) {
      return NextResponse.json({ error: "Pasiūlymas nerastas" }, { status: 404 })
    }

    await prisma.offer.delete({
      where: { id: offerId }
    })

    return NextResponse.json({
      success: true,
      message: "Pasiūlymas atšauktas"
    })
  } catch (error) {
    console.error("Offer withdraw error:", error)
    return NextResponse.json({ error: "Nepavyko atšaukti" }, { status: 500 })
  }
}
