import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Users,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const dashboardPath =
    user?.role === 'super_admin' ? '/admin' : '/dashboard';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-colors">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-gray-900 font-bold text-lg leading-tight">UniClubs</span>
              <p className="text-xs text-gray-500 leading-none">University Portal</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/clubs"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/clubs') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BookOpen size={15} />
              Clubs
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 leading-tight">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize leading-none">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to={dashboardPath}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {user.role === 'super_admin' ? (
                        <Users size={15} className="text-gray-400" />
                      ) : (
                        <LayoutDashboard size={15} className="text-gray-400" />
                      )}
                      {user.role === 'super_admin' ? 'Admin Panel' : 'My Dashboard'}
                    </Link>
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?tab=register"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Home</Link>
          <Link to="/clubs" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Clubs</Link>
          {user ? (
            <>
              <Link to={dashboardPath} onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Dashboard</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Sign In</Link>
              <Link to="/auth?tab=register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg">Join Now</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
