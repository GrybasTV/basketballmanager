export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET - Gauti rungtynes pagal ID
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        league: true,
        homeTeam: {
          include: {
            localLeague: true,
            players: {
              orderBy: { ovr: 'desc' },
            },
          },
        },
        awayTeam: {
          include: {
            localLeague: true,
            players: {
              orderBy: { ovr: 'desc' },
            },
          },
        },
        playerStats: {
          include: {
            player: true,
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json({ error: 'Failed to fetch match' }, { status: 500 });
  }
}
