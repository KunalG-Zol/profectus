import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------------------- AUTH --------------------

export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post('/auth/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

// -------------------- PROJECTS --------------------

// UPDATE THIS FUNCTION for repo creation
export const createProject = async (title, description, repoName, repoDesc, repoPrivate) => {
  // Support both new and old calls (for backward compatibility)
  const payload = repoName !== undefined
    ? {
        title,
        description,
        repo_name: repoName,
        repo_desc: repoDesc,
        repo_private: repoPrivate,
      }
    : { title, description };

  const response = await api.post('/api/projects/', payload);
  return response.data;
};

export const getProjects = async () => {
  const response = await api.get('/api/projects/');
  return response.data;
};

export const generateQuestions = async (projectId) => {
  const response = await api.post(`/api/projects/${projectId}/generate-questions`);
  return response.data;
};

export const submitAnswers = async (projectId, answers) => {
  const response = await api.post(`/api/projects/${projectId}/answers`, answers);
  return response.data;
};

export const generateRoadmap = async (projectId) => {
  const response = await api.post(`/api/projects/${projectId}/generate-roadmap`);
  return response.data;
};

export const generateProjectIdea = async (level = "beginner") => {
  const response = await api.post('/api/projects/generate-idea', { level });
  return response.data;
};

export const getProjectStatus = async (projectId) => {
  const response = await api.get(`/api/projects/${projectId}/status`);
  return response.data;
};

export const completeTask = async (taskId) => {
  const response = await api.put(`/api/projects/tasks/${taskId}/complete`);
  return response.data;
};

