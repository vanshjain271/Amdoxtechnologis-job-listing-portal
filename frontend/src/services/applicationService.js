import api from "./authService";

export const applyToJob = async (jobId, coverLetter) => {
  const response = await api.post(`/applications/${jobId}`, { coverLetter });
  return response.data;
};

export const getJobApplications = async (jobId) => {
  const response = await api.get(`/applications/job/${jobId}`);
  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get("/applications/my/all");
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.patch(`/applications/${id}/status`, { status });
  return response.data;
};

export default {
  applyToJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
};
