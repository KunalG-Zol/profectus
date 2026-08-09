import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { createProject, generateProjectIdea } from '../services/api';
import GlowBackdrop from './ui/GlowBackdrop';
import { button } from '../lib/styles';

const inputClass =
  'w-full px-4 py-3 bg-rich-black/50 border-2 border-white-smoke/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/70 focus:border-transparent transition-all placeholder:text-white-smoke/30';

const ProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoDesc, setRepoDesc] = useState('');
  const [repoPrivate, setRepoPrivate] = useState(false);
  const [level, setLevel] = useState('beginner');

  const [loading, setLoading] = useState(false);
  const [ideaLoading, setIdeaLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !repoName) {
      alert('Please fill all required fields.');
      return;
    }
    try {
      setLoading(true);
      const newProject = await createProject(
        title,
        description,
        repoName,
        repoDesc,
        repoPrivate
      );
      navigate(`/questions/${newProject.id}`);
    } catch (error) {
      alert('Error creating project: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateIdea = async () => {
    try {
      setIdeaLoading(true);
      const idea = await generateProjectIdea(level);
      setTitle(idea.title);
      setDescription(idea.description);
      const repoSlug = idea.title
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      setRepoName(repoSlug);
    } catch (error) {
      alert('Error generating project idea: ' + error.message);
    } finally {
      setIdeaLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] app-shell text-white-smoke font-josefin overflow-hidden">
      <GlowBackdrop />
      <div className="relative max-w-3xl mx-auto pt-12 pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-k95 text-white-smoke mb-2">Let's Get Started</h1>
          <p className="text-lg text-white-smoke/70">Tell us about your new project idea.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-ink/60 p-8 rounded-2xl shadow-2xl border border-white-smoke/10 backdrop-blur-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-bold mb-2 tracking-wider" htmlFor="title">
                Project Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., AI-Powered Recipe Generator"
                className={inputClass}
                required
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-bold mb-2 tracking-wider" htmlFor="description">
                Project Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project's goals, features, and technologies."
                className={`${inputClass} min-h-[150px] resize-y`}
                required
              />
            </div>

            {/* Project Level Dropdown */}
            <div>
              <label className="block text-sm font-bold mb-2 tracking-wider" htmlFor="level">
                Project Level
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={inputClass}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <p className="text-sm text-white-smoke/50 mt-1.5">
                Select the complexity level for AI-generated project ideas
              </p>
            </div>

            {/* Repository Fields */}
            <div className="pt-6 border-t border-white-smoke/10">
              <h2 className="text-lg font-bold mb-4">GitHub Repository Details</h2>

              <label className="block text-sm font-bold mb-2" htmlFor="repoName">
                Repository Name
              </label>
              <input
                id="repoName"
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="my-new-ai-project"
                className={inputClass}
                required
              />

              <label className="block text-sm font-bold mb-2 mt-4" htmlFor="repoDesc">
                Repository Description
              </label>
              <input
                id="repoDesc"
                type="text"
                value={repoDesc}
                onChange={(e) => setRepoDesc(e.target.value)}
                placeholder="Short description"
                className={inputClass}
              />

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="repoPrivate"
                  checked={repoPrivate}
                  onChange={() => setRepoPrivate(!repoPrivate)}
                  className="w-4 h-4 accent-orange-500 bg-rich-black/50 border-orange-500/30 rounded"
                />
                <label htmlFor="repoPrivate" className="ml-2 text-sm font-bold">
                  Private Repository
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit"
                className={button({ variant: 'primary', size: 'lg', className: 'w-full' })}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  'Create & Generate Questions'
                )}
              </button>

              <button
                type="button"
                onClick={handleGenerateIdea}
                className={button({ variant: 'secondary', size: 'lg', className: 'w-full' })}
                disabled={ideaLoading}
              >
                {ideaLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating Idea...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="text-orange-500" />
                    Surprise Me
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectForm;
