import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjectStatus, completeTask, generateRoadmap } from '../services/api';
import { useProjectContext } from '../context/ProjectContext';

// SVG Icon Components
const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const RocketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.343a1 1 0 0 1 .993.883l.007.117v3.34a1 1 0 0 1-2 0V3.343a1 1 0 0 1 1-1zm0 14.314a1 1 0 0 1 .993.883l.007.117v3.34a1 1 0 0 1-2 0v-3.34a1 1 0 0 1 1-1zm-7.414-5.414a1 1 0 0 1 .093 1.408l-.093.099-2.36 2.36a1 1 0 0 1-1.497-1.32l.093-.099 2.36-2.36a1 1 0 0 1 1.404-.086zm14.828 0a1 1 0 0 1 1.497 1.32l-.093.099-2.36 2.36a1 1 0 0 1-1.32 0l-2.36-2.36a1 1 0 0 1 0-1.414l2.36-2.36a1 1 0 0 1 1.32 0l2.36 2.36a1 1 0 0 1 0 1.414zM4.586 6.001a1 1 0 0 1 1.32 0l2.36 2.36a1 1 0 0 1 0 1.414l-2.36 2.36a1 1 0 0 1-1.414 0l-2.36-2.36a1 1 0 0 1 0-1.414l2.36-2.36a1 1 0 0 1 .093-.086zm14.828 0a1 1 0 0 1 1.414 0l2.36 2.36a1 1 0 0 1 0 1.414l-2.36 2.36a1 1 0 0 1-1.414 0l-2.36-2.36a1 1 0 0 1 0-1.414l2.36-2.36zM12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/>
  </svg>
);

// Recursive component to display modules and sub-modules
const ModuleDisplay = ({ module, index, depth = 0, handleCompleteTask }) => {
  const isTopLevel = depth === 0;
  const leftOffset = isTopLevel ? 'pl-12' : `ml-${Math.min(depth * 8, 16)}`;
  const titleSize = isTopLevel ? 'text-2xl' : depth === 1 ? 'text-xl' : 'text-lg';
  const borderColor = isTopLevel ? 'border-blue-500' : depth === 1 ? 'border-purple-500' : 'border-indigo-400';
  const numberBg = isTopLevel ? 'bg-white' : 'bg-gray-50';

  return (
    <motion.div
      key={module.id}
      className={`relative ${leftOffset} mb-${isTopLevel ? 8 : 6}`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {isTopLevel && (
        <div className={`absolute left-0 top-1.5 flex items-center justify-center w-10 h-10 ${numberBg} border-4 ${borderColor} rounded-full z-10`}>
          <span className={`font-bold ${isTopLevel ? 'text-blue-500' : 'text-purple-500'}`}>
            {index + 1}
          </span>
        </div>
      )}

      <div className={`bg-white p-6 rounded-xl shadow-md border ${isTopLevel ? 'border-gray-200' : 'border-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`${titleSize} font-semibold font-josefin text-gray-800`}>
            {!isTopLevel && <span className="text-gray-400 mr-2">↳</span>}
            {module.name}
          </h3>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${module.completed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
            {module.completed ? 'Completed' : 'In Progress'}
          </span>
        </div>

        {module.description && (
          <p className="text-gray-600 mb-4 text-sm">{module.description}</p>
        )}

        {/* Tasks */}
        {module.tasks && module.tasks.length > 0 && (
          <div className="space-y-3 mb-4">
            {module.tasks.map((task) => (
              <motion.div
                key={task.id}
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
              >
                <label
                  htmlFor={`task-${task.id}`}
                  className={`flex items-center w-full p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    task.completed ? 'bg-gray-50 text-gray-500' : 'hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onChange={() => !task.completed && handleCompleteTask(task.id)}
                    disabled={task.completed}
                    className="hidden"
                  />
                  <div className={`w-6 h-6 mr-4 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                    task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                  }`}>
                    <AnimatePresence>
                      {task.completed && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                        >
                          <CheckIcon className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className={task.completed ? 'line-through' : ''}>
                    {task.description}
                  </span>
                </label>
              </motion.div>
            ))}
          </div>
        )}

        {/* Sub-modules - Recursive rendering */}
        {module.sub_modules && module.sub_modules.length > 0 && (
          <div className={`mt-4 space-y-4 ${depth === 0 ? 'border-l-2 border-purple-200 pl-4' : ''}`}>
            {module.sub_modules.map((subModule, subIndex) => (
              <ModuleDisplay
                key={subModule.id}
                module={subModule}
                index={subIndex}
                depth={depth + 1}
                handleCompleteTask={handleCompleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

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
      const data = await generateRoadmap(projectId);
      setProjectStatus(data);
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
      const updatedStatus = await getProjectStatus(projectId);
      setProjectStatus(updatedStatus);
    } catch (error) {
      setError(error.message);
      alert('Failed to mark task as completed: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-6 text-lg font-semibold font-josefin">Loading project roadmap...</p>
      </div>
    );
  }

  if (!projectStatus) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold font-josefin">Error</h2>
        <p className="mt-4 text-lg text-gray-600">Failed to load project status.</p>
        <Link to="/" className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform duration-300 hover:scale-105">
          Start Over
        </Link>
      </div>
    );
  }

  if (projectStatus.modules.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl text-center">
        <RocketIcon />
        <h2 className="text-4xl font-bold mb-4 font-josefin mt-4">Project Roadmap</h2>
        <p className="mb-8 text-lg text-gray-600">No roadmap has been generated yet for this project.</p>
        <motion.button
          onClick={handleGenerateRoadmap}
          className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Generate Roadmap
        </motion.button>
      </div>
    );
  }

  // Filter to only show top-level modules (those without a parent)
  const topLevelModules = projectStatus.modules.filter(m => !m.parent_module_id);

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-10 p-8">
      <h2 className="text-4xl font-bold mb-2 font-josefin text-blue-900">{projectStatus.title}</h2>
      <p className="mb-10 text-lg text-gray-600">
        Project Status: <span className={`font-semibold ${projectStatus.completed ? 'text-green-600' : 'text-amber-600'}`}>
          {projectStatus.completed ? 'Completed' : 'In Progress'}
        </span>
      </p>

      <div className="relative">
        {/* Vertical Timeline Bar */}
        <div className="absolute left-5 top-2 bottom-2 w-1 bg-gray-200 rounded-full"></div>

        {topLevelModules.map((module, index) => (
          <ModuleDisplay
            key={module.id}
            module={module}
            index={index}
            depth={0}
            handleCompleteTask={handleCompleteTask}
          />
        ))}
      </div>

      <Link to="/" className="mt-12 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform duration-300 hover:scale-105">
        Create New Project
      </Link>
    </div>
  );
};

export default Roadmap;
