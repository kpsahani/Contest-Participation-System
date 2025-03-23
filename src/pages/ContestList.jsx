import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CalendarDays, Trophy, Users, Plus, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { contestsApi } from '../services/api';

const ContestList = () => {
  const { user } = useSelector((state) => state.auth);
  const [statusFilter, setStatusFilter] = useState('published'); // active, draft, completed

  const { data: contests = [], isLoading, error } = useQuery({
    queryKey: ['contests', statusFilter, user?.role],
    queryFn: async () => {
      try {
        const response = await contestsApi.getAll(user?.role === 'admin');
        return response.data;
      } catch (error) {
        console.error('Error fetching contests:', error);
        throw new Error(error.response?.data?.message || 'Failed to load contests');
      }
    },
    // enabled: !!user // Only fetch if user is logged in
  });

  const filteredContests = contests.filter(contest => {
    if (!user?.role === 'admin') {
      return contest.status === 'published';
    }
    
    return statusFilter === 'all' ? true : contest.status === statusFilter;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    console.error('Contest list error:', error);
    toast.error(error.message || 'Failed to load contests');
    return (
      <div className="text-center text-red-500">
        {error.message || 'Failed to load contests. Please try again later.'}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Contests</h1>
        <div className="flex items-center gap-4">
          {user?.role === 'admin' && (
            <>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input py-1"
                >
                  <option value="all">All</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <Link
                to="/contests/create"
                className="btn-primary"
              >
                <Plus className="w-4 h-4" /> Create Contest
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContests?.map((contest) => (
          <div
            key={contest._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{contest.title}</h2>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-1 text-xs rounded ${
                    contest.accessLevel === 'vip' 
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {contest.accessLevel.toUpperCase()}
                  </span>
                  {user?.role === 'admin' && (
                    <span className={`px-2 py-1 text-xs rounded ${
                      contest.status === 'active' 
                        ? 'bg-blue-100 text-blue-700'
                        : contest.status === 'draft'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {contest.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {contest.description}
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span>
                    Starts: {new Date(contest.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{contest.participants?.length || 0} Participants</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  <span>{contest.questions?.length || 0} Questions</span>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to={`/contests/${contest._id}`}
                  className={`w-full text-center py-2 px-4 rounded-md ${
                    user
                      ? contest.status === 'published'
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : contest.status === 'draft' && user?.role === 'admin'
                        ? 'bg-gray-500 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      toast.error('Please login to participate in contests');
                    } else if (contest.status !== 'published' && user?.role !== 'admin') {
                      e.preventDefault();
                      toast.error('This contest is not active');
                    }
                  }}
                >
                  {user
                    ? contest.status === 'published'
                      ? 'View Contest'
                      : contest.status === 'draft' && user?.role === 'admin'
                      ? 'Edit Draft'
                      : 'Contest Not Available'
                    : 'Login to Participate'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestList;
