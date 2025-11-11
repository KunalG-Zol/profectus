import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjects } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth(); // Get user from context
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedTasks: 0,
    currentStreak: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const projectsData = await getProjects();
        setProjects(projectsData.slice(0, 3));

        setStats({
          totalProjects: projectsData.length,
          activeProjects: projectsData.filter(p => p.status === 'active').length || projectsData.length,
          completedTasks: 42,
          currentStreak: 7
        });
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-rich-black to-[#071a2a]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rich-black to-[#071a2a] text-white-smoke">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-k95 text-4xl md:text-5xl mb-2">
            Welcome back, <span className="text-orange-500">{user?.name || user?.username || 'User'}</span>!
          </h1>
          <p className="font-josefin text-white-smoke/80 text-lg">
            Here's what's happening with your projects today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            className="bg-[#01080e]/60 p-6 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-josefin text-white-smoke/80">Total Projects</h3>
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="font-k95 text-4xl text-white-smoke">{stats.totalProjects}</p>
          </motion.div>

          <motion.div
            className="bg-[#01080e]/60 p-6 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-josefin text-white-smoke/80">Active Projects</h3>
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="font-k95 text-4xl text-white-smoke">{stats.activeProjects}</p>
          </motion.div>

          <motion.div
            className="bg-[#01080e]/60 p-6 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-josefin text-white-smoke/80">Tasks Completed</h3>
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-k95 text-4xl text-white-smoke">{stats.completedTasks}</p>
          </motion.div>

          <motion.div
            className="bg-[#01080e]/60 p-6 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-josefin text-white-smoke/80">Current Streak</h3>
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <p className="font-k95 text-4xl text-white-smoke">{stats.currentStreak} days</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="font-k95 text-3xl mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/create-project"
              className="bg-orange-500 hover:bg-orange-600 p-8 rounded-2xl transition-all transform hover:scale-105 shadow-lg flex flex-col items-center text-center"
            >
              <svg className="w-12 h-12 text-white-smoke mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <h3 className="font-josefin font-bold text-xl text-white-smoke">Create New Project</h3>
            </Link>

            <Link
              to="/projects"
              className="bg-[#01080e]/60 hover:bg-[#01080e]/80 p-8 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all transform hover:scale-105 flex flex-col items-center text-center"
            >
              <svg className="w-12 h-12 text-orange-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <h3 className="font-josefin font-bold text-xl text-white-smoke">View All Projects</h3>
            </Link>

            <Link
              to="/profile"
              className="bg-[#01080e]/60 hover:bg-[#01080e]/80 p-8 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all transform hover:scale-105 flex flex-col items-center text-center"
            >
              <svg className="w-12 h-12 text-orange-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="font-josefin font-bold text-xl text-white-smoke">My Profile</h3>
            </Link>
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-k95 text-3xl">Recent Projects</h2>
            <Link
              to="/projects"
              className="font-josefin text-orange-500 hover:text-orange-400 flex items-center transition-colors"
            >
              View All
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="bg-[#01080e]/60 p-12 rounded-2xl border border-orange-500/20 text-center">
              <svg className="w-16 h-16 text-orange-500/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="font-josefin text-2xl font-bold mb-2">No Projects Yet</h3>
              <p className="font-josefin text-white-smoke/80 mb-6">Start your journey by creating your first project!</p>
              <Link
                to="/create-project"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white-smoke font-josefin font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
              >
                Create Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="bg-[#01080e]/60 p-6 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all backdrop-blur-sm flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <div>
                    <h3 className="font-josefin font-bold text-2xl mb-2 text-orange-400">{project.title}</h3>
                    <p className="font-josefin text-white-smoke/80 mb-4 line-clamp-3">{project.description}</p>
                  </div>
                  <Link
                    to={`/roadmap/${project.id}`}
                    className="text-center bg-blue-500 hover:bg-blue-600 text-white-smoke font-josefin font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 w-full"
                  >
                    View Roadmap
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
