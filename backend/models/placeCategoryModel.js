const mongoose = require('mongoose');

const placeCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
  link: { type: String, required: true },
});

module.exports = mongoose.model('PlaceCategory', placeCategorySchema);
