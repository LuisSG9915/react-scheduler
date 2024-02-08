import axios from "axios";
const tk = new URLSearchParams(window.location.search).get("tk");
export const jezaApi = axios.create({
  baseURL: "http://cbinfo.no-ip.info:9083",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

jezaApi.interceptors.request.use(
  (config) => {
    const authToken = tk;
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    config.headers["Cache-Control"] = "no-cache";
    return config;
  },
  (error) => {
    console.log("Request error:", error);
    if (error.response && error.response.status === 401) {
      // window.location.href = "http://localhost:5173/";
    }
    return Promise.reject(error);
  }
);
