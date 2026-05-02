import api from './api';

export const getAdmins = (params = {}) => api.get('/admins', { params });
export const getAdmin = (id) => api.get(`/admins/${id}`);
export const createAdmin = (data) => api.post('/admins', data);
export const updateAdmin = (id, data) => api.put(`/admins/${id}`, data);
export const deleteAdmin = (id) => api.delete(`/admins/${id}`);
