import api from './api';

export const getReviews = (params = {}) => api.get('/performance', { params });
export const getReview = (id) => api.get(`/performance/${id}`);
export const createReview = (data) => api.post('/performance', data);
export const updateReview = (id, data) => api.put(`/performance/${id}`, data);
export const deleteReview = (id) => api.delete(`/performance/${id}`);
export const getEmployeeReviews = (employeeId) => api.get(`/performance/employee/${employeeId}`);
