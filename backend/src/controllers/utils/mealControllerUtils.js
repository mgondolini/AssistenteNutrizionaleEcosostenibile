const mongoose = require('mongoose');

const SingleMeal = mongoose.model('SingleMeal');
const Products = mongoose.model('Product');


module.exports = {
  initMealValues(mealName) {
    const mealToAdd = new SingleMeal();
    mealToAdd.meal_name = mealName;
    mealToAdd.components = [{}];
    mealToAdd.energy_tot = 0;
    mealToAdd.carbohydrates_tot = 0;
    mealToAdd.sugars_tot = 0;
    mealToAdd.fat_tot = 0;
    mealToAdd.saturated_fat_tot = 0;
    mealToAdd.proteins_tot = 0;
    mealToAdd.fiber_tot = 0;
    mealToAdd.salt_tot = 0;
    mealToAdd.sodium_tot = 0;
    mealToAdd.alcohol_tot = 0;
    mealToAdd.calcium_tot = 0;
    mealToAdd.carbon_footprint_tot = 0;
    mealToAdd.water_footprint_tot = 0;
    mealToAdd.timestamp = new Date();
    return mealToAdd;
  },
};
