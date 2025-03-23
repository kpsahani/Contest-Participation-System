import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { History, Award, User, Settings, Plus, List, BarChart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('history');

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['contestHistory', user.id],
    queryFn: () =>
      api.get(`users/${user.id}/history`).then((res) => res.data),
    enabled: !!user,
    onError: () => {
      toast.error('Failed to load contest history');
    }
  });

  const { data: prizes, isLoading: prizesLoading } = useQuery({
    queryKey: ['prizes', user.id],
    queryFn: () =>
      api.get(`users/${user.id}/prizes`).then((res) => res.data),
    enabled: !!user,
    onError: () => {
      toast.error('Failed to load prizes');
    }
  });

  if (historyLoading || prizesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {console.log("user", user)}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Points</p>
              <p className="text-2xl font-bold text-blue-600">
                {user.points || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-lg font-semibold capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/contests/create"
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-600">Create Contest</p>
                <p className="text-sm text-gray-500">Add a new contest</p>
              </div>
            </Link>
            <Link
              to="/contests"
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <List className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-600">Manage Contests</p>
                <p className="text-sm text-gray-500">View and edit contests</p>
              </div>
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <BarChart className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-600">Leaderboards</p>
                <p className="text-sm text-gray-500">View all rankings</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 px-6 text-sm font-medium ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <History className="w-5 h-5 inline mr-2" />
            Contest History
          </button>
          <button
            className={`flex-1 py-4 px-6 text-sm font-medium ${
              activeTab === 'prizes'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('prizes')}
          >
            <Award className="w-5 h-5 inline mr-2" />
            Prizes Won
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'history' ? (
            <div className="space-y-4">
              {history?.length > 0 ? (
                history.map((contest) => (
                  <div
                    key={contest.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <h3 className="font-semibold">{contest.title}</h3>
                    <div className="mt-2 flex justify-between text-sm text-gray-500">
                      <span>
                        Date:{' '}
                        {new Date(contest.startDate).toLocaleDateString()}
                      </span>
                      <span>Score: {contest.score}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No contest history available
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {prizes?.length > 0 ? (
                prizes.map((prize, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <h3 className="font-semibold">{prize.contestTitle}</h3>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-yellow-600 font-medium">
                        {prize.prize}
                      </span>
                      <span className="text-gray-500">
                        {new Date(prize.dateWon).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No prizes won yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
