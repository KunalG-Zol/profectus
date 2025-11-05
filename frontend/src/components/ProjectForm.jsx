import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, generateProjectIdea } from '../services/api';

const ProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [ideaLoading, setIdeaLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const newProject = await createProject(title, description);
      navigate(`/questions/${newProject.id}`);
    } catch (error) {
      console.error(error);
      alert('Error creating project: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateIdea = async () => {
    try {
      setIdeaLoading(true);
      const idea = await generateProjectIdea();
      setTitle(idea.title);
      setDescription(idea.description);
    } catch (error) {
      console.error(error);
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

            <div>
              <label className="block text-sm font-bold mb-2 tracking-wider" htmlFor="description">
                Project Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project's goals, key features, target audience, and the technologies you plan to use."
                className="w-full px-4 py-3 bg-rich-black/50 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all min-h-[200px] resize-y"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white-smoke font-bold py-4 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
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
                className="w-full bg-blue-500 hover:bg-blue-600 text-white-smoke font-bold py-4 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
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
