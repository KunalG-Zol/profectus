import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createGithubRepository } from '../services/api';
import { useProjectContext } from '../context/ProjectContext';

const StartProjectModal = ({ projectId, projectTitle, projectDescription, onClose, onProjectStarted }) => {
  const navigate = useNavigate();
  const { setError } = useProjectContext();
  const [repoName, setRepoName] = useState(projectTitle);
  const [repoDescription, setRepoDescription] = useState(projectDescription);
  const [createRepo, setCreateRepo] = useState(true);
  const [existingRepoUrl, setExistingRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (createRepo) {
        // Call backend to create new GitHub repo
        const response = await createGithubRepository(projectId, { repo_name: repoName, description: repoDescription });
        alert(`GitHub repository created: ${response.repo_url}`);
      } else {
        // Logic for linking existing repo (future implementation)
        alert(`Linking existing repository: ${existingRepoUrl} (Not yet implemented)`);
      }
      onProjectStarted(); // Callback to refresh project status or generate roadmap
      onClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error === 'GITHUB_NOT_LINKED') {
        alert('Please link your GitHub account first.');
        navigate('/profile');
      } else {
        setError(err.message);
        alert('Failed to start project: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Start Project: {projectTitle}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="repoOption"
                  value="create"
                  checked={createRepo}
                  onChange={() => setCreateRepo(true)}
                />
                <span className="ml-2 text-gray-700">Create New GitHub Repository</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="repoOption"
                  value="existing"
                  checked={!createRepo}
                  onChange={() => setCreateRepo(false)}
                />
                <span className="ml-2 text-gray-700">Use Existing Repository</span>
              </label>
            </div>

            {createRepo ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="repoName" className="block text-sm font-medium text-gray-700">Repository Name</label>
                  <input
                    type="text"
                    id="repoName"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="repoDescription" className="block text-sm font-medium text-gray-700">Repository Description (Optional)</label>
                  <textarea
                    id="repoDescription"
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={repoDescription}
                    onChange={(e) => setRepoDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="existingRepoUrl" className="block text-sm font-medium text-gray-700">Existing Repository URL or Name</label>
                  <input
                    type="text"
                    id="existingRepoUrl"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={existingRepoUrl}
                    onChange={(e) => setExistingRepoUrl(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Starting...' : 'Start Project'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StartProjectModal;
