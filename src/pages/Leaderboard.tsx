import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { Helmet } from 'react-helmet-async';

const Leaderboard = () => {
  return (
    <Layout>
      <Helmet>
        <title>Leaderboard - Snake Arena</title>
        <meta name="description" content="View the top Snake players and their high scores. Filter by game mode." />
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-mono font-bold text-center mb-8">
          TOP PLAYERS
        </h1>
        <LeaderboardTable />
      </div>
    </Layout>
  );
};

export default Leaderboard;
