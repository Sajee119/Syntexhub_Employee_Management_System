import api from './api';

export const getEmployees = (params = {}) => api.get('/employees', { params });
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => {
  if (data instanceof FormData) {
    return api.post('/employees', data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
  return api.post('/employees', data);
};
export const updateEmployee = (id, data) => {
  if (data instanceof FormData) {
    return api.put(`/employees/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
  return api.put(`/employees/${id}`, data);
};
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
export const bulkDeleteEmployees = (data) => api.post('/employees/bulk-delete', data);
export const bulkUpdateStatus = (data) => api.post('/employees/bulk-update-status', data);
export const sendEmployeeEmail = (id, data) => api.post(`/employees/${id}/send-email`, data);
export const getActivityLogs = (params = {}) => api.get('/employees/activity-logs', { params });
