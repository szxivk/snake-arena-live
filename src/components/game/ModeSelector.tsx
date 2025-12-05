import React from 'react';
import { GameMode } from '@/types/game';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  disabled?: boolean;
}

export function ModeSelector({ currentMode, onModeChange, disabled }: ModeSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentMode === 'walls' ? 'default' : 'secondary'}
        onClick={() => onModeChange('walls')}
        disabled={disabled}
        className={cn(
          "font-mono text-sm",
          currentMode === 'walls' && "shadow-sm"
        )}
      >
        WALLS
      </Button>
      <Button
        variant={currentMode === 'pass-through' ? 'default' : 'secondary'}
        onClick={() => onModeChange('pass-through')}
        disabled={disabled}
        className={cn(
          "font-mono text-sm",
          currentMode === 'pass-through' && "shadow-sm"
        )}
      >
        PASS-THROUGH
      </Button>
    </div>
  );
}
