const mongoose = require('mongoose');

const ParkSchema = new mongoose.Schema({
  city: { type: String, required: true },
  parks: [
    {
      name: String,
      desc: String,
      sources: [String],
    },
  ],
});

module.exports = {
  Park: mongoose.model('Park', ParkSchema),
};
