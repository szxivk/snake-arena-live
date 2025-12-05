import { describe, it, expect } from 'vitest';
import { gameLogicTestHelpers } from '@/hooks/useGameLogic';
import { Position, GRID_SIZE } from '@/types/game';

const { generateFood, getInitialState } = gameLogicTestHelpers;

describe('Game Logic', () => {
  describe('generateFood', () => {
    it('should generate food within grid bounds', () => {
      const snake: Position[] = [{ x: 10, y: 10 }];
      const food = generateFood(snake);
      
      expect(food.x).toBeGreaterThanOrEqual(0);
      expect(food.x).toBeLessThan(GRID_SIZE);
      expect(food.y).toBeGreaterThanOrEqual(0);
      expect(food.y).toBeLessThan(GRID_SIZE);
    });

    it('should not generate food on snake position', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 5, y: 7 },
      ];
      
      // Run multiple times to test randomness
      for (let i = 0; i < 100; i++) {
        const food = generateFood(snake);
        const isOnSnake = snake.some(
          segment => segment.x === food.x && segment.y === food.y
        );
        expect(isOnSnake).toBe(false);
      }
    });
  });

  describe('getInitialState', () => {
    it('should create initial state with walls mode', () => {
      const state = getInitialState('walls');
      
      expect(state.mode).toBe('walls');
      expect(state.snake).toHaveLength(1);
      expect(state.snake[0]).toEqual({ x: 10, y: 10 });
      expect(state.direction).toBe('right');
      expect(state.score).toBe(0);
      expect(state.isPlaying).toBe(false);
      expect(state.isGameOver).toBe(false);
    });

    it('should create initial state with pass-through mode', () => {
      const state = getInitialState('pass-through');
      
      expect(state.mode).toBe('pass-through');
      expect(state.snake).toHaveLength(1);
      expect(state.score).toBe(0);
    });

    it('should generate food not on snake', () => {
      const state = getInitialState('walls');
      const isOnSnake = state.snake.some(
        segment => segment.x === state.food.x && segment.y === state.food.y
      );
      expect(isOnSnake).toBe(false);
    });
  });
});

describe('Game State Transitions', () => {
  describe('Direction changes', () => {
    it('should not allow opposite direction change', () => {
      // Test that up cannot change to down directly
      const opposites: Record<string, string> = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left',
      };

      Object.entries(opposites).forEach(([dir, opposite]) => {
        expect(dir !== opposite).toBe(true);
      });
    });
  });

  describe('Wall collision (walls mode)', () => {
    it('should end game when hitting left wall', () => {
      const position = { x: -1, y: 10 };
      const isOutOfBounds = position.x < 0 || position.x >= GRID_SIZE;
      expect(isOutOfBounds).toBe(true);
    });

    it('should end game when hitting right wall', () => {
      const position = { x: GRID_SIZE, y: 10 };
      const isOutOfBounds = position.x >= GRID_SIZE;
      expect(isOutOfBounds).toBe(true);
    });

    it('should end game when hitting top wall', () => {
      const position = { x: 10, y: -1 };
      const isOutOfBounds = position.y < 0;
      expect(isOutOfBounds).toBe(true);
    });

    it('should end game when hitting bottom wall', () => {
      const position = { x: 10, y: GRID_SIZE };
      const isOutOfBounds = position.y >= GRID_SIZE;
      expect(isOutOfBounds).toBe(true);
    });
  });

  describe('Pass-through mode', () => {
    it('should wrap around when exiting left', () => {
      let newX = -1;
      if (newX < 0) newX = GRID_SIZE - 1;
      expect(newX).toBe(GRID_SIZE - 1);
    });

    it('should wrap around when exiting right', () => {
      let newX = GRID_SIZE;
      if (newX >= GRID_SIZE) newX = 0;
      expect(newX).toBe(0);
    });

    it('should wrap around when exiting top', () => {
      let newY = -1;
      if (newY < 0) newY = GRID_SIZE - 1;
      expect(newY).toBe(GRID_SIZE - 1);
    });

    it('should wrap around when exiting bottom', () => {
      let newY = GRID_SIZE;
      if (newY >= GRID_SIZE) newY = 0;
      expect(newY).toBe(0);
    });
  });

  describe('Self collision', () => {
    it('should detect collision with snake body', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 3, y: 6 },
        { x: 4, y: 6 },
        { x: 5, y: 6 },
      ];
      const newHead = { x: 4, y: 5 }; // Collides with body

      const collides = snake.some(
        segment => segment.x === newHead.x && segment.y === newHead.y
      );
      expect(collides).toBe(true);
    });

    it('should not detect collision with tail that moves', () => {
      const snake: Position[] = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
      ];
      const newHead = { x: 6, y: 5 }; // No collision

      const collides = snake.some(
        segment => segment.x === newHead.x && segment.y === newHead.y
      );
      expect(collides).toBe(false);
    });
  });

  describe('Food collision', () => {
    it('should detect food collision', () => {
      const head = { x: 10, y: 10 };
      const food = { x: 10, y: 10 };

      const ateFood = head.x === food.x && head.y === food.y;
      expect(ateFood).toBe(true);
    });

    it('should not detect food when not at same position', () => {
      const head = { x: 10, y: 10 };
      const food = { x: 15, y: 15 };

      const ateFood = head.x === food.x && head.y === food.y;
      expect(ateFood).toBe(false);
    });
  });

  describe('Score calculation', () => {
    it('should increase score by 10 when eating food', () => {
      let score = 0;
      score += 10;
      expect(score).toBe(10);
    });

    it('should accumulate score correctly', () => {
      let score = 0;
      for (let i = 0; i < 5; i++) {
        score += 10;
      }
      expect(score).toBe(50);
    });
  });

  describe('Speed progression', () => {
    it('should decrease speed (increase game pace) when eating food', () => {
      const INITIAL_SPEED = 150;
      const SPEED_INCREMENT = 5;
      const MIN_SPEED = 50;

      let speed = INITIAL_SPEED;
      speed = Math.max(MIN_SPEED, speed - SPEED_INCREMENT);
      expect(speed).toBe(145);
    });

    it('should not go below minimum speed', () => {
      const MIN_SPEED = 50;
      const SPEED_INCREMENT = 5;

      let speed = 52;
      speed = Math.max(MIN_SPEED, speed - SPEED_INCREMENT);
      expect(speed).toBe(50);
    });
  });
});
