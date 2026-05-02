import api from './api';

export const getTransfers = (params = {}) => api.get('/transfers', { params });
export const createTransfer = (data) => api.post('/transfers', data);
export const updateTransferStatus = (id, data) => api.put(`/transfers/${id}/status`, data);
export const deleteTransfer = (id) => api.delete(`/transfers/${id}`);
export const getEmployeeTransfers = (employeeId) => api.get(`/transfers/employee/${employeeId}`);
