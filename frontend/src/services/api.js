import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createProject = async (title, description) => {
  const response = await api.post('/projects/', { title, description });
  return response.data;
};

export const generateQuestions = async (projectId) => {
  const response = await api.post(`/projects/${projectId}/generate-questions`);
  return response.data;
};

export const submitAnswers = async (projectId, answers) => {
  const response = await api.post(`/projects/${projectId}/answers`, answers);
  return response.data;
};

export const generateRoadmap = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/roadmap`);
  return response.data;
};