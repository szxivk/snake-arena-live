import { useState, useCallback, useEffect, useRef } from 'react';
import {
  GameState,
  Position,
  Direction,
  GameMode,
  GRID_SIZE,
  INITIAL_SPEED,
  SPEED_INCREMENT,
  MIN_SPEED,
} from '@/types/game';

const getInitialState = (mode: GameMode): GameState => ({
  snake: [{ x: 10, y: 10 }],
  food: generateFood([{ x: 10, y: 10 }]),
  direction: 'right',
  score: 0,
  isPlaying: false,
  isGameOver: false,
  mode,
  speed: INITIAL_SPEED,
});

function generateFood(snake: Position[]): Position {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
}

export function useGameLogic(initialMode: GameMode = 'walls') {
  const [gameState, setGameState] = useState<GameState>(() => getInitialState(initialMode));
  const directionRef = useRef<Direction>(gameState.direction);
  const gameLoopRef = useRef<number | null>(null);

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.isGameOver) return prev;

      const head = prev.snake[0];
      const direction = directionRef.current;

      const moves: Record<Direction, Position> = {
        up: { x: head.x, y: head.y - 1 },
        down: { x: head.x, y: head.y + 1 },
        left: { x: head.x - 1, y: head.y },
        right: { x: head.x + 1, y: head.y },
      };

      let newHead = moves[direction];

      // Handle wall collision based on mode
      if (prev.mode === 'pass-through') {
        // Wrap around
        if (newHead.x < 0) newHead = { ...newHead, x: GRID_SIZE - 1 };
        if (newHead.x >= GRID_SIZE) newHead = { ...newHead, x: 0 };
        if (newHead.y < 0) newHead = { ...newHead, y: GRID_SIZE - 1 };
        if (newHead.y >= GRID_SIZE) newHead = { ...newHead, y: 0 };
      } else {
        // Wall collision = game over
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          return { ...prev, isPlaying: false, isGameOver: true };
        }
      }

      // Self collision
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...prev, isPlaying: false, isGameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;
      let newSpeed = prev.speed;

      // Food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10;
        newSpeed = Math.max(MIN_SPEED, prev.speed - SPEED_INCREMENT);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        speed: newSpeed,
        direction,
      };
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...getInitialState(prev.mode),
      isPlaying: true,
    }));
    directionRef.current = 'right';
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver) return prev;
      return { ...prev, isPlaying: true };
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver) return prev;
      return { ...prev, isPlaying: !prev.isPlaying };
    });
  }, []);

  const setMode = useCallback((mode: GameMode) => {
    setGameState(prev => ({
      ...getInitialState(mode),
    }));
    directionRef.current = 'right';
  }, []);

  const changeDirection = useCallback((newDirection: Direction) => {
    const opposites: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };

    if (opposites[newDirection] !== directionRef.current) {
      directionRef.current = newDirection;
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, gameState.speed);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isGameOver, gameState.speed, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyDirections: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
        W: 'up',
        S: 'down',
        A: 'left',
        D: 'right',
      };

      if (keyDirections[e.key]) {
        e.preventDefault();
        changeDirection(keyDirections[e.key]);
      }

      if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, togglePause]);

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    togglePause,
    setMode,
    changeDirection,
  };
}

// Export pure functions for testing
export const gameLogicTestHelpers = {
  generateFood,
  getInitialState,
};
