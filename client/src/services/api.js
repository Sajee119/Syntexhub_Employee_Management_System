import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
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
