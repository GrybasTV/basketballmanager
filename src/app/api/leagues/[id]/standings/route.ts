import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET - Gauti lentelę (standings)
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // Gauti visas komandas lygoje
    const league = await prisma.league.findUnique({
      where: { id },
      include: {
        localTeams: {
          include: {
            players: true,
          },
        },
      },
    });

    if (!league) {
      return NextResponse.json({ error: 'League not found' }, { status: 404 });
    }

    // Gauti visas rungtynes šioje lygoje
    const matches = await prisma.match.findMany({
      where: {
        leagueId: id,
        isPlayed: true,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    // Skaičiuoti statistiką kiekvienai komandai
    const standings = league.localTeams.map((team) => {
      const homeMatches = matches.filter((m) => m.homeTeamId === team.id);
      const awayMatches = matches.filter((m) => m.awayTeamId === team.id);
      const totalMatches = homeMatches.length + awayMatches.length;

      let wins = 0;
      let losses = 0;

      // Namų rungtynės
      homeMatches.forEach((match) => {
        if (match.homeScore > match.awayScore) wins++;
        else losses++;
      });

      // Svečių rungtynės
      awayMatches.forEach((match) => {
        if (match.awayScore > match.homeScore) wins++;
        else losses++;
      });

      const winPercentage = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

      // Taškų skirtumas
      let pointsFor = 0;
      let pointsAgainst = 0;

      homeMatches.forEach((match) => {
        pointsFor += match.homeScore;
        pointsAgainst += match.awayScore;
      });

      awayMatches.forEach((match) => {
        pointsFor += match.awayScore;
        pointsAgainst += match.homeScore;
      });

      const pointDiff = pointsFor - pointsAgainst;

      // Komandos OVR vidurkis
      const avgOvr =
        team.players.length > 0
          ? Math.round(team.players.reduce((sum, p) => sum + p.ovr, 0) / team.players.length)
          : 0;

      return {
        ...team,
        gamesPlayed: totalMatches,
        wins,
        losses,
        winPercentage: Math.round(winPercentage * 10) / 10,
        pointsFor,
        pointsAgainst,
        pointDiff,
        avgOvr,
      };
    });

    // Rūšiuoti: 1. winPercentage desc, 2. pointDiff desc
    standings.sort((a, b) => {
      if (b.winPercentage !== a.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }
      return b.pointDiff - a.pointDiff;
    });

    return NextResponse.json(standings);
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
  }
}
