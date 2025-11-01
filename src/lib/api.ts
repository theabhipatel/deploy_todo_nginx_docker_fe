import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'done';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Auth APIs
export const authAPI = {
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Todo APIs
export const todoAPI = {
  getTodos: async (page: number = 1, limit: number = 10, search: string = '') => {
    const response = await api.get('/todos', {
      params: { page, limit, search },
    });
    return response.data;
  },

  getTodo: async (id: string) => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  createTodo: async (data: { title: string; description?: string }) => {
    const response = await api.post('/todos', data);
    return response.data;
  },

  updateTodo: async (
    id: string,
    data: { title?: string; description?: string; status?: 'pending' | 'done' }
  ) => {
    const response = await api.put(`/todos/${id}`, data);
    return response.data;
  },

  deleteTodo: async (id: string) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },
};

export default api;