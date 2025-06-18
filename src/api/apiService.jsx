import axios from "axios";
import { BASE_URL } from "./config";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiService.interceptors.request.use(
  (request) => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      request.headers["Authorization"] = `Bearer ${access_token}`;
    }
    // Log request
    console.log(
      "%c[Axios][Request]",
      "color: #8ecae6; font-weight: bold",
      request.method?.toUpperCase(),
      request.url,
      request
    );
    return request;
  },
  (error) => {
    console.error("%c[Axios][Request][Error]", "color: #f44336", error);
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

apiService.interceptors.response.use(
  (response) => {
    // Log response
    console.log(
      "%c[Axios][Response]",
      "color: #90be6d; font-weight: bold",
      response.config?.method?.toUpperCase(),
      response.config?.url,
      response
    );

    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error(
      "%c[Axios][Response][Error]",
      "color: #ff006e",
      originalRequest?.method?.toUpperCase(),
      originalRequest?.url,
      error.response || error
    );

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return apiService(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refresh_token = localStorage.getItem("refresh_token");
        if (!refresh_token) throw new Error("No refresh token");

        const refreshResponse = await axios.post(
          `${BASE_URL}/api/v1/auth/refresh`,
          { refresh_token }
        );
        const { access_token } = refreshResponse.data || refreshResponse;
        localStorage.setItem("access_token", access_token);

        processQueue(null, access_token);

        originalRequest.headers["Authorization"] = "Bearer " + access_token;

        console.log(
          "%c[Axios][Retry][Request]",
          "color: #ffd166",
          originalRequest.method?.toUpperCase(),
          originalRequest.url,
          originalRequest
        );

        return apiService(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiService;
