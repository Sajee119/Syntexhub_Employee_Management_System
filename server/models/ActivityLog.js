import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true, enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'BULK_DELETE', 'SEND_EMAIL'] },
  entity: { type: String, required: true, enum: ['Employee', 'Department', 'Role', 'Admin', 'User'] },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  description: { type: String, required: true },
  metadata: { type: Object }
}, { timestamps: true });

export default mongoose.model('ActivityLog', activityLogSchema);
