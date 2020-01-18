const mongoose = require('mongoose');

const { Schema } = mongoose;

const WhoSchema = new Schema({
  sex: String,
  age_min: Number,
  age_max: Number,
  calories: Number,
  protein_g: Number,
  carbohydrate_g: Number,
  fiber_g: Number,
  sugars_perc: Number,
  total_fat_perc: Number,
  saturated_fat_perc: Number,
  calcium_g: Number,
  sodium: Number,
});

module.exports = mongoose.model('who', WhoSchema, 'who');
