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
}, { _id: false });

const UserSchema = new Schema({
  username: { type: String, required: true },
  password_hash_salt: { type: String, required: true },
  salt: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  birth_date: { type: Date, required: true },
  email: { type: String, required: true },
  sex: String,
  user_img_url: String,
  weight: Number,
  height: Number,
  allergens: String,
  daily_requirement: WhoSchema,
  achievements: [],
});

module.exports = mongoose.model('User', UserSchema, 'Users');
