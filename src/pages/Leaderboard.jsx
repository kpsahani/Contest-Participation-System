import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Leaderboard = () => {
  const [selectedContest, setSelectedContest] = useState(null);

  const { data: contests } = useQuery({
    queryKey: ['contests'],
    queryFn: () => api.get('/contests').then((res) => res.data)
  });

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', selectedContest],
    queryFn: () =>
      api
        .get(
          selectedContest
            ? `/contests/${selectedContest}/leaderboard`
            : '/contests/all/leaderboard'
        )
        .then((res) => res.data),
    onError: () => {
      toast.error('Failed to load leaderboard');
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
          {selectedContest ? 'Contest Leaderboard' : 'Global Leaderboard'}
        </h1>
        <select
          className="px-4 py-2 border rounded-md"
          value={selectedContest || ''}
          onChange={(e) => setSelectedContest(e.target.value || null)}
        >
          <option value="">Global Leaderboard</option>
          {contests?.map((contest) => (
            <option key={contest._id} value={contest._id}>
              {contest.title}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                {selectedContest && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submission Time
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard?.map((entry, index) => (
                <tr
                  key={index}
                  className={index < 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index < 3 ? (
                        <Medal
                          className={`w-5 h-5 mr-2 ${
                            index === 0
                              ? 'text-yellow-500'
                              : index === 1
                              ? 'text-gray-400'
                              : 'text-yellow-700'
                          }`}
                        />
                      ) : (
                        <span className="w-5 h-5 mr-2">{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {entry.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.score}</div>
                  </td>
                  {selectedContest && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(entry.submittedAt).toLocaleString()}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
