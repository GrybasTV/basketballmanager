export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateTeamLogoSVG } from '@/lib/teamLogoGenerator';

const prisma = new PrismaClient();

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET - Gauti komandos logotipą
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const team = await prisma.team.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        city: true,
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const svg = generateTeamLogoSVG({
      teamId: team.id,
      teamName: team.name,
      city: team.city,
    });

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error generating logo:', error);
    return NextResponse.json({ error: 'Failed to generate logo' }, { status: 500 });
  }
}
