import Role from '../models/Role.js';
import Employee from '../models/Employee.js';

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    const rolesWithCount = await Promise.all(roles.map(async (role) => {
      const count = await Employee.countDocuments({ role: role.name });
      return { ...role.toObject(), employeeCount: count };
    }));
    res.json(rolesWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    const employees = await Employee.find({ role: role.name });
    res.json({ ...role.toObject(), employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Role already exists' });
    res.status(400).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
