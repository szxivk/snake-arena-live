import React from 'react';
import { Button } from '@/components/ui/button';
import { Direction } from '@/types/game';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  disabled?: boolean;
}

export function GameControls({ onDirectionChange, disabled }: GameControlsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-fit">
      <div />
      <Button
        variant="secondary"
        size="icon"
        onClick={() => onDirectionChange('up')}
        disabled={disabled}
        className="h-12 w-12"
      >
        <ChevronUp className="h-6 w-6" />
      </Button>
      <div />
      
      <Button
        variant="secondary"
        size="icon"
        onClick={() => onDirectionChange('left')}
        disabled={disabled}
        className="h-12 w-12"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => onDirectionChange('down')}
        disabled={disabled}
        className="h-12 w-12"
      >
        <ChevronDown className="h-6 w-6" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => onDirectionChange('right')}
        disabled={disabled}
        className="h-12 w-12"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
