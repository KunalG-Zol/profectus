import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, generateProjectIdea } from '../services/api';

const ProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoDesc, setRepoDesc] = useState('');
  const [repoPrivate, setRepoPrivate] = useState(false);
  const [level, setLevel] = useState('beginner'); // NEW: Project level state

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
      const idea = await generateProjectIdea(level); // Pass level to API
      setTitle(idea.title);
      setDescription(idea.description);
      setRepoName(idea.title.replace(/\s+/g, '-').toLowerCase());
    } catch (error) {
      alert('Error generating project idea: ' + error.message);
    } finally {
      setIdeaLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rich-black to-[#071a2a] text-white-smoke font-josefin">
      <div className="max-w-3xl mx-auto pt-12 pb-24 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-k95 text-white-smoke mb-2">Let's Get Started</h1>
          <p className="text-lg text-white-smoke/80">Tell us about your new project idea.</p>
        </div>

        <div className="bg-[#01080e]/60 p-8 rounded-2xl shadow-2xl border border-orange-500/20 backdrop-blur-sm">
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
                className="w-full px-4 py-3 bg-rich-black/50 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 bg-rich-black/50 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all min-h-[150px] resize-y"
                required
              />
            </div>

            {/* Project Level Dropdown - NEW */}
            <div>
              <label className="block text-sm font-bold mb-2 tracking-wider" htmlFor="level">
                Project Level
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 bg-rich-black/50 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <p className="text-sm text-white-smoke/60 mt-1">
                Select the complexity level for AI-generated project ideas
              </p>
            </div>

            {/* Repository Fields */}
            <div className="mt-8">
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
                className="w-full px-4 py-3 bg-rich-black/50 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 bg-rich-black/50 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="repoPrivate"
                  checked={repoPrivate}
                  onChange={() => setRepoPrivate(!repoPrivate)}
                  className="w-4 h-4 text-orange-500 bg-rich-black/50 border-gray-700 rounded focus:ring-orange-500"
                />
                <label htmlFor="repoPrivate" className="ml-2 text-sm font-bold">
                  Private Repository
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white-smoke font-bold py-4 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Project...
                  </div>
                ) : 'Create & Generate Questions'}
              </button>

              <button
                type="button"
                onClick={handleGenerateIdea}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white-smoke font-bold py-4 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
                disabled={ideaLoading}
              >
                {ideaLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Idea...
                  </div>
                ) : 'Surprise Me'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
