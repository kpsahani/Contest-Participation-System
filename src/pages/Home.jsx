import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl mx-auto px-4">
        <Trophy className="w-20 h-20 text-blue-600 mx-auto mb-8" />
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to ContestHub
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Join exciting contests, test your knowledge, and compete with participants worldwide.
          Start your journey to become a champion today!
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/contests"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Contests
          </Link>
          <Link
            to="/leaderboard"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;