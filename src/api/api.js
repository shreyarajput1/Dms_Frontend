import axios from 'axios';

// Base URL for the Allsoft Document Management API (from Postman collection)
const BASE_URL = 'https://apis.allsoft.co/api/documentManagement';

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach the auth token (received from validateOTP) to every request,
// matching the "token" header used throughout the Postman collection.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dms_token');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

// Central place to react to auth failures (expired/invalid token).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('dms_token');
      localStorage.removeItem('dms_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ---- Endpoint helpers -----------------------------------------------------

export const generateOTP = (mobile_number) =>
  api.post('/generateOTP', { mobile_number });

export const validateOTP = (mobile_number, otp) =>
  api.post('/validateOTP', { mobile_number, otp });

export const fetchDocumentTags = (term = '') =>
  api.post('/documentTags', { term });

export const saveDocumentEntry = (file, data) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('data', JSON.stringify(data));
  return api.post('/saveDocumentEntry', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const searchDocumentEntry = (payload) =>
  api.post('/searchDocumentEntry', payload);
