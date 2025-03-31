import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  get: (url: string, config = {}) => axios.get(`${API_URL}${url}`, config),
  post: (url: string, data: any, config = {}) => axios.post(`${API_URL}${url}`, data, config),
  patch: (url: string, data: any, config = {}) => axios.patch(`${API_URL}${url}`, data, config),
  delete: (url: string, config = {}) => axios.delete(`${API_URL}${url}`, config),
};
