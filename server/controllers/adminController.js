import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createNotification } from './notificationController.js';

const buildUsername = (email, name) => {
  const base = (email || name || 'admin')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
  return `${base || 'admin'}_${Date.now().toString(36)}`;
};

export const getAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { role: { $in: ['Admin', 'Super Admin'] } };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const admins = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    const count = await User.countDocuments(query);
    res.json({ admins, totalPages: Math.ceil(count / limit), currentPage: page, total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    console.log('createAdmin called by user:', req.user && req.user._id, 'body:', req.body);
    const { name, email, password, role = 'Admin' } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const username = req.body.username?.trim() || buildUsername(email, name);
    const admin = await User.create({ name, email, username, password, role });
    try {
      await createNotification(req.user?._id, 'Admin Created', `${name} was added as ${role}`, 'success');
    } catch (notifyErr) {
      console.error('Notification error (createAdmin):', notifyErr.message);
    }
    res.status(201).json({ ...admin.toObject(), password: undefined });
  } catch (error) {
    console.error('createAdmin error:', error);
    res.status(400).json({ message: error.message || 'Failed to create admin' });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    console.log('updateAdmin called by user:', req.user && req.user._id, 'params:', req.params.id, 'body:', req.body);
    const { password, ...updateData } = req.body;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const admin = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    try {
      await createNotification(req.user?._id, 'Admin Updated', `${admin.name}'s profile was updated`, 'info');
    } catch (notifyErr) {
      console.error('Notification error (updateAdmin):', notifyErr.message);
    }
    res.json(admin);
  } catch (error) {
    console.error('updateAdmin error:', error);
    res.status(400).json({ message: error.message || 'Failed to update admin' });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    console.log('deleteAdmin called by user:', req.user && req.user._id, 'params:', req.params.id);
    const admin = await User.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    try {
      await createNotification(req.user?._id, 'Admin Deleted', `${admin.name} was removed`, 'warning');
    } catch (notifyErr) {
      console.error('Notification error (deleteAdmin):', notifyErr.message);
    }
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('deleteAdmin error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete admin' });
  }
};
