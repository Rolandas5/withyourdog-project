const mongoose = require('mongoose');
const DogProfileSchema = new mongoose.Schema({
  avatarUrl: String,
  name: { type: String, required: true },
  breed: { type: String, required: true },
  hobbies: [String],
  favoritePlaces: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
module.exports = mongoose.model('DogProfile', DogProfileSchema);
