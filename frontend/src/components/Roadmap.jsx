import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjectStatus, completeTask, generateRoadmap, checkTaskProgress, getTaskHelp } from '../services/api';
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

// Help Panel Component
const HelpPanel = ({ helpData, onClose, loading }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
    >
      <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold font-josefin">Task Help</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {helpData && (
          <p className="mt-2 text-sm opacity-90 font-medium">{helpData.task_description}</p>
        )}
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Getting help...</p>
          </div>
        ) : helpData ? (
          <div className="space-y-6">
            {/* Overview Section */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Overview
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">{helpData.help.overview}</p>
            </div>

            {/* Step-by-Step Guide */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Step-by-Step Guide
              </h4>
              <ol className="space-y-3">
                {helpData.help.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 text-sm pt-0.5 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Code Examples */}
            {helpData.help.code_examples && helpData.help.code_examples.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Code Examples
                </h4>
                <div className="space-y-3">
                  {helpData.help.code_examples.map((example, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono">
                        {example.language || 'code'}
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm text-green-400 font-mono">{example.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {helpData.help.resources && helpData.help.resources.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Helpful Resources
                </h4>
                <ul className="space-y-2">
                  {helpData.help.resources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm hover:underline"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {helpData.help.tips && helpData.help.tips.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Pro Tips
                </h4>
                <ul className="space-y-1">
                  {helpData.help.tips.map((tip, index) => (
                    <li key={index} className="text-yellow-900 text-sm flex gap-2">
                      <span>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No help data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Recursive component to display modules and sub-modules
const ModuleDisplay = ({ module, index, depth = 0, handleCompleteTask, handleCheckProgress, handleGetHelp, checkingProgress, gettingHelp }) => {
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
                className="flex items-center gap-2"
                whileHover={{ scale: 1.01 }}
              >
                <label
                  htmlFor={`task-${task.id}`}
                  className={`flex items-center flex-1 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
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

                {/* Action Buttons */}
                {!task.completed && (
                  <div className="flex gap-2 flex-shrink-0">
                    {/* Check Progress Button */}
                    <motion.button
                      onClick={() => handleCheckProgress(task.id)}
                      disabled={checkingProgress[task.id]}
                      className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Check progress from GitHub commits"
                    >
                      {checkingProgress[task.id] ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        </span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </motion.button>

                    {/* Help Button */}
                    <motion.button
                      onClick={() => handleGetHelp(task.id, task.description)}
                      disabled={gettingHelp}
                      className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Get help with this task"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </motion.button>
                  </div>
                )}
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
                handleCheckProgress={handleCheckProgress}
                handleGetHelp={handleGetHelp}
                checkingProgress={checkingProgress}
                gettingHelp={gettingHelp}
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
  const [checkingProgress, setCheckingProgress] = useState({});
  const [progressResults, setProgressResults] = useState({});
  const [showHelp, setShowHelp] = useState(false);
  const [helpData, setHelpData] = useState(null);
  const [gettingHelp, setGettingHelp] = useState(false);

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

  const handleCheckProgress = async (taskId) => {
    setCheckingProgress(prev => ({ ...prev, [taskId]: true }));

    try {
      const result = await checkTaskProgress(taskId);
      setProgressResults(prev => ({ ...prev, [taskId]: result }));

      if (result.auto_marked_complete) {
        const updatedStatus = await getProjectStatus(projectId);
        setProjectStatus(updatedStatus);
      }

      alert(
        `Progress Check Results:\n\n` +
        `Confidence: ${(result.analysis.confidence * 100).toFixed(0)}%\n` +
        `Status: ${result.analysis.suggested_completion ? 'Likely Complete ✓' : 'Not Complete ✗'}\n\n` +
        `Reasoning: ${result.analysis.reasoning}\n\n` +
        `Recent Commits:\n${result.analysis.relevant_commits.slice(0, 3).join('\n')}\n\n` +
        (result.auto_marked_complete ? '✅ Task automatically marked as complete!' : '⚠️ Task not auto-completed (confidence too low)')
      );
    } catch (error) {
      alert('Failed to check progress: ' + error.message);
    } finally {
      setCheckingProgress(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const handleGetHelp = async (taskId, taskDescription) => {
    setGettingHelp(true);
    setShowHelp(true);
    setHelpData(null);

    try {
      const result = await getTaskHelp(taskId);
      setHelpData(result);
    } catch (error) {
      setError(error.message);
      alert('Failed to get help: ' + error.message);
      setShowHelp(false);
    } finally {
      setGettingHelp(false);
    }
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
    setHelpData(null);
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

  const topLevelModules = projectStatus.modules.filter(m => !m.parent_module_id);

  return (
    <>
      <motion.div
        animate={{ marginRight: showHelp ? '500px' : '0' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="max-w-5xl mx-auto mt-10 mb-10 p-8 transition-all duration-300"
      >
        <h2 className="text-4xl font-bold mb-2 font-josefin text-blue-900">{projectStatus.title}</h2>
        <p className="mb-10 text-lg text-gray-600">
          Project Status: <span className={`font-semibold ${projectStatus.completed ? 'text-green-600' : 'text-amber-600'}`}>
            {projectStatus.completed ? 'Completed' : 'In Progress'}
          </span>
        </p>

        <div className="relative">
          <div className="absolute left-5 top-2 bottom-2 w-1 bg-gray-200 rounded-full"></div>

          {topLevelModules.map((module, index) => (
            <ModuleDisplay
              key={module.id}
              module={module}
              index={index}
              depth={0}
              handleCompleteTask={handleCompleteTask}
              handleCheckProgress={handleCheckProgress}
              handleGetHelp={handleGetHelp}
              checkingProgress={checkingProgress}
              gettingHelp={gettingHelp}
            />
          ))}
        </div>

        <Link to="/" className="mt-12 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform duration-300 hover:scale-105">
          Create New Project
        </Link>
      </motion.div>

      {/* Help Panel */}
      <AnimatePresence>
        {showHelp && (
          <HelpPanel
            helpData={helpData}
            onClose={handleCloseHelp}
            loading={gettingHelp}
          />
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseHelp}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Roadmap;
