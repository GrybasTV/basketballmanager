export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET - Gauti žaidėją pagal ID
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        team: true,
        birthCountry: true,
        contracts: true,
        stats: {
          orderBy: { season: 'desc' },
          take: 1,
        },
      },
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Skaičiuoti "formą" (paskutinių rungtynių pagrindu - kol tiesiog random)
    const form = player.form;

    return NextResponse.json({
      ...player,
      form,
    });
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json({ error: 'Failed to fetch player' }, { status: 500 });
  }
}
