import Department from '../models/Department.js';
import Employee from '../models/Employee.js';

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('head', 'name email');
    const deptsWithCount = await Promise.all(departments.map(async (dept) => {
      const count = await Employee.countDocuments({ department: dept.name });
      return { ...dept.toObject(), employeeCount: count };
    }));
    res.json(deptsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('head', 'name email');
    if (!department) return res.status(404).json({ message: 'Department not found' });
    const employees = await Employee.find({ department: department.name });
    res.json({ ...department.toObject(), employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Department already exists' });
    res.status(400).json({ message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
