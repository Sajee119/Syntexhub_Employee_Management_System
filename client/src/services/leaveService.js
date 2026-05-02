import api from './api';

export const applyLeave = (data) => api.post('/leaves/apply', data);
export const getLeaves = (params) => api.get('/leaves', { params });
export const updateLeaveStatus = (id, data) => api.put(`/leaves/${id}/status`, data);
export const deleteLeave = (id) => api.delete(`/leaves/${id}`);
