export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET - Gauti komandą pagal ID
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        country: true,
        localLeague: true,
        europeanLeague: true,
        players: {
          include: {
            birthCountry: true,
          },
          orderBy: [
            { ovr: 'desc' },
            { position: 'asc' },
          ],
        },
        coaches: true,
        contracts: {
          include: {
            player: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Skaičiuoti komandos statistiką
    const avgOvr = team.players.length > 0
      ? Math.round(team.players.reduce((sum, p) => sum + p.ovr, 0) / team.players.length)
      : 0;

    const totalWages = team.contracts.reduce((sum, c) => sum + c.weeklyWage, 0);

    // Sugrupuoti žaidėjus pagal poziciją
    const playersByPosition = {
      PG: team.players.filter(p => p.position === 'PG'),
      SG: team.players.filter(p => p.position === 'SG'),
      SF: team.players.filter(p => p.position === 'SF'),
      PF: team.players.filter(p => p.position === 'PF'),
      C: team.players.filter(p => p.position === 'C'),
    };

    // Get first coach
    const coach = team.coaches[0] || null;

    return NextResponse.json({
      ...team,
      avgOvr,
      totalWages,
      playersByPosition,
      coach,
      _count: {
        players: team.players.length,
      },
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}
