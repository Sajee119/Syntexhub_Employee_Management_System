import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    enum: ['Engineering', 'Design', 'Human Resources', 'Management', 'QA', 'Operations']
  },
  description: { type: String, trim: true },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  employeeCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Department', departmentSchema);
