import Transfer from '../models/Transfer.js';
import Employee from '../models/Employee.js';
import { createNotification } from './notificationController.js';

export const getTransfers = async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    const query = {};
    if (employeeId) query.employee = employeeId;
    if (status) query.status = status;
    
    const transfers = await Transfer.find(query)
      .populate('employee', 'name email department')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.create(req.body);
    
    await Employee.findByIdAndUpdate(req.body.employee, {
      department: req.body.toDepartment,
      role: req.body.toRole
    });
    
    await createNotification(
      req.body.employee,
      'Transfer Request',
      `Transfer request from ${req.body.fromDepartment} to ${req.body.toDepartment}`,
      'info'
    );
    
    res.status(201).json(transfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTransferStatus = async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, approvedBy: req.user._id },
      { new: true, runValidators: true }
    ).populate('employee', 'name email');
    
    if (!transfer) return res.status(404).json({ message: 'Transfer not found' });
    
    await createNotification(
      transfer.employee._id,
      `Transfer ${req.body.status}`,
      `Your transfer request has been ${req.body.status.toLowerCase()}`,
      req.body.status === 'Approved' ? 'success' : 'warning'
    );
    
    res.json(transfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndDelete(req.params.id);
    if (!transfer) return res.status(404).json({ message: 'Transfer not found' });
    res.json({ message: 'Transfer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find({ employee: req.params.employeeId })
      .sort({ createdAt: -1 });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
