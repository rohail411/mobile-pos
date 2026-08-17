import axios from 'axios';

// The client is served by the same Express server that hosts the API
// (see root index.js / electron/main.js), so requests should stay
// relative to the current origin rather than a hardcoded dev port.
axios.defaults.baseURL = '/';

axios.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
