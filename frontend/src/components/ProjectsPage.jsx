import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../services/api';
import { motion } from 'framer-motion';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to fetch projects. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-rich-black to-[#071a2a]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-rich-black to-[#071a2a] text-white-smoke text-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <Link to="/" className="mt-6 inline-block bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-transform duration-300 hover:scale-105">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rich-black to-[#071a2a] text-white-smoke font-josefin">
      <div className="max-w-5xl mx-auto pt-12 pb-24 px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-k95 text-white-smoke">My Projects</h1>
          <Link
            to="/project-form"
            className="bg-orange-500 hover:bg-orange-600 text-white-smoke font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Create New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center bg-[#01080e]/60 p-8 rounded-2xl shadow-2xl border border-orange-500/20">
            <h2 className="text-2xl font-bold mb-4">No Projects Found</h2>
            <p className="text-lg text-white-smoke/80">
              You haven't created any projects yet. Click the button above to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-[#01080e]/60 p-6 rounded-2xl shadow-2xl border border-orange-500/20 backdrop-blur-sm flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-orange-400">{project.title}</h2>
                  <p className="text-white-smoke/80 mb-4 line-clamp-3">{project.description}</p>
                </div>
                <Link
                  to={`/roadmap/${project.id}`}
                  className="text-center bg-blue-500 hover:bg-blue-600 text-white-smoke font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 w-full"
                >
                  View Roadmap
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;