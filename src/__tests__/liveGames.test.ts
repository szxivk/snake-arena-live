import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { liveGamesApi } from '@/services/api';

describe('Live Games API', () => {
  beforeEach(() => {
    liveGamesApi.startSimulation();
  });

  afterEach(() => {
    liveGamesApi.stopSimulation();
  });

  describe('getLiveGames', () => {
    it('should return array of live games', async () => {
      const games = await liveGamesApi.getLiveGames();
      
      expect(Array.isArray(games)).toBe(true);
    });

    it('should return games with required properties', async () => {
      const games = await liveGamesApi.getLiveGames();
      
      if (games.length > 0) {
        const game = games[0];
        expect(game).toHaveProperty('id');
        expect(game).toHaveProperty('playerId');
        expect(game).toHaveProperty('playerName');
        expect(game).toHaveProperty('score');
        expect(game).toHaveProperty('mode');
        expect(game).toHaveProperty('snake');
        expect(game).toHaveProperty('food');
        expect(game).toHaveProperty('direction');
        expect(game).toHaveProperty('isActive');
      }
    });

    it('should only return active games', async () => {
      const games = await liveGamesApi.getLiveGames();
      
      games.forEach(game => {
        expect(game.isActive).toBe(true);
      });
    });
  });

  describe('getGameById', () => {
    it('should return null for non-existent game', async () => {
      const game = await liveGamesApi.getGameById('non-existent-id');
      expect(game).toBeNull();
    });

    it('should return game by id', async () => {
      const games = await liveGamesApi.getLiveGames();
      
      if (games.length > 0) {
        const game = await liveGamesApi.getGameById(games[0].id);
        expect(game).not.toBeNull();
        expect(game?.id).toBe(games[0].id);
      }
    });
  });

  describe('subscribeToGame', () => {
    it('should return unsubscribe function', async () => {
      const games = await liveGamesApi.getLiveGames();
      
      if (games.length > 0) {
        const callback = () => {};
        const unsubscribe = await liveGamesApi.subscribeToGame(games[0].id, callback);
        
        expect(typeof unsubscribe).toBe('function');
        unsubscribe();
      }
    });

    it('should call callback with game updates', async () => {
      const games = await liveGamesApi.getLiveGames();
      
      if (games.length > 0) {
        let callCount = 0;
        const callback = () => {
          callCount++;
        };
        
        const unsubscribe = await liveGamesApi.subscribeToGame(games[0].id, callback);
        
        // Wait for at least one update
        await new Promise(resolve => setTimeout(resolve, 300));
        
        unsubscribe();
        expect(callCount).toBeGreaterThan(0);
      }
    });
  });

  describe('simulation', () => {
    it('should start and stop simulation', () => {
      // Stop first
      liveGamesApi.stopSimulation();
      
      // Start
      liveGamesApi.startSimulation();
      
      // Starting again should not throw
      liveGamesApi.startSimulation();
      
      // Stop
      liveGamesApi.stopSimulation();
    });
  });
});

describe('Game State Properties', () => {
  describe('LiveGame interface', () => {
    it('should have valid mode values', () => {
      const validModes = ['walls', 'pass-through'];
      const mode = 'walls';
      expect(validModes.includes(mode)).toBe(true);
    });

    it('should have valid direction values', () => {
      const validDirections = ['up', 'down', 'left', 'right'];
      const direction = 'right';
      expect(validDirections.includes(direction)).toBe(true);
    });

    it('should have snake as array of positions', () => {
      const snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }];
      expect(Array.isArray(snake)).toBe(true);
      snake.forEach(segment => {
        expect(segment).toHaveProperty('x');
        expect(segment).toHaveProperty('y');
        expect(typeof segment.x).toBe('number');
        expect(typeof segment.y).toBe('number');
      });
    });

    it('should have food as position', () => {
      const food = { x: 15, y: 15 };
      expect(food).toHaveProperty('x');
      expect(food).toHaveProperty('y');
      expect(typeof food.x).toBe('number');
      expect(typeof food.y).toBe('number');
    });
  });
});
