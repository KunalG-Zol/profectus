import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ isLandingPage }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to root (will show LandingPage after logout)
  };

  return (
    <nav className="bg-rich-black border-b border-orange-500/20">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-k95 text-2xl text-orange-500">
          Profectus
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated() ? (
            <>
              <Link
                to="/projects"
                className="font-josefin text-white-smoke hover:text-orange-500 transition-colors"
              >
                Projects
              </Link>
              <Link
                to="/profile"
                className="font-josefin text-white-smoke hover:text-orange-500 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-orange-500 hover:bg-orange-600 text-white-smoke font-josefin font-bold py-2 px-6 rounded-lg transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-josefin text-white-smoke hover:text-orange-500 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-orange-500 hover:bg-orange-600 text-white-smoke font-josefin font-bold py-2 px-6 rounded-lg transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
