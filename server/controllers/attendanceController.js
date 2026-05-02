import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

export const markAttendance = async (req, res) => {
  try {
    const { employeeId, status, notes } = req.body;
    const today = new Date(); today.setHours(0,0,0,0);
    
    const attendance = await Attendance.findOneAndUpdate(
      { employee: employeeId, date: { $gte: today } },
      { status, notes, checkIn: new Date() },
      { upsert: true, new: true }
    );
    
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { employeeId, date, month, year } = req.query;
    const query = {};
    if (employeeId) query.employee = employeeId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }
    if (month && year) {
      const start = new Date(year, month-1, 1);
      const end = new Date(year, month, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }
    
    const attendance = await Attendance.find(query).sort({ date: -1 }).populate('employee', 'name email department');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkout = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const attendance = await Attendance.findOneAndUpdate(
      { employee: req.params.id, date: { $gte: today } },
      { checkOut: new Date() },
      { new: true }
    );
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { month, year, employeeId } = req.query;
    const query = {};
    if (employeeId) query.employee = employeeId;
    if (month && year) {
      const start = new Date(year, month-1, 1);
      const end = new Date(year, month, 0);
      query.date = { $gte: start, $lte: end };
    }
    
    const records = await Attendance.find(query).populate('employee', 'name email department');
    
    const report = records.map(r => ({
      employeeName: r.employee?.name || 'Unknown',
      email: r.employee?.email || '-',
      department: r.employee?.department || '-',
      date: new Date(r.date).toLocaleDateString(),
      checkIn: r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '-',
      checkOut: r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '-',
      status: r.status,
      notes: r.notes || '-'
    }));
    
    res.json({ report, total: report.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
