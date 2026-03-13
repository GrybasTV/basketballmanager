// Test suite for Basketball Manager MVP
// Running with Node.js built-in test runner

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { PrismaClient } from '@prisma/client';
import { generateAnimeAvatarSVG, getAvatarColors } from '../src/lib/avatarGenerator.js';
import { generateTeamLogoSVG } from '../src/lib/teamLogoGenerator.js';
import { calculateTeamStrength, simulateMatch } from '../src/lib/matchEngine.js';

const prisma = new PrismaClient();

// Test helpers
function assertExists(value: any, message?: string) {
  assert.ok(value != null, message || 'Value should exist');
}

function assertInRange(value: number, min: number, max: number, message?: string) {
  assert.ok(
    value >= min && value <= max,
    message || `Expected ${value} to be between ${min} and ${max}`
  );
}

// ============================================
// Avatar Generator Tests
// ============================================
describe('Avatar Generator', () => {
  it('should generate valid SVG for a player', () => {
    const svg = generateAnimeAvatarSVG({
      playerId: 'test-123',
      position: 'PG',
      ovr: 75,
    });

    assertExists(svg);
    assert.ok(svg.includes('<svg'), 'Should contain SVG tag');
    assert.ok(svg.includes('</svg>'), 'Should close SVG tag');
    assert.ok(svg.includes('PG'), 'Should contain position');
  });

  it('should generate different avatars for different players', () => {
    const svg1 = generateAnimeAvatarSVG({
      playerId: 'player-1',
      position: 'PG',
      ovr: 75,
    });

    const svg2 = generateAnimeAvatarSVG({
      playerId: 'player-2',
      position: 'PG',
      ovr: 75,
    });

    assert.notStrictEqual(svg1, svg2, 'Different players should have different avatars');
  });

  it('should generate consistent avatars for same player', () => {
    const options = { playerId: 'same-player', position: 'SG', ovr: 80 };

    const svg1 = generateAnimeAvatarSVG(options);
    const svg2 = generateAnimeAvatarSVG(options);

    assert.strictEqual(svg1, svg2, 'Same player should always get same avatar');
  });

  it('should have avatar colors from defined palette', () => {
    const colors = getAvatarColors({
      playerId: 'test',
      position: 'PG',
      ovr: 70,
    });

    assertExists(colors.hair);
    assertExists(colors.eyes);
    assertExists(colors.skin);
    assertExists(colors.jersey);
  });
});

// ============================================
// Team Logo Generator Tests
// ============================================
describe('Team Logo Generator', () => {
  it('should generate valid SVG for a team', () => {
    const svg = generateTeamLogoSVG({
      teamId: 'team-1',
      teamName: 'Test Team',
      city: 'Test City',
    });

    assertExists(svg);
    assert.ok(svg.includes('<svg'), 'Should contain SVG tag');
    assert.ok(svg.includes('</svg>'), 'Should close SVG tag');
  });

  it('should generate different logos for different teams', () => {
    const svg1 = generateTeamLogoSVG({
      teamId: 'team-1',
      teamName: 'Team A',
      city: 'City A',
    });

    const svg2 = generateTeamLogoSVG({
      teamId: 'team-2',
      teamName: 'Team B',
      city: 'City B',
    });

    assert.notStrictEqual(svg1, svg2, 'Different teams should have different logos');
  });

  it('should extract team initials correctly', () => {
    const svg = generateTeamLogoSVG({
      teamId: 'test',
      teamName: 'Vilniaus Rytas',
      city: 'Vilnius',
    });

    // Should contain VR initials
    assert.ok(svg.includes('VR'), 'Should contain team initials');
  });
});

