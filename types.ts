
export interface PlayerStats {
  runs: number;
  wickets: number;
  battingAverage: number;
  highestRun: number;
  highestWicket: string;
  manOfTheMatch: number;
}

export enum PlayerRole {
  BATSMAN = 'Batsman',
  BOWLER = 'Bowler',
  ALL_ROUNDER = 'All-Rounder',
  WICKET_KEEPER = 'Wicket-Keeper',
}

export interface Player {
  id: number;
  name: string;
  country: string;
  role: PlayerRole;
  stats: PlayerStats;
}
