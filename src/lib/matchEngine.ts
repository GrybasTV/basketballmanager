// Rungtynių Simuliacijos Variklis
// Pagrįstas docs/atributai.md ir docs/schema.md

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// PAGALBINĖS FUNKCIJOS
// ============================================

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gaussianRandom(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

// ============================================
// KOMANDOS STIPRUMO VERTINIMAS
// ============================================

interface TeamStrength {
  offensiveRating: number;
  defensiveRating: number;
  paceRating: number;
  benchRating: number;
  overallRating: number;
}

export function calculateTeamStrength(players: any[]): TeamStrength {
  // Top 5 žaidėjai (pradinė penketa)
  const starters = players.slice(0, 5);
  // Bench (likę 10)
  const bench = players.slice(5);

  // Puolimo reitingas
  const offensiveRating =
    starters.reduce((sum, p) => sum + p.threePoint + p.midRange + p.closeRange + p.ballHandling, 0) /
    starters.length /
    4;

  // Gynybos reitingas
  const defensiveRating =
    starters.reduce(
      (sum, p) => sum + p.perimeterDef + p.interiorDef + p.steal + p.block + p.defensiveReb,
      0
    ) / starters.length / 5;

  // Tempo reitingas (greitis + stamina)
  const paceRating =
    starters.reduce((sum, p) => sum + p.speed + p.stamina, 0) / starters.length / 2;

  // Atsarginių reitingas
  const benchRating =
    bench.length > 0
      ? bench.reduce((sum, p) => sum + p.ovr, 0) / bench.length
      : 50;

  // Bendras reitingas
  const overallRating =
    (offensiveRating * 0.35 +
      defensiveRating * 0.35 +
      paceRating * 0.15 +
      benchRating * 0.15);

  return {
    offensiveRating,
    defensiveRating,
    paceRating,
    benchRating,
    overallRating,
  };
}

// ============================================
// RUNGTYNIŲ SIMULIACIJA
// ============================================

interface MatchSimOptions {
  homeTeam: any;
  awayTeam: any;
  season: number;
}

interface MatchSimResult {
  homeScore: number;
  awayScore: number;
  homeStats: any[];
  awayStats: any[];
  playByPlay: string[];
}

export function simulateMatch(options: MatchSimOptions): MatchSimResult {
  const { homeTeam, awayTeam, season } = options;

  // Skaičiuoti komandų stiprumą
  const homeStrength = calculateTeamStrength(homeTeam.players);
  const awayStrength = calculateTeamStrength(awayTeam.players);

  // Namų pranašumas (Home court advantage)
  const homeAdvantage = 3;

  // Base tempo (rungtynių greitis) - skaičiuojamas pagal paceRating
  const avgPace = (homeStrength.paceRating + awayStrength.paceRating) / 2;
  const possessions = Math.round(90 + (avgPace - 50) * 0.5); // 75-105 possession

  // Kiekvienos komandos possession skaičius
  const homePossessions = Math.round(possessions / 2 + randomInt(-3, 3));
  const awayPossessions = possessions - homePossessions;

  // Efektyvumo koeficientai
  const homeOffEff =
    homeStrength.offensiveRating * 1.1 +
    (100 - awayStrength.defensiveRating) * 0.5 +
    homeAdvantage;
  const awayOffEff =
    awayStrength.offensiveRating +
    (100 - homeStrength.defensiveRating) * 0.5;

  // Skaičiuojamas kiekvienos possession rezultatas
  const homeScore = calculateTeamScore(homePossessions, homeOffEff, homeTeam);
  const awayScore = calculateTeamScore(awayPossessions, awayOffEff, awayTeam);

  // Generuojami žaidėjų statistika
  const homeStats = generatePlayerStats(homeTeam, homeScore, homePossessions, 'home');
  const awayStats = generatePlayerStats(awayTeam, awayScore, awayPossessions, 'away');

  // Play-by-play (sutrumpinta versija)
  const playByPlay = generatePlayByPlay(homeTeam, awayTeam, homeStats, awayStats);

  return {
    homeScore,
    awayScore,
    homeStats,
    awayStats,
    playByPlay,
  };
}

function calculateTeamScore(
  possessions: number,
  offensiveEfficiency: number,
  team: any
): number {
  let score = 0;

  for (let i = 0; i < possessions; i++) {
    // Bazinis šansas įmesti
    let baseChance = offensiveEfficiency / 100;

    // Random variacija
    baseChance += gaussianRandom(0, 0.1);

    // Ar įmesta?
    if (Math.random() < baseChance) {
      // 2 arba 3 taškai?
      const threePointChance = team.players
        .slice(0, 5)
        .reduce((sum: number, p: any) => sum + p.threePoint, 0) / 5 / 100;

      score += Math.random() < threePointChance ? 3 : 2;
    }

    // Baudos metimai (už pražangas)
    if (Math.random() < 0.05) {
      const ftPercentage = team.players
        .slice(0, 5)
        .reduce((sum: number, p: any) => sum + p.freeThrow, 0) / 5 / 100;

      if (Math.random() < ftPercentage) {
        score += Math.random() < 0.3 ? 2 : 1; // 30% galimybė gauti 2 baudos metimus
      }
    }
  }

  return Math.max(60, Math.min(150, score));
}

function generatePlayerStats(
  team: any,
  teamScore: number,
  possessions: number,
  location: 'home' | 'away'
) {
  const players = team.players;
  const stats: any[] = [];

  // Minutes - pradinė penketa žaidžia daugiau
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const isStarter = i < 5;

    // Minučių skaičius
    const baseMinutes = isStarter ? randomInt(25, 35) : randomInt(10, 20);
    const minutes = Math.max(5, Math.min(40, baseMinutes + randomInt(-5, 5)));

    // Žaidėjo įsnaudžiai
    const usageRate = player.ovr / 100;

    // Taškai (proporcingai pagal minutes)
    const points = Math.round(
      (teamScore * usageRate * (minutes / 200)) + randomInt(-5, 5)
    );
    const finalPoints = Math.max(0, points);

    // Atkovoti kamuoliai
    const reboundChance = (player.defensiveReb + player.offensiveReb) / 200;
    const rebounds = Math.round(possessions * reboundChance * (minutes / 48) * 0.3);

    // Perdavimai
    const passChance = player.passing / 100;
    const assists = Math.round(finalPoints * passChance * randomInt(0.3, 0.7));

    // Vogtimo bandymai
    const stealChance = player.steal / 100;
    const steals = Math.random() < stealChance * 0.3 ? randomInt(0, 2) : 0;

    // Blokai
    const blockChance = player.block / 100;
    const blocks = Math.random() < blockChance * 0.2 ? randomInt(0, 2) : 0;

    // Praradimai
    const turnoverChance = (100 - player.ballHandling) / 500;
    const turnovers = Math.max(0, Math.round(minutes * turnoverChance));

    // Pražangos
    const fouls = randomInt(0, Math.round(minutes / 10));

    // Metimai
    const fgAttempts = Math.max(5, Math.round(finalPoints / (player.threePoint / 100 + 1)));
    const fgMade = Math.round(fgAttempts * (player.threePoint + player.midRange) / 200);
    const threePtAttempts = Math.round(fgAttempts * 0.3);
    const threePtMade = Math.round(threePtAttempts * player.threePoint / 100);
    const twoPtAttempts = fgAttempts - threePtAttempts;
    const twoPtMade = fgMade - threePtMade;

    stats.push({
      playerId: player.id,
      teamId: team.id,
      minutes,
      points: finalPoints,
      rebounds,
      assists,
      steals,
      blocks,
      turnovers,
      fouls,
      fgMade: twoPtMade + threePtMade,
      fgAttempted: fgAttempts,
      threePtMade,
      threePtAtt: threePtAttempts,
      ftMade: randomInt(0, 5),
      ftAttempted: randomInt(0, 7),
    });
  }

  // Normalizuoti, kad atitiktų komandos rezultatą
  const totalPoints = stats.reduce((sum, s) => sum + s.points, 0);
  if (totalPoints > 0 && totalPoints !== teamScore) {
    const ratio = teamScore / totalPoints;
    stats.forEach((s) => {
      s.points = Math.max(0, Math.round(s.points * ratio));
    });
  }

  return stats;
}

