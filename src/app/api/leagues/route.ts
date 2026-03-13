import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Gauti visas lygas
export async function GET() {
  try {
    const leagues = await prisma.league.findMany({
      include: {
        country: true,
        localTeams: {
          include: {
            players: true,
          },
        },
        _count: {
          select: {
            localTeams: true,
            matches: true,
          },
        },
      },
    });

    // Transform localTeams to teams for API compatibility
    const leaguesWithTeams = leagues.map((league) => ({
      ...league,
      teams: league.localTeams,
      _count: {
        teams: league._count.localTeams,
        matches: league._count.matches,
      },
    }));

    return NextResponse.json(leaguesWithTeams);
  } catch (error) {
    console.error('Error fetching leagues:', error);
    return NextResponse.json({ error: 'Failed to fetch leagues' }, { status: 500 });
  }
}
