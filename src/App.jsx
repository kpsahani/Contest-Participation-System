import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ContestList from './pages/ContestList';
import ContestDetail from './pages/ContestDetail';
import CreateContest from './pages/CreateContest';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminUserList from './pages/AdminUserList';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contests" element={<ContestList />} />
                <Route path="/contests/create" element={
                  <AdminRoute>
                    <CreateContest />
                  </AdminRoute>
                } />
                <Route path="/contests/:id" element={
                  <ProtectedRoute>
                    <ContestDetail />
                  </ProtectedRoute>
                } />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminRoute>
                    <AdminUserList />
                  </AdminRoute>
                } />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;