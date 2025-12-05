import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, GameMode } from '@/types/game';
import { leaderboardApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Trophy, Medal } from 'lucide-react';

export function LeaderboardTable() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<GameMode | 'all'>('all');

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = await leaderboardApi.getLeaderboard(
          filter === 'all' ? undefined : filter
        );
        setEntries(data);
      } finally {
        setIsLoading(false);
      }
    };
    loadLeaderboard();
  }, [filter]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-chart-4" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-chart-1" />;
    return <span className="font-mono text-sm">{rank}</span>;
  };

  return (
    <div className="border-4 border-border bg-card">
      <div className="border-b-4 border-border p-4">
        <h2 className="text-xl font-mono font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          LEADERBOARD
        </h2>
        <div className="flex gap-2 mt-4">
          {(['all', 'walls', 'pass-through'] as const).map((mode) => (
            <Button
              key={mode}
              variant={filter === mode ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFilter(mode)}
              className="font-mono text-xs"
            >
              {mode.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center font-mono text-muted-foreground">
          LOADING...
        </div>
      ) : entries.length === 0 ? (
        <div className="p-8 text-center font-mono text-muted-foreground">
          NO SCORES YET
        </div>
      ) : (
        <div className="divide-y-2 divide-border">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className={cn(
                "flex items-center p-4 gap-4",
                index < 3 && "bg-secondary"
              )}
            >
              <div className="w-10 flex justify-center">
                {getRankIcon(index + 1)}
              </div>
              <div className="flex-1">
                <div className="font-mono font-bold">{entry.username}</div>
                <div className="text-xs font-mono text-muted-foreground">
                  {entry.mode.toUpperCase()} • {new Date(entry.date).toLocaleDateString()}
                </div>
              </div>
              <div className="font-mono text-xl font-bold text-primary">
                {entry.score.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
