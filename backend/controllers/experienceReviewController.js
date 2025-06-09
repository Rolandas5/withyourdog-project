const ExperienceReview = require('../models/experienceReviewModel');

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await ExperienceReview.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Nepavyko gauti atsiliepimų' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const review = new ExperienceReview({
      ...req.body,
      ip: req.ip || req.headers['x-forwarded-for'] || '',
      date: new Date().toISOString().slice(0, 10),
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: 'Nepavyko išsaugoti atsiliepimo' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await ExperienceReview.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Nepavyko ištrinti atsiliepimo' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ExperienceReview.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Nepavyko atnaujinti atsiliepimo' });
  }
};
