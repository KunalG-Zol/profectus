import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, FolderKanban, Plus } from 'lucide-react';
import { getProjects } from '../services/api';
import Card from './ui/Card';
import { button } from '../lib/styles';

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
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)] app-shell">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)] app-shell text-white-smoke text-center px-4">
        <div>
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-3xl font-k95 mb-4">Something went wrong</h2>
          <p className="font-josefin text-white-smoke/70">{error}</p>
          <Link to="/" className={button({ variant: 'primary', className: 'mt-6 inline-flex' })}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] app-shell text-white-smoke font-josefin">
      <div className="max-w-6xl mx-auto pt-12 pb-24 px-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-k95 text-white-smoke">My Projects</h1>
          <Link to="/create-project" className={button({ variant: 'primary' })}>
            <Plus size={18} />
            Create New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center p-12" hover={false}>
            <FolderKanban className="w-14 h-14 text-orange-500/50 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold mb-2">No Projects Found</h2>
            <p className="text-lg text-white-smoke/70">
              You haven't created any projects yet. Click the button above to get started!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-orange-400">{project.title}</h2>
                    {project.completed && <CheckCircle2 size={20} className="text-green-400 shrink-0 mt-1" />}
                  </div>
                  <p className="text-white-smoke/70 mb-4 line-clamp-3">{project.description}</p>
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
      </div>
    </div>
  );
};

export default ProjectsPage;
