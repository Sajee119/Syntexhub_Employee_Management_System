import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  targetRoles: [String],
  targetDepartments: [String],
  publishDate: { type: Date, default: Date.now },
  expiryDate: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
