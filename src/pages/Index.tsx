import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { GameBoard } from '@/components/game/GameBoard';
import { GameControls } from '@/components/game/GameControls';
import { ModeSelector } from '@/components/game/ModeSelector';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { GameOverlay } from '@/components/game/GameOverlay';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useAuthContext } from '@/contexts/AuthContext';
import { leaderboardApi } from '@/services/api';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const {
    gameState,
    startGame,
    resumeGame,
    setMode,
    changeDirection,
  } = useGameLogic('walls');

  const { isAuthenticated } = useAuthContext();

  const handleGameOver = async () => {
    if (isAuthenticated && gameState.score > 0) {
      const result = await leaderboardApi.submitScore({
        score: gameState.score,
        mode: gameState.mode,
      });
      if (result.success && result.rank) {
        toast.success(`Score submitted! Rank: #${result.rank}`);
      }
    }
  };

  React.useEffect(() => {
    if (gameState.isGameOver) {
      handleGameOver();
    }
  }, [gameState.isGameOver]);

  return (
    <Layout>
      <Helmet>
        <title>Snake Arena - Classic Snake Game</title>
        <meta name="description" content="Play the classic Snake game with walls or pass-through mode. Compete on the leaderboard and watch live games." />
      </Helmet>

      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-mono font-bold mb-2">PLAY SNAKE</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Arrow keys or WASD to move • Space to pause
          </p>
        </div>

        <ModeSelector
          currentMode={gameState.mode}
          onModeChange={setMode}
          disabled={gameState.isPlaying}
        />

        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="relative">
            <GameBoard
              snake={gameState.snake}
              food={gameState.food}
              isGameOver={gameState.isGameOver}
            />

            {!gameState.isPlaying && !gameState.isGameOver && (
              <GameOverlay type="start" onStart={startGame} />
            )}

            {!gameState.isPlaying && !gameState.isGameOver && gameState.score > 0 && (
              <GameOverlay type="paused" onStart={startGame} onResume={resumeGame} />
            )}

            {gameState.isGameOver && (
              <GameOverlay
                type="gameover"
                score={gameState.score}
                onStart={startGame}
              />
            )}
          </div>

          <div className="flex flex-col items-center gap-6">
            <ScoreDisplay score={gameState.score} />
            
            <div className="border-2 border-border p-3 bg-secondary">
              <div className="font-mono text-xs text-center text-muted-foreground mb-2">
                MODE
              </div>
              <div className="font-mono text-sm font-bold text-center">
                {gameState.mode.toUpperCase()}
              </div>
            </div>

            <div className="lg:hidden">
              <GameControls
                onDirectionChange={changeDirection}
                disabled={!gameState.isPlaying}
              />
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="border-2 border-border p-4 bg-secondary text-center">
            <p className="font-mono text-sm text-muted-foreground">
              LOGIN to save your scores to the leaderboard!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
