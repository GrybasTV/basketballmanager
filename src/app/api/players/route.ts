import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Gauti visus žaidėjus
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    const position = searchParams.get('position');
    const limit = searchParams.get('limit');
    const sortBy = searchParams.get('sortBy') || 'ovr';
    const order = searchParams.get('order') || 'desc';

    const where: any = {};
    if (teamId) where.teamId = teamId;
    if (position) where.position = position;

    const players = await prisma.player.findMany({
      where,
      include: {
        team: {
          include: {
            localLeague: true,
          },
        },
        birthCountry: true,
        contracts: true,
      },
      orderBy: [
        { [sortBy]: order === 'asc' ? 'asc' : 'desc' },
        { lastName: 'asc' },
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}
