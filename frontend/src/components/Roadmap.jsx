import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Check,
  Code2,
  Lightbulb,
  Link as LinkIcon,
  ListChecks,
  Loader2,
  Rocket,
  Sparkles,
  X,
} from 'lucide-react';
import { getProjectStatus, completeTask, generateRoadmap, checkTaskProgress, getTaskHelp } from '../services/api';
import { useProjectContext } from '../context/ProjectContext';
import Badge from './ui/Badge';
import { button } from '../lib/styles';

// Help Panel Component
const HelpPanel = ({ helpData, onClose, loading }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-full md:w-[480px] lg:w-[520px] bg-ink shadow-2xl z-50 overflow-y-auto border-l border-white-smoke/10"
    >
      <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 text-rich-black p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold font-josefin">Task Help</h3>
          <button
            onClick={onClose}
            className="hover:bg-black/10 rounded-full p-2 transition-colors"
          >
            <X size={22} />
          </button>
        </div>
        {helpData && (
          <p className="mt-2 text-sm opacity-90 font-medium font-josefin">{helpData.task_description}</p>
        )}
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={40} className="animate-spin text-orange-500" />
            <p className="mt-4 text-white-smoke/60 font-medium font-josefin">Getting help...</p>
          </div>
        ) : helpData ? (
          <div className="space-y-6 font-josefin">
            {/* Overview Section */}
            <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-r-lg">
              <h4 className="font-bold text-orange-300 mb-2 flex items-center gap-2">
                <Lightbulb size={18} />
                Overview
              </h4>
              <p className="text-white-smoke/80 text-sm leading-relaxed">{helpData.help.overview}</p>
            </div>

            {/* Step-by-Step Guide */}
            <div>
              <h4 className="font-bold text-white-smoke mb-3 flex items-center gap-2">
                <ListChecks size={18} className="text-orange-400" />
                Step-by-Step Guide
              </h4>
              <ol className="space-y-3">
                {helpData.help.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-orange-500 text-rich-black rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <p className="text-white-smoke/80 text-sm pt-0.5 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Code Examples */}
            {helpData.help.code_examples && helpData.help.code_examples.length > 0 && (
              <div>
                <h4 className="font-bold text-white-smoke mb-3 flex items-center gap-2">
                  <Code2 size={18} className="text-green-400" />
                  Code Examples
                </h4>
                <div className="space-y-3">
                  {helpData.help.code_examples.map((example, index) => (
                    <div key={index} className="bg-rich-black rounded-lg overflow-hidden border border-white-smoke/10">
                      <div className="bg-black/40 px-4 py-2 text-xs text-white-smoke/50 font-mono">
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
                <h4 className="font-bold text-white-smoke mb-3 flex items-center gap-2">
                  <BookOpen size={18} className="text-purple-400" />
                  Helpful Resources
                </h4>
                <ul className="space-y-2">
                  {helpData.help.resources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm hover:underline"
                      >
                        <LinkIcon size={15} />
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {helpData.help.tips && helpData.help.tips.length > 0 && (
              <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <h4 className="font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <Sparkles size={18} />
                  Pro Tips
                </h4>
                <ul className="space-y-1">
                  {helpData.help.tips.map((tip, index) => (
                    <li key={index} className="text-amber-100/80 text-sm flex gap-2">
                      <span>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-white-smoke/50 font-josefin">
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

  return (
    <motion.div
      key={module.id}
      className={`relative ${leftOffset} mb-${isTopLevel ? 8 : 6}`}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.08 }}
    >
      {isTopLevel && (
        <div className="absolute left-0 top-1.5 flex items-center justify-center w-10 h-10 bg-rich-black border-4 border-orange-500 rounded-full z-10">
          <span className="font-bold text-orange-500">{index + 1}</span>
        </div>
      )}

      <div className="bg-ink/70 p-6 rounded-xl border border-white-smoke/10 backdrop-blur-sm">
        <div className="flex justify-between items-center gap-3 mb-4">
          <h3 className={`${titleSize} font-semibold font-josefin text-white-smoke`}>
            {!isTopLevel && <span className="text-white-smoke/30 mr-2">↳</span>}
            {module.name}
          </h3>
          <Badge tone={module.completed ? 'success' : 'warning'} className="shrink-0">
            {module.completed ? 'Completed' : 'In Progress'}
          </Badge>
        </div>

        {module.description && (
          <p className="text-white-smoke/60 mb-4 text-sm font-josefin">{module.description}</p>
        )}

        {/* Tasks */}
        {module.tasks && module.tasks.length > 0 && (
          <div className="space-y-3 mb-4">
            {module.tasks.map((task) => (
              <motion.div
                key={task.id}
                className="flex items-center gap-2"
                whileHover={{ scale: 1.005 }}
              >
                <label
                  htmlFor={`task-${task.id}`}
                  className={`flex items-center flex-1 p-3 rounded-lg cursor-pointer transition-all duration-200 font-josefin ${
                    task.completed ? 'bg-white-smoke/[0.03] text-white-smoke/40' : 'hover:bg-orange-500/[0.06]'
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
                  <div className={`w-6 h-6 mr-4 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                    task.completed ? 'bg-orange-500 border-orange-500' : 'border-white-smoke/25'
                  }`}>
                    <AnimatePresence>
                      {task.completed && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                        >
                          <Check size={16} className="text-rich-black" strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className={task.completed ? 'line-through' : 'text-white-smoke/90'}>
                    {task.description}
                  </span>
                </label>

                {/* Action Buttons */}
                {!task.completed && (
                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button
                      onClick={() => handleCheckProgress(task.id)}
                      disabled={checkingProgress[task.id]}
                      className="px-3 py-2 text-sm font-medium text-white-smoke bg-white-smoke/10 border border-white-smoke/10 rounded-lg hover:bg-orange-500/15 hover:border-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Check progress from GitHub commits"
                    >
                      {checkingProgress[task.id] ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <ListChecks size={16} />
                      )}
                    </motion.button>

                    <motion.button
                      onClick={() => handleGetHelp(task.id)}
                      disabled={gettingHelp}
                      className="px-3 py-2 text-sm font-medium text-rich-black bg-orange-500 rounded-lg hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Get help with this task"
                    >
                      <Lightbulb size={16} />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Sub-modules - Recursive rendering */}
        {module.sub_modules && module.sub_modules.length > 0 && (
          <div className={`mt-4 space-y-4 ${depth === 0 ? 'border-l-2 border-white-smoke/10 pl-4' : ''}`}>
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

  const handleGetHelp = async (taskId) => {
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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] app-shell text-white-smoke">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        <p className="mt-6 text-lg font-semibold font-josefin">Loading project roadmap...</p>
      </div>
    );
  }

  if (!projectStatus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] app-shell text-white-smoke text-center px-4">
        <h2 className="text-3xl font-k95">Error</h2>
        <p className="mt-4 text-lg text-white-smoke/70 font-josefin">Failed to load project status.</p>
        <Link to="/" className={button({ variant: 'primary', className: 'mt-8 inline-flex' })}>
          Start Over
        </Link>
      </div>
    );
  }

  if (projectStatus.modules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)] app-shell px-4">
        <div className="max-w-lg w-full bg-ink/60 border border-white-smoke/10 backdrop-blur-sm p-10 rounded-2xl text-center">
          <Rocket className="w-14 h-14 text-orange-500 mx-auto" strokeWidth={1.5} />
          <h2 className="text-3xl font-k95 mb-3 mt-4 text-white-smoke">Project Roadmap</h2>
          <p className="mb-8 text-white-smoke/70 font-josefin">No roadmap has been generated yet for this project.</p>
          <motion.button
            onClick={handleGenerateRoadmap}
            className={button({ variant: 'primary', size: 'lg' })}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Generate Roadmap
          </motion.button>
        </div>
      </div>
    );
  }

  const topLevelModules = projectStatus.modules.filter(m => !m.parent_module_id);

  return (
    <div className="app-shell min-h-[calc(100vh-73px)]">
      <div className="flex justify-center">
        <div className="max-w-5xl mx-auto mt-10 mb-10 p-4 sm:p-8 flex-grow w-full">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h2 className="text-4xl font-k95 text-white-smoke">{projectStatus.title}</h2>
            <Badge tone={projectStatus.completed ? 'success' : 'warning'}>
              {projectStatus.completed ? 'Completed' : 'In Progress'}
            </Badge>
          </div>
          <p className="mb-10 text-white-smoke/50 font-josefin">Project status overview and task tracker</p>

          <div className="relative">
            <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-orange-500/15 rounded-full"></div>

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

          <Link to="/" className={button({ variant: 'secondary', className: 'mt-8 inline-flex' })}>
            Back to Dashboard
          </Link>
        </div>

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
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseHelp}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Roadmap;