function generatePlayByPlay(
  homeTeam: any,
  awayTeam: any,
  homeStats: any[],
  awayStats: any[]
): string[] {
  const events: string[] = [];

  // Rungtynių pradžia
  events.push(`🏀 Rungtynių pradžia! ${homeTeam.city} ${homeTeam.name} vs ${awayTeam.city} ${awayTeam.name}`);

  // Pirmosios pusės pabaiga
  const homeFirstHalf = Math.floor(homeStats.reduce((sum, s) => sum + s.points, 0) / 2);
  const awayFirstHalf = Math.floor(awayStats.reduce((sum, s) => sum + s.points, 0) / 2);
  events.push(`⏱️ 2 kėlinio pabaiga: ${homeTeam.name} ${homeFirstHalf} - ${awayFirstHalf} ${awayTeam.name}`);

  // Rezultatas
  const homeFinal = homeStats.reduce((sum, s) => sum + s.points, 0);
  const awayFinal = awayStats.reduce((sum, s) => sum + s.points, 0);
  events.push(`🏆 Rungtynių pabaiga: ${homeTeam.name} ${homeFinal} - ${awayFinal} ${awayTeam.name}`);

  // MVP rungtynių
  const topScorer = [...homeStats, ...awayStats].sort((a, b) => b.points - a.points)[0];
  events.push(`⭐ Rezultatyviausias: ${topScorer.points} taškai`);

  return events;
}

// ============================================
// RUNGTYNIŲ SIMULIACIOS IŠSAUGOJIMAS
// ============================================

export async function simulateAndSaveMatch(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: {
        include: {
          players: true,
        },
      },
      awayTeam: {
        include: {
          players: true,
        },
      },
    },
  });

  if (!match) {
    throw new Error('Match not found');
  }

  if (match.isPlayed) {
    throw new Error('Match already played');
  }

  // Simuliuoti rungtynes
  const result = simulateMatch({
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    season: 1,
  });

  // Išsaugoti rezultatą
  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: {
      homeScore: result.homeScore,
      awayScore: result.awayScore,
      isPlayed: true,
      playedAt: new Date(),
    },
  });

  // Išsaugoti žaidėjų statistiką
  const allStats = [...result.homeStats, ...result.awayStats];
  await prisma.matchPlayerStats.createMany({
    data: allStats.map((stat) => ({
      ...stat,
      matchId,
    })),
  });

  return {
    match: updatedMatch,
    stats: allStats,
    playByPlay: result.playByPlay,
  };
}
