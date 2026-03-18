import api from "./authService"; // reuses the configured Axios instance with interceptors

// ─────────────────────────────────────────────
// JOB SEEKER PROFILE
// ─────────────────────────────────────────────

/**
 * Creates a new job seeker profile.
 * The auth token is automatically attached by the Axios request interceptor
 * defined in authService.js — no manual token handling needed here.
 */
export const createJobSeekerProfile = async (profileData) => {
  const response = await api.post("/profile/jobseeker", profileData);
  return response.data;
};

export const getJobSeekerProfile = async () => {
  const response = await api.get("/profile/jobseeker");
  return response.data;
};

export const updateJobSeekerProfile = async (profileData) => {
  const response = await api.put("/profile/jobseeker", profileData);
  return response.data;
};

// ─────────────────────────────────────────────
// EMPLOYER PROFILE
// ─────────────────────────────────────────────

export const createEmployerProfile = async (profileData) => {
  const response = await api.post("/profile/employer", profileData);
  return response.data;
};

export const getEmployerProfile = async () => {
  const response = await api.get("/profile/employer");
  return response.data;
};

export const updateEmployerProfile = async (profileData) => {
  const response = await api.put("/profile/employer", profileData);
  return response.data;
};

// ─────────────────────────────────────────────
// RESUME UPLOAD
// ─────────────────────────────────────────────

/**
 * Uploads a resume file using multipart/form-data.
 * The field name "resume" must match what multer expects on the backend.
 * We override the Content-Type so Axios sets the correct boundary automatically.
 *
 * @param {File} file - The File object from an <input type="file">
 * @param {Function} onUploadProgress - Optional callback for upload progress
 */
export const uploadResume = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post("/profile/upload-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return response.data;
};

// ─────────────────────────────────────────────
// PROFILE CHECK
// ─────────────────────────────────────────────

/**
 * Checks if the logged-in user already has a profile.
 * Used by the Dashboard to decide whether to redirect to CreateProfile.
 */
export const checkProfileExists = async () => {
  const response = await api.get("/profile/check");
  return response.data;
};