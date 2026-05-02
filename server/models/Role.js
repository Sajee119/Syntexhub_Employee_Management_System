import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
    enum: ['Developer', 'Designer', 'Manager', 'HR', 'Tester', 'DevOps']
  },
  description: { type: String, trim: true },
  permissions: [{ type: String }],
  employeeCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);
