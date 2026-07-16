import api from './axiosInstance';

export const createProject = (projectName, githubUrl) =>
  api.post('/projects', { projectName, githubUrl });

export const getUserProjects = (pageNo = 0, pageSize = 10) =>
  api.get('/projects', { params: { pageNo, pageSize } });

export const getProject = (id) => api.get(`/projects/${id}`);

export const updateProject = (id, projectName, githubUrl) =>
  api.put(`/projects/${id}`, { projectName, githubUrl });

export const deleteProject = (id) => api.delete(`/projects/${id}`);