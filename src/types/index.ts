export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export interface PlayerAttributes {
  // Offense
  closeShot: number;
  midRange: number;
  threePoint: number;
  freeThrow: number;
  ballHandling: number;
  passing: number;
  offensiveRebound: number;

  // Defense
  perimeterDefense: number;
  interiorDefense: number;
  steal: number;
  block: number;
  defensiveRebound: number;

  // Physical
  speed: number;
  strength: number;
  vertical: number;
  stamina: number;
  injuryProneness: number;

  // Mental
  basketballIq: number;
  clutch: number;
  potential: number;
}

export interface Player {
  id: string;
  teamId: string | null;
  firstName: string;
  lastName: string;
  age: number;
  birthCountryId: string;
  position: Position;
  ovr: number;
  pot: number;
  loyalty: number;
  morale: number;
  rhythm: number;
  attributes: PlayerAttributes;
  injuryStatus: 'HEALTHY' | 'INJURED' | 'REHAB';
  fatigueSeason: number; // 0-100
}

export interface Team {
  id: string;
  userId: string | null;
  name: string;
  city: string;
  countryId: string;
  prestige: number;
  wageBudget: number;
  transferBudget: number;
  isAiControlled: boolean;
  localLeagueId: string;
  europeanLeagueId: string;
}

export interface Contract {
  id: string;
  playerId: string;
  teamId: string;
  weeklyWage: number;
  expiresAtSeason: number;
  effectiveAtSeason: number;
  releaseClause: number | null;
  isLoan: boolean;
  loanPlayingTimeGuarantee: number | null;
}
