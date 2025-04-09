import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateRoadmap } from '../services/api';
import { useProjectContext } from '../context/ProjectContext';

const Roadmap = () => {
  const { projectId } = useParams();
  const { roadmap, setRoadmap, loading, setLoading, setError } = useProjectContext();

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const data = await generateRoadmap(projectId);
        setRoadmap(data);
      } catch (error) {
        setError(error.message);
        alert('Failed to generate roadmap: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [projectId, setRoadmap, setLoading, setError]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4">Generating your project roadmap...</p>
      </div>
    );
  }

  if (!roadmap || !roadmap.modules) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Error</h2>
        <p className="mt-4">Failed to generate roadmap.</p>
        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Start Over
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 font-josefin">Your Project Roadmap</h2>
      <p className="mb-6 text-gray-700">
        Here's your customized project roadmap based on your description and answers:
      </p>

      <div className="space-y-8">
        {Object.entries(roadmap.modules).map(([module, steps], moduleIndex) => (
          <div key={moduleIndex} className="w-full">
            <h3 className="text-lg font-semibold mb-3">
              {moduleIndex + 1}. {module}
            </h3>
            <ul className="pl-5 space-y-2">
              {steps.map((step, stepIndex) => (
                <li key={stepIndex} className="flex">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            {moduleIndex < Object.keys(roadmap.modules).length - 1 && (
              <hr className="my-6 border-gray-300" />
            )}
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