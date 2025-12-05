// Centralized API service - all backend calls go through here
// Currently mocked, ready for real backend integration

import { User, LeaderboardEntry, LiveGame, GameScore } from '@/types/game';

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data store
let currentUser: User | null = null;
const mockUsers: Map<string, { password: string; user: User }> = new Map();
const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', username: 'SnakeMaster', score: 2450, date: new Date('2024-01-15'), mode: 'walls' },
  { id: '2', username: 'RetroGamer', score: 2100, date: new Date('2024-01-14'), mode: 'pass-through' },
  { id: '3', username: 'NokiaKing', score: 1890, date: new Date('2024-01-13'), mode: 'walls' },
  { id: '4', username: 'PixelPro', score: 1750, date: new Date('2024-01-12'), mode: 'pass-through' },
  { id: '5', username: 'ClassicPlayer', score: 1620, date: new Date('2024-01-11'), mode: 'walls' },
  { id: '6', username: 'GameLegend', score: 1500, date: new Date('2024-01-10'), mode: 'pass-through' },
  { id: '7', username: 'SnakeCharmer', score: 1380, date: new Date('2024-01-09'), mode: 'walls' },
  { id: '8', username: 'BitRunner', score: 1250, date: new Date('2024-01-08'), mode: 'pass-through' },
  { id: '9', username: 'VintageViper', score: 1100, date: new Date('2024-01-07'), mode: 'walls' },
  { id: '10', username: 'OldSchool', score: 980, date: new Date('2024-01-06'), mode: 'pass-through' },
];

// Initialize some mock users
mockUsers.set('demo@snake.com', {
  password: 'demo123',
  user: { id: 'demo-1', username: 'DemoPlayer', email: 'demo@snake.com' }
});

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User } | { error: string }> {
    await delay(500);
    const userData = mockUsers.get(email);
    if (!userData || userData.password !== password) {
      return { error: 'Invalid email or password' };
    }
    currentUser = userData.user;
    localStorage.setItem('snake_user', JSON.stringify(currentUser));
    return { user: currentUser };
  },

  async signup(email: string, username: string, password: string): Promise<{ user: User } | { error: string }> {
    await delay(500);
    if (mockUsers.has(email)) {
      return { error: 'Email already registered' };
    }
    const existingUsername = Array.from(mockUsers.values()).find(u => u.user.username === username);
    if (existingUsername) {
      return { error: 'Username already taken' };
    }
    const user: User = {
      id: `user-${Date.now()}`,
      username,
      email,
    };
    mockUsers.set(email, { password, user });
    currentUser = user;
    localStorage.setItem('snake_user', JSON.stringify(currentUser));
    return { user };
  },

  async logout(): Promise<void> {
    await delay(200);
    currentUser = null;
    localStorage.removeItem('snake_user');
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    if (currentUser) return currentUser;
    const stored = localStorage.getItem('snake_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    return null;
  },
};

// Leaderboard API
export const leaderboardApi = {
  async getLeaderboard(mode?: 'walls' | 'pass-through'): Promise<LeaderboardEntry[]> {
    await delay(300);
    if (mode) {
      return mockLeaderboard.filter(entry => entry.mode === mode);
    }
    return [...mockLeaderboard];
  },

  async submitScore(score: GameScore): Promise<{ success: boolean; rank?: number }> {
    await delay(400);
    if (!currentUser) {
      return { success: false };
    }
    const entry: LeaderboardEntry = {
      id: `score-${Date.now()}`,
      username: currentUser.username,
      score: score.score,
      date: new Date(),
      mode: score.mode,
    };
    mockLeaderboard.push(entry);
    mockLeaderboard.sort((a, b) => b.score - a.score);
    const rank = mockLeaderboard.findIndex(e => e.id === entry.id) + 1;
    return { success: true, rank };
  },
};

// Live Games API (for spectating)
let mockLiveGames: LiveGame[] = [];
let gameSimulationInterval: number | null = null;

const generateMockGame = (): LiveGame => {
  const players = ['SnakeWatcher', 'LivePlayer', 'StreamKing', 'GamerX', 'ProSnake'];
  const modes: ('walls' | 'pass-through')[] = ['walls', 'pass-through'];
  return {
    id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    playerId: `player-${Math.random().toString(36).substr(2, 9)}`,
    playerName: players[Math.floor(Math.random() * players.length)],
    score: Math.floor(Math.random() * 500),
    mode: modes[Math.floor(Math.random() * modes.length)],
    startedAt: new Date(),
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: 'right',
    isActive: true,
  };
};

export const liveGamesApi = {
  async getLiveGames(): Promise<LiveGame[]> {
    await delay(200);
    return mockLiveGames.filter(g => g.isActive);
  },

  async getGameById(gameId: string): Promise<LiveGame | null> {
    await delay(100);
    return mockLiveGames.find(g => g.id === gameId) || null;
  },

  async subscribeToGame(gameId: string, callback: (game: LiveGame) => void): Promise<() => void> {
    // Simulate real-time updates
    const interval = setInterval(async () => {
      const game = mockLiveGames.find(g => g.id === gameId);
      if (game && game.isActive) {
        simulateGameStep(game);
        callback({ ...game });
      }
    }, 200);

    return () => clearInterval(interval);
  },

  startSimulation(): void {
    if (gameSimulationInterval) return;
    
    // Create initial games
    mockLiveGames = [generateMockGame(), generateMockGame(), generateMockGame()];
    
    // Periodically add/remove games
    gameSimulationInterval = window.setInterval(() => {
      // Randomly end some games
      mockLiveGames.forEach(game => {
        if (Math.random() < 0.1) {
          game.isActive = false;
        }
      });
      
      // Remove inactive games
      mockLiveGames = mockLiveGames.filter(g => g.isActive);
      
      // Add new games if below threshold
      if (mockLiveGames.length < 3 && Math.random() < 0.5) {
        mockLiveGames.push(generateMockGame());
      }
    }, 5000);
  },

  stopSimulation(): void {
    if (gameSimulationInterval) {
      clearInterval(gameSimulationInterval);
      gameSimulationInterval = null;
    }
    mockLiveGames = [];
  },
};

// Helper to simulate game movement
function simulateGameStep(game: LiveGame) {
  const head = game.snake[0];
  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  // Randomly change direction sometimes
  if (Math.random() < 0.2) {
    const allDirs = ['up', 'down', 'left', 'right'] as const;
    game.direction = allDirs[Math.floor(Math.random() * allDirs.length)];
  }

  const dir = directions[game.direction];
  let newHead = { x: head.x + dir.x, y: head.y + dir.y };

  // Handle wrapping for pass-through mode
  if (game.mode === 'pass-through') {
    if (newHead.x < 0) newHead.x = 19;
    if (newHead.x > 19) newHead.x = 0;
    if (newHead.y < 0) newHead.y = 19;
    if (newHead.y > 19) newHead.y = 0;
  } else {
    // Wall collision ends game
    if (newHead.x < 0 || newHead.x > 19 || newHead.y < 0 || newHead.y > 19) {
      game.isActive = false;
      return;
    }
  }

  game.snake.unshift(newHead);

  // Check food collision
  if (newHead.x === game.food.x && newHead.y === game.food.y) {
    game.score += 10;
    game.food = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
  } else {
    game.snake.pop();
  }

  // Limit snake length for display
  if (game.snake.length > 50) {
    game.snake = game.snake.slice(0, 50);
  }
}
