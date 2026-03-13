import { NextResponse } from 'next/server';
import { simulateAndSaveMatch } from '@/lib/matchEngine';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST - Simuliuoti rungtynes
export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const result = await simulateAndSaveMatch(id);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error simulating match:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to simulate match' },
      { status: 500 }
    );
  }
}
