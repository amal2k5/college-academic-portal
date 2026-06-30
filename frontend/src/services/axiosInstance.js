import axios from "axios";

const axiosInstance = axios.create({
 baseURL: import.meta.env.VITE_API_URL,
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


const isLoginCall = original.url?.includes("/auth/login/");
const isRefreshCall = original.url?.includes("/auth/refresh/");
    const alreadyRetried = original._retry;


    if (
  is401 &&
  !alreadyRetried &&
  !isRefreshCall &&
  !isLoginCall
) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        try {

          const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh/`,
            { refresh },
            { headers: { "Content-Type": "application/json" } }
          );

          localStorage.setItem("access", data.access);

          original.headers.Authorization = `Bearer ${data.access}`;
          return axiosInstance(original);
        } catch (_refreshError) {

        }
      }


      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;