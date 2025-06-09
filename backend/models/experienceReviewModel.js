const mongoose = require('mongoose');

const experienceReviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  avatar: { type: String, required: true },
  date: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  ip: { type: String },
});

module.exports = mongoose.model('ExperienceReview', experienceReviewSchema);
