import axios from 'axios';
import { toast } from 'react-hot-toast';

const base = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` : '/api';

const api = axios.create({
  baseURL: base,
  timeout: 10000
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.code === 'ECONNREFUSED' || !err.response) {
      window.location.href = '/network-error';
    }
    const message = err.response?.data?.message || 'Something went wrong';
    toast.error(message);
    return Promise.reject(err);
  }
);

export default api;
