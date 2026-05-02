import Employee from '../models/Employee.js';
import ActivityLog from '../models/ActivityLog.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../services/emailService.js';
import fs from 'fs';
import path from 'path';

const logActivity = async (userId, action, entity, entityId, description, metadata = {}) => {
  await ActivityLog.create({ user: userId, action, entity, entityId, description, metadata });
};

const createNotification = async (userId, title, message, type = 'info', link = null) => {
  await Notification.create({ user: userId, title, message, type, link });
};

export const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role, status, sortBy = 'createdAt', order = 'desc', salaryMin, salaryMax, dateFrom, dateTo } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;
    if (salaryMin || salaryMax) {
      query.salary = {};
      if (salaryMin) query.salary.$gte = Number(salaryMin);
      if (salaryMax) query.salary.$lte = Number(salaryMax);
    }
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const employees = await Employee.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Employee.countDocuments(query);
    
    res.json({
      employees,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    await logActivity(req.user._id, 'CREATE', 'Employee', employee._id, `Created employee: ${employee.name}`);
    await createNotification(req.user._id, 'Employee Created', `${employee.name} was added to the system`, 'success', '/employees');
    res.status(201).json(employee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    let updateData = req.body;

    if (req.file) {
      const uploadDir = 'uploads/profiles';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `employee_${req.params.id}_${Date.now()}${path.extname(req.file.originalname)}`;
      const filepath = path.join(uploadDir, filename);

      fs.writeFileSync(filepath, req.file.buffer);
      updateData = { ...updateData, profilePicture: `/uploads/profiles/${filename}` };
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await logActivity(req.user._id, 'UPDATE', 'Employee', employee._id, `Updated employee: ${employee.name}`, updateData);
    await createNotification(req.user._id, 'Employee Updated', `${employee.name}'s details were updated`, 'info', '/employees');
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await logActivity(req.user._id, 'DELETE', 'Employee', employee._id, `Deleted employee: ${employee.name}`);
    await createNotification(req.user._id, 'Employee Deleted', `${employee.name} was removed from the system`, 'warning', '/employees');
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkDeleteEmployees = async (req, res) => {
  try {
    const { ids } = req.body;
    const result = await Employee.deleteMany({ _id: { $in: ids } });
    await logActivity(req.user._id, 'BULK_DELETE', 'Employee', null, `Bulk deleted ${result.deletedCount} employees`, { count: result.deletedCount });
    await createNotification(req.user._id, 'Bulk Delete', `${result.deletedCount} employees were deleted`, 'warning', '/employees');
    res.json({ message: `${result.deletedCount} employees deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    const result = await Employee.updateMany({ _id: { $in: ids } }, { status });
    await logActivity(req.user._id, 'UPDATE', 'Employee', null, `Bulk updated ${result.modifiedCount} employees to ${status}`, { count: result.modifiedCount, status });
    await createNotification(req.user._id, 'Bulk Status Update', `${result.modifiedCount} employees set to ${status}`, 'info', '/employees');
    res.json({ message: `${result.modifiedCount} employees updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendEmployeeEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    
    const result = await sendEmail({ to: employee.email, subject, text: message });
    if (result.success) {
      await logActivity(req.user._id, 'SEND_EMAIL', 'Employee', id, `Sent email to ${employee.name}: ${subject}`);
      await createNotification(req.user._id, 'Email Sent', `Email sent to ${employee.name}`, 'success', '/employees');
      res.json({ message: 'Email sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send email' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const logs = await ActivityLog.find({ user: req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await ActivityLog.countDocuments({ user: req.user._id });
    res.json({ logs, totalPages: Math.ceil(count / limit), currentPage: page, total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
