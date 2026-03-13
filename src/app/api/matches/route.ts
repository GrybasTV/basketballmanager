export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Gauti rungtynes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get('leagueId');
    const teamId = searchParams.get('teamId');
    const isPlayed = searchParams.get('isPlayed');
    const matchDay = searchParams.get('matchDay');
    const limit = searchParams.get('limit');

    const where: any = {};
    if (leagueId) where.leagueId = leagueId;
    if (teamId) {
      where.OR = [
        { homeTeamId: teamId },
        { awayTeamId: teamId },
      ];
    }
    if (isPlayed !== null) where.isPlayed = isPlayed === 'true';
    if (matchDay) where.matchDay = parseInt(matchDay);

    const matches = await prisma.match.findMany({
      where,
      include: {
        league: true,
        homeTeam: {
          include: {
            localLeague: true,
          },
        },
        awayTeam: {
          include: {
            localLeague: true,
          },
        },
        playerStats: {
          include: {
            player: {
              include: {
                team: true,
              },
            },
          },
        },
      },
      orderBy: [
        { matchDay: 'asc' },
        { id: 'asc' },
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
