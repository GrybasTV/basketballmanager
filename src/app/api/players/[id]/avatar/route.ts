import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generatePlayerAvatarSVG } from '@/lib/avatarGenerator';

const prisma = new PrismaClient();

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET - Gauti žaidėjo avatarą
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const player = await prisma.player.findUnique({
      where: { id },
      select: {
        id: true,
        position: true,
        ovr: true,
      },
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const svg = generatePlayerAvatarSVG(player.id, player.position, player.ovr);

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error generating avatar:', error);
    return NextResponse.json({ error: 'Failed to generate avatar' }, { status: 500 });
  }
}
