import axios from "axios";

const api = axios.create({
  baseURL: "https://sketchmind-server.vercel.app/",
  withCredentials: true, // sends cookies!
});

let logoutFn: null | (() => void) = null;

export function setAxiosLogout(fn: () => void) {
  logoutFn = fn;
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (original.url === "/api/auth/refresh" || original._retry) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401) {
      original._retry = true;

      try {
        await api.post("/api/auth/refresh");
        return api(original); // retry original request once
      } catch (refreshErr) {
        if (logoutFn) logoutFn();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  },
);

export default api;
