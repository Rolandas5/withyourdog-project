const mongoose = require('mongoose');

const dogHotelSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  city: String,
  website: String,
  hours: String,
  image: String,
});

module.exports = mongoose.model('DogHotel', dogHotelSchema);
