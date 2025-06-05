const mongoose = require('mongoose');

const beachInfoSchema = new mongoose.Schema({
  country: { type: String, required: true },
  city: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String },
  infrastructure: { type: String },
  note: { type: String },
  sources: [{ type: String }],
});

module.exports = mongoose.model('BeachInfo', beachInfoSchema);
