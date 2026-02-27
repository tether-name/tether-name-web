import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import logo from '../assets/logo.png';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#2a2a2a] border-b border-[#444] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold hover:opacity-80">
              <img src={logo} alt="Tether.name" className="h-8 w-8 rounded" />
              <span>
                <span className="text-[#f4b049]">tether</span>
                {' '}
                <span className="text-[#61d396]">name</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            {user ? (
              <>
                <span className="text-gray-400 text-sm hidden md:inline truncate max-w-[200px]">
                  {user.email}
                </span>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white px-2 sm:px-3 py-2 text-sm font-medium whitespace-nowrap"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="border border-gray-500 hover:border-gray-400 text-gray-300 hover:text-white px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/challenge"
                  className="border border-[#f4b049] bg-[#f4b049] text-[#333] hover:bg-[#e5a03a] px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Verify
                </Link>
                <Link
                  to="/auth"
                  className="border border-[#61d397] bg-[#61d397] text-[#333] hover:bg-[#52c488] px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center space-x-1"
                >
                  <span>Sign-In</span>
                  <span>→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
