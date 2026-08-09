import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  FolderOpen,
  Plus,
  Rocket,
  User,
} from 'lucide-react';
import { getProjects } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card';
import { button } from '../lib/styles';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const HomePage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const projectsData = await getProjects();
        setProjects(projectsData);
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
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)] app-shell">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  const completedCount = projects.filter((p) => p.completed).length;
  const inProgressCount = projects.length - completedCount;

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderKanban },
    { label: 'In Progress', value: inProgressCount, icon: Rocket },
    { label: 'Completed', value: completedCount, icon: CheckCircle2 },
  ];

  const recentProjects = [...projects]
    .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
    .slice(0, 3);

  return (
    <div className="min-h-[calc(100vh-73px)] app-shell">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <motion.div className="mb-12" {...fadeUp()}>
          <h1 className="font-k95 text-4xl md:text-5xl mb-2">
            Welcome back, <span className="text-orange-500">{user?.name || user?.username || 'there'}</span>!
          </h1>
          <p className="font-josefin text-white-smoke/70 text-lg">
            Here's what's happening with your projects today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Card key={stat.label} {...fadeUp(0.1 + i * 0.08)} className="p-6" hover={false}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-josefin text-white-smoke/70">{stat.label}</h3>
                <stat.icon className="w-7 h-7 text-orange-500" strokeWidth={1.75} />
              </div>
              <p className="font-k95 text-4xl text-white-smoke">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div className="mb-12" {...fadeUp(0.3)}>
          <h2 className="font-k95 text-3xl mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/create-project"
              className="bg-orange-500 hover:bg-orange-600 p-8 rounded-2xl transition-all hover:scale-[1.02] shadow-lg flex flex-col items-center text-center"
            >
              <Plus className="w-11 h-11 text-white-smoke mb-4" strokeWidth={1.75} />
              <h3 className="font-josefin font-bold text-xl text-white-smoke">Create New Project</h3>
            </Link>

            <Link
              to="/projects"
              className="bg-ink/60 hover:bg-ink/80 p-8 rounded-2xl border border-white-smoke/10 hover:border-orange-500/30 transition-all hover:scale-[1.02] flex flex-col items-center text-center"
            >
              <FolderOpen className="w-11 h-11 text-white-smoke/70 mb-4" strokeWidth={1.75} />
              <h3 className="font-josefin font-bold text-xl text-white-smoke">View All Projects</h3>
            </Link>

            <Link
              to="/profile"
              className="bg-ink/60 hover:bg-ink/80 p-8 rounded-2xl border border-white-smoke/10 hover:border-orange-500/30 transition-all hover:scale-[1.02] flex flex-col items-center text-center"
            >
              <User className="w-11 h-11 text-white-smoke/70 mb-4" strokeWidth={1.75} />
              <h3 className="font-josefin font-bold text-xl text-white-smoke">My Profile</h3>
            </Link>
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div {...fadeUp(0.4)}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-k95 text-3xl">Recent Projects</h2>
            {projects.length > 0 && (
              <Link
                to="/projects"
                className="font-josefin text-orange-500 hover:text-orange-400 flex items-center gap-1 transition-colors"
              >
                View All
                <ArrowRight size={18} />
              </Link>
            )}
          </div>

          {projects.length === 0 ? (
            <Card className="p-12 text-center" hover={false}>
              <FolderKanban className="w-14 h-14 text-orange-500/50 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-josefin text-2xl font-bold mb-2">No Projects Yet</h3>
              <p className="font-josefin text-white-smoke/70 mb-6">Start your journey by creating your first project!</p>
              <Link
                to="/create-project"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white-smoke font-josefin font-bold py-3 px-8 rounded-lg transition-all hover:scale-[1.02]"
              >
                <Plus size={18} />
                Create Project
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentProjects.map((project, index) => (
                <Card key={project.id} {...fadeUp(0.5 + index * 0.1)} className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-josefin font-bold text-2xl text-orange-400">{project.title}</h3>
                      {project.completed && <CheckCircle2 size={20} className="text-green-400 shrink-0 mt-1" />}
                    </div>
                    <p className="font-josefin text-white-smoke/70 mb-4 line-clamp-3">{project.description}</p>
                  </div>
                  <Link
                    to={`/roadmap/${project.id}`}
                    className={button({ variant: 'secondary', size: 'sm', className: 'w-full' })}
                  >
                    View Roadmap
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
