import React, { useState, useEffect } from 'react';
import { LiveGame } from '@/types/game';
import { liveGamesApi } from '@/services/api';
import { GameBoard } from '@/components/game/GameBoard';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { cn } from '@/lib/utils';

interface GameViewerProps {
  game: LiveGame | null;
  className?: string;
}

export function GameViewer({ game: initialGame, className }: GameViewerProps) {
  const [game, setGame] = useState<LiveGame | null>(initialGame);

  useEffect(() => {
    setGame(initialGame);
    if (!initialGame) return;

    let unsubscribe: (() => void) | undefined;

    const subscribe = async () => {
      unsubscribe = await liveGamesApi.subscribeToGame(initialGame.id, (updatedGame) => {
        setGame(updatedGame);
      });
    };

    subscribe();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initialGame?.id]);

  if (!game) {
    return (
      <div className={cn(
        "border-4 border-border bg-card flex items-center justify-center",
        className
      )}
        style={{ minHeight: 400 }}
      >
        <div className="text-center font-mono text-muted-foreground">
          <p className="text-lg">SELECT A GAME TO WATCH</p>
          <p className="text-sm mt-2">Choose from the list on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border-4 border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-mono font-bold text-lg">{game.playerName}</h3>
          <p className="font-mono text-sm text-muted-foreground">
            {game.mode.toUpperCase()} MODE
          </p>
        </div>
        <ScoreDisplay score={game.score} />
      </div>

      <div className="flex justify-center">
        <GameBoard
          snake={game.snake}
          food={game.food}
          isGameOver={!game.isActive}
        />
      </div>

      {!game.isActive && (
        <div className="mt-4 text-center font-mono text-destructive">
          GAME ENDED
        </div>
      )}
    </div>
  );
}
