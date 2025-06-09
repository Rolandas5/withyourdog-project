const mongoose = require('mongoose');

const groomingSalonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  website: { type: String },
  hours: { type: String },
  image: { type: String },
});

module.exports = mongoose.model('GroomingSalon', groomingSalonSchema);
