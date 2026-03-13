export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Gauti visas komandas
export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        country: true,
        localLeague: true,
        players: {
          include: {
            birthCountry: true,
          },
          orderBy: [
            { ovr: 'desc' },
          ],
        },
        coaches: true,
        _count: {
          select: {
            players: true,
          },
        },
      },
    });

    // Skaičiuoti komandos OVR vidurkį
    const teamsWithStats = teams.map((team) => {
      const avgOvr = team.players.length > 0
        ? Math.round(team.players.reduce((sum, p) => sum + p.ovr, 0) / team.players.length)
        : 0;

      return {
        ...team,
        avgOvr,
      };
    });

    return NextResponse.json(teamsWithStats);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}
