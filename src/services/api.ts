/**
 * Axios API client configuration.
 */
import axios from "axios";

const API_URL = process.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (email: string, password: string, full_name: string) =>
    api.post("/auth/register", { email, password, full_name }),

  getMe: () => api.get("/auth/me"),
};

// Chat API
export const chatApi = {
  sendMessage: (message: string, conversationId?: number) =>
    api.post("/chat/message", { message, conversation_id: conversationId }),

  getConversations: () => api.get("/chat/conversations"),

  getConversation: (id: number) => api.get(`/chat/conversations/${id}`),

  createConversation: (title?: string) =>
    api.post("/chat/conversations", { title }),
};

// Reports API
export const reportsApi = {
  generate: (data: { title: string; report_type: string }) =>
    api.post("/reports/generate", data),

  list: (skip = 0, limit = 20) =>
    api.get("/reports/list", { params: { skip, limit } }),

  get: (id: number) => api.get(`/reports/${id}`),

  getDownloadUrl: (id: number) => `${API_URL}/reports/${id}/download`,

  download: (id: number) =>
    api.get(`/reports/${id}/download`, { responseType: "blob" }),
};

export default api;
