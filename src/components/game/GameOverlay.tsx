import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameOverlayProps {
  type: 'start' | 'paused' | 'gameover';
  score?: number;
  onStart: () => void;
  onResume?: () => void;
  className?: string;
}

export function GameOverlay({ type, score, onStart, onResume, className }: GameOverlayProps) {
  return (
    <div className={cn(
      "absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-20",
      className
    )}>
      {type === 'start' && (
        <>
          <h2 className="text-2xl font-mono font-bold mb-4 text-primary">SNAKE</h2>
          <p className="text-sm text-muted-foreground mb-4 font-mono">
            Use arrow keys or WASD to move
          </p>
          <Button onClick={onStart} className="font-mono">
            START GAME
          </Button>
        </>
      )}

      {type === 'paused' && (
        <>
          <h2 className="text-2xl font-mono font-bold mb-4 text-primary">PAUSED</h2>
          <p className="text-sm text-muted-foreground mb-4 font-mono">
            Press SPACE to resume
          </p>
          <Button onClick={onResume} className="font-mono">
            RESUME
          </Button>
        </>
      )}

      {type === 'gameover' && (
        <>
          <h2 className="text-2xl font-mono font-bold mb-2 text-destructive">GAME OVER</h2>
          {score !== undefined && (
            <p className="text-lg font-mono mb-4 text-primary">
              SCORE: {score}
            </p>
          )}
          <Button onClick={onStart} className="font-mono">
            PLAY AGAIN
          </Button>
        </>
      )}
    </div>
  );
}
