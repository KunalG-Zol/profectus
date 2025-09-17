import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectStatus, completeTask, generateRoadmap } from '../services/api';
import { useProjectContext } from '../context/ProjectContext';

const Roadmap = () => {
  const { projectId } = useParams();
  const { setError } = useProjectContext();
  const [projectStatus, setProjectStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectStatus = async () => {
      try {
        setLoading(true);
        const data = await getProjectStatus(projectId);
        setProjectStatus(data);
      } catch (error) {
        setError(error.message);
        alert('Failed to load project status: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectStatus();
  }, [projectId, setError]);

  const handleGenerateRoadmap = async () => {
    try {
      setLoading(true);
      await generateRoadmap(projectId);
      const updatedStatus = await getProjectStatus(projectId);
      setProjectStatus(updatedStatus);
    } catch (error) {
      setError(error.message);
      alert('Failed to generate roadmap: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
      // Refresh project status
      const updatedStatus = await getProjectStatus(projectId);
      setProjectStatus(updatedStatus);
    } catch (error) {
      setError(error.message);
      alert('Failed to mark task as completed: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4">Loading project roadmap...</p>
      </div>
    );
  }

  if (!projectStatus) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Error</h2>
        <p className="mt-4">Failed to load project status.</p>
        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Start Over
        </Link>
      </div>
    );
  }

  // If no modules, show generate button
  if (projectStatus.modules.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4 font-josefin">Project Roadmap</h2>
        <p className="mb-6 text-gray-700">No roadmap has been generated yet for this project.</p>
        <button
          onClick={handleGenerateRoadmap}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Generate Roadmap
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-2 font-josefin">Project Roadmap</h2>
      <p className="mb-6 text-gray-700">
        Project Status: <span className={`font-semibold ${projectStatus.completed ? 'text-green-600' : 'text-amber-600'}`}>
          {projectStatus.completed ? 'Completed' : 'In Progress'}
        </span>
      </p>

      <div className="space-y-8">
        {projectStatus.modules.map((module) => (
          <div key={module.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">
                {module.name}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${module.completed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {module.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>

            <div className="pl-2 space-y-2">
              {module.tasks.map((task) => (
                <div key={task.id} className="flex items-center py-2 border-b border-gray-100">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => !task.completed && handleCompleteTask(task.id)}
                    disabled={task.completed}
                    className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                    {task.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link to="/" className="mt-8 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
        Create New Project
      </Link>
    </div>
  );
};

export default Roadmap;