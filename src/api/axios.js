import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://community_backend.test/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const token = user.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;