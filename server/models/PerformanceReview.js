import mongoose from 'mongoose';

const performanceReviewSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  goals: [{
    description: String,
    achieved: { type: Boolean, default: false }
  }],
  strengths: [String],
  improvements: [String],
  comments: String,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('PerformanceReview', performanceReviewSchema);
