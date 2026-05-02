import PerformanceReview from '../models/PerformanceReview.js';
import Employee from '../models/Employee.js';
import { createNotification } from './notificationController.js';

export const getReviews = async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    const query = {};
    if (employeeId) query.employee = employeeId;
    if (status) query.status = status;
    
    const reviews = await PerformanceReview.find(query)
      .populate('employee', 'name email')
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await PerformanceReview.findById(req.params.id)
      .populate('employee', 'name email')
      .populate('reviewer', 'name');
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const review = await PerformanceReview.create({ ...req.body, reviewer: req.user._id });
    await createNotification(
      review.employee,
      'Performance Review',
      `New performance review created with rating ${review.rating}/5`,
      'info'
    );
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await PerformanceReview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('employee', 'name email');
    
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    if (req.body.status === 'Completed') {
      await createNotification(
        review.employee._id,
        'Review Completed',
        `Your performance review has been completed`,
        'success'
      );
    }
    
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await PerformanceReview.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeReviews = async (req, res) => {
  try {
    const reviews = await PerformanceReview.find({ employee: req.params.employeeId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
