import { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    project,
    setProject,
    questions,
    setQuestions,
    roadmap,
    setRoadmap,
    loading,
    setLoading,
    error,
    setError,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};