import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['ID', 'Certificate', 'Contract', 'Payslip', 'Other'] },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);
