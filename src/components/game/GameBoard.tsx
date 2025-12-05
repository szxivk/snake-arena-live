import React from 'react';
import { Position, GRID_SIZE, CELL_SIZE } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  isGameOver?: boolean;
  className?: string;
}

export function GameBoard({ snake, food, isGameOver, className }: GameBoardProps) {
  const boardSize = GRID_SIZE * CELL_SIZE;

  return (
    <div 
      className={cn(
        "relative border-4 border-game-border bg-game-screen",
        isGameOver && "opacity-70",
        className
      )}
      style={{ 
        width: boardSize, 
        height: boardSize,
      }}
    >
      {/* Grid pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--game-cell)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--game-cell)) 1px, transparent 1px)
          `,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
        }}
      />

      {/* Food */}
      <div
        className="absolute bg-game-food"
        style={{
          width: CELL_SIZE - 2,
          height: CELL_SIZE - 2,
          left: food.x * CELL_SIZE + 1,
          top: food.y * CELL_SIZE + 1,
        }}
      />

      {/* Snake */}
      {snake.map((segment, index) => (
        <div
          key={`${segment.x}-${segment.y}-${index}`}
          className={cn(
            "absolute bg-game-snake",
            index === 0 && "z-10"
          )}
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: segment.x * CELL_SIZE + 1,
            top: segment.y * CELL_SIZE + 1,
          }}
        />
      ))}
    </div>
  );
}
