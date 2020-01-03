const mongoose = require('mongoose');

const { Schema } = mongoose;

const MealComponentSchema = new Schema({
  barcode: Number,
  product_name: String,
  image_url: String,
  quantity: Number,
  carbon_footprint: Number,
  water_footprint: Number,
}, { _id: false });

const MealSchema = new Schema({
  meal_name: String,
  components: [MealComponentSchema],
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
  timestamp: Date,
}, { _id: false });

const UserMealSchema = new Schema({
  username: String,
  meals: [MealSchema],
});

module.exports = mongoose.model('Meals', UserMealSchema, 'Meals');
module.exports = mongoose.model('SingleMeal', MealSchema);
