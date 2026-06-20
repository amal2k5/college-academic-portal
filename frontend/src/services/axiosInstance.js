import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request: attach access token ──────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response: on 401 → try refresh → retry once → else logout ─────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    const is401 = error.response?.status === 401;
    const alreadyRetried = original._retry;
    const isRefreshCall = original.url?.includes("/auth/refresh/");

    if (is401 && !alreadyRetried && !isRefreshCall) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        try {
          // Use plain axios here — NOT axiosInstance — to avoid interceptor loop
          const { data } = await axios.post(
            "http://127.0.0.1:8000/api/auth/refresh/",
            { refresh },
            { headers: { "Content-Type": "application/json" } }
          );

          localStorage.setItem("access", data.access);

          // Swap token and replay the failed request
          original.headers.Authorization = `Bearer ${data.access}`;
          return axiosInstance(original);
        } catch (_refreshError) {
          // Refresh itself failed — token is dead
        }
      }

      // No refresh token or refresh failed → force logout
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;