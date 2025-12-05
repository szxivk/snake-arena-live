// Game types

export interface Position {
  x: number;
  y: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameMode = 'walls' | 'pass-through';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  isPlaying: boolean;
  isGameOver: boolean;
  mode: GameMode;
  speed: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  date: Date;
  mode: GameMode;
}

export interface LiveGame {
  id: string;
  playerId: string;
  playerName: string;
  score: number;
  mode: GameMode;
  startedAt: Date;
  snake: Position[];
  food: Position;
  direction: Direction;
  isActive: boolean;
}

export interface GameScore {
  score: number;
  mode: GameMode;
}

// Game configuration
export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 5;
export const MIN_SPEED = 50;
