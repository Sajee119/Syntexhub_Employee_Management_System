import Document from '../models/Document.js';
import Employee from '../models/Employee.js';
import path from 'path';
import fs from 'fs';

export const uploadDocument = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { name, type } = req.body;
    
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    
    const fileUrl = `/uploads/${req.file.filename}`;
    
    const document = await Document.create({
      employee: employeeId,
      name,
      type,
      fileUrl,
      fileSize: req.file.size,
      uploadedBy: req.user._id
    });
    
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ employee: req.params.employeeId }).populate('uploadedBy', 'name');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });
    
    const filePath = path.join('uploads', path.basename(document.fileUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateSalarySlip = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.body;
    
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    
    const slipData = {
      employee: employee.name,
      email: employee.email,
      month,
      year,
      salary: employee.salary,
      deductions: employee.salary * 0.1,
      netPay: employee.salary * 0.9
    };
    
    res.json(slipData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
