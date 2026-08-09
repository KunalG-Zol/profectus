import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FolderKanban, LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 shrink-0">
    <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="14" fill="#142330" />
      <path d="M14 42h6v8h-6z" fill="#bb6a3c" />
      <path d="M25 32h6v18h-6z" fill="#cd7f4c" />
      <path d="M36 22h6v28h-6z" fill="#dd9a68" />
      <path d="M14 34l11-10 11-10 8-8" stroke="#bb6a3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 6h8v8" stroke="#bb6a3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="font-k95 text-xl text-white-smoke tracking-wide">Profectus</span>
  </Link>
);

const Navbar = ({ isLandingPage }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(!isLandingPage);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLandingPage) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLandingPage]);

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate('/');
  };

  const solid = scrolled || !isLandingPage;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        solid
          ? 'bg-rich-black/80 backdrop-blur-md border-b border-white-smoke/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated() ? (
            <>
              <Link
                to="/projects"
                className="font-josefin text-white-smoke/90 hover:text-orange-500 transition-colors flex items-center gap-1.5"
              >
                <FolderKanban size={17} />
                Projects
              </Link>
              <Link
                to="/profile"
                className="font-josefin text-white-smoke/90 hover:text-orange-500 transition-colors flex items-center gap-1.5"
              >
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full ring-1 ring-orange-500/40" />
                ) : (
                  <User size={17} />
                )}
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-orange-500 hover:bg-orange-600 text-white-smoke font-josefin font-bold py-2 px-5 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white-smoke font-josefin font-bold py-2 px-6 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white-smoke p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-rich-black/95 backdrop-blur-md border-b border-white-smoke/10"
          >
            <div className="px-4 sm:px-6 py-4 flex flex-col gap-4">
              {isAuthenticated() ? (
                <>
                  <Link
                    to="/projects"
                    onClick={() => setMobileOpen(false)}
                    className="font-josefin text-white-smoke/90 flex items-center gap-2 py-1"
                  >
                    <FolderKanban size={18} />
                    Projects
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="font-josefin text-white-smoke/90 flex items-center gap-2 py-1"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-orange-500 hover:bg-orange-600 text-white-smoke font-josefin font-bold py-2.5 px-5 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="bg-orange-500 hover:bg-orange-600 text-white-smoke font-josefin font-bold py-2.5 px-6 rounded-lg transition-all text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
