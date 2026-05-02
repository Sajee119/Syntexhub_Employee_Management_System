import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['Developer', 'Designer', 'Manager', 'HR', 'Tester', 'DevOps']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Engineering', 'Design', 'Human Resources', 'Management', 'QA', 'Operations']
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary must be positive']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  profilePicture: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
