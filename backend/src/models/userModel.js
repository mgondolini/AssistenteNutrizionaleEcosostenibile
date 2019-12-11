const mongoose = require('mongoose');

const { Schema } = mongoose;

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
});

module.exports = mongoose.model('User', UserSchema, 'Users');
