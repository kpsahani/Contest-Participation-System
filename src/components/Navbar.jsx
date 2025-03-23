import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Trophy, Users, User, LogOut, Plus, ChevronDown, Settings } from "lucide-react";
import { loadUser, logout } from "../redux/slices/authSlice";

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="text-blue-600" size={24} />
            <span className="text-xl font-bold text-gray-800">ContestHub</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/contests" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Contests
            </Link>
            <Link to="/leaderboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Leaderboard
            </Link>

            {isAuthenticated && user?.role === "admin" && (
              <div className="relative">
                <button onClick={() => setShowAdminMenu(!showAdminMenu)} className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  <Settings className="w-5 h-5 mr-1" />
                  Admin
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link to="/contests/create" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Contest
                    </Link>
                    <Link to="/admin/users" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Link>
                  </div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                  <User size={20} />
                  <span>{user?.username}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
