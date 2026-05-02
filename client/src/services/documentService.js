import api from './api';

export const uploadDocument = (employeeId, formData) => 
  api.post(`/documents/employee/${employeeId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getEmployeeDocuments = (employeeId) => api.get(`/documents/employee/${employeeId}`);
export const deleteDocument = (id) => api.delete(`/documents/${id}`);
export const generateSalarySlip = (employeeId, data) => api.post(`/documents/salary-slip/${employeeId}`, data);
