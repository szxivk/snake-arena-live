import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { LiveGamesList } from '@/components/watch/LiveGamesList';
import { GameViewer } from '@/components/watch/GameViewer';
import { LiveGame } from '@/types/game';
import { Helmet } from 'react-helmet-async';

const Watch = () => {
  const [selectedGame, setSelectedGame] = useState<LiveGame | null>(null);

  return (
    <Layout>
      <Helmet>
        <title>Watch Live Games - Snake Arena</title>
        <meta name="description" content="Watch other players play Snake in real-time. Spectate live games and learn from the best." />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-mono font-bold text-center mb-8">
          WATCH LIVE
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <LiveGamesList
              onSelectGame={setSelectedGame}
              selectedGameId={selectedGame?.id}
            />
          </div>
          <div className="lg:col-span-2">
            <GameViewer game={selectedGame} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Watch;
