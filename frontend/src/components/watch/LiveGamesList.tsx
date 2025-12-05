import React, { useState, useEffect } from 'react';
import { LiveGame } from '@/types/game';
import { liveGamesApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Eye, Users, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveGamesListProps {
  onSelectGame: (game: LiveGame) => void;
  selectedGameId?: string;
}

export function LiveGamesList({ onSelectGame, selectedGameId }: LiveGamesListProps) {
  const [games, setGames] = useState<LiveGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadGames = async () => {
    setIsLoading(true);
    try {
      const data = await liveGamesApi.getLiveGames();
      setGames(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    liveGamesApi.startSimulation();
    loadGames();

    const interval = setInterval(loadGames, 3000);

    return () => {
      clearInterval(interval);
      liveGamesApi.stopSimulation();
    };
  }, []);

  return (
    <div className="border-4 border-border bg-card">
      <div className="border-b-4 border-border p-4 flex items-center justify-between">
        <h2 className="text-xl font-mono font-bold flex items-center gap-2">
          <Users className="h-5 w-5" />
          LIVE GAMES
        </h2>
        <Button variant="ghost" size="icon" onClick={loadGames}>
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      </div>

      {isLoading && games.length === 0 ? (
        <div className="p-8 text-center font-mono text-muted-foreground">
          SEARCHING FOR GAMES...
        </div>
      ) : games.length === 0 ? (
        <div className="p-8 text-center font-mono text-muted-foreground">
          NO LIVE GAMES RIGHT NOW
        </div>
      ) : (
        <div className="divide-y-2 divide-border">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game)}
              className={cn(
                "w-full flex items-center p-4 gap-4 hover:bg-secondary transition-colors text-left",
                selectedGameId === game.id && "bg-secondary"
              )}
            >
              <div className="w-8 h-8 border-2 border-border flex items-center justify-center bg-accent">
                <Eye className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-mono font-bold">{game.playerName}</div>
                <div className="text-xs font-mono text-muted-foreground">
                  {game.mode.toUpperCase()} • Playing now
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-primary">
                  {game.score}
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  SCORE
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
