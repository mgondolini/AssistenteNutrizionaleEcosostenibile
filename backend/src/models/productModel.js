const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
  code: Number,
  product_name: String,
  image_url: String,
  quantity: Number,
  brands: String,
  ingredients_text: String,
  traces: String,
  origin: String, // new
  packaging: String, // new
  serving_size: Number,
  allergens: String,
  energy_kj_100g: Number,
  energy_kcal_100g: Number, // new
  carbohydrates_100g: Number,
  sugars_100g: Number,
  fat_100g: Number,
  saturated_fat_100g: Number,
  proteins_100g: Number,
  fiber_100g: Number,
  salt_100g: Number,
  sodium_100g: Number,
  alcohol_100g: Number,
  calcium_100g: Number,
  nutrition_score_uk_100g: String,
  nova_group: String, // new
  carbon_footprint_100g: Number,
  water_footprint_100g: Number,
  measure_unit: String, // new
});

module.exports = mongoose.model('Product', ProductSchema, 'Products');
