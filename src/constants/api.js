import axios from "axios";
import { getToken } from "./auth.js";

export const API_ORIGIN = "https://trackerexpensebackend.onrender.com";
export const API_BASE_URL = `${API_ORIGIN}/api`;

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    try {
      const token = getToken();
      if (token) {
        config.headers = config.headers || {};
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (err) => Promise.reject(err),
);

export default axios;
