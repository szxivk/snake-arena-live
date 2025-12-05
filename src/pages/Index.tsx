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

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
        {/* Left side - Game Area */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-mono font-bold">PLAY SNAKE</h1>
          
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
        </div>

        {/* Right side - Controls & Info */}
        <div className="flex flex-col gap-6 min-w-[200px]">
          <ScoreDisplay score={gameState.score} />
          
          <div className="border-2 border-border p-4 bg-secondary">
            <div className="font-mono text-xs text-muted-foreground mb-2">
              CURRENT MODE
            </div>
            <div className="font-mono text-lg font-bold">
              {gameState.mode.toUpperCase()}
            </div>
          </div>

          <ModeSelector
            currentMode={gameState.mode}
            onModeChange={setMode}
            disabled={gameState.isPlaying}
          />

          <div className="border-2 border-border p-4 bg-secondary">
            <div className="font-mono text-xs text-muted-foreground mb-3">
              CONTROLS
            </div>
            <div className="font-mono text-xs space-y-1">
              <p>↑ ↓ ← → or WASD</p>
              <p>SPACE to pause</p>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden">
            <GameControls
              onDirectionChange={changeDirection}
              disabled={!gameState.isPlaying}
            />
          </div>

          {!isAuthenticated && (
            <div className="border-2 border-border p-4 bg-secondary">
              <p className="font-mono text-xs text-muted-foreground">
                LOGIN to save scores!
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
