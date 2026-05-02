import api from './api';

export const markAttendance = (data) => api.post('/attendance/mark', data);
export const getAttendance = (params) => api.get('/attendance', { params });
export const checkout = (id) => api.put(`/attendance/${id}/checkout`);
export const generateReport = (params) => api.get('/attendance/report', { params });
