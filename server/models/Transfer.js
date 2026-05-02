import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  fromDepartment: String,
  toDepartment: String,
  fromRole: String,
  toRole: String,
  transferDate: { type: Date, default: Date.now },
  reason: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Transfer', transferSchema);
