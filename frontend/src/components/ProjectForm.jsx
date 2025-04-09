import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/api';

const ProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
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
      alert('Error creating project: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-[#071a2a] shadow-lg rounded-lg border border-orange-500/20">
      <h2 className="text-2xl font-bold mb-6 font-k95 text-white-smoke">Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white-smoke text-sm font-bold mb-2 font-josefin" htmlFor="title">
            Project Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title"
            className="w-full px-3 py-2 bg-rich-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white-smoke"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-white-smoke text-sm font-bold mb-2 font-josefin" htmlFor="description">
            Project Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project in detail (goals, features, technologies, etc.)"
            className="w-full px-3 py-2 bg-rich-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[200px] text-white-smoke"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white-smoke font-josefin font-bold py-3 px-4 rounded-md transition duration-300"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Project & Generate Questions'}
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;