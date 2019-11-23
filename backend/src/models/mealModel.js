const mongoose = require('mongoose');

const { Schema } = mongoose;

const MealComponentSchema = new Schema({
  barcode: String,
  product_name: String,
  quantity: Number,
});

const MealSchema = new Schema({
  meal_name: String,
  components: [MealComponentSchema],
  calories_tot: Number,
  energy_tot: Number,
  carbohydrates_tot: Number,
  sugars_tot: Number,
  fat_tot: Number,
  saturated_fat_tot: Number,
  proteins_tot: Number,
  fiber_tot: Number,
  salt_tot: Number,
  sodium_tot: Number,
  alcohol_tot: Number,
  calcium_tot: Number,
  carbon_footprint_tot: Number,
  water_footprint_tot: Number,
  timestamp: String,
});

const UserMealSchema = new Schema({
  username: String,
  meals: [MealSchema],
});


module.exports = mongoose.model('Meals', UserMealSchema, 'Meals');
