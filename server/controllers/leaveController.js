import Leave from '../models/Leave.js';
import { createNotification } from './notificationController.js';

export const applyLeave = async (req, res) => {
  try {
    const leave = await Leave.create({ ...req.body, employee: req.user._id });
    await createNotification(req.user._id, 'Leave Applied', `Leave applied from ${req.body.startDate} to ${req.body.endDate}`, 'info');
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaves = async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    const query = {};
    if (employeeId) query.employee = employeeId;
    if (status) query.status = status;
    
    const leaves = await Leave.find(query).populate('employee', 'name email').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, comments, reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true }
    ).populate('employee', 'name email');
    
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    
    await createNotification(
      leave.employee._id,
      `Leave ${status}`,
      `Your leave request has been ${status.toLowerCase()}`,
      status === 'Approved' ? 'success' : 'warning'
    );
    
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.json({ message: 'Leave deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
