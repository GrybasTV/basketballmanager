export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Notification types
const NOTIFICATION_TYPES = {
  INJURY: { icon: "🏥", color: "red", priority: "high" },
  OFFER_REJECTED: { icon: "📉", color: "orange", priority: "medium" },
  OFFER_ACCEPTED: { icon: "✅", color: "green", priority: "medium" },
  MATCH_START: { icon: "🏀", color: "blue", priority: "low" },
  MATCH_RESULT: { icon: "📊", color: "purple", priority: "medium" },
  BUDGET_WARNING: { icon: "💰", color: "yellow", priority: "high" },
  TRANSFER_COMPLETE: { icon: "📝", color: "green", priority: "medium" },
  TRAINING_COMPLETE: { icon: "🏋️", color: "blue", priority: "low" },
  NEW_MESSAGE: { icon: "💬", color: "blue", priority: "low" },
} as const

// GET - Fetch user notifications
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Neprisijungęs" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const unreadOnly = searchParams.get("unreadOnly") === "true"
  const limit = parseInt(searchParams.get("limit") || "20")

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        ...(unreadOnly ? { isRead: false } : {})
      },
      orderBy: { createdAt: "desc" },
      take: limit
    })

    // Add metadata to each notification
    const enriched = notifications.map(n => {
      const typeInfo = NOTIFICATION_TYPES[n.type as keyof typeof NOTIFICATION_TYPES] || {
        icon: "📌",
        color: "gray",
        priority: "low"
      }
      return {
        ...n,
        icon: typeInfo.icon,
        color: typeInfo.color,
        priority: typeInfo.priority
      }
    })

    const unreadCount = await prisma.notification.count({
      where: { userId: session.user.id, isRead: false }
    })

    return NextResponse.json({
      notifications: enriched,
      unreadCount
    })
  } catch (error) {
    console.error("Notifications fetch error:", error)
    return NextResponse.json({ error: "Nepavyko gauti pranešimų" }, { status: 500 })
  }
}

// PUT - Mark notifications as read
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Neprisijungęs" }, { status: 401 })
  }

  try {
    const { notificationIds, markAll } = await req.json() as any

    if (markAll) {
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false
        },
        data: { isRead: true }
      })

      return NextResponse.json({ success: true, message: "Visi pranešimai pažymėti kaip skaityti" })
    }

    if (notificationIds && Array.isArray(notificationIds)) {
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: session.user.id
        },
        data: { isRead: true }
      })

      return NextResponse.json({ success: true, message: "Pranešimai pažymėti" })
    }

    return NextResponse.json({ error: "Nenurodyti pranešimai" }, { status: 400 })
  } catch (error) {
    console.error("Notifications update error:", error)
    return NextResponse.json({ error: "Nepavyko atnaujinti" }, { status: 500 })
  }
}

// POST - Create notification (internal use)
export async function POST(req: NextRequest) {
  const { userId, type, content } = await req.json() as any

  if (!userId || !type || !content) {
    return NextResponse.json({ error: "Trūksta duomenų" }, { status: 400 })
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        content
      }
    })

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error("Notification create error:", error)
    return NextResponse.json({ error: "Nepavyko sukurti pranešimo" }, { status: 500 })
  }
}

// DELETE - Delete notification(s)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Neprisijungęs" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const notificationId = searchParams.get("id")
  const deleteAll = searchParams.get("all") === "true"

  try {
    if (deleteAll) {
      await prisma.notification.deleteMany({
        where: { userId: session.user.id }
      })
      return NextResponse.json({ success: true, message: "Visi pranešimai ištrinti" })
    }

    if (notificationId) {
      await prisma.notification.delete({
        where: { id: notificationId }
      })
      return NextResponse.json({ success: true, message: "Pranešimas ištrintas" })
    }

    return NextResponse.json({ error: "Nenurodytas pranešimas" }, { status: 400 })
  } catch (error) {
    console.error("Notification delete error:", error)
    return NextResponse.json({ error: "Nepavyko ištrinti" }, { status: 500 })
  }
}
