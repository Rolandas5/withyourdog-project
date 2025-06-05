const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Cafe = require('../models/cafeModel');
const cafesData = JSON.parse(
  fs.readFileSync(__dirname + '/cafes.json', 'utf-8')
).cafes;

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Cafe.deleteMany();
  await Cafe.insertMany(cafesData);
  console.log('Kavinės įkeltos!');
  mongoose.disconnect();
}

seed();
