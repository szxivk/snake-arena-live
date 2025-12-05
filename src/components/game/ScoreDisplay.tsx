import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  label?: string;
  className?: string;
}

export function ScoreDisplay({ score, label = 'SCORE', className }: ScoreDisplayProps) {
  return (
    <div className={cn("text-center font-mono", className)}>
      <div className="text-xs text-muted-foreground tracking-wider">{label}</div>
      <div className="text-3xl font-bold text-primary tracking-widest">
        {score.toString().padStart(5, '0')}
      </div>
    </div>
  );
}