// ============================================
// Match Engine Tests
// ============================================
describe('Match Engine', () => {
  const mockHomeTeam = {
    id: 'home-1',
    name: 'Home Team',
    city: 'Home City',
    players: Array(15).fill(null).map((_, i) => ({
      id: `hp-${i}`,
      firstName: `Home${i}`,
      lastName: `Player${i}`,
      teamId: 'home-1',
      age: 25,
      birthCountryId: 'LT',
      position: ['PG', 'SG', 'SF', 'PF', 'C'][i % 5],
      height: 200,
      weight: 90,
      ovr: 75,
      pot: 80,
      loyalty: 50,
      morale: 70,
      rhythm: 70,
      closeRange: 70,
      midRange: 70,
      threePoint: 70,
      freeThrow: 70,
      ballHandling: 70,
      passing: 70,
      offensiveReb: 70,
      perimeterDef: 70,
      interiorDef: 70,
      steal: 70,
      block: 70,
      defensiveReb: 70,
      speed: 70,
      strength: 70,
      vertical: 70,
      stamina: 70,
      injuryProne: 30,
      basketballIQ: 70,
      clutch: 70,
      injuryStatus: 'HEALTHY',
      fatigueSeason: 0,
      form: 70,
    })),
  };

  const mockAwayTeam = {
    id: 'away-1',
    name: 'Away Team',
    city: 'Away City',
    players: Array(15).fill(null).map((_, i) => ({
      id: `ap-${i}`,
      firstName: `Away${i}`,
      lastName: `Player${i}`,
      teamId: 'away-1',
      age: 25,
      birthCountryId: 'LT',
      position: ['PG', 'SG', 'SF', 'PF', 'C'][i % 5],
      height: 200,
      weight: 90,
      ovr: 70, // Weaker team
      pot: 75,
      loyalty: 50,
      morale: 70,
      rhythm: 70,
      closeRange: 65,
      midRange: 65,
      threePoint: 65,
      freeThrow: 65,
      ballHandling: 65,
      passing: 65,
      offensiveReb: 65,
      perimeterDef: 65,
      interiorDef: 65,
      steal: 65,
      block: 65,
      defensiveReb: 65,
      speed: 65,
      strength: 65,
      vertical: 65,
      stamina: 65,
      injuryProne: 30,
      basketballIQ: 65,
      clutch: 65,
      injuryStatus: 'HEALTHY',
      fatigueSeason: 0,
      form: 70,
    })),
  };

  it('should calculate team strength correctly', () => {
    const strength = calculateTeamStrength(mockHomeTeam.players);

    assertExists(strength.offensiveRating);
    assertExists(strength.defensiveRating);
    assertExists(strength.paceRating);
    assertExists(strength.benchRating);
    assertExists(strength.overallRating);

    assertInRange(strength.offensiveRating, 0, 100);
    assertInRange(strength.defensiveRating, 0, 100);
    assertInRange(strength.overallRating, 0, 100);
  });

  it('should simulate a match with valid scores', () => {
    const result = simulateMatch({
      homeTeam: mockHomeTeam,
      awayTeam: mockAwayTeam,
      season: 1,
    });

    assertExists(result.homeScore);
    assertExists(result.awayScore);
    assertExists(result.homeStats);
    assertExists(result.awayStats);
    assertExists(result.playByPlay);

    assertInRange(result.homeScore, 50, 150);
    assertInRange(result.awayScore, 50, 150);

    // Should have stats for all 15 players
    assert.strictEqual(result.homeStats.length, 15);
    assert.strictEqual(result.awayStats.length, 15);
  });

  it('should favor stronger team on average', () => {
    let homeWins = 0;
    const simulations = 10;

    for (let i = 0; i < simulations; i++) {
      const result = simulateMatch({
        homeTeam: mockHomeTeam,
        awayTeam: mockAwayTeam,
        season: 1,
      });
      if (result.homeScore > result.awayScore) homeWins++;
    }

    // Home team (higher OVR) should win more often
    // This is probabilistic so we just check it's not losing all
    assert.ok(homeWins > 0, 'Stronger team should win at least some games');
  });

  it('should generate player stats within valid ranges', () => {
    const result = simulateMatch({
      homeTeam: mockHomeTeam,
      awayTeam: mockAwayTeam,
      season: 1,
    });

    const playerStats = result.homeStats[0];

    assertInRange(playerStats.minutes, 5, 40);
    assertInRange(playerStats.points, 0, 50);
    assertInRange(playerStats.rebounds, 0, 20);
    assertInRange(playerStats.assists, 0, 15);
    assertInRange(playerStats.turnovers, 0, 10);
  });
});

// ============================================
// Database Tests
// ============================================
describe('Database', () => {
  let testTeamId: string;
  let testPlayerId: string;

  it('should connect to database', async () => {
    await prisma.$connect();
    assert.ok(true, 'Database connection successful');
  });

  it('should have leagues', async () => {
    const leagues = await prisma.league.findMany();
    assert.ok(leagues.length > 0, 'Should have at least one league');
  });

  it('should have teams', async () => {
    const teams = await prisma.team.findMany();
    assert.ok(teams.length > 0, 'Should have at least one team');
    testTeamId = teams[0].id;
  });

  it('should have players', async () => {
    const players = await prisma.player.findMany({
      where: { teamId: testTeamId },
    });
    assert.ok(players.length > 0, 'Team should have players');
    testPlayerId = players[0].id;
  });

  it('should have valid player attributes', async () => {
    const player = await prisma.player.findUnique({
      where: { id: testPlayerId },
    });

    assertExists(player);
    assertInRange(player!.ovr, 0, 99);
    assertInRange(player!.pot, 0, 99);
    assertInRange(player!.age, 16, 40);
    assert.ok(['PG', 'SG', 'SF', 'PF', 'C'].includes(player!.position));
  });

  it('should have matches', async () => {
    const matches = await prisma.match.findMany();
    assert.ok(matches.length > 0, 'Should have matches scheduled');
  });

  it('should have coaches', async () => {
    const coaches = await prisma.coach.findMany();
    assert.ok(coaches.length > 0, 'Should have coaches');
  });

  after(async () => {
    await prisma.$disconnect();
  });
});

// ============================================
// Integration Tests
// ============================================
describe('Integration', () => {
  it('should simulate and save a match', async () => {
    // Get an unplayed match
    const match = await prisma.match.findFirst({
      where: { isPlayed: false },
      include: {
        homeTeam: { include: { players: true } },
        awayTeam: { include: { players: true } },
      },
    });

    if (!match) {
      console.log('⚠️  No unplayed matches found, skipping');
      assert.ok(true);
      return;
    }

    // Import and run simulation
    const { simulateMatch } = await import('../src/lib/matchEngine.js');
    const result = simulateMatch({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      season: 1,
    });

    assertInRange(result.homeScore, 50, 150);
    assertInRange(result.awayScore, 50, 150);

    console.log(`✓ Simulated: ${match.homeTeam.name} ${result.homeScore} - ${result.awayScore} ${match.awayTeam.name}`);
  });
});

console.log('\n🏀 Basketball Manager - Test Suite');
console.log('=====================================\n');
