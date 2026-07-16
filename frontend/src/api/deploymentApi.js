import api from './axiosInstance';

export const triggerDeploy = (projectId) =>
  api.post(`/deployments/${projectId}`);

export const getProjectDeployments = (projectId, pageNo = 0, pageSize = 10) =>
  api.get(`/deployments/project/${projectId}`, { params: { pageNo, pageSize } });

export const getDeployment = (id) => api.get(`/deployments/${id}`);

export const deleteDeployment = (id) => api.delete(`/deployments/${id}`);