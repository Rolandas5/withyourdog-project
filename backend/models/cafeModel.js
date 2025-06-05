const mongoose = require('mongoose');

const CafeSchema = new mongoose.Schema({
  city: { type: String, required: true },
  cafes: [
    {
      name: String,
      desc: String,
      sources: [String],
    },
  ],
});

module.exports = mongoose.model('Cafe', CafeSchema, 'cafes');
